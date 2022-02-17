---
title: "Kafka Monitoring"
metaTitle: "Tutorials | Pixie 101 | Kafka Monitoring"
metaDescription: "Learn how to monitor Kafka using Pixie."
order: 7
---

Debugging distributed messaging systems can be challenging. Pixie makes analyzing Kafka easier by using eBPF to [automatically capture](https://docs.px.dev/about-pixie/pixie-ebpf/) full-body Kafka requests without the need for manual instrumentation.

This tutorial will demonstrate how to use Pixie to see:

- [Topic-centric flow graph & topic summaries](#topic-centric-flow-graph)
- [Latency and throughput per pod](#latency-and-throughput-per-pod)
- [Kafka event with metadata](#kafka-events-with-metadata)
- [Producer-consumer latency per topic and partition](#producer-consumer-latency)
- [Consumer rebalancing delay](#consumer-rebalancing-delay)

<YouTube youTubeId="42o5fURGXqI?t=1332"/>

## Prerequisites

1. You will need a Kubernetes cluster with Pixie installed. If you do not have a cluster, you can create a minikube cluster and install Pixie using one of our [install guides](https://docs.px.dev/installing-pixie/install-guides/).

2. You will need to install the Kafka microservices demo application:

> - Install the [Pixie CLI](/installing-pixie/install-schemes/cli/#1.-install-the-pixie-cli).
> - Run `px demo deploy px-kafka` to install the Kafka demo app.
> - Run `kubectl get pods -n px-kafka` to make sure all pods are ready _before proceeding_.

3. You will need to manually start the demo app's load generator:

> - Run `kubectl -n px-kafka get svc load-test` to get the `load-test` external IP (and port).
> - Navigate to the external IP (with port) in your browser.
> - Press the `"Start swarming"` button.

## Kafka Microservice Demo App

The demo application you deployed in the [Prerequisites](#prerequisites) steps has:

- A single `order` topic.
- One producer: the `order` service publishes messages to the `order` topic.
- Two consumers: the `shipping` and `invoicing` services consume messages from the `order` topic. The `shipping` service is able to consume the order messages at the rate they are produced. The `invoicing` service is slower and unable to consume the order messages at the rate they are produced.

::: div image-xl relative
<svg title='' src='use-case-tutorials/kafka/kafka-microservice-app.png'/>
:::

To see the application's simple front end, navigate to the external IP (and port) of the `apache` service:

```bash
kubectl -n px-kafka get svc apache
```

To use the application, click on the Order page and scroll to the bottom of the page to select the `"Add Order"` button. Any orders added by the order service should soon show up on both the Shipping and Invoicing pages.

## Topic-centric Flow Graph

Let's use Pixie to see a graph of producers and consumers for each Kafka topic.

1. Select `px/kafka_overview` from the script drop-down menu.

::: div image-xl relative
<svg title='' src='use-case-tutorials/kafka/kafka-overview.png'/>
:::

> This graph shows us that we have 1 topic, named `order`, with 1 producer and 2 consumers.

<Alert variant="outlined" severity="info">If this script doesn't show any output, make sure that you started the load generator in Prerequisites Step #3.</Alert>

2. Hover over an edge on the graph to see throughput and total record Bytes for a producer or consumer. The thickness of the edge indicates an increase in throughput.

> By examining the edges of the graph, we can see that the producer is producing to the order topic at about 450 B/s. The `shipping` consumer is consuming at the same rate of 450 B/s. The `invoicing` consumer is only consuming at 86 B/s and is falling behind. Since this is a demo application, the traffic throughput is lower than what you'd typically see in a production application.

> The table at the bottom summarizes the same topic information, but also includes the number of topic partitions.

## Latency and Throughput per Pod

The previous script alerted us to the fact that the `invoicing` pod is consuming messages at a slower speed than they are being produced. Let's investigate this more.

1. Select `px/kafka_stats` from the script drop-down menu.

> This script calculates the latency and throughput of a pod's Kafka requests.

::: div image-xl relative
<svg title='' src='use-case-tutorials/kafka/kafka-stats.png'/>
:::

> The **Summary** table at the bottom of the page shows us the request throughput, latency, and total number of Kafka requests per pod. The `shipping` pod has sent around 7,600 `Fetch` requests while the `invoicing` pod has sent much fewer (only 1700 `Fetch` requests). We can also see that the This again indicates that something is wrong.

2. To check the pod's resources, click on the `px-kafka/invoicing-*` pod name in the **SOURCE** column of the **Summary** table to follow the deep link to the `px/pod` script.

> This script shows an overview of the pod's CPU usage, network traffic and throughput, disk and memory usage.

> In this case, CPU utilization is low, which means resource starvation is not causing the `invoicing` pod to consume messages at a slower rate.

## Kafka Events with Metadata

Let's inspect the raw Kafka requests flowing through the cluster.

1. Select `px/kafka_data` from the script drop-down menu.

> This script shows a sample of the most recent Kafka messages in your cluster.

> For each record you can see the source, destination, request command, full-body request and response, and the latency. Pixie only shows the size of the payload, not the content, because it's usually too large.

::: div image-xl relative
<svg title='' src='use-case-tutorials/kafka/kafka-data.png'/>
:::

2. Click the `TIME_` column title to sort by time.

> We can see that there are a bunch of different Kafka request commands being traced by Pixie, such as `Produce`, `Fetch`, `OffsetCommit`, `Heartbeat`, etc. Pixie supports full body tracing of these op codes.

3. Click on a table row with the `Produce` `REQ_CMD` to inspect the full request and response body in JSON format.

> Pixie parses the request body and gives us information on the name of the topic, what partition it is producing to and the total size of the message set. Inspecting the response shows us if there's any error code coming back from the Kafka broker, base offset, log append time, etc.

This script is useful for inspecting a specific request or filtering all requests by a certain command (you'll need to [edit the PxL script](https://docs.px.dev/using-pixie/using-live-ui/#write-your-own-pxl-scripts-edit-an-existing-script) to do that).

## Producer Consumer Latency

Producer consumer latency is the time between when a producer pushes a message to a topic to when it is fetched by a consumer.

It's important to monitor this latency because many incidents begin with producer consumer lag.

1. Select `px/kafka_producer_consumer_latency` from the script drop-down menu.

2. Select the drop-down arrow next to the `namespace` argument, type `px-kafka`, and press `Enter` to re-run the script.

> The **Kafka Topics** table will update to show the topics being written and read to by pods in this namespace. The table lists our single `order` topic.

3. Select the drop-down arrow next to the `topic` argument, type `order`, and press `Enter` to re-run the script.

::: div image-xl relative
<svg title='' src='use-case-tutorials/kafka/kafka-producer-consumer-latency.png'/>
:::

> The **Kafka Producers** and **Kafka Consumers** tables show us that we have 1 producer and 2 consumers for this topic.

> The **Kafka Producer-Consumer Delay (Seconds)** graph plots the delay between when the producer pushes messages to the `order` topic and the consumers fetch them.

4. Let's examine the `shipping` consumers. Select the drop-down arrow next to the `consumer` argument, type `shipping`, and press `Enter` to re-run the script.

::: div image-xl relative
<svg title='' src='use-case-tutorials/kafka/kafka-producer-consumer-latency-shipping.png'/>
:::

> The graph updates to show a flat line. This tells us that there is near zero latency between when the `order` topic messages are being produced and when all 5 `shipping` partitions are consuming the messages.

4. Let's examine the `invoicing` consumers. Select the drop-down arrow next to the `consumer` argument, type `invoicing`, and press `Enter` to re-run the script.

::: div image-xl relative
<svg title='' src='use-case-tutorials/kafka/kafka-producer-consumer-latency-invoicing.png'/>
:::

> The graph updates to show non-zero latency for all 5 `invoicing` partitions. All 5 partitions are consuming `order` topic messages around 40-55 seconds after they are being produced.

> The zig zag line shape is due to the `invoicing` consumer fetching a batch of messages from the topic, processing these messages slowly, then fetching another group of messages and being even more behind. The overall trend is upward; there is increasing producer-consumer lag for the `invoicing` consumer. This is a bad sign.

## Consumer Rebalancing Delay

Consumer rebalancing (shuffling the consumers among partitions) happens whenever a new consumer comes online or an existing consumer goes offline.

It's important to monitor these events because either some or all of the consumers are stopped from consuming messages when the rebalancing is in progress. If consumer rebalancing events happen too often, this can cause consumers to lag in their consumption of messages.

1. To trigger a rebalancing, we'll need to scale our deployments. Run:

```bash
kubectl scale --replicas=3 deployment shipping -n px-kafka
```

2. Select `px/kafka_consumer_rebalancing` from the script drop-down menu.

> This script visualizes the most recent Kafka consumer rebalancing events with their delays.

::: div image-xl relative
<svg title='' src='use-case-tutorials/kafka/kafka-consumer-rebalancing.png'/>
:::

> The **Consumer Groups** table shows us that we now have 3 members in the `shipping` consumer group.

> Each consumer rebalancing event consists of 1 `JoinGroup` and 1 `SyncGroup` request per consumer. In the default rebalance protocol, there's a stop-the-world effect on the whole consumer group when a rebalancing event happens.

> The **Consumer Rebalancing Events** table shows the traced `JoinGroup` and `SyncGroup` requests.

> The **Consumer Rebalancing Delay** table at the top calculates the delay between when the `JoinGroup` request was sent and when the `SyncGroup` request was received. This measures the stop-the-world delay mentioned above.
