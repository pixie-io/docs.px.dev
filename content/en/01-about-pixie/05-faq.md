---
title: "FAQ"
metaTitle: "About Pixie | FAQ"
metaDescription: "Commonly asked questions about Pixie."
order: 5
---

### General

- [What is Pixie?](/about-pixie/faq#what-is-pixie)
- [Who created Pixie?](/about-pixie/faq#who-created-pixie)
- [What license is Pixie released under?](/about-pixie/faq#what-license-is-pixie-released-under)
- [Which K8s environments are supported?](/about-pixie/faq#which-k8s-environments-are-supported)
- [Can I completely self-host Pixie?](/about-pixie/faq#can-i-completely-self-host-pixie)
- [Is there a hosted cloud offering?](/about-pixie/faq#does-pixie-offer-a-hosted-cloud-offering)

### Data Collection

- [Where does Pixie store its data?](/about-pixie/faq#where-does-pixie-store-its-data)
- [How much data does Pixie store?](/about-pixie/faq#how-much-data-does-pixie-store)
- [How does Pixie secure its data?](/about-pixie/faq#how-does-pixie-secure-its-data)
- [What data does Pixie collect?](/about-pixie/faq#what-data-does-pixie-collect)
- [Which protocols are automatically traced?](/about-pixie/faq#which-protocols-are-automatically-traced)
- [Which types of K8s resources, metadata are supported?](/about-pixie/faq#which-types-of-k8s-resources-metadata-are-supported)
- [Can I capture full distributed traces (a single request across multiple services)?](/about-pixie/faq#can-i-capture-requests-if-one-of-the-endpoints-is-outside-the-cluster)
- [Can I capture requests if one of the endpoints is outside the cluster?](/about-pixie/faq#can-i-capture-requests-if-one-of-the-endpoints-is-outside-the-cluster)
- [Can I capture system metrics like CPU?](/about-pixie/faq#can-i-capture-system-metrics-like-cpu)
- [What is the performance impact?](/about-pixie/faq#what-is-the-performance-impact)
- [Which languages are supported for continuous profiling?](/about-pixie/faq#which-languages-are-supported-for-continuous-profiling)

### How do I…

- [How do I export data from the Pixie platform? Import data?](/about-pixie/faq#how-do-i-export-data-from-the-pixie-platform-import-data)
- [How do I share a Pixie dashboard with others?](/about-pixie/faq#how-do-i-share-a-pixie-dashboard-with-others)
- [How do I set up RBAC?](/about-pixie/faq#how-do-i-set-up-rbac)
- [How do I send alerts?](/about-pixie/faq#how-do-i-send-alerts)
- [How do I delete a cluster?](/about-pixie/faq#how-do-i-delete-a-cluster)

### Troubleshooting

- [How do I get the Pixie debug logs?](/about-pixie/faq#how-do-i-get-the-pixie-debug-logs)
- [My deployment is stuck / fails.](/about-pixie/faq#my-deployment-is-stuck-fails)
- [Why does my cluster show as unavailable / unhealthy in the Live UI?](/about-pixie/faq#why-does-my-cluster-show-as-unavailable-unhealthy-in-the-live-ui)
- [Why does my cluster show as disconnected in the Live UI?](/about-pixie/faq#why-does-my-cluster-show-as-disconnected-in-the-live-ui)
- [Why can’t I see data?](/about-pixie/faq#why-can't-i-see-data)
- [Why can’t I see data after enabling Data Isolation Mode?](/about-pixie/faq#why-can't-i-see-data-after-enabling-data-isolation-mode)
- [Why can’t I see application profiles / flamegraphs for my pod / node?](/about-pixie/faq#why-can't-i-see-application-profiles-flamegraphs-for-my-pod-node)
- [Why is the vizier-pem pod’s memory increasing?](/about-pixie/faq#why-is-the-vizier-pem-pod's-memory-increasing)
- [Troubleshooting tracepoint scripts.](/about-pixie/faq#troubleshooting-pixie-tracepoint-scripts)
- [How do I get help?](/about-pixie/faq#how-do-i-get-help)

## General

### What is Pixie?

Pixie is an open source observability tool for Kubernetes applications. See the [Overview](/about-pixie/what-is-pixie/).

### Who created Pixie?

Pixie was originally built by Pixie Labs. [New Relic, Inc.](https://newrelic.com/) acquired [Pixie Labs](https://pixielabs.ai/) in December 2020 and contributed Pixie to the [Cloud Native Computing Foundation](https://www.cncf.io/) as a sandbox project in June 2021.

### What license is Pixie released under?

Pixie is released under the [Apache 2.0](https://github.com/pixie-io/pixie/blob/main/LICENSE) license.

### Which K8s environments are supported?

Pixie has been tested to work with a variety of Kubernetes environments listed in the [requirements](/installing-pixie/requirements/) page. Just because Pixie hasn’t been tested on a specific environment, does not mean that Pixie won't work. If you’ve successfully deployed Pixie to an environment not currently listed, please [submit a PR](https://github.com/pixie-io/pixie-docs/blob/main/content/en/02-installing-pixie/01-requirements.md) to update the page.

### Can I completely self host Pixie?

Yes. See the self-hosted [Install Guide](/installing-pixie/install-guides/self-hosted-pixie) to get started.

### Does Pixie offer a hosted cloud offering?

Yes. Pixie Community Cloud is a hosted version of Pixie. Pixie stores all data on the customer's cluster, resulting in a very small cloud footprint which allows Pixie to offer the Community Cloud offering 100% free for all Pixie users. See the Community Cloud [Install Guide](/installing-pixie/install-guides/community-cloud-for-pixie) to get started.

## Data Collection

### Where does Pixie store its data?

Pixie stores the data it collects in-memory on the nodes in your cluster; no data is sent to a centralized backend outside of the cluster. This is true for both self-hosted Pixie and [Pixie Community Cloud](/about-pixie/faq#does-pixie-offer-a-hosted-cloud-offering).

Pixie has a [2GiB memory requirement](/installing-pixie/requirements/#memory) per node. After installing Pixie, it is normal to see a temporary increase in memory usage of the `vizier-pem` pods as they begin to fill their data tables.

### How much data does Pixie store?

Retention time depends on the level of traffic in your cluster, but will generally be on the order of hours. Each data table in Pixie (e.g. `http_events`) has its own maximum size. These tables collect data until the maximum size is reached, and then begin dropping the oldest data.

We recommend integrating with third-party observability tools (such as [New Relic’s integration](https://newrelic.com/platform/kubernetes-pixie)) to provide long-term retention.

### How does Pixie secure its data?

Pixie stores the telemetry data it collects in-memory on the nodes in your cluster. Data processing and script execution are also performed in the cluster. End-to-end encryption is offered for data in flight between in-cluster storage and presentation in the UI, CLI, and API.

Pixie Cloud (self-hosted or Pixie Community Cloud) hosts the UI and stores limited metadata related to account (user, organization) and Kubernetes control data (cluster name, number of nodes, etc). All communication with Pixie Cloud is TLS encrypted.

Pixie supports two modes for accessing data by the UI. In Passthrough Mode, data flows through Pixie's Cloud via a reverse proxy as encrypted traffic without any persistence. This convenience mode allows developers to access data without being in the same network as the cluster. In Data Isolation Mode, no data flows through Pixie Cloud, instead the browser directly proxies into Pixie's Vizier Module. For more info, see [Configuring Data Transfer Modes](/reference/admin/data-transfer-mode/).

### What data does Pixie collect?

Pixie automatically collects a variety of information from your cluster using eBPF and from Linux directly. The collected data includes:

- **Protocol traces**: Full-body messages between the pods of your applications.
- **Resource metrics**: CPU, memory and IO metrics for your pods.
- **Network metrics**: Network-layer and connection-level RX/TX statistics.
- **JVM metrics**: JVM memory management metrics for Java applications.
- **Application performance profiles**: Sampled stack traces from your applications to help identify application performance bottlenecks.

All this data is collected without requiring any manual application instrumentation. See the [Data Sources](/about-pixie/data-sources) page for additional information.

### Which protocols are automatically traced?

Pixie uses [eBPF](/about-pixie/pixie-ebpf) to automatically collect telemetry data for a [variety of protocols](/about-pixie/data-sources/).

### Which types of K8s resources, metadata are supported?

Pixie captures cluster, namespace, node, pod, service, and container metadata. Pixie does not yet capture logs or events.

### Can I capture full distributed traces (a single request across multiple services)?

Pixie captures spans, but not full traces. To construct a full trace a request would need to be tagged with a traceID and Pixie does not modify requests. The [Roadmap](/about-pixie/roadmap) contains plans to support constructing full traces if a request is already tagged with a traceID.

### Can I capture requests if one of the endpoints is outside the cluster?

Yes, Pixie can capture requests with only one endpoint within the cluster. For example, if a service makes a call to an external mySQL database which is not monitored by Pixie, Pixie will still be able to capture the SQL calls. However, for endpoints outside of the cluster, Pixie won’t be able to resolve the remote address to a pod/service name, so you’ll need to know the endpoint’s IP address.

### Can I capture system metrics like CPU?

Yes, Pixie captures machine-level resource metrics on Linux and other Unix systems such as CPU usage, memory, disk utilization and network bandwidth.

### What is the performance impact?

Typical performance overhead for node CPU usage is between 2-5%, depending on the amount and type of traffic. We are in the process of optimizing this, however, so watch for that to go down even further.

### Which languages are supported for continuous profiling?

Go, C++ and Rust are currently supported. The [Roadmap](/about-pixie/roadmap) contains plans to expand support to other languages.

## How do I...?

### How do I export data from the Pixie platform? Import data?

Pixie offers two [client libraries](/reference/api/overview/) (Go, Python) to allow developers to easily integrate Pixie observability data into their existing stack.

Pixie does not currently offer data ingestion.

The [Roadmap](/about-pixie/roadmap) contains plans to support exporting or ingesting data in a variety of additional formats.

### How do I share a Pixie dashboard with others?

*Self-hosted Pixie*

To share data from the same cluster, [send an invitation through the Admin UI](/installing-pixie/install-guides/self-hosted-pixie#invite-others-to-your-organization-(optional)).

*Community Cloud for Pixie*

To share data from the same cluster, both parties will need to register for Pixie accounts using emails from the same gsuite email domain. For example, if both parties sign up using a @mycompany.com email address, then both parties will automatically be grouped into the same mycompany org and see the same results.

### How do I set up RBAC?

Pixie does not yet offer full RBAC support. However, you can enable “Approvals” under the [Org Settings](https://work.withpixie.ai/admin/org) tab on the admin page. This requires each user who registers in the org to be manually approved on the [Users](https://work.withpixie.ai/admin/users) tab before they can log in.

### How do I send alerts?

Pixie does not offer alerting. However, alerts can be set up using Pixie’s API. For example, see the [Slackbot Alert Tutorial](/tutorials/integrations/slackbot-alert/).

For comprehensive alerting, we recommend integrating with third-party observability tools (such as New Relic’s integration).

### How do I delete a cluster?

The UI does not currently support deleting clusters. If you’d like to rename your cluster, you can redeploy Pixie with the cluster name flag. See the [install guides](/installing-pixie/install-schemes/) for specific instructions.

## Troubleshooting

### How do I get the Pixie debug logs?

Install Pixie’s [CLI tool](/installing-pixie/install-schemes/cli) and run `px collect-logs.` This command will output a zipped file named `pixie_logs_<datestamp>.zip` in the working directory. The selected kube-context determines the Kubernetes cluster that outputs the logs, so make sure that you are pointing to the correct cluster.

### My deployment is stuck / fails

*Deploy with CLI gets stuck at “Wait for PEMs/Kelvin”*

This step of the deployment waits for the newly deployed Pixie PEM pods to become ready and available. This step can take several minutes.

If some `vizier-pem` pods are not ready, use kubectl to check the individual pod’s events or check Pixie’s debug logs (which also include pod events).

If pods are still stuck in pending, but there are no Pixie specific errors, check that there is no resource pressure (memory, CPU) on the cluster.

*Deploy with CLI fails to pass health checks.*

This step of the deployment checks that the `vizier-cloud-connector` pod can successfully run a query on the `kelvin` pod. These queries are brokered by the `vizer-query-broker` pod. To debug a failing health check, check the Pixie debug logs for those pods for specific errors.

*Deploy with CLI fails waiting for the Cloud Connector to come online.*

This step of the deployment checks that the Cloud Connector can successfully communicate with Pixie Cloud. To debug this step, check the Pixie debug logs for the `vizier-cloud-connector` pod, check the firewall, etc.

### Why does my cluster show as unavailable / unhealthy in the Live UI?

Confirm that all of the `pl` and `px-operator` namespace pods are ready and available using `px debug pods`. Deploying Pixie usually takes anywhere between 5-7 minutes. Once Pixie is deployed, it can take a few minutes for the UI to show that the cluster is healthy.

To debug, follow the steps in the “Deploy with CLI fails to pass health checks” section in the [above question](/about-pixie/faq/#my-deployment-is-stuck-fails). As long as the Kelvin pod, plus at least one PEM pod is up and running, then your cluster should not show as unavailable.

### Why does my cluster show as disconnected in the Live UI?

`Cluster '<CLUSTER_NAME>' is disconnected. Pixie instrumentation on 'CLUSTER_NAME' is disconnected. Please redeploy Pixie to the cluster or choose another cluster.`

This error indicates that the `vizier-cloud-connector` pod is not able to connect to the cloud properly. To debug, check the events / logs for the `vizier-cloud-connector` pod. Note that after deploying Pixie, it can take a few minutes for the UI to show the cluster as available.

### Why can’t I see data?

*Live UI shows an error.*

Error `Table 'http_events' not found` is usually an issue with deploying Pixie onto nodes with unsupported kernel versions. Check that your kernel version is supported [here](/installing-pixie/requirements/).

Error `Invalid Vis Spec: Missing value for required arg service.` occurs when a script has a required argument that is missing a value. Required script arguments are denoted with an asterisk after the argument name. For example, px/service has a required variable for service name. Select the required argument drop-down box in the top left and enter a value.

Error `Unexpected error rpc error: code = Unknown desc = rpc error: code = Canceled desc = context canceled` is associated with a query timing out. Try reducing the `start_time` window.

*Live UI does not show an error, but data is missing.*

It is possible that you need to adjust the `start_time` window. The `start_time` window expects a negative relative time (e.g. `-5m`) or an absolute time in the format `2020-07-13 18:02:5.00 +0000`.

If specific services / requests are missing, it is possible that Pixie doesn't support the encryption library used by that service. You can see the list of encryption libraries supported by Pixie [here](/about-pixie/data-sources/#encryption-libraries).

If specific services / requests are missing, it is possible that your application was not built with [debug information](/reference/admin/debug-info). See the [Data Sources](/about-pixie/data-sources) page to see which protocols and/or encryption libraries require a build with debug information.

### Why can’t I see data after enabling Data Isolation Mode?

In [Data Isolation Mode](/reference/admin/data-transfer-mode/) Pixie doesn’t use a reverse proxy. Instead, the UI directly connects to the cluster using HTTP/2. Make sure that you have the correct firewall rules to allow this. The Cloud Connector will need to talk to Pixie cloud, but others can be blocked.

### Why can’t I see application profiles / flamegraphs for my pod / node?

Continuous profiling currently only supports Go/C++/Rust. The [Roadmap](/about-pixie/roadmap) contains plans to expand this support to Java, Ruby, Python, etc.

### Why is the vizier-pem pod’s memory increasing?

This is expected behavior. Pixie stores the data it collects in-memory on the nodes in your cluster; data is not sent to any centralized backend cloud outside of the cluster. So what you are observing is simply the data that it is collecting.

Pixie has a 2GiB memory requirement per node. This limit can be configured with the `--pemMemoryLimit` flag when deploying Pixie with the CLI/Helm. We do not recommend using a value less than 2GiB.

### Troubleshooting Pixie tracepoint scripts

*I’m not seeing any data for my distributed bpftrace script.*

Rather than query data already collected by the Pixie Platform, Distributed bpftrace Deployment scripts extend the Pixie platform to collect new data sources by deploying tracepoints when the script is run. The first time this type of script is run, it will deploy the probe and query the data (but there won't be much data at this point). Re-running the script after the probe has had more time to gather data will produce more results.

*I'm getting error that tracepoints failed to deploy.*

Run the `px/tracepoint_status` script. It should show a longer error message in the "Tracepoint Status" table.

*How do I remove a tracepoint table?*

It is not currently possible to remove a table. Instead, we recommend renaming the table name (e.g. table_name_0) while debugging the script.

### How do I get help?

Ask a question on our [Community Slack](https://slackin.px.dev/) or file an issue on [GitHub](https://github.com/pixie-io/pixie/issues).
