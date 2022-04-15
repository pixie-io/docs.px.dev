---
title: "Export OpenTelemetry Data"
metaTitle: "Tutorials | Integrations and Alerts | Export OpenTelemetry Data"
metaDescription: "Export OpenTelemetry Data"
order: 3
redirect_from:
    - /tutorials/otel/
---

This tutorial will demonstrate how to export Pixie data in the OpenTelemetry (OTel) format.

To do this, we will take the following steps:

1. Deploy an OTel collector to our cluster.
2. Write a PxL script that uses the [OTel methods](/reference/pxl/otel-export/) to transformation Pixie DataFrames into OTel data.
3. Setup the Pixie [Plugin System](/reference/plugins/plugin-system/) to run the PxL script at regularly scheduled intervals.

Note that [Pixie's API](/using-pixie/api-quick-start/) can also be used to run the PxL scripts developed in Step 2, however this tutorial will cover the Plugin System only.

## Deploy the OTel Collector

If you don't already have an OTel collector set up, you can follow the directions to deploy our demo collector [here](https://github.com/pixie-io/pixie-demos/tree/main/otel-collector).

Most OTel collectors are configured to forward metrics to Prometheus or Jaeger, but our demo collector simply outputs the metrics it receives to the logs.

## Write the PxL script

PxL scripts are used to query telemetry data collected by the Pixie Platform. Our PxL script will also export the Pixie data in the OTel format. We'll use the Live UI's `Scratch Pad` to develop our PxL script.

1. Open Pixie's [Live UI](/using-pixie/using-live-ui/).

2. Select the `Scratch Pad` script from the `script` drop-down menu in the top left.

3. Open the script editor using the keyboard shortcut: `ctrl+e` (Windows, Linux) or `cmd+e` (Mac).

4. Replace the contents of the `PxL Script` tab with the following. Hover over the code block below to show the copy button in the top-right.

```python:numbers
import px
# Read in the http_events table
df = px.DataFrame(table='http_events', start_time='-10s')

# Attach the pod and service metadata
df.pod = df.ctx['pod']
df.service = df.ctx['service']
# Count the number of requests per pod and service
df = df.groupby(['pod', 'service', 'req_path']).agg(
  throughput=('latency', px.count),
  time_=('time_', px.max),
)

# Change the denominator if you change start_time above.
df.requests_per_s = df.throughput / 10

px.export(df, px.otel.Data(
  # endpoint arg not required if run in a plugin that provides the endpoint
  endpoint=px.otel.Endpoint(
    url='otel-collector.default.svc.cluster.local:4317',
    insecure=True
  ),
  resource={
      # service.name is required by OpenTelemetry.
      'service.name' : df.service,
      'service.instance.id': df.pod,
      'k8s.pod.name': df.pod,
  },
  data=[
    px.otel.metric.Gauge(
      name='http.throughput',
      description='The number of messages sent per second',
      value=df.requests_per_s,
      attributes={
        'req_path': df.req_path,
      }
    )
  ]
))

px.display(df)
```

5. Run the script using the `RUN` button in the top right or by using the keyboard shortcut: `ctrl+enter` (Windows, Linux) or `cmd+enter` (Mac).

6. Hide the script editor using `ctrl+e` (Windows, Linux) or `cmd+e` (Mac).

> Your Live UI should output something similar to the following:

<svg title='OTel PxL script output in the Live UI' src='plugin/otel-script-output.png'/>

7. To validate that the data has been received by the OTel collector, check logs for the the `otel-collector-*` pod. If the export was successful, you should see logs similar to:

```bash
2022-04-15T20:48:20.633Z    INFO    loggingexporter/logging_exporter.go:54    MetricsExporter    {"#metrics": 32}
```

> So what does this PxL script actually do? This PxL script calculates the rate of HTTP requests made to each pod in your cluster and exports that data as an OpenTelemetry Gauge metric.

> If this is your first PxL script, you may want to check out the [Writing a PxL Script Tutorial](/tutorials/pxl-scripts/write-pxl-scripts/) to learn more. We'll give a high-level overview of this script below.

### The Data

The first part of the PxL script (lines 1-19) read in the `http_events` data and count the number of requests made to each pod from the last 10s.

```python
import px

# Read in the http_events table
df = px.DataFrame(table='http_events', start_time='-10s')

# Attach the pod and service metadata
df.pod = df.ctx['pod']
df.service = df.ctx['service']

# Count the number of requests per pod and service
df = df.groupby(['pod', 'service', 'req_path']).agg(
  throughput=('latency', px.count),
  time_=('time_', px.max),
)

# Calculate the rate for the time window
df.requests_per_s = df.throughput / 10
```

### Exporting

To export the data, you’ll call `px.export` with the DataFrame as the first argument and the export target `px.otel.Data` as the second argument.

```python
px.export(df, px.otel.Data(...))
```

The export target (`px.otel.Data`) describes which columns to use for the corresponding OpenTelemetry fields. You specify a column using the same syntax as in a regular query: `df.column_name` or `df[‘column_name’]`. The columns must reference a column available in the `df` argument or the PxL compiler will throw an error

### Specifying a Collector Endpoint and Authentication

The PxL OpenTelemetry exporter needs to talk with a collector. You must specify this information via the `endpoint` parameter:

```python
endpoint=px.otel.Endpoint(
  url='otel-collector.default.svc.cluster.local:4317',
  insecure=True
),
```

The endpoint url must be an OpenTelemetry grpc endpoint. Don’t specify a protocol prefix. Optionally, you can also specify the headers passed to the endpoint. Some OpenTelemetry collector providers look for authentication tokens or api keys in the connection context. The headers field is where you can add this information.

Note that if you’re writing a [plugin script](/reference/plugins/plugin-system), this information should be passed in from the plugin context.

### Transforming Data

The core idea of the PxL OpenTelemetry export is that you’re converting columnar data from a Pixie DataFrame into the fields of whatever OpenTelemetry data that you wish to capture. You can reference a column by using the attribute syntax `df.column_name`. Under the hood, Pixie will convert the values for each row into a new OpenTelemetry message. The columns must match up with the DataFrame that you are exporting (the first argument to `px.export`), otherwise you will receive a compiler error.

### Specifying a Resource

The `resource` parameter defines the entity producing the [telemetry data](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/resource/sdk.md). Users define the `resource` argument as a dictionary mapping attribute keys to the STRING columns that populate the attribute values. The PxL configuration expects `service.name` to be set, all other attributes are optional.

When creating new attribute keys, keep in mind OpenTelemetry has a [recommended pattern](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/resource/semantic_conventions/README.md#document-conventions) that you should follow to maintain broad compatibility with OpenTelemetry collectors.

```python
resource={
    # service.name is required by OpenTelemetry.
    'service.name' : df.service,
    'service.instance.id': df.pod,
    'k8s.pod.name': df.pod,
},
```

### Specifying Data

The data parameter allows you to specify a list of metrics or traces that are generated from the DataFrame. In the example script, we specify a single Gauge metric for the `df.request_per_s` column. We also supply an attribute for the metric, `req_path`. Each Metric and Trace type supports a custom attribute field. Metric/Trace attributes work similarly to Resource attributes, but they are scoped only to the specific method

```python
data=[
  px.otel.metric.Gauge(
    name='http.throughput',
    description='The number of messages sent per second',
    value=df.requests_per_s,
    attributes={
      'req_path': df.req_path,
    }
  )
]
```

We currently support a limited set of OpenTelemetry signal types: `metric.Gauge`, `metric.Summary` and `trace.Span`. We also support a subset of the available fields for each instrument. You can see the full set of features [in our api documentation.](/reference/pxl/otel-export) If you want support for other fields, please [open an issue](https://github.com/pixie-io/pixie).

## Setup the Plugin System

Now that we have a PxL script that exports OTel data, let's set up the [Plugin System](/reference/plugins/plugin-system/) to run this script at regularly scheduled intervals.

1. Navigate to the `Plugin` tab on the `Admin` page (`/admin/plugins`).

2. Click the toggle to enable the OpenTelemetry plugin.

3. Expand the plugin row (with the arrow next to the toggle) and enter the export path.

> If you are using the demo collector from [Step 1](/tutorials/integrations/otel/#deploy-the-otel-collector), then you'll use the same export path pictured below: `otel-collector.default.svc.cluster.local:4317`

4. Click the toggle to disable "Secure connections with TLS" and press the `SAVE` button. The demo OTel collector does not support TLS.

<svg title='Plugins are enabled in the Admin UI.' src='plugin/plugins_page.png'/>

5. Click the database icon in the left nav bar to open the data export configuration page.

<svg title='Select the data export icon.' src='plugin/data-export-icon.png'/>

6. The OpenTelemetry plugin comes with several pre-configured OTel export PxL scripts (more coming soon!). Click the toggle to disable these scripts:

<svg title='Select the data export icon.' src='plugin/data-export.png'/>

7. Select the `+ CREATE SCRIPT` button.

8. Enter `HTTP Throughput` for the `Script Name`.

9. Replace the contents of the `PxL` field with the following:

```python
import px
# Read in the http_events table
df = px.DataFrame(table='http_events', start_time=px.plugin.start_time)

# Attach the pod and service metadata
df.pod = df.ctx['pod']
df.service = df.ctx['service']
# Count the number of requests per pod and service
df = df.groupby(['pod', 'service', 'req_path']).agg(
  throughput=('latency', px.count),
  time_=('time_', px.max),
)

# Change the denominator if you change start_time above.
df.requests_per_s = df.throughput / 10

px.export(df, px.otel.Data(
  resource={
      # service.name is required by OpenTelemetry.
      'service.name' : df.service,
      'service.instance.id': df.pod,
      'k8s.pod.name': df.pod,
  },
  data=[
    px.otel.metric.Gauge(
      name='http.throughput',
      description='The number of messages sent per second',
      value=df.requests_per_s,
      attributes={
        'req_path': df.req_path,
      }
    )
  ]
))
```

> This is the script we developed in [Step 2](/tutorials/integrations/otel/#write-the-pxl-script) with a few modifications:

> - We've changed the DataFrame's `start_time` argument to use `px.plugin.start_time`. This value can be configured using the `Summary Window` field on this page.

> - We've removed the `Endpoint` parameter. We configured the plugin with this value in Step 3.

> - We removed the `px.display()` call which was used to display the data in the Live UI when developing our script in the Scratch Pad.

10. Select the `OpenTelemetry` option in the `Plugin` field.

11. Click the `SAVE` button.

12. To validate that the data is being received by the OTel collector, check logs for the the `otel-collector-*` pod. If the plugin configuration was successful, you should see logs every 10 seconds:

```bash
2022-04-15T21:17:27.530Z    INFO    loggingexporter/logging_exporter.go:54    MetricsExporter    {"#metrics": 32}
2022-04-15T21:17:37.570Z    INFO    loggingexporter/logging_exporter.go:54    MetricsExporter    {"#metrics": 30}
2022-04-15T21:17:47.609Z    INFO    loggingexporter/logging_exporter.go:54    MetricsExporter    {"#metrics": 29}
2022-04-15T21:17:57.449Z    INFO    loggingexporter/logging_exporter.go:54    MetricsExporter    {"#metrics": 29}
```

Congrats! You're now exporting Pixie data to an OTel collector.
