---
title: "Using the API"
metaTitle: "Using Pixie | Using the API"
metaDescription:  "Use the API to run PxL scripts"
order: 3
redirect_from:
    - /reference/api/quick-start/
---

This guide shows you how to get started with the Pixie API using one of our client libraries. For information on our gRPC API, see the [reference docs](/reference/api/overview).

Check out the following video for a live coding demo using the Go API:
<YouTube youTubeId="bHlUlVgAE7E"/>

## Setup

1. Install Pixie on your cluster using the [install guides](/installing-pixie/install-guides/).
2. Find your cluster's ID following the directions [here](/reference/admin/cluster-id/#find-the-cluster-id).
3. Create an API key following the directions [here](/reference/admin/api-keys/#create-an-api-key). An API Key is required when using the client API for running queries.

## Install the client library

```python
# Requires Python 3.8.7+
pip install pxapi
```

```go
// We recommend using a Go modules project: https://blog.golang.org/using-go-modules
go get px.dev/pxapi
```

## Import the library

```python
import pxapi
```

```go
// Import pixie go package and subpackages.
import (
	"context"
	"fmt"
	"io"
	"os"

	"px.dev/pxapi"
	"px.dev/pxapi/errdefs"
	"px.dev/pxapi/types"
)
```

## Initialize a Pixie client and connect to a cluster

You'll need the API Key and Cluster ID created in the [Setup](/using-pixie/api-quick-start/#setup) section.

```python
# Create a Pixie client.
px_client = pxapi.Client(token=<YOUR_API_TOKEN_STRING>)

# Connect to cluster.
conn = px_client.connect_to_cluster(<YOUR_CLUSTER_ID_STRING>)
```

```go
// Create a Pixie client.
ctx := context.Background()
client, err := pxapi.NewClient(ctx, pxapi.WithAPIKey(<YOUR_API_TOKEN_STRING>))
if err != nil {
	panic(err)
}

// Create a connection to the cluster.
vz, err := client.NewVizierClient(ctx, <YOUR_CLUSTER_ID_STRING>)
if err != nil {
	panic(err)
}
```

## Run a PxL script and display the results

<Alert variant="outlined" severity="warning">
  PxL scripts passed to the API need to name the output dataframe in the call to `px.display()`. Table names are used to differentiate between multiple output tables when processing the results. If you forget to name the dataframe in the call to `px.display()`, you will get an error: `Table TABLE_NAME not received.`
</Alert>

```python
# Define a PxL query with one output table.
PXL_SCRIPT = """
import px
df = px.DataFrame('http_events')[['http_resp_status','http_req_path']]
df = df.head(10)
px.display(df, 'http_table')
"""

# Execute the PxL script.
script = conn.prepare_script(PXL_SCRIPT)

# Print the table output.
for row in script.results("http_table"):
    print(row["http_resp_status"], row["http_req_path"])
```

```go
// Define a PxL script with out output table.
pxl := `
import px
df = px.DataFrame('http_events')
df = df[['upid', 'http_req_path', 'remote_addr', 'http_req_method']]
df = df.head(10)
px.display(df, 'http')
`

// Create TableMuxer to accept results table.
tm := &tableMux{}

// Execute the PxL script.
resultSet, err := vz.ExecuteScript(ctx, pxl, tm)
if err != nil && err != io.EOF {
	panic(err)
}

// Receive the PxL script results.
defer resultSet.Close()
if err := resultSet.Stream(); err != nil {
	fmt.Printf("Got error : %+v, while streaming\n", err)
}

// Satisfies the TableRecordHandler interface.
type tablePrinter struct{}

func (t *tablePrinter) HandleInit(ctx context.Context, metadata types.TableMetadata) error {
	return nil
}

func (t *tablePrinter) HandleRecord(ctx context.Context, r *types.Record) error {
	for _, d := range r.Data {
		fmt.Printf("%s ", d.String())
	}
	fmt.Printf("\n")
	return nil
}

func (t *tablePrinter) HandleDone(ctx context.Context) error {
	return nil
}

// Satisfies the TableMuxer interface.
type tableMux struct {
}

func (s *tableMux) AcceptTable(ctx context.Context, metadata types.TableMetadata) (pxapi.TableRecordHandler, error) {
	return &tablePrinter{}, nil
}
```

This PxL query returns two columns from the first 10 rows of the `http_events` table of data. For more information on how this PxL script was written, check out the [PxL script tutorials](/tutorials/pxl-scripts/write-pxl-scripts).

Note that the API does not currently support running our open source `px/` scripts by name. If you would like to run one of the `px/` scripts that we include in the CLI or Live UI, you will need to copy the PxL script and pass it in as a string. Only PxL scripts with an empty Vis Spec will return results from the API.

If your PxL query has any compile errors, you will get a `pixie.errors.PxLError`. We recommend writing and debugging your PxL scripts using our [Live UI](/using-pixie/using-live-ui), [CLI](/using-pixie/using-cli) tool.

## Complete example source code

Below is the complete source code for the example above.

This basic example along with more advanced API examples can be found in the [API folder](https://github.com/pixie-io/pixie/tree/main/src/api) in Pixie's GitHub repo.

```python
# Import Pixie's python API.
import pxapi

# Define a PxL query with one output table.
PXL_SCRIPT = """
import px
df = px.DataFrame('http_events')[['http_resp_status','http_req_path']]
df = df.head(10)
px.display(df, 'http_table')
"""

# Create a Pixie client.
px_client = pxapi.Client(token=<YOUR_API_TOKEN_STRING>)

# Connect to cluster.
conn = px_client.connect_to_cluster(<YOUR_CLUSTER_ID_STRING>)

# Execute the PxL script.
script = conn.prepare_script(PXL_SCRIPT)

# Print the table output.
for row in script.results("http_table"):
    print(row["http_resp_status"], row["http_req_path"])
```

```go
package main

import (
	"context"
	"fmt"
	"io"
	"os"

	"px.dev/pxapi"
	"px.dev/pxapi/errdefs"
	"px.dev/pxapi/types"
)

// Define PxL script with one table output.
var (
	pxl = `
import px
df = px.DataFrame('http_events')
df = df[['upid', 'http_req_path', 'remote_addr', 'http_req_method']]
df = df.head(10)
px.display(df, 'http')
`
)

func main() {

	// Create a Pixie client.
	ctx := context.Background()
	client, err := pxapi.NewClient(ctx, pxapi.WithAPIKey(<YOUR_API_TOKEN_STRING>))
	if err != nil {
		panic(err)
	}

	// Create a connection to the cluster.
	vz, err := client.NewVizierClient(ctx, <YOUR_CLUSTER_ID_STRING>)
	if err != nil {
		panic(err)
	}

	// Create TableMuxer to accept results table.
	tm := &tableMux{}

	// Execute the PxL script.
	resultSet, err := vz.ExecuteScript(ctx, pxl, tm)
	if err != nil && err != io.EOF {
		panic(err)
	}

	// Receive the PxL script results.
	defer resultSet.Close()
	if err := resultSet.Stream(); err != nil {
		if errdefs.IsCompilationError(err) {
			fmt.Printf("Got compiler error: \n %s\n", err.Error())
		} else {
			fmt.Printf("Got error : %+v, while streaming\n", err)
		}
	}

	// Get the execution stats for the script execution.
	stats := resultSet.Stats()
	fmt.Printf("Execution Time: %v\n", stats.ExecutionTime)
	fmt.Printf("Bytes received: %v\n", stats.TotalBytes)
}

// Satisfies the TableRecordHandler interface.
type tablePrinter struct{}

func (t *tablePrinter) HandleInit(ctx context.Context, metadata types.TableMetadata) error {
	return nil
}

func (t *tablePrinter) HandleRecord(ctx context.Context, r *types.Record) error {
	for _, d := range r.Data {
		fmt.Printf("%s ", d.String())
	}
	fmt.Printf("\n")
	return nil
}

func (t *tablePrinter) HandleDone(ctx context.Context) error {
	return nil
}

// Satisfies the TableMuxer interface.
type tableMux struct {
}

func (s *tableMux) AcceptTable(ctx context.Context, metadata types.TableMetadata) (pxapi.TableRecordHandler, error) {
	return &tablePrinter{}, nil
}
```

## End-to-End Encryption

Pixie offers end-to-end encryption for telemetry data requested by the API. For more information, see the [FAQ](/about-pixie/faq#how-does-pixie-secure-its-data).

Encryption is controlled by a flag during client creation. For additional info, see the [Go](https://github.com/pixie-io/pixie/blob/main/src/api/go/pxapi/examples/encryption_example/example.go#L77) or [Python](https://github.com/pixie-io/pixie/blob/main/src/api/python/examples/script_with_single_table.py#L35) encryption examples.
