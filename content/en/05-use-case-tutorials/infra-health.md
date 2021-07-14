---
title: "Infra Health"
metaTitle: "Using Pixie | Use Cases | Infra Health"
metaDescription: "Network monitoring using Pixie."
order: 2
---

This tutorial will demonstrate how to use Pixie to:

- Monitor resource usage by [Namespace](#resource-usage-by-namespace), [Node](#resource-usage-by-node), and [Pod](#resource-usage-by-pod).
- Use deep links to navigate between the scripts, making it

**Prerequisites**

1. You will need a Kubernetes cluster with Pixie installed. If you do not have a cluster, you can create a minikube cluster and install Pixie using our [install guides](/installing-pixie/quick-start/).

## Resource Usage by Node

Let’s use the `px/nodes` script to list all of the nodes in our cluster along with high-level resource useage:

1. Open the [Live UI](http://work.withpixie.ai/) and select `px/nodes` from the `script` drop-down menu at the top.

> This script lists all of the nodes in the cluster along with their CPU usage, memory consumption, and network traffic stats. It also displays a list of pods that were on each node during the time window.

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

<svg title='' src='use-case-tutorials/nodes.png'/>
:::

> Clicking on any Kubernetes resource name in Pixie’s UI will open a script showing a high-level overview for that entity.

2. Click on one of the node names in the top left “Nodes” table to follow the deep link to the `px/node` script for that node. The script may take a few seconds to execute.

> The `px/node` script shows a similar set of information - CPU usage, memory usage, and network traffic - but just for the selected node.

3. Click on the drop down arrow by the `groupby` argument at the top and select "pod". The graph will switch to display the information grouped by pod instead of node.

## Resource Usage by Pod

The `px/node` script contains a list of the pods on the node.

4. Click on one of the pod names in top left "Pods" table. This takes us to the `px/pod` script. The script may take a few seconds to execute.

> This script shows an overview of the specified pod, including high-level HTTP application metrics, and resource usage. It also lists containers on the pod and all live processes.

<svg title='' src='use-case-tutorials/pod.png'/>

5. Scroll down to the bottom to see a CPU flamegraph for the pod. To learn more about how use Pixie for application profiling, check out [Profiling with Flamegraphs](/tutorials/profiler/) tutorial.

## Resource Usage by Namespace

For a very high-level overview of the cluster, let's use the `px/namespaces` script to:

- List the namespace on the cluster and their pods and service counts.
- List the high-level resource usage per namespace.

1. Select `px/namespaces` from the script drop-down menu.

::: div image-xl relative
<PoiTooltip top={17} left={2}>
<strong>Script shortcuts icons</strong>
{' '}
are available for the heavily used px/cluster and px/namespace scripts.
</PoiTooltip>

<svg title='' src='use-case-tutorials/namespaces.png'/>
:::

2. Select any namespace name in the `NAMESPACES` table column. This will open the `px/namespace` script for the selected namespace.
