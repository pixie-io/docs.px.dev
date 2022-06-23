---
title: "Tutorial #1: Write your first PxL script"
metaTitle: "Tutorials | PxL Scripts | Write Custom Scripts | Tutorial #1: Write your first PxL script"
metaDescription: ""
order: 1
redirect_from:
    - /tutorials/pxl-scripts/pxl-scripts-1
---

This tutorial series demonstrates how to write a PxL script to analyze the volume of traffic coming in and out of each pod in your cluster (total bytes received vs total bytes sent).

In Part 1 of this tutorial, we will write a very basic PxL script which simply queries a table of traced network connection data provided by Pixie's no-instrumentation monitoring platform.

## The most basic PxL script

1. Create a new PxL file called `my_first_script.pxl`:

```bash
touch my_first_script.pxl
```

2. Open this file in your favorite editor and add the following lines. To copy the code, hover over the top-right corner of the code block and click the copy icon.

```python:numbers
# Import Pixie's module for querying data
import px

# Load the last 30 seconds of Pixie's `conn_stats` table into a Dataframe.
df = px.DataFrame(table='conn_stats', start_time='-30s')

# Display the DataFrame with table formatting
px.display(df)
```

> On `line 2` we import Pixie's `px` module. This is Pixie's main library for querying data.

> Pixie's scripts are written using the [Pixie Language](/reference/pxl) (PxL), a DSL that follows the API of the the popular Python data processing library [Pandas](https://pandas.pydata.org/docs/user_guide/index.html). Pandas uses DataFrames to represent tables of data.

> On `line 5` we load the last 30 seconds of data from the `conn_stats` table into a [DataFrame](/reference/pxl/operators/dataframe.dataframe).

> The [`conn_stats`](/reference/datatables/conn_stats/) table contains high-level statistics about the connections (i.e. client-server pairs) that Pixie has traced in your cluster.

> On `line 8` we display the table using [`px.display()`](/reference/pxl/operators/px.display/).

3. Run this script using Pixie's Live CLI:

```bash
px live -f my_first_script.pxl
```

<Alert variant="outlined" severity="info">
  If you aren't familiar with Pixie's CLI tool, check out the <a href="/using-pixie/using-cli">Using the CLI</a> guide.
</Alert>

> Your CLI should output something similar to the following table:

<svg title='Output of my_first_script.pxl in the Live CLI.' src='pxl-scripts/first-script-1.png'/>

This PxL script outputs a table of data representing the last 30 seconds of the traced client-server connections in your cluster. Columns include:

- `time_`: Timestamp when the data record was collected.
- `upid` An opaque numeric ID that globally identifies a running process inside the cluster.
- `remote_addr`: IP address of the remote endpoint.
- `remote_port`: Port of the remote endpoint.
- `addr_family`: The socket address family of the connection.
- `protocol`: The protocol of the traffic on the connections.
- `role`: The role of the process that owns the connection (client=1 or server=2).
- `conn_open`: The number of connections opened since the beginning of tracing.
- `conn_close`: The number of connections closed since the beginning of tracing.
- `conn_active`: The number of active connections.
- `bytes_sent`: The number of bytes sent to the remote endpoint(s).
- `bytes_recv`: The number of bytes received from the remote endpoint(s).

<Alert variant="outlined" severity="info">
  If your output table is empty, try increasing the `start_time` value on line 5. If you modify the `start_time`, you'll need to save the script, exit the Live CLI using `ctrl+c`, and re-run the command in Step 3.
</Alert>

## (Optional) Running px/schemas

You can find the [`conn_stats`](/reference/datatables/conn_stats/) column descriptions as well as descriptions for all of the data tables provided by Pixie in the [data table reference docs](/reference/datatables/) or by running the pre-built `px/schemas` script:

1. Exit the Live CLI using `ctrl+c`

2. Run the `px/schemas` script:

```bash
px live px/schemas
```

3. Use the keyboard arrows to scroll down through the output table until you reach `conn_stats` in the `table_name` column. You should see all of the columns available in the `conn_stats` table listed with their descriptions.

<svg title='conn_stats table schema from the px/schemas script.' src='pxl-scripts/first-script-2.png'/>

## (Optional) More fun with DataFrames

[DataFrame](/reference/pxl/operators/dataframe.dataframe) initialization supports `end_time` for queries requiring more precise time periods. If an `end_time` isn't provided, the DataFrame will return all events up to the current time.

```python:numbers
import px

df = px.DataFrame(table='conn_stats', start_time='-60s', end_time='-30s')

px.display(df)
```

You can [drop](/reference/pxl/operators/dataframe.drop/) columns using the `df.drop()` command.

```python:numbers
import px

df = px.DataFrame(table='conn_stats', start_time='-30s')

# Drop select columns
df = df.drop(['conn_open', 'conn_close', 'bytes_sent', 'bytes_recv'])

px.display(df)
```

Alternatively, you can use [keep](/reference/pxl/operators/dataframe.__getitem__) to return a DataFrame with only the specified columns. This can be used to reorder the columns in the output.

```python:numbers
import px

df = px.DataFrame(table='conn_stats', start_time='-30s')

# Keep only the select columns
df = df[['remote_addr', 'conn_open', 'conn_close']]

px.display(df)
```

If you only need a few columns from a table, use the [DataFrame](/reference/pxl/operators/dataframe.dataframe)'s `select` argument instead.

```python:numbers
import px

# Populate the DataFrame with only the select columns from the `conn_stats` table
df = px.DataFrame(table='conn_stats', select=['remote_addr', 'conn_open', 'conn_close'], start_time='-30s')

px.display(df)
```

To [filter](/reference/pxl/operators/dataframe.filter) the rows in the DataFrame by the `role` column:

```python:numbers
import px

df = px.DataFrame(table='conn_stats', start_time='-30s')

# Filter the results to only include rows whose `role` value equals 1 (connections traced on the client-side)
df = df[df.role == 1]

px.display(df)
```

If you want to see a small sample of data, you can [limit](/reference/pxl/operators/dataframe.head) the number of rows in the returned DataFrame to the first n rows (line 4).

```python:numbers
import px

df = px.DataFrame(table='conn_stats', start_time='-30s')

# Limit the number of rows in the DataFrame to 100
df = df.head(100)

px.display(df)
```

## Conclusion

Congratulations, you built your first script!

In [Tutorial #2](/tutorials/pxl-scripts/write-pxl-scripts/custom-pxl-scripts-2), we will expand this PxL script to produce a table that summarizes the total amount of traffic coming in and out of each of the pods in your cluster.

This video summarizes the content in part 1 and part 2 of this tutorial:
<YouTube youTubeId="is-qWZiKJ4I" />
