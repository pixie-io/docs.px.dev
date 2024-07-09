---
title: "Request Tracing"
metaTitle: "Tutorials | Pixie 101 | Request Tracing"
metaDescription: "Learn how to use Pixie to trace requests in your cluster."
order: 5
redirect_from:
    - /using-pixie/use-cases/request-tracing/
---

The move from monolith to microservice architecture has greatly increased the volume of inter-service traffic. Pixie makes debugging  this communication between services easy by providing immediate and deep (full-body) visibility into requests flowing through your cluster.

HTTP requests are featured in this tutorial, but Pixie can trace a number of different protocols including DNS, PostgreSQL, and MySQL. See the full list [here](/about-pixie/data-sources/#supported-protocols).

This tutorial will demonstrate how to use Pixie to:

- Inspect full-body HTTP requests.
- See HTTP error rate per service.
- See HTTP error rate per pod.

If you're interested in troubleshooting HTTP latency, check out the [Service Performance](/tutorials/pixie-101/service-performance) tutorial.

<YouTube youTubeId="Gl0so4rbwno"/>

## Prerequisites

1. You will need a Kubernetes cluster with Pixie installed. If you do not have a cluster, you can create a minikube cluster and install Pixie using one of our [install guides](/installing-pixie/install-guides/).

2. You will need to install the demo microservices application, using Pixie's CLI:

> - [Install the Pixie CLI](/installing-pixie/install-schemes/cli/#1.-install-the-pixie-cli).
> - Run `px demo deploy px-sock-shop` to install Weavework's [Sock Shop](https://microservices-demo.github.io/) demo app.
> - Run `kubectl get pods -n px-sock-shop` to make sure all pods are ready before proceeding. The demo app can take up to 5 minutes to deploy.

## Full-Body HTTP Request

A developer has noticed that the demo application's `cart` service is reporting errors.

<Alert variant="outlined" severity="info">
  To see high-level error rates for all of the services in your cluster, check out the <a href="/tutorials/pixie-101/service-performance/#service-graph">Service Graph</a> section of the Service Performance tutorial.
</Alert>

Let's use Pixie to look at HTTP requests with specific types of errors:

1. Select `px/http_data_filtered` from the script drop-down menu.

> This script shows the most recent HTTP requests in your cluster filtered by service, pod, request path, and response status code.

2. Select the drop-down arrow next to the `status_code` argument, type `500`, and press Enter to re-run the script.

> This filters the HTTP requests to just those with the `500` status code.

3. Select the drop-down arrow next to the `svc` argument, type `px-sock-shop/carts`, and press Enter to re-run the script.

<Alert variant="outlined" severity="info">
  Pixie displays service names in the UI in the &lt;namespace&gt;&#47;&lt;service&gt; format.
</Alert>

> This filters the HTTP requests to just those made to the `carts` service.

::: div image-xl relative
<PoiTooltip top={41} left={55}>
<strong>Click a row</strong>
{' '}
to see the data in JSON form.
</PoiTooltip>

<PoiTooltip top={24} left={3}>
<strong>Show / hide table columns</strong>
{' '}
with the table column menu.
</PoiTooltip>

<svg title='' src='use-case-tutorials/http_data_filtered.png'/>
:::

> For requests with longer message bodies, it's often easier to view the data in JSON form.

4. Click on a table row to see the row data in JSON format.

5. Scroll through the JSON data to find the `resp_body` key.

> We can see that a HTTP POST request to the `carts` service has returned an error, with the message: `Cannot find item in cart`.

## Service Errors

Once we have identified a specific error coming from the `carts` service, we will want to go up a level to see how often these errors occur at the service level.

6. Hover over the **HTTP Data** table and scroll all the way to the right side.

> Pixie's UI makes it easy to quickly navigate between Kubernetes resources. Clicking on any pod, node, service, or namespace name in the UI will open a script showing a high-level overview for that entity.

7. From the `SVC` column, click on the `px-sock-shop/carts` service name.

> This will open the `px/service` script with the `service` argument pre-filled with the name of the service you selected.

> The `px/service` script shows error rate over time for all inbound HTTP requests.

::: div image-xl relative
<PoiTooltip top={11} left={79}>
<strong>Modify the start_time</strong>
{' '}
to change the time window for the results (e.g -30m, -1h).
</PoiTooltip>

<svg title='' src='use-case-tutorials/service_errors.png'/>
:::

> We can see that the `carts` service has had a low but consistent error rate over the selected time window.

8. Scroll down to the **Inbound Traffic by Requesting Service** table.

> This table shows the services making requests to the `carts` service.

> We can see from the `ERROR_RATE` column that the requests with errors are only coming from the `front-end` service.

## Pod Errors

If services are backed by multiple pods, it is worth inspecting the individual pods to see if a single pod is the source of the service's errors.

9. Scroll up to the **Pod List** table.

> In this case, the carts service is backed by a single pod. If the service had multiple pods, they would be listed here.

6. Click on the pod name in the **Pod List** table.

> This will open the `px/pod` script with the `pod` argument pre-filled with the name of the pod you selected.

> The `px/pod` script shows HTTP error rate alongside high-level resource metrics.

::: div image-xl relative
<svg title='' src='use-case-tutorials/pod_errors.png'/>
:::

> We can see that there is no resource pressure on this pod and that the HTTP request throughput has been constant over the selected time window.

> Resolving this bug requires further insight into the application logic. For Go/C/C++ applications, you might want to try Pixie's [continuous profiling](/tutorials/pixie-101/profiler/) feature. Pixie also offers [dynamic logging](/tutorials/simple-go-tracing/) for Go applications.

## Related Scripts

This tutorial demonstrated a few of Pixie's [community scripts](https://github.com/pixie-io/pixie/tree/main/src/pxl_scripts). To see full body requests for a specific protocol, check out the following scripts:

- <CloudLink url="/script/http_data">px/http_data</CloudLink> shows the most recent HTTP/2 requests in the cluster.
- <CloudLink url="/script/dns_data">px/dns_data</CloudLink> shows the most recent DNS requests in the cluster.
- <CloudLink url="/script/mysql_data">px/mysql_data</CloudLink> shows the most recent MySQL requests in the cluster.
- <CloudLink url="/script/pgsql_data">px/pgsql_data</CloudLink> shows the most recent Postgres requests in the cluster.
- <CloudLink url="/script/redis_data">px/redis_data</CloudLink> shows the most recent Redis requests in the cluster.
- <CloudLink url="/script/cql_data">px/cql_data</CloudLink> shows the most recent Cassandra requests in the cluster.
