---
title: "Database Query Profiling"
metaTitle: "Using Pixie | Use Cases | Database Query Profiling"
metaDescription: "Database Query Profiling."
order: 3
---

This tutorial will demonstrate how to use Pixie to monitor database queries:

- [Visualize the flow of requests within your cluster.](#see-how-requests-flow-between-pods)
- [See request health stats per pod.](#get-request-health-stats-per-pod)
- [Inspect full request / response headers and message bodies.](#inspect-full-request-response-bodies)

This tutorial features MySQL requests, but Pixie can trace a number of different database protocols including Cassandra, PostgreSQL, and Redis. See the [Protocols](https://docs.px.dev/about-pixie/observability/) page for the full list.

**Prerequisites**

1. You will need a Kubernetes cluster with Pixie installed. If you do not have a cluster, you can create a minikube cluster and install Pixie using our [installation steps](/installing-pixie/).

2. You will need an application that uses MySQL. To install a demo app that uses MySQL:

> - [Install the Pixie CLI](/installing-pixie/quick-start/#using-the-install-script-(easiest))
> - Run `px demo deploy px-sock-shop` to install Weavework's [Sock Shop](https://microservices-demo.github.io/) demo app.
> - Run `kubectl get pods -n px-sock-shop` to make sure all pods are ready before proceeding. The demo app can take up to 5 minutes to deploy.

## See How Requests Flow between Pods

A global view of database traffic flowing through a cluster can be used to:

- Quickly determine which services are communicating to which databases.
- Get high-level latency and throughput information per database instance.
- Observe imbalances of traffic between database partitions.

Let’s use the `px/mysql_flow_graph` script to see a map of all of the MySQL requests passing through the cluster:

1. Open the [Live UI](http://work.withpixie.ai/) and select `px/mysql_flow_graph` from the `script` drop-down menu at the top.

> When the script opens, you’ll get an error indicating a value is missing for the `namespace` required argument. The UI denotes required script arguments with an asterisk after the argument name.

2. Enter `px-sock-shop` for the required `namespace` argument: select the drop down arrow next to the `namespace` argument, type `px-sock-shop`, and hit Enter.

> This script shows a graph of all MySQL requests that pass through your cluster, with latency and throughput stats. Pixie captures all requests in which at least one endpoint is within the cluster.

::: div image-xl relative
<PoiTooltip top={23} left={10}>
<strong>Click anywhere on the graph to interact</strong>
{': '}
pan, zoom, or rearrange individual nodes.
</PoiTooltip>

<PoiTooltip top={37} left={52}>
<strong>Hover over an Edge</strong>
{' '}
for request stats for endpoint pairs. Thicker lines indicate more traffic.
</PoiTooltip>

<PoiTooltip top={65} left={87}>
<strong>Enable Hierarchy View</strong>
{' '}
for a different visualization of the graph.
</PoiTooltip>

<svg title='' src='use-case-tutorials/mysql_flow_graph.png'/>
:::

<Alert variant="outlined" severity="info">
  Hover over the pulsing blue circles on the image above to see tips about this graph.
</Alert>

> If a request’s remote endpoint is within the cluster, then the IP address is resolved to a pod/service name. This demo app makes requests to a MySQL database outside of the cluster. Let's filter the requests to only show communication to the external MySQL database.

3. Select drop down arrow next to the `destination_filter` argument, type in the IP address, and press Enter to re-run the script.

> The graph should update to only show requests sent to the external database at that IP address.

4. Clear the `destination_filter` value by selecting the drop-down arrow and pressing Enter.

## Get Request Health Stats per Pod

For a more detailed view of the health of the MySQL requests flowing through the cluster, we’ll use the `px/mysql_stats` script:

1. Select `px/mysql_stats` from the `script` drop-down menu.

> This script shows latency, error rate and throughput over time for a pod’s specific MySQL requests. It has an optional `pod` script argument to filter the requests to contain only those to/from a specific pod.

::: div image-xl relative
<PoiTooltip top={44} left={35}>
<strong>Click a legend item</strong>
{' '}
to highlight those specific results. Click the item a second time to show all results.
</PoiTooltip>

<PoiTooltip top={27} left={50}>
<strong>Drag your mouse across the graph</strong>
{' '}
to see the values at particular timestamps.
</PoiTooltip>

<svg title='' src='use-case-tutorials/mysql_stats.png'/>
:::

2. Scroll down to inspect the "Request Error Rate" graph. Our demo app isn't currently producing any MySQL errors, good!

## Inspect Full Request / Response Bodies

If we had seen MySQL errors, one of the first things we'd want to do is inspect the contents of the queries with errors.

To see raw MySQL requests, including full header and bodies, we'll use `px/mysql_data`:

1. Select `px/mysql_data` from the `script` drop-down menu at the top of the page.

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
to expand and see the row data in json form.
</PoiTooltip>

<svg title='' src='use-case-tutorials/mysql_data.png'/>
:::

2. Click on a table row to see the row data in json format. Scroll down to the `resp_body` json key to see the full SQL message.

3. Click the `source_filter` argument’s drop down arrow. Type `catalogue` and press Enter. This filters the MySQL requests to show only the requests from the catalogue pod.

4. Clear the `source_filter` value by clicking on the argument’s drop down arrow and pressing Enter.

<Alert variant="outlined" severity="info">
  If you'd like to learn how to modify this script to show only MySQL requests with errors, check out the directions in the tutorial <a href="https://www.eksworkshop.com/intermediate/241_pixie/using_pixie/mysql_data/">here</a>.
</Alert>
