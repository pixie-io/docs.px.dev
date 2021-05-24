---
title: "Tutorial #2: Finish your first PxL Script"
metaTitle: "Tutorials | Write Custom Scripts | Tutorial #3: Finish your first PxL Script"
metaDescription: ""
order: 2
---

## Overview

[Tutorial #1](/tutorials/pxl-scripts/pxl-scripts-1) wrote a simple script to query the `conn_stats` table of data provided by Pixie's platform:

```python:numbers
# Import Pixie's module for querying data
import px 

# Load the last 30 seconds of Pixie's `conn_stats` table into a Dataframe. 
df = px.DataFrame(table='conn_stats', start_time='-30s')

# Display the DataFrame with table formatting
px.display(df)
```

This tutorial will modify that script to produce a table that summarizes the total amount of traffic coming in and out of each of the pods in your cluster.


## Adding Context

The [`ctx`](/reference/pxl/operators/metadata/) function provides extra Kubernetes metadata context based on the existing information in your DataFrame. 

Because the `conn_stats` table contains the `upid` (an opaque numeric ID that globally identifies a process running inside the cluster), PxL can infer the `namespace`, `service`, `pod`, `container` and `cmd` (command) that initiated the connection. 

We'll add columns for `pod` and `service` to our script. 

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

Use your arrow keys to scroll to the far right of the table and you should see a new columns labeled `pod` and `service`, representing the kubernetes entity that initiated the traced connection. Note that some of the connections in the table are missing context (a `pod` or `service`). This occasionally occurs due to a gap in metadata or a short-lived `upid`. 

<svg title='Script output in the Live CLI after adding pod and service metadata columns.' src='pxl-scripts/first-script-3.png'/>

## Grouping and Aggregating Data

Let's [group](/reference/pxl/operators/group-by/) the connection data by unique pairs of values in the `pod` and `service` columns, computing the aggregating expressions on each group of data. 

*Note that PxL does not currently support standalone groupings, you must always follow the `groupby()` call with a call to `agg()`. However, the agg call can take zero arguments. A full list of the aggregating functions is available [here](/reference/pxl/udf/#aggregate-functions).*

```python:numbers
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

# Display the DataFrame with table formatting
px.display(df)
```

2. Save your script, exit the Live CLI using `ctrl+c` and re-run the script. 

<svg title='Script output in the Live CLI after grouping and aggregating the data.' src='pxl-scripts/first-script-4.png'/>

Each row in the output represents a unique `pod` and `service` pair that had one or more connections traced in the last 30 seconds. All of the connections between these `pod` / `service` pairs have had their sent- and received- bytes summed for the 30 second time period. 

## Filtering 

Let's [filter](/reference/pxl/operators/filter/) out the rows in the DataFrame that do not have a service identified (an empty value for the `service` column).

```python:numbers
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

3. Save your script, exit the Live CLI using `ctrl+c` and re-run the script. 

<svg title='Script output in the Live CLI after filtering out rows without a service identified.' src='pxl-scripts/first-script-5.png'/>

The script output shows that the rows that were missing a `service` value are no longer included in the table. 

## Conclusion

You now have a script that produces a table summarizing the total amount of traffic coming in and out of each of the pods in your cluster for the last 30s (`start_time`). This could be used to:
- Examine the balance of a `pod`'s incoming vs outgoing traffic.
- Investigate if `pods` under the same `service` receive a similar amount of traffic or if there is an imbalance in traffic received.
