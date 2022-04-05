---
title: "Tutorial #5: Add a Graph to your Vis Spec"
metaTitle: "Tutorials | PxL Scripts | Write Custom Scripts | Tutorial #5: Add a Graph to your Vis Spec"
metaDescription: ""
order: 5
---

## Overview

## Set up the Scratch Pad

## Modifying the PxL Script

```python
# Import Pixie's module for querying data
import px

def pod_connections(start_time: str):

    # Load the last 30 seconds of Pixie's `conn_stats` table into a Dataframe.
    df = px.DataFrame(table='conn_stats', start_time=start_time)

    # Each record contains contextual information that can be accessed by the reading ctx.
    df.pod = df.ctx['pod']

    # Group data by unique values in the 'pod' column and calculate the
    # sum of the 'bytes_sent' and 'bytes_recv' for each unique pod grouping.
    df = df.groupby(['pod', 'remote_addr']).agg(
        bytes_sent=('bytes_sent', px.sum),
        bytes_recv=('bytes_recv', px.sum)
    )

    df.remote_pod = px.pod_id_to_pod_name(px.ip_to_pod_id(df.remote_addr))

    df.is_server_side_tracing = df.trace_role == 2
    df.responder_pod = px.select(df.is_server_side_tracing, df.pod, df.remote_pod)
    df.requestor_pod = px.select(df.is_server_side_tracing, df.remote_pod, df.pod)

    return df

def network_traffic_per_pod(start_time: str):

    # Load the last 30 seconds of Pixie's `conn_stats` table into a Dataframe.
    df = px.DataFrame(table='conn_stats', start_time=start_time)

    # Each record contains contextual information that can be accessed by the reading ctx.
    df.pod = df.ctx['pod']
    df.service = df.ctx['service']

    # Group data by unique values in the 'pod' column and calculate the
    # sum of the 'bytes_sent' and 'bytes_recv' for each unique pod grouping.
    df = df.groupby(['pod', 'service']).agg(
        bytes_sent=('bytes_sent', px.sum),
        bytes_recv=('bytes_recv', px.sum)
    )

    # Force ordering of the columns (do not include _clusterID_, which is a product of the CLI and not the PxL script)
    df = df[['service', 'pod', 'bytes_sent', 'bytes_recv']]

    # Filter out connections that don't have their service identified.
    df = df[df.service != '']

    return df

def network_traffic_timeseries(start_time: str):

    # Load the last 30 seconds of Pixie's `conn_stats` table into a Dataframe.
    df = px.DataFrame(table='conn_stats', start_time=start_time)

    # Each record contains contextual information that can be accessed by the reading ctx.
    df.pod = df.ctx['pod']

    df.duration = px.parse_duration(start_time)

    # Window size to use on time_ column for bucketing.
    ns_per_s = 1000 * 1000 * 1000
    window_ns = px.DurationNanos(10 * ns_per_s)
    df.timestamp = px.bin(df.time_, window_ns)

    df = df.groupby(['pod', 'timestamp']).agg(
        bytes_sent=('bytes_sent', px.sum),
        bytes_recv=('bytes_recv', px.sum)
    )

    df.time_ = df.timestamp
    df = df.drop('timestamp')

    return df
```

## Modifying the Vis Spec

```json
{
  "variables": [
      {
          "name": "start_time",
          "type": "PX_STRING",
          "description": "The relative start time of the window. Current time is assumed to be now",
          "defaultValue": "-5m"
      }
  ],
  "widgets": [
      {
          "name": "Network Traffic per Pod",
          "position": {
              "x": 0,
              "y": 0,
              "w": 12,
              "h": 3
          },
          "func": {
              "name": "network_traffic_per_pod",
              "args": [
                  {
                      "name": "start_time",
                      "variable": "start_time"
                  }
              ]
          },
          "displaySpec": {
              "@type": "types.px.dev/px.vispb.Table",
              "gutterColumn": "status"
          }
      },
      {
          "name": "Bytes Sent",
          "position": {
              "x": 0,
              "y": 3,
              "w": 6,
              "h": 3
          },
          "globalFuncOutputName": "resource_timeseries",
          "displaySpec": {
              "@type": "types.px.dev/px.vispb.TimeseriesChart",
              "timeseries": [
                  {
                      "value": "bytes_sent",
                      "mode": "MODE_LINE",
                      "series": "pod"
                  }
              ],
              "title": "",
              "yAxis": {
                  "label": "Bytes sent"
              },
              "xAxis": null
          }
      },
      {
          "name": "Bytes Received",
          "position": {
              "x": 6,
              "y": 3,
              "w": 6,
              "h": 3
          },
          "globalFuncOutputName": "resource_timeseries",
          "displaySpec": {
              "@type": "types.px.dev/px.vispb.TimeseriesChart",
              "timeseries": [
                  {
                      "value": "bytes_recv",
                      "mode": "MODE_LINE",
                      "series": "pod"
                  }
              ],
              "title": "",
              "yAxis": {
                  "label": "Bytes received"
              },
              "xAxis": null
          }
      },
      {
          "name": "Pod Connections",
          "position": {
              "x": 0,
              "y": 6,
              "w": 12,
              "h": 5
          },
          "func": {
              "name": "pod_connections",
              "args": [
                  {
                      "name": "start_time",
                      "variable": "start_time"
                  }
              ]
          },
          "displaySpec": {
              "@type": "types.px.dev/px.vispb.Graph",
              "adjacencyList": {
                  "fromColumn": "requestor_pod",
                  "toColumn": "responder_pod"
              },
              "edgeWeightColumn": "bytes_recv",
              "edgeLength": 300,
              "edgeThresholds": {
                  "mediumThreshold": 5,
                  "highThreshold": 50
              },
              "edgeHoverInfo": [
                  "bytes_recv",
                  "bytes_sent"
              ]
          }
      }
  ],
  "globalFuncs": [
      {
          "outputName": "resource_timeseries",
          "func": {
              "name": "network_traffic_timeseries",
              "args": [
                  {
                      "name": "start_time",
                      "variable": "start_time"
                  }
              ]
          }
      }
  ]
}
```

## Conclusion
