---
title: "Tutorial #3: Write your first Vis Spec"
metaTitle: "Tutorials | PxL Scripts | Write Custom Scripts | Tutorial #3: Write your first Vis Spec"
metaDescription: ""
order: 3
---

## Overview

In [Tutorial #1](/tutorials/pxl-scripts/write-pxl-scripts/custom-pxl-scripts-1) and [Tutorial #2](/tutorials/pxl-scripts/write-pxl-scripts/custom-pxl-scripts-2) we wrote a simple PxL script that produced a table summarizing the total traffic coming in and out of each of the pods in your cluster. We used the Pixie CLI tool to execute the script:

<svg title='CLI output for the PxL script developed in Tutorials #1 and #2.' src='pxl-scripts/first-script-5.png'/>

In this tutorial series, we will look at other ways to visualize this data, including a timeseries chart and graph. We will use the Live UI to execute the script since it offers rich visualizations that are not available with the CLI or API:

<svg title='Live UI output after this tutorial.' src='pxl-scripts/first-vis-spec-1.png'/>

## Using the Scratch Pad

The Live UI's `Scratch Pad` is designed for developing quick, one-off scripts. Let's use the `Scratch Pad` to run the PxL script we developed in [Tutorial #2](/tutorials/pxl-scripts/write-pxl-scripts/custom-pxl-scripts-2).

1. Open Pixie's [Live UI](/using-pixie/using-live-ui/).

2. Select the `Scratch Pad` script from the `script` drop-down menu in the top left.

3. Open the script editor using the keyboard shortcut: `ctrl+e` (Windows, Linux) or `cmd+e` (Mac).

4. Replace the contents of the `PxL Script` tab with the following:

```python
# Import Pixie's module for querying data
import px

# Load the last 30 seconds of Pixie's `conn_stats` table into a Dataframe.
df = px.DataFrame(table='conn_stats', start_time='-30s')

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

# Display the DataFrame with table formatting
px.display(df)
```

4. Run the script using the `RUN` button in the top right or by using the keyboard shortcut: `ctrl+enter` (Windows, Linux) or `cmd+enter` (Mac).

5. Hide the script editor using `ctrl+e` (Windows, Linux) or `cmd+e` (Mac).

> Your Live UI should output something similar to the following:

<svg title='PxL script output using the Scratch Pad in the Live UI' src='pxl-scripts/first-vis-spec-2.png'/>

## What is a Vis Spec?

Pixie's Live UI constructs "Live View" dashboards using two files:

- The `PxL Script` queries the Pixie platform for telemetry data.
- The `Vis Spec` defines the functions to execute from the PxL script as well as the how to visualize the query output.

You might wonder how our `PxL Script` (which does not yet have a `Vis Spec`) was able to be visualized in the Live UI. The Live UI allows you to omit the `Vis Spec` if you call [`px.display()`](/reference/pxl/operators/px.display/) in your `PxL Script`. This call tells the Live UI to format the query output into a table.

### Refactoring the PxL Script

Note that on the last line of our `PxL script`, we call `px.display()`. Let's remove this function call and instead use a `Vis Spec` to do the same thing: format the query output into a table.

1. Open the script editor using the keyboard shortcut: `ctrl+e` (Windows, Linux) or `cmd+e` (Mac).

2. Replace the contents of the `PxL Script` tab with the following:

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
```

> This PxL script adds a `network_traffic_per_pod()` function to encapsulate the query logic from our previous script. The function takes a string input variable called `start_time`.

> The `Vis Spec` will define which function(s) to call from our `PxL script` as well as which input variables to provide to the function(s).

### Writing your first Vis Spec

1. Select the `Vis Spec` tab at the top of the script editor.

> You should see the following empty `Vis Spec`:

```json
{
    "variables": [],
    "widgets": [],
    "globalFuncs": []
}
```

> A `Vis Spec` is a json file containing three lists:

> - **widgets**: the visual elements to show in the Live View (e.g. chart, map, table)
> - **globalFuncs**: the functions that output data to be displayed by the widgets
> - **variables**: the input variables that can be provided to the functions

2. Replace the contents of the `Vis Spec` tab with the following:

```json
{
    "variables": [
        {
            "name": "start_time",
            "type": "PX_STRING",
            "description": "The relative start time of the window. Current time is assumed to be now",
            "defaultValue": "-5m"
        },
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
        }
    ],
    "globalFuncs": []
}
```

> Remember that the `Vis Spec` has two purposes. It defines the functions to execute from the PxL script and describes how to visualize the query output.

> This `Vis Spec` configures a single input variable called `start_time`. This input variable is provided to the `network_traffic_per_pod()` function. The Live UI will display these configurable input variables at the top of the Live View.

> This `Vis Spec` defines a single Table widget:
>
> - The `name` field is an optional string that is displayed at the top of the widget in the Live View. A widget's `name` must be unique across all widgets in a given `Vis Spec`.
> - The `position` field specifies the location and size of the widget within the Live View.
> - The `func` field provides the name of the PxL function to invoke to provide the output to be displayed in the widget. This function takes the `start_time` variable as an input argument.
> - The `displaySpec` field specifies the widget type (Table, Bar Chart, Graph, etc)

<Alert variant="outlined" severity="info">
  For a detailed description of every Vis Spec field, please refer to the <a href="https://github.com/pixie-io/pixie/blob/bdae78cc266a078e73db2d9be205fc3ce5cc823b/src/api/proto/vispb/vis.proto">Vis Spec proto</a>.
</Alert>

3. Run the script using the keyboard shortcut: `ctrl+enter` (Windows, Linux) or `cmd+enter` (Mac).

4. Hide the script editor using `ctrl+e` (Windows, Linux) or `cmd+e` (Mac).

> Your Live UI should output something similar to the following:

<svg title='Live View with Table widget.' src='pxl-scripts/first-vis-spec-4.png'/>

5. Note the `start_time` variable in the top right. Select the drop-down arrow next to it, type `-30m` and press `Enter`. The Live UI should update with the appropriate results for that timewindow.

### Adding a required script variable

1. Open the script editor using the keyboard shortcut: `ctrl+e` (Windows, Linux) or `cmd+e` (Mac).

2. Select the `PxL Script` tab and replace the contents with the following:

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

> This `PxL Script` updates the function to take a `ns` argument of type `px.Namespace`. This variable is used to filter the pod connections to only those involving pods in the specified namespace.

3. Switch to the `Vis Spec` tab and replace the contents with the following:

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
                "@type": "types.px.dev/px.vispb.Table",
                "gutterColumn": "status"
            }
        }
    ],
    "globalFuncs": []
}
```

> Here we've added the `namespace` argument to the list of variables:

> - By omitting a `defaultValue`, the `namespace` variable is designated as required; This means that the script will error until you provide a value for the `namespace` variable.
> - The `namespace` argument is of type `PX_NAMESPACE`. By using one of Pixie's [semantic types](/reference/pxl/#data-types-semantic-types), the Live UI will suggest the cluster's available namespaces when entering a value for the variable.
> - The `network_traffic_per_pod()` function is updated to take the new variable as an argument.

4. Run the script using the keyboard shortcut: `ctrl+enter` (Windows, Linux) or `cmd+enter` (Mac).

5. Hide the script editor using `ctrl+e` (Windows, Linux) or `cmd+e` (Mac).

> You should get the following error since the `Vis Spec` defines the `namespace` argument as a required variable:

<svg title='Error indicating a value is missing for a required argument.' src='pxl-scripts/first-vis-spec-5.png'/>

6. Select the drop-down arrow next to the `namespace` argument. If you wait for a second, the drop-down menu should populate with the available `namespace` names. Type `default` and press `Enter`.

> The Live UI should update with the appropriate results for that namespace.

<svg title='Live View results filtered by the specified namespace.' src='pxl-scripts/first-vis-spec-6.png'/>

## Conclusion

Congratulations, you wrote your first `Vis Spec` to accompany your `PxL Script`! Tables aren't all that exciting, but now that you can write a `Vis Spec`, we can learn how to visualize our data in more interesting ways.

In [Tutorial #4](/tutorials/pxl-scripts/write-pxl-scripts/custom-pxl-scripts-4) we will add a Timeseries chart to our Live View.
