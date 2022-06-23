---
title: "Tutorial #2: Finish your first PxL Script"
metaTitle: "Tutorials | PxL Scripts | Write Custom Scripts | Tutorial #2: Finish your first PxL Script"
metaDescription: ""
order: 2
redirect_from:
    - /tutorials/pxl-scripts/pxl-scripts-2
---

In [Tutorial #1](/tutorials/pxl-scripts/write-pxl-scripts/custom-pxl-scripts-1) we wrote a simple script to query the [`conn_stats`](/reference/datatables/conn_stats/) table of data provided by Pixie's platform:

```python:numbers
# Import Pixie's module for querying data
import px

# Load the last 30 seconds of Pixie's `conn_stats` table into a Dataframe.
df = px.DataFrame(table='conn_stats', start_time='-30s')

# Display the DataFrame with table formatting
px.display(df)
```

This tutorial will expand this PxL script to produce a table that summarizes the total amount of traffic coming in and out of each of the pods in your cluster.

## Adding Context

The [`ctx`](/reference/pxl/operators/dataframe.ctx.__getitem__/) function provides extra Kubernetes metadata context based on the existing information in your DataFrame.

Because the [`conn_stats`](/reference/datatables/conn_stats/) table contains the `upid` (an opaque numeric ID that globally identifies a process running inside the cluster), PxL can infer the namespace, service, pod, container and command that initiated the connection.

Let's add columns for `pod` and `service` to our script.

```python:numbers
# Import Pixie's module for querying data
import px

# Load the last 30 seconds of Pixie's `conn_stats` table into a Dataframe.
df = px.DataFrame(table='conn_stats', start_time='-30s')

# Each record contains contextual information that can be accessed by the reading ctx.
df.pod = df.ctx['pod']
df.service = df.ctx['service']

# Display the DataFrame with table formatting
px.display(df)
```

1. Save and run your script using Pixie's Live CLI:

```bash
px live -f my_first_script.pxl
```

> Your CLI output should look similar to the following:

<svg title='Script output in the Live CLI after adding pod and service metadata columns.' src='pxl-scripts/first-script-3.png'/>

> Use your arrow keys to scroll to the far right of the table and you should see a new columns labeled `pod` and `service`, representing the kubernetes entity that initiated the traced connection. Note that some of the connections in the table are missing context (a `pod` or `service`). This occasionally occurs due to a gap in metadata or a short-lived `upid`.

## Grouping and Aggregating Data

Let's [group](/reference/pxl/operators/dataframe.groupby/) the connection data by unique pairs of values in the `pod` and `service` columns, computing the aggregating expressions on each group of data.

<Alert variant="outlined" severity="info">
  PxL does not currently support standalone groupings, you must always follow the `groupby()` call with a call to `agg()`. However, the agg() call can take zero arguments. A full list of the aggregating functions is available <a href="/reference/pxl/udf/#aggregate-functions">here</a>.
</Alert>

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

# Display the DataFrame with table formatting
px.display(df)
```

> Pods can have multiple processes, so on `line 12` we [group](/reference/pxl/operators/dataframe.groupby/) our connection stats by unique `service`, `pod` and `upid` pair. Later in the script, we will aggregate the connection stats into a single value per pod.

> The `conn_stats` table [reference docs](/reference/datatables/conn_stats/) show that the `bytes_sent` and `bytes_recv` columns are of type `METRIC_COUNTER`.

<Alert variant="outlined" severity="info">
  A <b>counter</b> is a cumulative metric that represents a single monotonically increasing counter whose value can only increase or be set to zero on restart. For example, Pixie uses a counter to represent the number of bytes sent to a remote endpoint since the beginning of tracing.
</Alert>
<Alert variant="outlined" severity="info">
  A <b>guage</b> is a metric that represents a single value that can arbitrarily increase or decrease. For example, Pixie uses a guage to represent the number of active connections with a remote endpoint.
</Alert>

> Since we're interested in knowing the number of bytes sent and received over the last 30 seconds, we calculate the `min` (starting value) and the `max` (ending value) for each unique pod process. On `line 22` we subtract these two values to find the total bytes sent and received over the time window.

> On `line 28`, we group the connection stats for each unique pod, aggregating the values for each pod process.

2. Save your script, exit the Live CLI using `ctrl+c` and re-run the script.

> Your CLI output should look similar to the following:

<svg title='Script output in the Live CLI after grouping and aggregating the data.' src='pxl-scripts/first-script-4.png'/>

> Each row in the output represents a unique `pod` and `service` pair that had one or more connections traced in the last 30 seconds. All of the connections between these `pod` / `service` pairs have had their sent- and received- bytes summed for the 30 second time period.

## Filtering

Let's [filter](/reference/pxl/operators/dataframe.filter) out the rows in the DataFrame that do not have a service identified (an empty value for the `service` column).

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

3. Save your script, exit the Live CLI using `ctrl+c` and re-run the script.

> Your CLI output should look similar to the following. Note that the script output no longer shows rows that are missing a `service` value.

<svg title='Script output in the Live CLI after filtering out rows without a service identified.' src='pxl-scripts/first-script-5.png'/>

## Conclusion

Congrats! You have written a script that produces a table summarizing the total amount of traffic coming in and out of each of the pods in your cluster for the last 30 seconds.

This script could be used to:

- Examine the balance of a `pod`'s incoming vs outgoing traffic.
- Investigate if `pods` under the same `service` receive a similar amount of traffic or if there is an imbalance in traffic received.
