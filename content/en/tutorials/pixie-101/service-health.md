---
title: "Service Health"
metaTitle: "Tutorials | Pixie 101 | Service Health"
metaDescription: "Learn how to use Pixie to monitor service health."
order: 3
---

Unreliable or slow services can lead to a poor user experience for your customers. With Pixie, you can easily monitor the performance and reliability of your services alongside your network and infrastructure layers.

This tutorial will demonstrate how to use Pixie to see:

- The flow of HTTP traffic between the services in your cluster.
- HTTP latency, error, and throughput rate for all services.
- A sample of the slowest requests for a individual service.
- HTTP latency, error, and throughput per service endpoint.

## Prerequisites

1. You will need a Kubernetes cluster with Pixie installed. If you do not have a cluster, you can create a minikube cluster and install Pixie using our [installation steps](/installing-pixie/).

2. You will need an application that makes MySQL requests. To install a demo app that uses MySQL:

> - [Install the Pixie CLI](/installing-pixie/install-schemes/cli/#1.-install-the-pixie-cli)
> - Run `px demo deploy px-sock-shop` to install Weavework's [Sock Shop](https://microservices-demo.github.io/) demo app.
> - Run `kubectl get pods -n px-sock-shop` to make sure all pods are ready before proceeding. The demo app can take up to 5 minutes to deploy.

## Service Graph

To get a high-level overview of the services in your cluster, we'll start with the `px/cluster` script.

1. Open the [Live UI](http://work.withpixie.ai/) and select `px/cluster` from the `script` drop-down menu at the top.

> This script shows a graph of the HTTP traffic between the services in your cluster, along with latency, error, and throughput rate per service.

::: div image-xl relative
<PoiTooltip top={9} left={2}>
<strong>Click the Kubernetes icon</strong>
{' '}
for a shortcut to the `px/cluster` script.
</PoiTooltip>

<PoiTooltip top={26} left={60}>
<strong>Hover over an edge</strong>
{' '}
for latency, error and throughput. Thicker lines indicate more traffic.
</PoiTooltip>

<PoiTooltip top={60} left={47}>
<strong>Drag the 3-dot column divider</strong>
{' '}
to expand the column.
</PoiTooltip>

<svg title='' src='use-case-tutorials/cluster.png'/>
:::

<Alert variant="outlined" severity="info">
  Hover over the flashing blue circles on the image above to see tips about this graph.
</Alert>

2. Scroll down to the **Services** table.

> This table contains latency, error and throughput rate for all HTTP traffic. It also contains `INBOUND_THROUGHPUT` and `OUTBOUND_THROUGHPUT` columns to reflect all network traffic (not just HTTP).

> Let's figure out which service is the slowest.

3. Expand the **LATENCY** column by dragging the 3-dot column header divider.

> This script represents service latency with a [box & whisker plot](https://datavizcatalogue.com/methods/box_plot.html).

4. Click one of the vertical quantile lines on the box plot to switch the latency display between the P50, P90 and P99 quantile values.

> The table column title will update to reflect the selected quantile.

5. Click the `LATENCY` column title to sort the services by latency.

## Individual Service Health

Let's take a closer look at the health of a particular service.

Clicking on any pod, node, service, or namespace name in Pixie’s UI will open a script showing a high-level overview for that entity.

<Alert variant="outlined" severity="info">
  Pixie displays pod and service names in the UI in the `&lt;namespace&gt;&#47;&lt;pod&gt;` and `&lt;namespace&gt;&#47;&lt;service&gt;` format.
</Alert>

6. From the `SERVICE` column in the **Services** table, click on the `px-sock-shop/front-end` service.

> This will open the `px/service` script with the `service` argument pre-filled with the name of the service you selected.

> The `px/service` script shows the latency, error, and throughput over time for all HTTP requests for the service. It lists the incoming traffic by requesting service, as well as a sample of the slowest requests for the selected service.

::: div image-xl relative
<PoiTooltip top={35} left={68}>
<strong>Click a legend item</strong>
{' '}
to highlight those specific results. Click the item a second time to show all results.
</PoiTooltip>

<PoiTooltip top={27} left={58}>
<strong>Drag your mouse across the graph</strong>
{' '}
to see the values at particular timestamps.
</PoiTooltip>

<svg title='' src='use-case-tutorials/service.png'/>
:::

7. Scroll down to the **Sample of Slow Requests** table.

8. Hover over the column titles to find the `RESP_STATUS` column.

9. Click the column title to sort by HTTP response status code.

## Service Endpoint Health

When troubleshooting service health, it can be useful to see stats broken down by service endpoint.

1. Select `pxbeta/service_endpoints` from the script drop-down menu (note: this is a Beta script).

2. Select the drop down arrow next to the `service` argument, type `px-sock-shop/catalogue`, and press Enter to re-run the script.

> This script shows latency, error and throughput per endpoint for the given service.

3. Clear the `service` value by selecting the drop-down arrow and pressing Enter.

::: div image-xl
<svg title='' src='use-case-tutorials/service_endpoints.png'/>
:::

## Related Scripts

This tutorial demonstrated a few of Pixie's [community scripts](https://github.com/pixie-labs/pixie/tree/main/src/pxl_scripts). For more insight into the health of your services, check out the following scripts:

- [`px/services`](http://work.withpixie.ai/script/services) shows LET over time for all services in the given namespace, along with a  service graph.
- [`px/service_stats`](http://work.withpixie.ai/script/service_stats) shows LET over time for the given service, along with a service graph and summary of incoming and outgoing traffic.
- [`px/service_edge_stats`](http://work.withpixie.ai/script/service_edge_stats) shows LET over time according to another service.
- [`px/pod`](http://work.withpixie.ai/script/pod) shows a CPU flamegraph for the pod to see how your Go/C++/Rust applications are spending their time. To learn more about how use Pixie for application profiling, check out the [Profiling with Flamegraphs](/tutorials/profiler) tutorial.
