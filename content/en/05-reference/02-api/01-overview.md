---
title: "Overview"
metaTitle: "Reference | API | Overview"
metaDescription: "Quick Start guide for using Pixie's API."
order: 1
redirect_from:
    - /using-pixie/using-api/
---

Pixie's API allows developers to easily export data from Pixie's observability platform and integrate it into their existing stack.

## Client Libraries

<Alert variant="outlined" severity="warning">
  The Python and Go API libraries are v0.x. Breaking changes may be introduced prior to a v1.x+ release.
</Alert>

Pixie supplies two client libraries that provide a layer of abstraction on top of gRPC and handle the details of authentication, cluster connection, script execution, and more.

- [Go Client Reference Docs](https://pkg.go.dev/px.dev/pxapi)
- [Python Client Reference Docs](/reference/api/py)

To get started using one of client libraries, check out our [Quick Start](/reference/api/quick-start/) guide.

## gRPC API

<Alert variant="outlined" severity="info">
  We highly recommend using one of our supported client libraries, rather than using the gRPC API directly.
</Alert>

Pixie uses a gRPC API to communicate between its backend platform and its [Live UI](/using-pixie/using-live-ui), [CLI](/using-pixie/using-cli), and API clients.

- Pixie Cloud [schema definition](https://github.com/pixie-io/pixie/blob/main/src/api/proto/cloudpb/cloudapi.proto): get available clusters, connect to a cluster.
- Pixie Vizier [schema definition](https://github.com/pixie-io/pixie/blob/main/src/api/proto/vizierpb/vizierapi.proto): execute a PxL script.

### gRPC Streaming Details

Data from Pixie's observability platform is queried using [PxL scripts](/using-pixie/#pxl-scripts). A PxL script can output multiple data tables.

The gRPC API's main endpoint, `ExecuteScript`, returns data on a stream. A PxL script with two tables, would produce a stream like the following:

- The first message contains the metadata for a single table. Table Metadata Messages includes: `name`, `id`, `relation` (describing the table columns). For PxL scripts with multiple data tables, the channel does not guarantee that all Table Metadata Messages are sent before sending over any Data Messages, only that a client will receive metadata for a particular table before receiving data from that table.

- The following messages contain the table data sent in batches. Data Messages contain a `RowBatch` containing a: `tableID` (matches the `id` in the table metadata), `numRows`, and `eos`. The message containing the final batch of data will have its end-of-stream (`eos`) flag set true. If the stream unexpectedly closes, there is no guarantee that a table will receive `eos`. It is important to note that users can write queries that stream forever and thus never send an `eos`

- The final message contains script execution statistics.

The following diagram shows the response to `ExecuteScript` for a PxL script containing two tables:

<svg title='Pixie `ExecuteScript` gRPC streaming output example.' src='api/grpc-streaming.png'/>
