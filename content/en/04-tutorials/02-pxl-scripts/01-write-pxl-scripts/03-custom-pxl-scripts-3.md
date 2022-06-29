---
title: "Tutorial #3: Write your first Vis Spec"
metaTitle: "Tutorials | PxL Scripts | Write Custom Scripts | Tutorial #3: Write your first Vis Spec"
metaDescription: ""
order: 3
---

In [Tutorial #1](/tutorials/pxl-scripts/write-pxl-scripts/custom-pxl-scripts-1) and [Tutorial #2](/tutorials/pxl-scripts/write-pxl-scripts/custom-pxl-scripts-2) we wrote a simple PxL script that produced a table summarizing the total traffic coming in and out of each of the pods in your cluster. We used the Pixie CLI tool to execute the script:

<svg title='CLI output for the PxL script developed in Tutorials #1 and #2.' src='pxl-scripts/first-script-5.png'/>

In this tutorial series, we will look at other ways to visualize this data, including a time series chart and graph. We will use the [Live UI](/using-pixie/using-live-ui/) to execute the script since it offers rich visualizations that are not available with Pixie's [CLI](/using-pixie/using-cli/) or [API](/using-pixie/api-quick-start/).

<svg title='Live UI output after this Vis Spec tutorial series.' src='pxl-scripts/first-vis-spec-1.png'/>

## Using the Scratch Pad

The Live UI's [`Scratch Pad`](/using-pixie/using-live-ui/#write-your-own-pxl-scripts-use-the-scratch-pad) is designed for developing quick, one-off scripts. Let's use the `Scratch Pad` to run the PxL script we developed in [Tutorial #2](/tutorials/pxl-scripts/write-pxl-scripts/custom-pxl-scripts-2).

1. Open Pixie's [Live UI](/using-pixie/using-live-ui/).

2. Select the `Scratch Pad` script from the `script` drop-down menu in the top left.

3. Open the script editor using the keyboard shortcut: `ctrl+e` (Windows, Linux) or `cmd+e` (Mac).

4. Replace the contents of the `PxL Script` tab with the script developed in [Tutorial #2](/tutorials/pxl-scripts/write-pxl-scripts/custom-pxl-scripts-2):

```python:numbers
# Import Pixie's module for querying data
import px

# Load the last 30 seconds of Pixie's `conn_stats` table into a Dataframe.
df = px.DataFrame(table='conn_stats', start_time='-30s')

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

# Display the DataFrame with table formatting
px.display(df)
```

5. Run the script using the keyboard shortcut: `ctrl+enter` (Windows, Linux) or `cmd+enter` (Mac).

6. Hide the script editor using the keyboard shortcut: `ctrl+e` (Windows, Linux) or `cmd+e` (Mac).

> Your Live UI should output something similar to the following:

<svg title='PxL script output using the Scratch Pad in the Live UI' src='pxl-scripts/first-vis-spec-2.png'/>

Now you know how to run PxL scripts using both the [CLI](/using-pixie/using-cli/) and the [Live UI](/using-pixie/using-live-ui/) scratch pad.

## What is a Vis Spec?

Pixie's [Live UI](/using-pixie/using-live-ui/) constructs "Live View" dashboards using two files:

- The `PxL Script` queries the Pixie platform for telemetry data.
- The `Vis Spec` defines the functions to execute from the `PxL script`, provides inputs to those functions, and defines how to visualize the output.

You might wonder how our PxL Script (which does not yet have a Vis Spec) was able to be visualized in the Live UI. The Live UI allows you to omit the Vis Spec if you call [`px.display()`](/reference/pxl/operators/px.display/) in your PxL Script. This call tells the Live UI to format the query output into a table.

## Refactoring the PxL Script

The last line of our PxL script includes a call to [`px.display()`](/reference/pxl/operators/px.display/). Let's remove this function call and instead use a Vis Spec to do the same thing: format the query output into a table.

Remember that the Vis Spec specifies which function(s) to execute from the PxL script. So we will need to refactor our PxL script to contain a function with our query.

1. Open the script editor using the keyboard shortcut: `ctrl+e` (Windows, Linux) or `cmd+e` (Mac).

2. Replace the contents of the `PxL Script` tab with the following:

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

> On `line 4` we define a function called `network_traffic_per_pod()`. This function takes a string input variable called `start_time` and encapsulates the same query logic from the previous version of our PxL script.

> On `line 7` we pass the function's `start_time` argument to the DataFrame's own `start_time` variable.

## Writing your first Vis Spec

Now, let's write the Vis Spec.

1. Select the `Vis Spec` tab at the top of the script editor.

> You should see the following empty Vis Spec:

```json:numbers
{
    "variables": [],
    "widgets": [],
    "globalFuncs": []
}
```

> A Vis Spec is a json file containing three lists:

> - **widgets**: the visual elements to show in the Live View (e.g. chart, map, table)
> - **globalFuncs**: the PxL script functions that output data to be displayed by the widgets
> - **variables**: the input variables that can be provided to the PxL script functions

2. Replace the contents of the `Vis Spec` tab with the following:

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

> Remember that the Vis Spec has three purposes. It defines the functions to execute from the PxL script, provides inputs to those functions, and describes how to visualize the query output.

> Starting on `line 2` we list a single variable called `start_time`. This input variable is provided to the `network_traffic_per_pod()` function on `line 24`. The Live UI will display all script variables at the top of the Live View.

> Starting on `line 10` we list a single table widget:
>
> - The `name` field is an optional string that is displayed at the top of the widget in the Live View. A widget's `name` must be unique across all widgets in a given Vis Spec.
> - The `position` field specifies the location and size of the widget within the Live View.
> - The `func` field provides the name of the PxL script function to invoke to provide the output to be displayed in the widget. This function takes the previously defined `start_time` variable as an input argument.
> - The `displaySpec` field specifies the widget type (Table, Bar Chart, Graph, etc)

> This Vis Spec only contains a single function, so we define it inline within the widget (starting on `line 19`). If multiple widgets used the same function, you would want to define it in the `"globalFuncs"` field. You'll see how to do that in [Tutorial #4](/tutorials/pxl-scripts/write-pxl-scripts/custom-pxl-scripts-4).

<Alert variant="outlined" severity="info">
  For a detailed description of every Vis Spec field, please refer to the <a href="https://github.com/pixie-io/pixie/blob/bdae78cc266a078e73db2d9be205fc3ce5cc823b/src/api/proto/vispb/vis.proto">Vis Spec proto</a>.
</Alert>

3. Run the script using the keyboard shortcut: `ctrl+enter` (Windows, Linux) or `cmd+enter` (Mac).

4. Hide the script editor using the keyboard shortcut: `ctrl+e` (Windows, Linux) or `cmd+e` (Mac).

> Your Live UI should output something similar to the following:

<svg title='Live View with Table widget.' src='pxl-scripts/first-vis-spec-4.png'/>

5. Note the `start_time` variable in the top right. Select the drop-down arrow next to it, type `-1h` and press `Enter`. The Live UI should update the results to reflect the new time window.

## Adding a Required Script Variable

Let's add another variable, a required one, to the `Vis Spec`. A required variable must be input before the script can be run.

1. Open the script editor using the keyboard shortcut: `ctrl+e` (Windows, Linux) or `cmd+e` (Mac).

2. Select the `PxL Script` tab and replace the contents with the following:

```python:numbers
# Import Pixie's module for querying data
import px

def network_traffic_per_pod(start_time: str, ns: px.Namespace):

    # Load the `conn_stats` table into a Dataframe.
    df = px.DataFrame(table='conn_stats', start_time=start_time)

    # Each record contains contextual information that can be accessed by the reading ctx.
    df.pod = df.ctx['pod']
    df.service = df.ctx['service']
    df.namespace = df.ctx['namespace']

    # Filter connections to only those within the provided namespace.
    df = df[df.namespace == ns]

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

> On `line 4` we add an additional `ns` argument of type `px.Namespace` to our function definition.

> On `line 15` we use the `ns` variable to filter the pod connections to only those involving pods in the specified namespace.

3. Switch to the `Vis Spec` tab and replace the contents with the following:

```json:numbers
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

> We've updated the Vis Spec in the following ways:

> - Starting on `line 9` we added a `namespace` argument to the list of `"variables"`.
> - By omitting a `defaultValue`, the `namespace` variable is designated as required; This means that the Live UI will error until you provide a value for the `namespace` variable.
> - On `line 11` we define the `namespace` argument type as `PX_NAMESPACE`. By using one of Pixie's [semantic types](/reference/pxl/#data-types-semantic-types), the Live UI will suggest the cluster's available namespaces when entering a value for the variable.
> - Starting on `line 31`, we updated the `network_traffic_per_pod()` function to take the new variable as an argument.

4. Run the script using the keyboard shortcut: `ctrl+enter` (Windows, Linux) or `cmd+enter` (Mac).

5. Hide the script editor using `ctrl+e` (Windows, Linux) or `cmd+e` (Mac).

> You should get the following error since the `Vis Spec` defines the `namespace` argument as a required variable:

<svg title='Error indicating a value is missing for a required argument.' src='pxl-scripts/first-vis-spec-5.png'/>

6. Select the drop-down arrow next to the `namespace` argument. If you wait for a second, the drop-down menu should populate with the available `namespace` names. Type `default` and press `Enter`.

> The Live UI should update with the appropriate results for that namespace.

<svg title='Live View results filtered by the specified namespace.' src='pxl-scripts/first-vis-spec-6.png'/>

<Alert variant="outlined" severity="info">
  The Live UI denotes <b>required script variables</b> with an asterisk (*) next to the variable name.
</Alert>

## Interacting with Table Widgets

Pixie's Live View widgets are interactive. Here are a sample of ways you can interact with the table widget:

- To sort a table column, click on a column title.

- Click on deep links to easily navigate between Kubernetes entities. Click on any node / service / pod name (in a table cell) to be taken to an overview of that resource.

- To see a table row's contents in JSON form, click on the row to expand it. This is useful for seeing the contents of a truncated table cell.

- To add / remove columns from the table (without modifying the PxL script), use the hamburger menu to the left of the first column title.

## Conclusion

Congratulations, you wrote your first Vis Spec to accompany your PxL Script!

Tables aren't all that exciting, but now that you know how Vis Specs work you can learn how to visualize your data in more interesting ways. In [Tutorial #4](/tutorials/pxl-scripts/write-pxl-scripts/custom-pxl-scripts-4) we'll add a timeseries chart to our Live View.
