---
title: "Dynamic Logging In Go (Alpha)"
metaTitle: "Tutorials | Collecting Custom Data | Dynamic Structured Logging In Go"
metaDescription: "Simple tutorial to show how dynamic structured logging works in Go using eBPF"
order: 2
redirect_from:
    - /tutorials/simple-go-tracing/
    - /using-pixie/use-cases/code-tracing/
---
This is a simple demo showing the ability of Pixie to add dynamic structured logs into
Go binaries deployed in production environments. This capability allows one to debug Go
binaries in production without the need
to instrument the source code with additional log statements, recompile, and redeploy.

A simple overview of this functionality is show here:

::: div image-l
<svg title='Dynamic Structured Logging in Go' src='dynamic_logs.svg' />
:::

In a legacy systems a modify-compile-deploy cycle is required to get visibility into the binary
if the appropriate log lines are missing. Pixie allows
you to dynamically capture function arguments, return values and latency, without this slow
process. Since we use new kernel technologies like eBPF, we can safely insert these logs without stopping
execution of you program, and with minimal overhead.

Note: Dynamic logging is an alpha feature.
[Limitations](/tutorials/custom-data/dynamic-go-logging/#requirements-and-limitations) are listed at the end of this page.

## Tutorial Overview

<YouTube youTubeId="aH7PHSsiIPM" />

## Setup

1. Pixie needs to be installed on your Kubernetes cluster. If it is not already installed, please consult our [install guides](/installing-pixie/).

2. Clone the `pixie` repo to get the relevant files.

```bash
git clone https://github.com/pixie-io/pixie-demos.git
cd pixie-demos/simple-gotracing
```

## Running the Demo

The demo is completely self-contained and will install a simple Go application under the
namespace px-demo-gotracing. The source of this application is in app.go. To deploy this application run:

```bash
kubectl apply -f k8s_manifest.yaml
```

We are going to dynamic trace the `computeE` function in app.go to get started. This is a simple function
that tried to approximate the value of [eulers number](https://en.wikipedia.org/wiki/E_(mathematical_constant)) by
using a taylor series. The number of iterations of the expansion is specified by the `iters` query param to the HTTP handler.
To see how this works we can connect to the service by forwarding the appropriate port:

```bash
kubectl port-forward service/gotracing-svc -n px-demo-gotracing 9090
```

We can use `curl` to quickly access the api. The number of iterations is the query parameter `iters`.

```bash
curl http://localhost:9090/e
# e = 2.7183

curl http://localhost:9090/e\?iters\=2
# e = 2.0000

curl http://localhost:9090/e\?iters\=200
# e = 2.7183
```

As expected the accuracy of e approaches the expected value of `2.7183` as we
increase the number of iterations.

The full source code of this is located here. The function that computes this is shown below:

```go
// computeE computes the approximation of e by running a fixed number of iterations.
func computeE(iterations int64) float64 {
	res := 2.0
	fact := 1.0

	for i := int64(2); i < iterations; i++ {
		fact *= float64(i)
		res += 1 / fact
	}
	return res
}
```

The function computeE is called by an HTTP handler. Let's say we want to quickly access the arguments to the `computeE`
function, and it's latency. We can use the provided [capture_args.pxl](https://github.com/pixie-io/pixie-demos/blob/main/simple-gotracing/capture_args.pxl)
script. The complete script has code to programmatically insert the log
and capture data for a time period. However, the actual function that captures this data is straightforward:

```python
@pxtrace.probe("main.computeE")
def probe_func():
    return [{
        'iterations': pxtrace.ArgExpr("iterations"),
        'latency': pxtrace.FunctionLatency(),
    }]
```

This PXL function simply attached to the `main.computeE` function and grabs the iterations argument along with the
execution time in nanoseconds.

To attach this function to our running binary we need to first identify the `UPID` of the process we want to trace. The `UPID` refers to the _unique process id_, which is a process ID that
is globally unique in the entire cluster. In future versions of Pixie we will make this process easier. For now, we can
easily get the `UPID` by running the follow script:

```bash
px run px/upids -- --namespace px-demo-gotracing

# [0000]  INFO Pixie CLI
# Table ID: UPIDs
#   CLUSTERID                             POD                                           CONTAINER  UPID                                  CMDLINE  POD CREATE TIME
#   f890689b-299c-43fd-8d2a-b0c528a58393  px-demo-gotracing/gotracing-7cdd66f89d-khnss  app        00000003-0023-9267-0000-000008e60831  ./main   2020-08-09T20:39:34-07:00
```

The relevant `UPID` is in the fourth column. Edit the `upid` variable in the `capture_args.pxl` script with this value. Alternatively, you can run the following
shell command that will do the substitution for you:

```bash
sed -i'.orig' "s/replace-me-with-upid/$(px run -o json px/upids -- --namespace px-demo-gotracing  | jq -r '.upid' | head -n 1)/g" capture_args.pxl
```

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

## Requirements & Limitations

Dynamic logging is an alpha feature. It is currently only supports logging of Go binaries.

### Requirements

Dynamic Go Logging works using [debug information](/reference/admin/debug-info). By default, `go build` compiles your program with debug information and is compatible with Dynamic Go Logging. However, if you compile with -ldflags '-w -s' or strip the debug symbols after compiling, then you will not be able use Dynamic Go Logging.

Additionally, Dynamic logging works for Golang versions up to 1.16 only (the go compiler for 1.17 changed the calling convention, and the Dynamic Logging feature has not yet been updated to support those changes).

### Limitations

Dynamic Logging can currently be used to trace only certain types of arguments and return values:

| Value type (argument or return value)     | Supported?                         |
| :---------------------------------------- | :--------------------------------- |
| Primitive types                           | Yes.                               |
| Strings                                   | Yes. Truncated after 23 characters |
| Arrays                                    | No.                                |
| Structs                                   | Partial. Struct members that are other primitive types or other structs are traced. Pointers to other types are not followed. Strings inside structs are not supported. |
| Interfaces                                | Partial. Struct data is printed out. If more than 128 types implement the same interface, then the interface is not traced. |

If your build is optimized with inlining (-gcflags '-l'), certain functions won't be traceable.
For more info see the [golang documentation](https://golang.org/doc/gdb#Introduction).

### Known Issues

Note that there is a known bug in which re-running the script after modifying the `probe_func` definition will cause the tracepoint to fail to deploy. To get around this bug, whenever you modify the `probe_func` definition, please rename the `table_name` (and update the `table_name` in the `df = px.DataFrame(table_name)` line as well.
