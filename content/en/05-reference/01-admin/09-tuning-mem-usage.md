---
title: "Tuning Memory Usage"
metaTitle: "Reference | Admin | Tuning Memory Usage"
metaDescription: "Tuning Pixie vizier-pem memory usage"
order: 9
---

One of Pixie's unique features is that it collects, stores and queries all telemetry data *locally in your cluster*. Unless you choose to configure a [plugin](/reference/plugins/plugin-system/) or export data using [Pixie's API](/reference/api/overview/), no telemetry data is transferred to a centralized backend outside of the cluster.

The component responsible for collecting and storing the telemetry data in your cluster is called a [PEM](/reference/architecture/#vizier-components) (Pixie Edge Module).
When Pixie is installed, a `vizier-pem` data collector pod is deployed to each node in your cluster via a DaemonSet. By default, `vizier-pem` pods have a `2Gi` memory limit (but this can be configured to be lower or higher).

After installing Pixie, it is normal to see an increase in memory usage of the `vizier-pem` pods as they begin storing telemetry data. Once the `vizier-pem`'s memory limit is reached, old telemetry data is expired to make room for new data and memory utilization should not increase any further.

## How does Pixie use memory?

Pixie's `vizier-pem` pods use memory for two main purposes:

- **Collecting telemetry data**: Tracing application traffic, collecting CPU profiles, etc. requires that those those values are stored in memory somewhere as they are processed.

- **Storing telemetry data (short-term)**: After processing, telemetry data is stored in [data tables](/reference/datatables/) in-memory on the nodes in your cluster. Each data table in Pixie (e.g. http_events) has its own maximum size. These tables collect data until the maximum size is reached, and then begin dropping the oldest data. Retention time depends on the level of traffic in your cluster, but will generally be on the order of hours. See the [FAQ](/about-pixie/faq/#data-collection-how-much-data-does-pixie-store) for long-term data storage solutions.

By default, `vizier-pem` pods reserve 60% of their allocated memory for short-term data storage (leaving the other 40% for the collection). For the default `2Gi` memory limit, `vizier-pem` pods will reserve `1.2Gi` memory for data storage.

For developers with [long-term data storage](/about-pixie/faq/#how-do-i...-how-do-i-export-data-from-the-pixie-platform-import-data), Pixie can be configured to allocate less memory for data storage.

### If Pixie stores data locally, why does it have a cloud component?

Pixie's [cloud](/reference/architecture/#cloud) component serves Pixie's API and UI to make it easy for developers to access telemetry data without being in the same network as the cluster. It also manages metadata in the system, such as orgs, users, and viziers. When you query the Pixie platform using the CLI, Live UI or API, your telemetry data flows through Pixie's Cloud via a reverse proxy as [end-to-end encrypted traffic](/about-pixie/faq/#data-collection-how-does-pixie-secure-its-data) without any persistence.

## Configure Pixie memory usage

The proper setting for Pixie's memory usage is dependent on your cluster / environment.

For most clusters, we recommend that you initially try deploying Pixie with the default (`2Gi`) memory limit. To accommodate your application pods, we recommend that this amount be no more than 25% of your nodes' total memory. So if you have `4Gi` total memory on your nodes, you'll want to use a `1Gi` memory limit.

If the default memory limit does not work for your cluster, check out the following:

- [How to deploy Pixie with a particular memory limit](#configure-pixie-memory-usage-how-can-i-deploy-pixie-with-a-particular-memory-limit)
- [If your `vizier-pem` pods fail to schedule during deployment, try reducing the memory request](#configure-pixie-memory-usage-why-did-the-vizier-pem-pods-fail-to-schedule)
- [If your `vizier-pem` pods get regularly OOMKilled, try increasing the memory limit](#configure-pixie-memory-usage-why-did-my-vizier-pem-pods-get-oomkilled)
- [If your nodes have limited memory and you are exporting Pixie data to long-term storage, try reducing the memory allocated to data storage](#configure-pixie-memory-usage-(advanced)-how-can-i-configure-vizier-pem-pods-to-reserve-more-or-less-memory-for-data-storage)

### How can I deploy Pixie with a particular memory limit?

The default memory limit is `2Gi` per PEM. The lowest recommended value is [`1Gi`](/installing-pixie/requirements/#memory) per PEM. `1Gi` is not a suitable limit for a cluster with high throughput, but may be suitable for a small cluster with limited resources.

To learn how to set Pixie's memory limit when deploying, see the [Deploy Options](/reference/admin/deploy-options#configure-pixie-memory-usage-setting-the-memory-limit) page.

### Why did the vizier-pem pods fail to schedule?

If your `vizier-pem` pods fail to schedule during installation, this is usually because there are node(s) in your cluster that do not have the requested amount of memory. In this situation, you can try reducing the memory [request](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#requests-and-limits) down as far as `1Gi`. However, keep in mind that if it is a particularly large or active cluster, `1Gi` may not be sufficient for that particular cluster, and some PEM OOMKills might occur, so it might be good to set a higher limit than request, such as `2Gi` for the limit. `1Gi` limit deployments are recommended for smaller clusters with less traffic.

To learn how to set Pixie's memory request when deploying, see the [Deploy Options](/reference/admin/deploy-options#configure-pixie-memory-usage-setting-the-memory-request) page.

### Why did my vizier-pem pods get OOMKilled?

Part of the benefit of deploying on Kubernetes is that Kubernetes will OOMKill pods that are using too many resources in order to protect the other pods in the cluster. When Pixie is OOMKilled, this means that it is exceeding the memory limit. This is a step that Kubernetes takes to protect the other applications, and therefore will not cause problems on the other pods. For PEMs that are regularly OOMKilling at `2Gi` or greater memory, feel free to file a GitHub issue. A good next step here is usually to [deploy Pixie with more memory](/reference/admin/deploy-options#configure-pixie-memory-usage-setting-the-memory-limit) and see if it reaches a stable state for memory.

### (Advanced) How can I configure vizier-pem pods to reserve more or less memory for data storage?

As discussed [above](#how-does-pixie-use-memory), Pixie's `vizier-pem` data collector pods use memory for two main purposes: collecting data and storing data. By default, `vizier-pem` pods reserve 60% of their allocated memory for short-term data storage (leaving the other 40% for the collection). For the default `2Gi` memory limit, this means that a `vizier-pem` pod will reserve `1.2Gi` memory for data storage.

To reduce Pixie's memory footprint, developers with a [long-term data storage](/about-pixie/faq/#how-do-i...-how-do-i-export-data-from-the-pixie-platform-import-data) solution can configure Pixie to use less memory for short-term data storage on the node.

To learn how to set Pixie's data store memory limit when deploying, see the [Deploy Options](/reference/admin/deploy-options#configure-pixie-memory-usage-setting-the-data-table-storage-memory-limit) page.
