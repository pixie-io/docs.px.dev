---
title: "Request Tracing"
metaTitle: "Tutorials | Pixie 101 | Request Tracing"
metaDescription: "Learn how to use Pixie to trace requests in your cluster."
order: 5
---

Pixie uses a low-level Linux tracing technology called [eBPF](https://www.brendangregg.com/ebpf.html) to automatically capture telemetry data without the need for manual instrumentation. One type of telemetry data Pixie collects is network traffic, including certain encrypted traffic. If the traffic is of a [supported protocol](http://localhost:8000/about-pixie/data-sources/#supported-protocols), such as HTTP2/gRPC and DNS, this traffic is classified and parsed, making it easy for you to quickly inspect debug issues with your distributed applications.

This tutorial will demonstrate how to use Pixie to:

- See a high-level overview of HTTP errors for the services in your cluster.
- Drill down into HTTP errors per service and per pod.
- Inspect full body HTTP requests.

Cluster > Service > Pod > see errors > switch to http_data_filtered > hide columns

## Prerequisites

1. You will need a Kubernetes cluster with Pixie installed. If you do not have a cluster, you can create a minikube cluster and install Pixie using our [installation steps](/installing-pixie/).

2. You will need an application that makes MySQL requests. To install a demo app that uses MySQL:

> - [Install the Pixie CLI](/installing-pixie/install-schemes/cli/#1.-install-the-pixie-cli)
> - Run `px demo deploy px-sock-shop` to install Weavework's [Sock Shop](https://microservices-demo.github.io/) demo app.
> - Run `kubectl get pods -n px-sock-shop` to make sure all pods are ready before proceeding. The demo app can take up to 5 minutes to deploy.

## HTTP Errors in the Cluster

To get a high-level overview of the services in your cluster, we'll start with the `px/cluster` script.

1. Open the [Live UI](http://work.withpixie.ai/) and select `px/cluster` from the `script` drop-down menu at the top.

> This script shows a graph of the HTTP traffic between the services in your cluster, along with latency, error, and throughput rate per service.

::: div image-xl relative
<PoiTooltip top={10} left={1}>
<strong>Click the Kubernetes icon</strong>
{' '}
for a shortcut to the `px/cluster` script.
</PoiTooltip>

<PoiTooltip top={71} left={61}>
<strong>Click table column titles</strong>
{' '}
to sort the column data.
</PoiTooltip>

<PoiTooltip top={72} left={3}>
<strong>Show / hide table columns</strong>
{' '}
with the table column menu.
</PoiTooltip>

<svg title='' src='use-case-tutorials/cluster_errors.png'/>
:::

2. Scroll down to the **Services** table.

3. Click on the `ERROR_RATE` column title to sort the services by error rate.

> The `carts` service has errors, so let's take a closer look at that service.

## HTTP Errors per Service

> Clicking on any pod, node, service, or namespace name in Pixie’s UI will open a script showing a high-level overview for that entity.

4. From the `SERVICE` column in the **Services** table, click on the `px-sock-shop/carts` service.

<Alert variant="outlined" severity="info">
  Pixie displays service names in the UI in the `&lt;namespace&gt;&#47;&lt;service&gt;` format.
</Alert>

> This will open the `px/service` script with the `service` argument pre-filled with the name of the service you selected.

> The `px/service` script shows the latency, error, and throughput over time for all HTTP requests for the service.

> We can see that the `carts` service has a consistent, low level of HTTP errors over the last 5 min.

::: div image-xl relative
<svg title='' src='use-case-tutorials/service_errors.png'/>
:::

5. Scroll down to the **Inbound Traffic by Requesting Service** table.

> Here, we can see that the errors are from the HTTP requests from the `front-end` service.

## HTTP Errors per Pod

Let's drill down into the pod view.

6. Click on the pod name in the **Pod List** table.

> This will open the `px/pod` script with the `pod` argument pre-filled with the name of the pod you selected.

> The `px/pod` script shows the latency, error, and throughput over time for all HTTP requests for the pod.

::: div image-xl relative
<svg title='' src='use-case-tutorials/pod_errors.png'/>
:::

## Individual Full Body HTTP Requests

1. Select `px/http_data_filtered` from the script drop-down menu.

> Note how the `pod` argument preserves the same value that was selected in the `px/pod` script.

> The `px/http_data_filtered` script shows a sample of HTTP requests in the cluster filtered by service, pod, request path & response status code.

2. Select the drop down arrow next to the `status_code` argument, type `500`, and press Enter to re-run the script.

> The graph should update to only show HTTP requests with a response status code of `500`.

::: div image-xl relative
<PoiTooltip top={56} left={55}>
<strong>Click a row</strong>
{' '}
to see the data in JSON form.
</PoiTooltip>

<svg title='' src='use-case-tutorials/http_data_filtered.png'/>
:::

> For requests with longer message bodies, it's often easier to view the data in JSON form.

3. Click on a table row to see the row data in JSON format.

4. Scroll through the JSON data to find the `resp_body` key.

> We can see that the `front-end` has tried to
