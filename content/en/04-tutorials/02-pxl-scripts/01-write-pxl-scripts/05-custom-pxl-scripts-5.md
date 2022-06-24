---
title: "Tutorial #5: Add a Graph to your Vis Spec"
metaTitle: "Tutorials | PxL Scripts | Write Custom Scripts | Tutorial #5: Add a Graph to your Vis Spec"
metaDescription: ""
order: 5
---

In the previous two tutorials, you learned how to write a Vis Spec to visualize PxL script query output in the form of a table and time series chart.

In this tutorial, we will add a graph to our Live View. This graph will map all of the connections that Pixie has automatically traced between the pods in your cluster.

<svg title='Live View with table, time series chart, and graph widgets.' src='pxl-scripts/first-vis-spec-1.png'/>

## Setting up the Scratch Pad

We will continue to use the Live UI's [`Scratch Pad`](/using-pixie/using-live-ui/#write-your-own-pxl-scripts-use-the-scratch-pad) to develop our scripts. Let's set it up with the final version of the code we developed in [Tutorial #4](/tutorials/pxl-scripts/write-pxl-scripts/custom-pxl-scripts-4):

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

6. Make sure the script runs by clicking the `RUN` button or keyboard shortcut: `ctrl+enter` (Windows, Linux) or `cmd+enter` (Mac).

## Modifying the PxL Script

To help you visualize what is happening in your Kubernetes cluster, let's add a graph that maps all of the connections that Pixie has automatically traced between the pods in your cluster. This will allow you to quickly see which pods are communicating with each other.

To do this, we'll first need to add a new PxL script function. This function will output a table of data that we can use to populate our graph. The graph widget requires a "fromColumn" and "toColumn" to create a graph. We can also supply additional columns that can be used to create the graph edge weight or hover info.

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

    return d

def pod_connections(start_time: str):

    # Load the `conn_stats` table into a Dataframe.
    df = px.DataFrame(table='conn_stats', start_time=start_time)

    # Each record contains contextual information that can be accessed by the reading ctx.
    df.pod = df.ctx['pod']

    # Calculate connection stats for each process for each unique pod / remote_addr pair.
    # trace_role is included in the groupby so that we can use it later on.
    df = df.groupby(['pod', 'upid', 'remote_addr', 'trace_role']).agg(
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

    # Calculate connection stats for each unique pod / remote_addr pair. Since there
    # may be multiple processes per pod we perform an additional aggregation to
    # consolidate those into one entry.
    # trace_role is included in the groupby so that we can use it later on.
    df = df.groupby(['pod', 'remote_addr', 'trace_role']).agg(
        bytes_sent=('bytes_sent', px.sum),
        bytes_recv=('bytes_recv', px.sum),
    )

    # Get the pod name from the connection's remote address
    df.remote_pod = px.pod_id_to_pod_name(px.ip_to_pod_id(df.remote_addr))

    # Determine the requestor and responder pods be looking at the trace_role.
    # Connections are traced server-side (trace_role==2), unless the server is
    # outside of the cluster in which case the request is traced client-side (trace_role==1).
    #
    # When trace_role==2, the connection source is the remote_addr column
    # and destination is the pod column. When trace_role==1, the connection
    # source is the pod column and the destination is the remote_addr column.
    df.is_server_side_tracing = df.trace_role == 2
    df.responder_pod = px.select(df.is_server_side_tracing, df.pod, df.remote_pod)
    df.requestor_pod = px.select(df.is_server_side_tracing, df.remote_pod, df.pod)

    return dfs
```

> On `line 81` we define a new function called `pod_connections()`.

> The code on `lines 84-111` should look very familiar to you at this point. If you are still confused, go back and re-read the explanation in [Tutorial #3](/tutorials/pxl-scripts/write-pxl-scripts/custom-pxl-scripts-3) or [Tutorial #4](/tutorials/pxl-scripts/write-pxl-scripts/custom-pxl-scripts-4). Note that the groupby on `line 91` and `line 108` contain the `trace_role` column. This is because we will need to use this column on `line 123`.

> On `line 114` we get the pod name for any connections whose `remote_addr` are a pod within the cluster.

> On `lines 123-125` we create `requestor_pod` and `responder_pod` columns by looking at the `trace_role` column. Pixie traces connections server-side (trace_role==2), unless the server is outside of the cluster in which case the request is traced client-side (trace_role==1).

## Modifying the Vis Spec

Let's modify the Vis Spec to create a new graph widget populated with data from our new PxL function:

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

> On `lines 83-117` we've added a new graph widget named "Pod Connections".

> On `lines 103-104` we define the `fromColumn` and `toColumn` which will be used to construct the graph.

> On `line 106` we define the `edgeWeightColumn` to be the `bytes_recv` column.

> On `line 112` we define the `edgeHoverInfo`.

<Alert variant="outlined" severity="info">
  For a detailed description of every Vis Spec field, please refer to the <a href="https://github.com/pixie-io/pixie/blob/bdae78cc266a078e73db2d9be205fc3ce5cc823b/src/api/proto/vispb/vis.proto">Vis Spec proto</a>.
</Alert>

2. Run the script using the keyboard shortcut: `ctrl+enter` (Windows, Linux) or `cmd+enter` (Mac).

> Your Live UI output should now contain a graph:

<svg title='Live View with table, time series chart, and graph widgets.' src='pxl-scripts/first-vis-spec-1.png'/>

## Interacting with Graph Widget

Pixie's Live View widgets are interactive.

Here are a sample of ways you can interact with the graph widget:

- Click anywhere on the graph to interact. You can pan, zoom, or rearrange individual nodes.

- Hover over a graph edge to see edge stats. For this graph, we've configured the edge stats to show total bytes sent and received. Thicker edge lines indicate more bytes received.

- Click `ENABLE HIERARCHY` to see the nodes in a hierarchical layout.

## Conclusion

Congratulations, you have finished writing a Vis Spec that displays your Pixie telemetry data in table, time series chart and graph form!

## Pro Tip: Don't start from scratch

When writing a new PxL script or Vis Spec, it's often easiest to modify an existing script instead of starting from scratch.

Start by identifying a script that does something similar to what you're looking for. The Live UI's `script` drop-down menu lists all of Pixie's [open source scripts](https://github.com/pixie-io/pixie/tree/main/src/pxl_scripts) along with their descriptions:

<svg title='' src='live-ui/scratch-pad.png'/>

You can also browse the [101 tutorials](/tutorials/pixie-101/) to see how to use Pixie's open source PxL scripts for specific observability use cases.

Once you identify a PxL script / Vis Spec that does something similar to what you are aiming to do, [open the script editor](/using-pixie/using-live-ui/#write-your-own-pxl-scripts-edit-an-existing-script) and start modifying the script to convert it into what you want.

<Alert variant="outlined" severity="warning">
  Pixie's Live UI will soon support script persistence, but at the moment, any scripts modified in the Live UI will be lost if you refresh or switch to a different script. When editing scripts in the Live UI, make sure to save a copy of your changes outside of Pixie. For extensive script development, we recommend using the <a href="/tutorials/pxl-scripts/script-dev-environment/">Script Developer Environment</a>
</Alert>
