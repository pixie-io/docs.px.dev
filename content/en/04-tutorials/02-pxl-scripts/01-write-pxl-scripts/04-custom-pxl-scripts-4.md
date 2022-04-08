---
title: "Tutorial #4: Add a Timeseries chart to your Vis Spec"
metaTitle: "Tutorials | PxL Scripts | Write Custom Scripts | Tutorial #4: Add a Timeseries chart to your Vis Spec"
metaDescription: ""
order: 4
---

## Overview

In [Tutorial #3](/tutorials/pxl-scripts/write-pxl-scripts/custom-pxl-scripts-3) you learned how write a `Vis Spec` in order to create rich visualizations for your `PxL script` query in the Live UI. In this tutorial, we will add two timeseries charts to our Live View:

<svg title='Live View with Table and Timeseries chart widgets.' src='pxl-scripts/first-vis-spec-7.png'/>

## Setting up the Scratch Pad

We will continue to use the Live UI's `Scratch Pad` to develop our scripts. Let's set up the `Scratch Pad` with the final version of the `PxL Script` and `Vis Spec` we developed in [Tutorial #3](/tutorials/pxl-scripts/write-pxl-scripts/custom-pxl-scripts-3).

1. Open Pixie's [Live UI](/using-pixie/using-live-ui/).

2. Select the `Scratch Pad` script from the `script` drop-down menu in the top left.

3. Open the script editor using the keyboard shortcut: `ctrl+e` (Windows, Linux) or `cmd+e` (Mac).

4. Replace the contents of the `PxL Script` tab with the following:

```python
# Import Pixie's module for querying data
import px

def network_traffic_per_pod(start_time: str, ns: px.Namespace):

    # Load the last 30 seconds of Pixie's `conn_stats` table into a Dataframe.
    df = px.DataFrame(table='conn_stats', start_time=start_time)

    # Each record contains contextual information that can be accessed by the reading ctx.
    df.pod = df.ctx['pod']
    df.service = df.ctx['service']
    df.namespace = df.ctx['namespace']

    # Filter connections to only those within the provided namespace.
    df = df[df.namespace == ns]

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
```

5. Replace the contents of the `Vis Spec` tab with the following:

```json
{
    "variables": [
        {
            "name": "start_time",
            "type": "PX_STRING",
            "description": "The relative start time of the window. Current time is assumed to be now",
            "defaultValue": "-5m"
        },
        {
            "name": "namespace",
            "type": "PX_NAMESPACE",
            "description": "The name of the namespace."
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
                    },
                    {
                        "name": "ns",
                        "variable": "namespace"
                    }
                ]
            },
            "displaySpec": {
                "@type": "types.px.dev/px.vispb.Table"
            }
        }
    ],
    "globalFuncs": []
}
```

6. Make sure the script runs by using the `RUN` button or keyboard shortcut: `ctrl+enter` (Windows, Linux) or `cmd+enter` (Mac).

## Adding a function to the PxL Script

```python
# Import Pixie's module for querying data
import px

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

## Adding to the Vis Spec

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

## Interacting with the Timeseries Graph

## Pro Tip

Note about looking at other scripts for inspiration

<Alert variant="outlined" severity="info">
  For a detailed description of every Vis Spec field, please refer to the <a href="https://github.com/pixie-io/pixie/blob/bdae78cc266a078e73db2d9be205fc3ce5cc823b/src/api/proto/vispb/vis.proto">Vis Spec proto</a>.
</Alert>

## Conclusion
