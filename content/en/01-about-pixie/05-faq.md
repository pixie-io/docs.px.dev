---
title: "FAQ"
metaTitle: "About Pixie | FAQ"
metaDescription: "Commonly asked questions about Pixie."
order: 5
---

**General**

- [What is Pixie?](#general-what-is-pixie)
- [Who created Pixie?](#general-who-created-pixie)
- [What license is Pixie released under?](#general-what-license-is-pixie-released-under)
- [Which K8s environments are supported?](#general-which-k8s-environments-are-supported)
- [Can I completely self-host Pixie?](#general-can-i-completely-self-host-pixie)
- [Is there a hosted cloud offering?](#general-does-pixie-offer-a-hosted-cloud-offering)

**Data Collection**

- [Where does Pixie store its data?](#data-collection-where-does-pixie-store-its-data)
- [How much data does Pixie store?](#data-collection-how-much-data-does-pixie-store)
- [How does Pixie secure its data?](#data-collection-how-does-pixie-secure-its-data)
- [What data does Pixie collect?](#data-collection-what-data-does-pixie-collect)
- [Which protocols are automatically traced?](#data-collection-which-protocols-are-automatically-traced)
- [Which types of K8s resources, metadata are supported?](#data-collection-which-types-of-k8s-resources-metadata-are-supported)
- [Can I capture full distributed traces (a single request across multiple services)?](#data-collection-can-i-capture-requests-if-one-of-the-endpoints-is-outside-the-cluster)
- [Can I capture requests if one of the endpoints is outside the cluster?](#data-collection-can-i-capture-requests-if-one-of-the-endpoints-is-outside-the-cluster)
- [Can I capture system metrics like CPU?](#data-collection-can-i-capture-system-metrics-like-cpu)
- [What is the performance impact?](#data-collection-what-is-the-performance-impact)
- [Which languages are supported for continuous profiling?](#data-collection-which-languages-are-supported-for-continuous-profiling)

**How do I…**

- [How do I export data from the Pixie platform? Import data?](#how-do-i...-how-do-i-export-data-from-the-pixie-platform-import-data)
- [How do I share a Pixie dashboard with others?](#how-do-i...-how-do-i-share-a-pixie-dashboard-with-others)
- [How do I set up RBAC?](#how-do-i...-how-do-i-set-up-rbac)
- [How do I send alerts?](#how-do-i...-how-do-i-send-alerts)
- [How do I delete a cluster?](#how-do-i...-how-do-i-delete-a-cluster)

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

Pixie stores the data it collects in-memory on the nodes in your cluster; no data is sent to a centralized backend outside of the cluster. This is true for both self-hosted Pixie and [Pixie Community Cloud](#general-does-pixie-offer-a-hosted-cloud-offering).

Pixie has a [1GiB memory requirement](/installing-pixie/requirements/#memory) per node. After installing Pixie, it is normal to see a temporary increase in memory usage of the `vizier-pem` pods as they begin to fill their [data tables](/reference/datatables/).

### How much data does Pixie store?

Retention time depends on the level of traffic in your cluster, but will generally be on the order of hours. Each [data table](/reference/datatables/) in Pixie (e.g. `http_events`) has its own maximum size. These tables collect data until the maximum size is reached, and then begin dropping the oldest data.

Pixie's [Plugin System](/reference/plugins/plugin-system) integrates with third-party observability tools to provide long-term retention.

### How does Pixie secure its data?

Pixie stores the telemetry data it collects in-memory on the nodes in your cluster. Data processing and script execution are also performed in the cluster. End-to-end encryption is offered for data in flight between in-cluster storage and presentation in the UI, CLI, and API.

Pixie Cloud (self-hosted or Pixie Community Cloud) hosts the UI and stores limited metadata related to account (user, organization) and Kubernetes control data (cluster name, number of nodes, etc). All communication with Pixie Cloud is TLS encrypted.

Data flows through Pixie's Cloud via a reverse proxy as encrypted traffic without any persistence. This allows developers to access data without being in the same network as the cluster.

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

Pixie's [continuous profiler](/tutorials/pixie-101/profiler/) currently supports Go, C++, Rust and Java. The [Roadmap](/about-pixie/roadmap) contains plans to expand support to other languages.

## How do I...?

### How do I export data from the Pixie platform? Import data?

Pixie offers two [client libraries](/reference/api/overview/) (Go, Python) to allow developers to easily integrate Pixie observability data into their existing stack. You can also use Pixie's [Plugin System](/reference/plugins/plugin-system/) to [export data in the OpenTelemetry format](/tutorials/integrations/otel/). Pixie does not currently offer data ingestion. The [Roadmap](/about-pixie/roadmap) contains plans to support exporting or ingesting data in a variety of additional formats.

### How do I share a Pixie dashboard with others?

See the [User Management & Sharing](/reference/admin/user-mgmt) reference docs.

### How do I set up RBAC?

Pixie does not yet offer full RBAC support. However, you can enable “Approvals” under the <CloudLink url="/admin/org">Org Settings</CloudLink> tab on the admin page. This requires each user who registers in the org to be manually approved on the <CloudLink url="/admin/users">Users</CloudLink> tab before they can log in.

### How do I send alerts?

Pixie does not offer alerting. However, alerts can be set up using Pixie’s API. For example, see the [Slackbot Alert Tutorial](/tutorials/integrations/slackbot-alert/).

In the future, Pixie's [Plugin System](/reference/plugins/plugin-system) will integrate with third-party observability tools to provide alerts using Pixie data.

### How do I delete a cluster?

The UI does not currently support deleting clusters. If you’d like to rename your cluster, you can redeploy Pixie with the cluster name flag. See the [install guides](/installing-pixie/install-schemes/) for specific instructions.
