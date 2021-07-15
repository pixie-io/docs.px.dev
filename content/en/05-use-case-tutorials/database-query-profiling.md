---
title: "Database Query Profiling"
metaTitle: "Using Pixie | Use Cases | Database Query Profiling"
metaDescription: "Database Query Profiling."
order: 3
---

Your database could be a bottleneck for your distributed application. With Pixie, you can investigate the performance of your requests to make sure database latency is not significantly impacting service latency.

This tutorial will demonstrate how to use Pixie to:

- Monitor the health (latency, error and throughput) of a pod's MySQL requests.
- Monitor the health of a pod's MySQL requests by query type and parameter.
- Inspect the latency of individual full body MySQL requests.

This tutorial features MySQL requests, but Pixie can trace a number of different database protocols including Cassandra, PostgreSQL, and Redis. See the full list of supported protocols [here](/about-pixie/data-sources/).

## Prerequisites

1. You will need a Kubernetes cluster with Pixie installed. If you do not have a cluster, you can create a minikube cluster and install Pixie using our [installation steps](/installing-pixie/).

2. You will need an application that makes MySQL requests. To install a demo app that uses MySQL:

> - [Install the Pixie CLI](/installing-pixie/quick-start/#using-the-install-script-(easiest))
> - Run `px demo deploy px-sock-shop` to install Weavework's [Sock Shop](https://microservices-demo.github.io/) demo app.
> - Run `kubectl get pods -n px-sock-shop` to make sure all pods are ready before proceeding. The demo app can take up to 5 minutes to deploy.

## Monitor Request Health by Pod

To see the health of a pod's MySQL requests, we’ll use the `px/mysql_stats` script:

1. Open the [Live UI](http://work.withpixie.ai/) and select `px/mysql_stats` from the `script` drop-down menu.

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
  Hover over the pulsing blue circles on the image above to see tips about this graph.
</Alert>

> To show only the MySQL requests to/from a specific pod, use the optional `pod` script argument.

2. Select the drop down arrow next to the `pod` argument, type `catalogue`, and press Enter to re-run the script.

> The graph should update to show stats just for the requests made to/from the `catalogue` pod.

3. Clear the `pod` value by selecting the drop-down arrow and pressing Enter.

<Alert variant="outlined" severity="info">
  By using an IP address for the `pod` argument, you can see the health of all of the requests to an off-cluster database.
</Alert>

## Monitor Request Health by Query Type, Parameter

To see the health of a pod's MySQL requests clustered by query type, we’ll use the `px/sql_queries` script:

1. Select `px/sql_queries` from the `script` drop-down menu.

> This live view calculates the latency, error rate, and throughput over time for each distinct normalized SQL Query.

::: div image-xl relative
<PoiTooltip top={80} left={65}>
<strong>Click a table column title</strong>
{' '}
to sort the table data by that column.
</PoiTooltip>

<svg title='' src='use-case-tutorials/sql_queries.png'/>
:::

2. Scroll down to the "Summary" table.

3. Click on a query in the `NORMED_QUERY` column to be taken to the `px/sql_queries` script.

> This script shows the same request health stats over time for each distinct parameter set for a given normalized SQL query.

> If the normalized query you picked doesn't have any parameters, click your browser's Back button and try a different query from the Summary table.

## Inspect Individual Requests

To see the latency of individual MySQL request, we'll use the `px/mysql_data` script:

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
<strong>Sort the data</strong>
{' '}
by clicking on a table column title.
</PoiTooltip>

<PoiTooltip top={56} left={55}>
<strong>Click a row</strong>
{' '}
to expand and see the row data in JSON form.
</PoiTooltip>

<svg title='' src='use-case-tutorials/mysql_data.png'/>
:::

> For requests with longer message bodies, it's often easier to view the data in JSON form.

2. Click on a table row to see the row data in JSON format. Scroll through the JSON data to find the `resp_body` key.

3. Click the table row again to collapse the JSON view.

4. Scroll to the last column of the table to see latency data for the individual requests.

5. Click on the `LATENCY` column title to sort the table by descending latency.
