---
title: "Database Query Profiling"
metaTitle: "Tutorials | Pixie 101 | Database Query Profiling"
metaDescription: "Learn how to use Pixie to do database query profiling."
order: 4
redirect_from:
    - /using-pixie/use-cases/db-health/
---

Service performance issues often turn out to be the result of slow database queries. With Pixie, you can easily monitor the performance of your database requests to ensure they do not impact service health.

MySQL requests are featured in this tutorial, but Pixie can trace a number of different database protocols including Cassandra, PostgreSQL, and Redis. See the full list [here](/about-pixie/data-sources/#supported-protocols).

This tutorial will demonstrate how to use Pixie to monitor MySQL:

- Latency, error and throughput (LET) rate for all pods.
- LET rate per normalized query.
- Latency per individual full body query.

<YouTube youTubeId="5NkU--hDXRQ"/>

## Prerequisites

1. You will need a Kubernetes cluster with Pixie installed. If you do not have a cluster, you can create a minikube cluster and install Pixie using one of our [install guides](/installing-pixie/install-guides/).

2. You will need to install the demo microservices application, using Pixie's CLI:

> - [Install the Pixie CLI](/installing-pixie/install-schemes/cli/#1.-install-the-pixie-cli).
> - Run `px demo deploy px-sock-shop` to install Weavework's [Sock Shop](https://microservices-demo.github.io/) demo app.
> - Run `kubectl get pods -n px-sock-shop` to make sure all pods are ready before proceeding. The demo app can take up to 5 minutes to deploy.

## Request Health by Pod

To see MySQL latency, error, and throughput rate for all pods in your cluster, we’ll use the `px/mysql_stats` script:

1. Open the <CloudLink url="/">Live UI</CloudLink> and select `px/mysql_stats` from the `script` drop-down menu.

> This script shows latency, error and throughput over time for all MySQL requests in the cluster.

::: div image-xl relative
<PoiTooltip top={43} left={35}>
<strong>Click a legend item</strong>
{' '}
to highlight those specific results. Click the item a second time to show all results.
</PoiTooltip>

<PoiTooltip top={27} left={57}>
<strong>Drag your mouse across the graph</strong>
{' '}
to see the values at particular timestamps.
</PoiTooltip>

<svg title='' src='use-case-tutorials/mysql_stats.png'/>
:::

<Alert variant="outlined" severity="info">
  Hover over the flashing blue circles on the image above to see tips about this graph.
</Alert>

> Let’s use the optional `pod` script input argument to filter to a particular pod.

2. Select the drop-down arrow next to the `pod` argument, type `px-sock-shop/catalogue`, and press Enter to re-run the script.

> The graph should update to show stats just for the requests made to/from the `catalogue` pod.

3. Clear the `pod` value by selecting the drop-down arrow and pressing Enter.

## Request Health by Normalized Query

Pixie can automatically cluster your SQL queries so that you can analyze similar queries as a single group.

For example, the following two queries:

> `SELECT * FROM Socks WHERE Socks.Color ='Green'`

> `SELECT * FROM Socks WHERE Socks.Color ='Blue'`

would be clustered together into the normalized query:

> `SELECT * FROM Socks WHERE Socks.Color =?`

A normalized query means that constants, such as a sock color, have been replaced with placeholders.

Let's see this feature in action for our demo application:

1. Select `px/sql_queries` from the `script` drop-down menu.

> This live view calculates the latency, error, and throughput over time for each normalized SQL query.

::: div image-xl relative
<PoiTooltip top={71} left={25}>
<strong>Drag the 3-dot divider</strong>
{' '}
to expand the column.
</PoiTooltip>

<PoiTooltip top={78} left={2}>
<strong>Click the `>`</strong>
{' '}
to see the row data in JSON form.
</PoiTooltip>

<PoiTooltip top={85} left={81}>
<strong>Query constants</strong>
{' '}
are identified and replaced with a `?`.
</PoiTooltip>

<svg title='' src='use-case-tutorials/sql_queries.png'/>
:::

> Let's examine one of the normalized SQL queries.

2. Scroll down to the **Summary** table.

> For longer queries, it's often easier to view the data in JSON form.

3. Hover over the third row. Click the `>` that appears to expand the row.

> Inspect the query and you'll see that the `sock_id` values have been replaced with the `?` placeholder.

4. Click the `>` to close the row.

> Next, let's view latency, error and throughput for the constants passed to this normalized query.

5. Instead of clicking the `>`, click the actual query text (`SELECT sock.sock_id AS...`) for the same row.

> This script shows latency, error, and throughput for each individual parameter for the given normalized SQL query.

> The **Summary** table shows the individual parameters passed to `sock_id` in the normalized query.

::: div image-xl relative
<PoiTooltip top={75} left={2}>
<strong>Show / hide table columns</strong>
{' '}
with the table column menu.
</PoiTooltip>

<PoiTooltip top={80} left={25}>
<strong>Individual params</strong>
{' '}
passed to `sock_id` in the normalized query.
</PoiTooltip>

<svg title='' src='use-case-tutorials/sql_query.png'/>
:::

6. Hover over the "Summary" table and scroll to the right to see latency stats per parameter.

## Individual Full Body Requests

Pixie captures all network traffic that passes through your cluster (it supports both server and client-side tracing). For [supported protocols](/about-pixie/data-sources/#supported-protocols), this traffic is parsed into messages that are paired with their responses.

Let's inspect the most recent MySQL requests flowing through your cluster, including the full request and response bodies.

1. Select `px/mysql_data` from the `script` drop-down menu at the top of the page.

> This script shows the most recent MySQL requests flowing through your cluster, including the full request and response bodies.

> Pixie is able capture any request that flows through the cluster, as long as at least one endpoint is within the cluster.

::: div image-xl relative
<PoiTooltip top={26} left={3}>
<strong>Show / hide table columns</strong>
{' '}
with the table column menu.
</PoiTooltip>

<PoiTooltip top={24} left={33}>
<strong>Click a column title</strong>
{' '}
to sort the data.
</PoiTooltip>

<PoiTooltip top={56} left={55}>
<strong>Click a row</strong>
{' '}
to see the data in JSON form.
</PoiTooltip>

<svg title='' src='use-case-tutorials/mysql_data.png'/>
:::

> For requests with longer message bodies, it's often easier to view the data in JSON form.

2. Click on a table row to see the row data in JSON format. Scroll through the JSON data to find the `resp_body` key.

3. Click the table row again to collapse the JSON view.

4. Scroll to the last column of the table to see latency data for the individual requests.

5. Click on the `LATENCY` column title to sort the table by descending latency.

## Related Scripts

This tutorial demonstrated a few of Pixie's [community scripts](https://github.com/pixie-io/pixie/tree/main/src/pxl_scripts). For more insight into your database queries, check out the following scripts.

#### PostgreSQL

- <CloudLink url="/script/pgsql_data">px/pgsql_data</CloudLink> shows the most recent Postgres requests in the cluster.
- <CloudLink url="/script/pgsql_stats">px/pgsql_stats</CloudLink> shows latency, error, and throughput rate for a pod's PostgreSQL requests.
- <CloudLink url="/script/pgsql_flow_graph">px/pgsql_flow_graph</CloudLink> shows a graph of the PostgreSQL messages in the cluster with latency stats.

#### Redis

- <CloudLink url="/script/redis_data">px/redis_data</CloudLink> shows the most recent Redis requests in the cluster.
- <CloudLink url="/script/redis_stats">px/redis_stats</CloudLink> shows latency, error, and throughput rate for a pod's Redis requests.
- <CloudLink url="/script/redis_flow_graph">px/redis_flow_graph</CloudLink> shows a graph of the Redis messages in the cluster with latency stats.

#### Cassandra

- <CloudLink url="/script/cql_data">px/cql_data</CloudLink> shows the most recent Cassandra requests in the cluster.
- <CloudLink url="/script/cql_stats">px/cql_stats</CloudLink> shows latency, error, and throughput rate for a pod's Cassandra requests.
