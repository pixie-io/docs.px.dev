---
title: "Tutorial #4: Add a Timeseries chart to your Vis Spec"
metaTitle: "Tutorials | PxL Scripts | Write Custom Scripts | Tutorial #4: Add a Timeseries chart to your Vis Spec"
metaDescription: ""
order: 4
---

In [Tutorial #3](/tutorials/pxl-scripts/write-pxl-scripts/custom-pxl-scripts-3) you learned how write a Vis Spec in order to visualize the PxL script query output as a table in the Live UI.

In this tutorial, we will add two time series charts to our Vis Spec:

<svg title='Live View with table and time series chart widgets.' src='pxl-scripts/first-vis-spec-7.png'/>

## Setting up the Scratch Pad

We will continue to use the Live UI's [`Scratch Pad`](/using-pixie/using-live-ui/#write-your-own-pxl-scripts-use-the-scratch-pad) to develop our scripts. Let's set it up with the first version of the PxL Script and Vis Spec we developed in [Tutorial #3](/tutorials/pxl-scripts/write-pxl-scripts/custom-pxl-scripts-3):

1. Open Pixie's [Live UI](/using-pixie/using-live-ui/).

2. Select the `Scratch Pad` script from the `script` drop-down menu in the top left.

3. Open the script editor using the keyboard shortcut: `ctrl+e` (Windows, Linux) or `cmd+e` (Mac).

4. Replace the contents of the `PxL Script` tab with the following:

```python:numbers
# Import Pixie's module for querying data
import px

def network_traffic_per_pod(start_time: str):

    # Load the `conn_stats` table into a Dataframe.
    df = px.DataFrame(table='conn_stats', start_time=start_time)

    # Each record contains contextual information that can be accessed by the reading ctx.
    df.pod = df.ctx['pod']
    df.service = df.ctx['service']

    # Calculate connection stats for each process for each unique pod.
    df = df.groupby(['service', 'pod', 'upid']).agg(
        # The fields below are counters per UPID, so we take
        # the min (starting value) and the max (ending value) to subtract them.
        bytes_sent_min=('bytes_sent', px.min),
        bytes_sent_max=('bytes_sent', px.max),
        bytes_recv_min=('bytes_recv', px.min),
        bytes_recv_max=('bytes_recv', px.max),
    )

    # Calculate connection stats over the time window.
    df.bytes_sent = df.bytes_sent_max - df.bytes_sent_min
    df.bytes_recv = df.bytes_recv_max - df.bytes_recv_min

    # Calculate connection stats for each unique pod. Since there
    # may be multiple processes per pod we perform an additional aggregation to
    # consolidate those into one entry.
    df = df.groupby(['service', 'pod']).agg(
        bytes_sent=('bytes_sent', px.sum),
        bytes_recv=('bytes_recv', px.sum),
    )

    # Filter out connections that don't have their service identified.
    df = df[df.service != '']

    return df
```

5. Replace the contents of the `Vis Spec` tab with the following:

```json:numbers
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
                "@type": "types.px.dev/px.vispb.Table"
            }
        }
    ],
    "globalFuncs": []
}
```

6. Make sure the script runs by clicking the `RUN` button or keyboard shortcut: `ctrl+enter` (Windows, Linux) or `cmd+enter` (Mac).

## Adding a Function to the PxL Script

Our PxL script contains a single `network_traffic_per_pod()` function. This function calculates two values for each pod in our cluster: total bytes sent and total bytes received (for the selected time window).

In order to add time series charts to our Live View, we'll need to calculate time series data for each metric (bytes sent and bytes received). Let's add a second function to our PxL script to do that:

1. Replace the contents of the `PxL Script` tab with the following:

```python:numbers
# Import Pixie's module for querying data
import px

def network_traffic_per_pod(start_time: str):

    # Load the `conn_stats` table into a Dataframe.
    df = px.DataFrame(table='conn_stats', start_time=start_time)

    # Each record contains contextual information that can be accessed by the reading ctx.
    df.pod = df.ctx['pod']
    df.service = df.ctx['service']

    # Calculate connection stats for each process for each unique pod.
    df = df.groupby(['service', 'pod', 'upid']).agg(
        # The fields below are counters per UPID, so we take
        # the min (starting value) and the max (ending value) to subtract them.
        bytes_sent_min=('bytes_sent', px.min),
        bytes_sent_max=('bytes_sent', px.max),
        bytes_recv_min=('bytes_recv', px.min),
        bytes_recv_max=('bytes_recv', px.max),
    )

    # Calculate connection stats over the time window.
    df.bytes_sent = df.bytes_sent_max - df.bytes_sent_min
    df.bytes_recv = df.bytes_recv_max - df.bytes_recv_min

    # Calculate connection stats for each unique pod. Since there
    # may be multiple processes per pod we perform an additional aggregation to
    # consolidate those into one entry.
    df = df.groupby(['service', 'pod']).agg(
        bytes_sent=('bytes_sent', px.sum),
        bytes_recv=('bytes_recv', px.sum),
    )

    # Filter out connections that don't have their service identified.
    df = df[df.service != '']

    return df

def network_traffic_timeseries(start_time: str):

    # Load the `conn_stats` table into a Dataframe.
    df = px.DataFrame(table='conn_stats', start_time=start_time)

    # Each record contains contextual information that can be accessed by the reading ctx.
    df.pod = df.ctx['pod']

    # Window size to use on time_ column for bucketing.
    ns_per_s = 1000 * 1000 * 1000
    window_ns = px.DurationNanos(10 * ns_per_s)
    df.timestamp = px.bin(df.time_, window_ns)

    # Calculate connection stats for each unique pod / upid / timestamp pair.
    df = df.groupby(['pod', 'upid', 'timestamp']).agg(
        # The fields below are counters per UPID, so we take
        # the min (starting value) and the max (ending value) to subtract them.
        bytes_sent_min=('bytes_sent', px.min),
        bytes_sent_max=('bytes_sent', px.max),
        bytes_recv_min=('bytes_recv', px.min),
        bytes_recv_max=('bytes_recv', px.max),
    )

    # Calculate connection stats over the time window.
    df.bytes_sent = df.bytes_sent_max - df.bytes_sent_min
    df.bytes_recv = df.bytes_recv_max - df.bytes_recv_min

    # Calculate connection stats for each unique pod / timestamp pair. Since there
    # may be multiple processes per pod we perform an additional aggregation to
    # consolidate those into one entry.
    df = df.groupby(['pod', 'timestamp']).agg(
        bytes_sent=('bytes_sent', px.sum),
        bytes_recv=('bytes_recv', px.sum),
    )

    # The timeseries chart widget expects a `time_` column
    df.time_ = df.timestamp
    df = df.drop('timestamp')

    return df
```

> On `line 40` we define a new function called `network_traffic_timeseries()`.

> On `line 43` we create a DataFrame and populate it with data from the same [`conn_stats`](/reference/datatables/conn_stats/) telemetry data table.

> On `line 46` we use the [`ctx`](/reference/pxl/operators/dataframe.ctx.__getitem__/) function to add a `pod` column which contains the name of the pod that initiated the traced connection.

> On `lines 49-51` we use the [`bin`](/reference/pxl/udf/bin/) function to create a `timestamp` column from the `time_` column. The `timestamp` column contains the values in the `time_` column rounded down to the nearest multiple of 10 seconds.

> On `lines 54-73` we group and aggregate the connection stats according to unique pod and timestamp pairs.

> The time series chart widget expects a `time_` column in the DataFrame, so on `line 76` we rename the `timestamp` column to `time_`.

## Adding the Time Series Charts to the Vis Spec

Let's add two time series chart widgets to our Vis Spec:

1. Replace the contents of the `Vis Spec` tab with the following:

```json:numbers
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

> On `lines 85-96` we add our new `network_traffic_timeseries()` function to the `globalFuncs` list. This function will be used by both of the time series chart widgets that we will add next.

> On `lines 33-57` we add a new times series chart widget named "Bytes Sent":

> - The time series widget contains the same `name` and `position` fields as the table widget.

> - Instead of using the `func` field to define the function inline (as we did with the table widget), we use the `globalFuncOutputName` field to reference our global function.

> - In the `displaySpec` field we use the `timeseries` field to define the `value` and `series`. This chart will plot the `bytes_sent` values for each `pod` series.

> On `lines 58-82` we add a widget named "Bytes Received" that is identical to the "Bytes Sent" chart, but instead plots the `bytes_recv` column of values from the `resource_timeseries` function output table.

<Alert variant="outlined" severity="info">
  For a detailed description of every Vis Spec field, please refer to the <a href="https://github.com/pixie-io/pixie/blob/bdae78cc266a078e73db2d9be205fc3ce5cc823b/src/api/proto/vispb/vis.proto">Vis Spec proto</a>.
</Alert>

2. Run the script using the keyboard shortcut: `ctrl+enter` (Windows, Linux) or `cmd+enter` (Mac).

> Your Live UI output should now contain two charts in addition to the table:

<svg title='Live View with table and time series chart widgets.' src='pxl-scripts/first-vis-spec-7.png'/>

## Conclusion

Congratulations, you edited your PxL script and Vis Spec to produce a time series chart in the Live UI!

Tables and time series charts are useful for visualizing your observability data, but graphs can help you even more quickly make sense of what's happening with your Kubernetes applications. In [Tutorial #5](/tutorials/pxl-scripts/write-pxl-scripts/custom-pxl-scripts-5) we'll add a graph to our Live View.
