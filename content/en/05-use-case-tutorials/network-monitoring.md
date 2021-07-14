---
title: "Network Monitoring Tutorial"
metaTitle: "Using Pixie | Use Cases | Network Monitoring Tutorial"
metaDescription: "Network monitoring using Pixie."
order: 1
---

This tutorial will demonstrate how to use Pixie to:

- [Visualize the flow of network traffic within your cluster.](#visualize-network-traffic-flowing-within-the-cluster)
- [Visualize the flow of DNS requests within your cluster.](#visualize-dns-requests-made-within-the-cluster)
- [Visualize TCP drops and TCP retransmits across your cluster.](#visualize-tcp-drops-and-tcp-retransmissions-across-the-cluster)

**Prerequisites**

1. You will need a Kubernetes cluster with Pixie installed. If you do not have a cluster, you can create a minikube cluster and install Pixie using our [install guides](/installing-pixie/quick-start/).

## Live network traffic map

A global view of the network traffic flowing within a cluster can be used to:

- Quickly determine which services are communicating.
- Identify any misconfigured services.
- Identify load balancing issues.

Let’s use the `px/net_flow_graph` script to see a graph of all of the network traffic passing through the cluster:

1. Open the [Live UI](work.withpixie.ai) and select `px/net_flow_graph` from the `script` drop-down menu at the top.

> When the script opens, you’ll get an error indicating a value is missing for the `namespace` required argument. The UI denotes required script arguments with an asterisk after the argument name.

::: div image-l
<svg title='' src='use-case-tutorials/missing_required_arg.png'/>
:::

2. Enter `pl` for the required `namespace` argument: select the drop down arrow next to the `namespace` argument, type `pl`, and hit enter.  `pl` is the namespace that Pixie deploys to.

::: div image-xl relative
<PoiTooltip top={25} left={15}>
<strong>Click anywhere on the graph to interact</strong>
{': '}
pan, zoom, or rearrange individual nodes.
</PoiTooltip>

<PoiTooltip top={37} left={62}>
<strong>Hover over an Edge</strong>
{' '}
for network transmission stats. Thicker lines indicate more traffic.
</PoiTooltip>

<PoiTooltip top={60} left={87}>
<strong>Enable Hierarchy View</strong>
{' '}
for a different view of the graph.
</PoiTooltip>

<svg title='' src='use-case-tutorials/net_flow_graph.png'/>
:::

> This script shows a mapping of all the outgoing connections for the pods in the specified namespace.

> Grey hexagonal icons represent pods making network requests. Blue circles represent remote endpoint. If a request’s remote endpoint is within the cluster, then the IP address is resolved to a pod/service name.

> Let's filter the graph to only show communication to the `pl-nats` pod.

3. Select drop down arrow next to the `to_entity_filter` argument, type `pl-nats`, and press enter to re-run the script.

> The graph should update to only show network traffic sent to the `pl-nats` pod. Pixie uses NATS as our messaging system.

4. Clear the `to_entity_filter` value by selecting the drop-down arrow and pressing enter.

5. Scroll down to the table below the graph. This table contains the same data that is used to construct the graph above.

## Live DNS request map

A global view of DNS requests made within a cluster can be used to:

- Quickly determine which services are making DNS requests.
- Get high-level latency and throughput information.
- Observe imbalances of throughput between DNS servers.

Let’s use the px/dns_flow_graph script to see a graph of DNS requests in the cluster:

1. Select `px/dns_flow_graph` from the `script` drop-down menu.

::: div image-xl relative
<PoiTooltip top={14} left={28}>
<strong>Enter a string</strong>
{' '}
to filter the DNS requests.
</PoiTooltip>

<PoiTooltip top={50} left={40}>
<strong>Hover over an Edge</strong>
{' '}
to see  network transmission stats. Thicker lines indicate more traffic.
</PoiTooltip>

<PoiTooltip top={72} left={57}>
<strong>Click table column titles</strong>
{' '}
to sort the column data.
</PoiTooltip>

<svg title='' src='use-case-tutorials/dns_flow_graph.png'/>
:::

> This script shows all of the DNS requests made in the cluster, with latency and throughput stats.

> This cluster doesn't have anything deployed except Pixie, so all we see are the kube-dns pods communicating with the metadata server.

2. Click on the `LATENCY_AVG` column title to sort the table data by average latency.

## Live TCP drops, retransmits map

TCP drops and retransmits can indicate network connectivity issues that may affect application performance.

Let's use the `px/tcp_drops`script to see a global view of TCP drops across the cluster.

1. Select `px/tcp_drops` from the script drop-down menu.

> This script is different from other PxL scripts. The two previous scripts simply queried the Pixie platform for data that is being continuously collected (DNS events, HTTP events, etc). This script deploys a new short-lived data source, then queries the new data source after some time has passed.

> This script does not automatically run when it first opens; it requires you to explicitly run it.

2. Press the `RUN` button in the top right and the script will first deploy a tracepoint (the new data source) and then query the new data source.

<svg title='' src='use-case-tutorials/tcp_drops.png'/>

3. After a few seconds have passed, press the `RUN` button once again. Since more time has elapsed since the tracepoint was deployed, you should see more data in the graph.

To see TCP retransmission counts across the cluster, check out the [`px/tcp_retransmissions`](http://work.withpixie.ai/script/tcp_retransmissions) script.
