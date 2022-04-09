---
title: "Export Data to OpenTelemetry"
metaTitle: "Tutorials | Integrations and Alerts | Pixie <> OpenTelemetry"
metaDescription: "Export Data to OpenTelemetry"
order: 3
redirect_from:
    - /tutorials/otel/
---


Pixie comes packaged with an OpenTelemetry exporter. You can write PxL scripts that define the transformation of Pixie DataFrames into OpenTelemetry data. This article walks through a script that exports HTTP data collected by Pixie into an OpenTelemetry endpoint. More detailed PxL documentation for the OpenTelemetry integration is available [here](/reference/pxl/otel-export). 


## Example OpenTelemetry Export PxL Script

The following [PxL script](/tutorials/pxl-scripts/write-pxl-scripts/#overview) calculates the rate of HTTP requests made to each pod in your cluster and exports that data as an OpenTelemetry Gauge metric.  


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

# Change the denominator if you change start_time above.
df.requests_per_s = df.throughput / 10

px.export(df, px.otel.Data(
  # endpoint arg not required if run in a plugin that provides the endpoint
  endpoint=px.otel.Endpoint(
    url='0.0.0.0:98765',
    headers={
      'apikey': '12345',
    }
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
```



## The Data
The first part of this script (lines 1-19) read  in the `http_events` data and count the number of requests made to each pod from the last 10s.


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



## Exporting

To export the data, you’ll call `px.export` with the DataFrame as the first argument and the export target `px.otel.Data` as the second argument. 


```python
px.export(df, px.otel.Data(...))
```


The export target (`px.otel.Data`) describes which columns to use for the corresponding OpenTelemetry fields. You specify a column using the same syntax as in a regular query: `df.column_name` or `df[‘column_name’]`. The columns must reference a column available in the `df` argument or the PxL compiler will throw an error


## Specifying a Collector Endpoint and Authentication

The PxL OpenTelemetry exporter needs to talk with a collector. You must specify this information via the `endpoint` parameter:


```python
endpoint=px.otel.Endpoint(
  url='0.0.0.0:55690',
  headers={
    'api-key': '12345',
  }
),
```


The endpoint url must be an OpenTelemetry grpc endpoint and must be secured with SSL. Don’t specify a protocol prefix. Optionally, you can also specify the headers passed to the endpoint. Some OpenTelemetry collector providers look for authentication tokens or api keys in the connection context. The headers field is where you can add this information.

Note that if you’re writing a [plugin script](/reference/plugins/plugin-system), this information should be passed in from the plugin context.


## Transforming Data

The core idea of the PxL OpenTelemetry export is that you’re converting columnar data from a Pixie DataFrame into the fields of whatever OpenTelemetry data that you wish to capture. You can reference a column by using the attribute syntax `df.column_name`. Under the hood, Pixie will convert the values for each row into a new OpenTelemetry message. The columns must match up with the DataFrame that you are exporting (the first argument to `px.export`), otherwise you will receive a compiler error.


## Specifying a Resource

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



## Specifying Data

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

