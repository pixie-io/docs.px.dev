---
title: "Service Performance"
metaTitle: "Tutorials | Pixie 101 | Service Performance"
metaDescription: "Learn how to use Pixie to monitor service performance."
order: 3
redirect_from:
    - /using-pixie/use-cases/service-health/
---

Unreliable or slow services can lead to a poor user experience for your customers. With Pixie, you can get immediate visibility into the health of your services, without the need for manual instrumentation.

Pixie automatically captures all network traffic in your cluster using [eBPF](https://www.brendangregg.com/ebpf.html), a low-level Linux tracing technology. Messages of a [supported protocol](/about-pixie/data-sources/#supported-protocols) type, such as HTTP2/gRPC, are parsed and paired with their responses, making latency, error, and throughput information immediately available after installing Pixie.

This tutorial will demonstrate how to use Pixie to see:

- The flow of HTTP traffic between the services in your cluster.
- Latency per service.
- Latency per service endpoint.
- A sample of the slowest requests for an individual service.

If you're interested in troubleshooting HTTP errors, check out the [Request Tracing](/tutorials/pixie-101/request-tracing) tutorial.

<YouTube youTubeId="Rex0yz_5vwc"/>

## Prerequisites

1. You will need a Kubernetes cluster with Pixie installed. If you do not have a cluster, you can create a minikube cluster and install Pixie using one of our [install guides](/installing-pixie/install-guides/).

2. You will need to install the demo microservices application, using Pixie's CLI:

> - [Install the Pixie CLI](/installing-pixie/install-schemes/cli/#1.-install-the-pixie-cli).
> - Run `px demo deploy px-sock-shop` to install Weavework's [Sock Shop](https://microservices-demo.github.io/) demo app.
> - Run `kubectl get pods -n px-sock-shop` to make sure all pods are ready before proceeding. The demo app can take up to 5 minutes to deploy.

## Service Graph

When debugging issues with microservices, it helps to start at a high-level view, like a service map, and then drill down into the problem service(s).

For a global view of the services in your cluster, we'll use the `px/cluster` script:

1. Open the <CloudLink url="/">Live UI</CloudLink> and select `px/cluster` from the `script` drop-down menu at the top.

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

> This table contains latency, error and throughput rate for all HTTP traffic. The `INBOUND_THROUGHPUT` and `OUTBOUND_THROUGHPUT` columns  reflect all traced network traffic (not just HTTP) for the service.

Let's figure out which service is the slowest.

3. Click the `LATENCY` column title to sort the services by latency.

It’s good to check multiple percentiles for latency, not just the average, in order to get a better picture of the overall distribution.

4. Expand the `LATENCY` column by dragging the 3-dot column header divider.

> This script represents service latency with a [box & whisker plot](https://datavizcatalogue.com/methods/box_plot.html).

5. Click the vertical quantile lines on the box plot to switch the latency display between the P50, P90 and P99 quantile values.

> The `LATENCY` column will resort itself and the column title will update to reflect the selected quantile.

> A high P50 latency value for the `front-end` service indicates that this is general performance degradation, rather than an issue with a specific request.

## Service Performance

Once we have identified a service we are interested in investigating further, we will want to drill down into its detailed latency information.

Pixie's UI makes it easy to quickly navigate between Kubernetes resources. Clicking on any pod, node, service, or namespace name in the UI will open a script showing a high-level overview for that entity.

6. From the `SERVICE` column in the **Services** table, click on the `px-sock-shop/front-end` service.

> This will open the `px/service` script with the `service` argument pre-filled with the name of the service you selected.

> The `px/service` script shows the latency, error, and throughput over time for all HTTP requests for the service.

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

<PoiTooltip top={10} left={82}>
<strong>Modify the start_time</strong>
{' '}
to change the time window for the results (e.g -30m, -1h).
</PoiTooltip>

<svg title='' src='use-case-tutorials/service.png'/>
:::

> This view shows us that the service's latency values have been consistent over the selected time window.

7. Scroll down to the **Sample of Slow Requests** table and expand the `REQ_PATH` column.

> If this service handles multiple kinds of requests, this table can help identify if there is a particular request type that is much slower.

> This table shows individual requests, so we will see the full path with URL parameters filled in (for example, `/restaurants/123`).  However, Pixie makes it possible to drill down into individual logical endpoints (for example, `/restaurants/*`).

## Endpoint Performance

Request latency can vary greatly by endpoint, especially if one of the requests is more database intensive. However, when there are wildcards (URL parameters) in your request paths, it can be difficult to drill down into a particular endpoint.

Pixie can cluster HTTP requests by logical endpoint, substituting a `*` for the parameters in your requests. For example, the following two requests:

> `/restaurants/0123550/reviews/239487345/author`
> `/restaurants/3485799/reviews/394853457/author`

would be clustered together into the logical endpoint:

> `/restaurants/*/reviews/*/author`

Let's look at latency by logical service endpoint:

1. Select `pxbeta/service_endpoints` from the script drop-down menu (note: this is a Beta script).

2. Select the drop-down arrow next to the `service` argument, type `px-sock-shop/catalogue`, and press Enter to re-run the script.

<Alert variant="outlined" severity="info">
  Pixie displays service names in the UI in the &lt;namespace&gt;&#47;&lt;service&gt; format.
</Alert>

> This script shows latency, error and throughput per logical endpoint for the given service.

::: div image-xl
<svg title='' src='use-case-tutorials/service_endpoints.png'/>
:::

3. Click on `catalog/*` in the **Endpoints** table to see an overview of that individual endpoint with a sample of slow requests.

::: div image-xl
<svg title='' src='use-case-tutorials/service_endpoint.png'/>
:::

## Related Scripts

This tutorial demonstrated a few of Pixie's [community scripts](https://github.com/pixie-io/pixie/tree/main/src/pxl_scripts). For more insight into the health of your services, check out the following scripts:

- <CloudLink url="/script/pod">px/pod</CloudLink> shows a CPU flamegraph for the pod to see how your Go/C++/Rust applications are spending their time. To learn more about how use Pixie for application profiling, check out the [Profiling with Flamegraphs](/tutorials/pixie-101/profiler) tutorial.
- <CloudLink url="/script/services">px/services</CloudLink> shows LET over time for all services in the given namespace, along with a  service graph.
- <CloudLink url="/script/service_stats">px/service_stats</CloudLink> shows LET over time for the given service, along with a service graph and summary of incoming and outgoing traffic.
- <CloudLink url="/script/service_edge_stats">px/service_edge_stats</CloudLink> shows statistics about the traffic between two services.
