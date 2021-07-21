---
title: "Golang Logging"
metaTitle: "Tutorials | Golang Logging"
metaDescription: "Simple tutorial to show how dynamic structured logging works in Go using eBPF"
order: 7

---

This tutorial will demonstrate how to use Pixie to debug Go binaries in production *without* needing
to instrument the source code with additional log statements, recompile, and redeploy.

## Setup

1. You'll need a Kubernetes cluster with Pixie installed. For instructions, see our [install guides](/installing-pixie/).

2. Clone the `pixie-demos` repo to get the relevant files.

```bash
git clone https://github.com/pixie-labs/pixie-demos.git
cd pixie-demos/simple-gotracing/app
```

## Deploy the Demo App

1. Deploy the demo application using kubectl:

```bash
kubectl apply -f k8s_manifest.yaml
```

> This demo is completely self-contained and will install a simple Go application under the
namespace `px-demo-gotracing`.

> The application code in `app.go` contains a function called [`computeE`](https://github.com/pixie-labs/pixie-demos/blob/main/simple-gotracing/app/app.go#L10) which tries to approximate the value of [Eulers number](https://en.wikipedia.org/wiki/E_(mathematical_constant)) by using a Taylor series. The number of iterations of the expansion is specified by the `iters` query param to the HTTP handler.

## Query the Demo App

2. To use the app, we will connect to the service by forwarding the appropriate port. In a new tab, run

```bash
kubectl port-forward service/gotracing-svc -n px-demo-gotracing 9090
```

3. Use `curl` to quickly access the api. The number of iterations is the query parameter `iters`.

```bash
curl http://localhost:9090/e
# e = 2.7183

curl http://localhost:9090/e\?iters\=2
# e = 2.0000

curl http://localhost:9090/e\?iters\=200
# e = 2.7183
```

> As expected, the accuracy of `e` approaches the expected value of `2.7183` as we
increase the number of iterations.

## Dynamically Log Function Arguments, Latency

Let's say we want to quickly access the arguments to the `computeE` function, and it's latency. To do this, we'll write a PxL script to programmatically insert the log and capture data for a time period.

1. Open the [Live UI](work.withpixie.ai) and select the `Scratch Pad` script from the `script` drop-down menu.

2. Open the editor (`ctrl` (Windows) / `cmd` (Mac, Linux) + `e`).

3. Replace the code in the editor with the following:

```python
import pxtrace
import px

# The UPID of the simple-gotracing-example server. You can
# get the value of this by running:
# px run px/upids -- --namespace px-demo-gotracing
# The relevant UPID will be in the fourth column.
upid = 'replace-me-with-upid'

# This is the basic trace function. Every function call of
# `main.computeE` is traced and the values are recorded into
# a table as specified by the return value.
#
# To probe struct functions, see the notes here:
# https://docs.pixielabs.ai/tutorials/simple-go-tracing/#formatting-the-pxtrace.probe-path
@pxtrace.probe("main.computeE")
def probe_func():
    return [{
        'iterations': pxtrace.ArgExpr("iterations"),
        'latency': pxtrace.FunctionLatency(),
    }]

# This is the function that actually installs the tracepoint.
# The arguments are:
#    Tracepoint name.
#    Output table name.
#    Name of the probe function.
#    The UPID.
#    The TTL of the tracepoint. It is updated each time the script is run.
pxtrace.UpsertTracepoint('compute_e_data',
                         'compute_e_data',
                         probe_func,
                         px.uint128(upid),
                         "5m")

# This just writes the output into a table.
px.display(px.DataFrame(table='compute_e_data'))
```

This PXL code attaches to the `main.computeE` function and grabs the iterations argument along with the execution time in nanoseconds.

### Get the UPID

To attach this function to our running binary we need to identify the `UPID` of the process we want to trace. The `UPID` refers to the _unique process id_, which is a process ID that is globally unique in the entire cluster. In future versions of Pixie we will make this process easier.

1. In a new tab, open the [Live UI](work.withpixie.ai) and select the `px/upids` script from the `script` drop-down menu.

2. Select the `namespace` argument drop-down arrow, type `px-demo-gotracing`, and press enter.

3. Copy the relevant `UPID` value.

4. In the previous tab, copy the UPID value into the

### Run the PxL script

Run the PxL script:

```bash
px run -f capture_args.pxl

# [0000]  INFO Pixie CLI
#  ✔    Preparing schema
#  ✔    Deploying compute_e_data
# Table ID: output
#   CLUSTERID    UPID  TIME   GOID   ITERATIONS
```

The result data will be empty since no requests have been made yet. Let's run the curl commands we have above and see what happens:

```bash
px run -f capture_args.pxl

# [0000]  INFO Pixie CLI
# Table ID: output
#   CLUSTERID                             UPID                                  TIME                       GOID    ITERATIONS
#   f890689b-299c-43fd-8d2a-b0c528a58393  00000003-0024-844a-0000-000008caa618  2020-08-09T17:16:11-07:00  194529  100
#   f890689b-299c-43fd-8d2a-b0c528a58393  00000003-0024-844a-0000-000008caa618  2020-08-09T17:16:14-07:00  194416  2
#   f890689b-299c-43fd-8d2a-b0c528a58393  00000003-0024-844a-0000-000008caa618  2020-08-09T17:16:16-07:00  194531  200
```

There it is, we just capture all the arguments to the computeE function without changing the source code or redeploying it. We also found out
that the default number of iterations is a 100 without having to look through the source code. While this example is straight forward and simple
and hardly requires the use of dynamic logging to understand, we can easily see how this can be used to debug much more complicated scenarios.

## Cleaning Up

To delete the demo from the cluster just run:

```bash
kubectl delete namespace px-demo-gotracing
```

## Modifying the Demo

### Building and Deploying the App

The demo can easily be modified by editing the app.go source file. After that you can simply create a new docker image by running:

```bash
docker build . -t <image name>
```

Edit the image name in `k8s_manifest.yaml` to correspond to you new image and redeploy.

### Formatting the pxtrace.probe path

The format of the probe path differs slightly depending on whether the function being traced is a standard function or a [receiver method](https://tour.golang.org/methods/8). To create the `pxtrace.probe path` follow these steps:

1. Get the package path (typically the directory of the file that contains the function) + prefix under GoSrc.

2. Get the full function name. For simple functions (like the `computeE` example above), this is simply the name of the function. For receiver methods, format as `(*<struct-name>).<funcName>`.

3. Combine together as `<gopath>.<fullFuncName>`. Note that if the `fullFuncName` is unambiguous, you may leave out the `gopath`.

#### Example Probe for a Regular Function

To trace the `encodeError` Go function from [`https://github.com/microservices-demo/payment/blob/master/transport.go`](https://github.com/microservices-demo/payment/blob/master/transport.go#L47), with the following signature:

```go
func encodeError(_ context.Context, err error, w http.ResponseWriter) {}
```

1. Take the project path + package prefix from the top of the file: `github.com/microservices-demo/payment` + `payment`

2. Take the function name: `encodeError`

3. Combine these two parts together to get the full probe path. The resulting PxL script probe is:

```python
@pxtrace.probe("github.com/microservices-demo/payment/payment.encodeError")
```

#### Example Probe for a Struct Function

To trace the `Authorise` receiver method from [`https://github.com/microservices-demo/payment/blob/master/service.go`](https://github.com/microservices-demo/payment/blob/master/service.go#L41), with the following signature:

```go
func (s *service) Authorise(amount float32) (Authorisation, error) {}
```

1. Take the project path + package prefix from the top of the file: `github.com/microservices-demo/payment` + `payment`

2. Since it's a receiver method, the full method name would be formatted as: `(*service).Authorise`

3. Combine these two parts together to get the full probe path. The resulting PxL script probe is:

```python
@pxtrace.probe("github.com/microservices-demo/payment/payment.(*service).Authorise")
```

### Debug symbols

Note that Dynamic Go Logging works using debug symbols. By default, go build compiles your program with debug symbols, and is compatible with Dynamic Go Logging. However, if you compile with -ldflags '-w' or strip the debug symbols after compiling, then you will not be able use Dynamic Go Logging. Additionally, if your build is optimized with inlining (-gcflags '-l'), certain functions won't be traceable. For more info see the [golang documentation](https://golang.org/doc/gdb#Introduction).

## Known Issues

Note that there is a known bug in which re-running the script after modifying the `probe_func` definition will cause the tracepoint to fail to deploy. To get around this bug, whenever you modify the `probe_func` definition, please rename the `table_name` (and update the `table_name` in the `df = px.DataFrame(table_name)` line as well.
