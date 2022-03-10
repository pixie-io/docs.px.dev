---
title: "Kafka Monitoring"
metaTitle: "Tutorials | Pixie 101 | Kafka Monitoring"
metaDescription: "Learn how to monitor Kafka using Pixie."
order: 7
---

Debugging distributed messaging systems can be challenging. Pixie makes analyzing Kafka easier by using eBPF to [automatically capture](https://docs.px.dev/about-pixie/pixie-ebpf/) full-body Kafka requests without the need for manual instrumentation.

This tutorial will demonstrate how to use Pixie to see:

- [Topic-centric flow graph & topic summaries](#topic-centric-flow-graph)
- [Kafka events with metadata](#kafka-events-with-metadata)
- [Producer-consumer latency per topic and partition](#producer-consumer-latency)
- [Consumer rebalancing duration](#consumer-rebalancing-duration)

<YouTube youTubeId="42o5fURGXqI?t=1332"/>

## Prerequisites

1. You will need a Kubernetes cluster with Pixie installed. If you do not have a cluster, you can create a minikube cluster and install Pixie using one of our [install guides](https://docs.px.dev/installing-pixie/install-guides/).

2. You will need to install the Kafka microservices demo application:

> - Install the [Pixie CLI](/installing-pixie/install-schemes/cli/#1.-install-the-pixie-cli).
> - Run `px demo deploy px-kafka` to install the demo app.
> - Run `kubectl get pods -n px-kafka` to make sure all pods are ready before proceeding.
> - Run `px demo interact px-kafka` and follow the directions to turn on the invoicing service delay.

## Kafka Microservice Demo App

The demo application deployed in the [Prerequisites](#prerequisites) section has three microservices that use Kafka to communicate:

- The `order` service creates orders. This service publishes messages to the `order` topic.
- The `shipping` service consumes the `order` topic messages and extracts the information needed to ship the items. This service is able to consume the `order` topic messages at the rate they are produced.
- The `invoicing` service consumes the `order` topic messages and extracts the information needed to send out an invoice. This service, when configured with the delay in the Prereqs step, is slower and unable to consume the `order` topic messages at the rate they are produced.

::: div image-xl relative
<svg title='' src='use-case-tutorials/kafka/kafka-microservice-app.png'/>
:::

To see the application's simple front end, navigate to the external IP (and port) of the `apache` service:

```bash
kubectl -n px-kafka get svc apache
```

The application has 3 pages: one each for the `order`, `shipping` and `invoicing` services. A load generator simulates a user adding orders to the Order page. Orders can also be manually entered by scrolling to the bottom of the Order page and selecting the `"Add Order"` button. Any orders added on the Order page should soon show up on both the Shipping and Invoicing pages.

## Topic-centric Flow Graph

Let's use Pixie to see a graph of producers and consumers for each Kafka topic.

1. Select `px/kafka_overview` from the script drop-down menu.

2. Select the drop-down arrow next to the `namespace` argument, type `px-kafka`, and press `Enter` to re-run the script.

::: div image-xl relative
<svg title='' src='use-case-tutorials/kafka/kafka-overview.png'/>
:::

> Pixie is able to automatically discover and list all clients and topics in the cluster.

> This graph shows us that our microservice app has 1 active topic, named `order`, with 1 producer and 2 consumers.

3. Hover over an edge on the graph to see throughput and total record Bytes for a producer or consumer. The thickness of the edge indicates an increase in throughput.

> By examining the edges of the graph, we can see that the producer is producing to the order topic at about `450 B/s`. The `shipping` client is consuming at the same rate of `450 B/s`. The `invoicing` client is only consuming at `200 B/s` and is falling behind. Since this is a demo application, the traffic throughput is lower than what you'd typically see in a production application.

> The **Kafka Topics** table below the graph summarizes the same high-level topic information, and also includes the number of topic partitions.

4. Scroll down the page to see tables listing the brokers, producer and consumer pods.

::: div image-xl relative
<svg title='' src='use-case-tutorials/kafka/kafka-overview-2.png'/>
:::

> The **Kafka Producer Pods** and **Kafka Consumer Pods** tables confirm that the `invoicing` client is consuming messages at a slower speed than they are being produced.

> In our case, the `shipping` client has sent 292 `Fetch` requests while the `invoicing` client has sent much fewer (only 192 `Fetch` requests). This again indicates that something is wrong.

> When debugging Kafka problems, you may want to check the health of the clients involved. Pixie makes it easy to switch between higher-level Kafka system metrics and the lower-level client infra metrics.

5. To check the health of the `invoicing` client, click on the `px-kafka/invoicing-*` pod name in the **POD** column of the **Kafka Consumer Pods** table.

> Clicking on any pod name will take you to the `px/pod` script for that pod. This script shows an overview of the pod's CPU usage, network traffic and throughput, disk, and memory usage.

> In this case, CPU utilization is low, which means resource starvation is not causing the `invoicing` client to consume messages at a slower rate.

## Kafka Events with Metadata

Let's inspect the raw Kafka requests flowing through the cluster.

1. Select `px/kafka_data` from the script drop-down menu.

> Pixie [automatically traces](https://docs.px.dev/about-pixie/pixie-ebpf/) all messages flowing through your cluster, identify the ones using the Kafka protocol, and parses the message metadata. This script shows a sample of the most recent Kafka events in the cluster.

> For each record you can see the source, destination, request command, request and response, and the latency. Note that Pixie only shows the size of the payload, not the content, because it's usually too large.

::: div image-xl relative
<svg title='' src='use-case-tutorials/kafka/kafka-data.png'/>
:::

2. Click the `TIME_` column title to sort by time.

> We can see that there are multiple Kafka request commands being traced by Pixie, such as `Produce`, `Fetch`, `OffsetCommit`, and `Heartbeat`.

3. Click on a table row with the `Produce` `REQ_CMD` to inspect the parsed request and response body in JSON format.

> Pixie parses the request body and gives us information on the name of the topic, what partition it is producing to and the total size of the message set. Inspecting the response shows us if there's any error code coming back from the Kafka broker, base offset, log append time, etc.

This script is useful for inspecting a specific request or filtering all requests by a certain command (you'll need to [edit the PxL script](https://docs.px.dev/using-pixie/using-live-ui/#write-your-own-pxl-scripts-edit-an-existing-script) to do that).

## Producer Consumer Latency

Producer consumer latency is the time between when a producer pushes a message to a topic to when it is fetched by a consumer. This latency is important to monitor because many incidents begin with consumer lag.

A large consumer lag in one component can mean that it is out of sync with other components. In our demo application, the `invoicing` service is not consuming messages from the `order` topic as quickly as the `shipment` service is. If you check the application front-end, you will see orders on the Shipment page that are not present on the Invoicing page. If not addressed, this application may fail to create invoices for all of the orders it receives and lose out on money owed for the orders that  successfully shipped.

1. Select `px/kafka_producer_consumer_latency` from the script drop-down menu.

2. Select the drop-down arrow next to the `namespace` argument, type `px-kafka`, and press `Enter` to re-run the script.

> The **Kafka Topics** table will update to show the topics being written and read to by clients in this namespace. The table lists our single `order` topic.

3. Select the drop-down arrow next to the `topic` argument, type `order`, and press `Enter` to re-run the script.

::: div image-xl relative
<svg title='' src='use-case-tutorials/kafka/kafka-producer-consumer-latency.png'/>
:::

<Alert variant="outlined" severity="info">If you don't see the sawtooth waveform seen here, make sure you turned on the `invoicing` service delay in the last step of the Prerequisites section.</Alert>

> The **Kafka Producers** and **Kafka Consumers** tables show us that we have 1 producer and 2 consumers for this topic.

> The **Kafka Producer-Consumer Delay (Seconds)** graph plots the delay between when the producer pushes messages to the `order` topic and the consumers fetch them.

4. Let's examine the `shipping` consumers. Select the drop-down arrow next to the `consumer` argument, type `shipping`, and press `Enter` to re-run the script.

::: div image-xl relative
<svg title='' src='use-case-tutorials/kafka/kafka-producer-consumer-latency-shipping.png'/>
:::

> The graph updates to show a flat line. This tells us that there is near zero latency between when the `order` topic messages are being produced and when all 5 `shipping` partitions are consuming the messages.

5. Let's examine the `invoicing` consumers. Select the drop-down arrow next to the `consumer` argument, type `invoicing`, and press `Enter` to re-run the script.

::: div image-xl relative
<svg title='' src='use-case-tutorials/kafka/kafka-producer-consumer-latency-invoicing.png'/>
:::

> The graph updates to show non-zero latency for all 5 `invoicing` partitions. All 5 partitions are consuming `order` topic messages around 40-55 seconds after they are being produced.

> The zig zag line shape is due to the `invoicing` consumer fetching a batch of messages from the topic, processing these messages slowly, then fetching another group of messages and being even more behind. The overall trend is upward; there is increasing producer-consumer lag for the `invoicing` consumer. This is a bad sign and it could end in data loss or affect the whole cluster if it isn’t addressed.

## Consumer Rebalancing Duration

Consumer rebalancing (shuffling the consumers among partitions) can happen for a variety of reasons, including when a new consumer comes online, an existing consumer goes offline or a broker reboots.

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

## Related Scripts

This tutorial demonstrated a few of Pixie's [community scripts](https://github.com/pixie-io/pixie/tree/main/src/pxl_scripts). To learn how to write your own PxL script, check out the [tutorial](/tutorials/pxl-scripts/write-pxl-scripts).
