---
title: "Network Monitoring"
metaTitle: "Tutorials | Pixie 101 | Network Monitoring"
metaDescription: "Learn how to use Pixie to monitor network health."
order: 1
---

Network performance can have a big impact on the health of your services. With Pixie, you can easily monitor your network alongside your application and infrastructure layers.

This tutorial will demonstrate how to use Pixie to see:

- The flow of network traffic within your cluster.
- The flow of DNS requests within your cluster.
- TCP drops and TCP retransmits across your cluster.

<YouTube youTubeId="qIxzIPBhAUI"/>

## Prerequisites

1. You will need a Kubernetes cluster with Pixie installed. If you do not have a cluster, you can create a minikube cluster and install Pixie using one of our [install guides](/installing-pixie/install-guides/).

## Network Traffic Across Pods

A global view of the network traffic flowing within a cluster can be used to:

- Quickly determine which services are communicating.
- Identify any misconfigured services.
- Identify load balancing issues.

Let’s use the `px/net_flow_graph` script to see a graph of all of the network traffic passing through the cluster:

1. Open the <CloudLink url="/">Live View</CloudLink> and select `px/net_flow_graph` from the `script` drop-down menu at the top.

> When the script opens, you’ll get an error indicating a value is missing for the `namespace` required argument. The UI denotes required script arguments with an asterisk after the argument name.

::: div image-l
<svg title='' src='use-case-tutorials/missing_required_arg.png'/>
:::

2. Enter `pl` for the required `namespace` argument.

> Select the drop down arrow next to the `namespace` argument, type `pl`, and hit Enter.  `pl` is the namespace that Pixie deploys to.

> This script shows a mapping of all the outgoing connections for the pods in the specified namespace.

::: div image-xl relative
<PoiTooltip top={25} left={15}>
<strong>Click anywhere on the graph to interact</strong>
{': '}
pan, zoom, or rearrange individual nodes.
</PoiTooltip>

<PoiTooltip top={37} left={61}>
<strong>Hover over an Edge</strong>
{' '}
for network transmission stats. Thicker lines indicate more traffic.
</PoiTooltip>

<PoiTooltip top={51} left={35}>
<strong> Grey hexagonal icons represent pods</strong>
{' '}
making network requests.
</PoiTooltip>

<PoiTooltip top={55} left={55}>
<strong>Blue circles represent remote endpoints.</strong>
{' '}
If a request’s remote endpoint is within the cluster, then the IP address is resolved to a pod/service name.
</PoiTooltip>

<svg title='' src='use-case-tutorials/net_flow_graph.png'/>
:::

<Alert variant="outlined" severity="info">
  Hover over the flashing blue circles on the image above to see tips about this graph.
</Alert>

> Let's filter the graph to only show communication to the `pl-nats` pod.

3. Select the drop down arrow next to the `to_entity_filter` argument, type `pl-nats`, and press Enter to re-run the script.

> The graph should update to only show network traffic sent to the `pl-nats` pod. Pixie uses NATS as our messaging system.

4. Clear the `to_entity_filter` value by selecting the drop-down arrow and pressing Enter.

5. Scroll down to the table below the graph. This table contains the same data that is used to construct the graph above.

## DNS Requests Across Pods

Another capability Pixie provides is the ability to inspect and analyze DNS traffic. This information can be used to:

- Quickly determine which services are making DNS requests.
- Get high-level DNS latency and throughput information.
- Observe imbalances of throughput between DNS servers.

Let’s use the px/dns_flow_graph script to see a graph of DNS requests in the cluster:

1. Select `px/dns_flow_graph` from the `script` drop-down menu.

<Alert variant="outlined" severity="warning">
  Don't forget to clear the `to_entity_filter` argument value if you didn't do so in the last section.
</Alert>

> This script shows all of the DNS requests made in the cluster, with latency and throughput stats.

> This cluster doesn't have anything deployed except Pixie, so all we see are the kube-dns pods communicating with the metadata server.

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

2. Click on the `LATENCY_AVG` column title to sort the table data by average latency.

## TCP Drops

TCP drops and retransmits can indicate network connectivity issues that may affect application performance.

Let's use the `bpftrace/tcp_drops`script to see a global view of TCP drops across the cluster.

1. Select `bpftrace/tcp_drops` from the script drop-down menu.

<Alert variant="outlined" severity="info">
  This script is a PxL mutation script. While the previous scripts query the Pixie platform for data, this script extends Pixie to collect new data. Mutation scripts must be run manually; they do not automatically run when they are first opened.
</Alert>

2. Press the "RUN" button in the top right and the script will first deploy a tracepoint (the new data source) and then query the new data source.

::: div image-xl relative
<PoiTooltip top={72} left={87}>
<strong>Enable Hierarchy View</strong>
{' '}
for a different view of the graph.
</PoiTooltip>

<svg title='' src='use-case-tutorials/tcp_drops.png'/>
:::

3. Hover over an edge to see the number of drops between pod pairs. The color and thickness of the edges indicate an increase in the number of TCP drops.

4. After a few seconds have passed, press the "RUN" button once again. Since more time has elapsed since the tracepoint was deployed, you should see more data in the graph.

## Related Scripts

This tutorial demonstrated three of Pixie's [community scripts](https://github.com/pixie-io/pixie/tree/main/src/pxl_scripts). For more insight into your network, check out the following scripts:

- <CloudLink url="script/dns_data">px/dns_data</CloudLink> shows the most recent DNS requests in your cluster, including the full request and response bodies.
- <CloudLink url="script/bpftrace/tcp_retransmits">bpftrace/tcp_retransmits</CloudLink> graphs the TCP retransmission counts across your cluster. Don't forget to click the RUN button.
