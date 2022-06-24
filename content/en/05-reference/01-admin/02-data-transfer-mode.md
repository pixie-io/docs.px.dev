---
title: "Configure Data Transfer Mode"
metaTitle: "Reference | Admin | Configure Data Transfer Mode"
metaDescription: "Configure Pixie's data transfer mode."
order: 2
redirect_from:
    - /admin/configuration/
    - /reference/admin/configuration/
    - /installing-pixie/data-transfer-mode
---

Pixie stores the data it collects in-memory on the nodes in your cluster. For more information, see the [FAQ](/about-pixie/faq/#data-collection-where-does-pixie-store-its-data).

Pixie supports two modes for accessing this data by the Live UI.

## Data Passthrough Mode (Default)

In data passthrough mode, your cluster's data flows through Pixie's control cloud via a reverse proxy as encrypted traffic without any persistence. This allows users to access data without being in the same VPC/network as the cluster.

Pixie offers [end-to-end encryption](/about-pixie/faq/#data-collection-how-does-pixie-secure-its-data) for telemetry data in flight.

When enabled, the Live UI [Admin Page](https://work.withpixie.ai/admin) will show your cluster's **Mode** as `Passthrough`.

::: div image-xl
<svg title='Admin page showing Passthrough mode.'  src='data-mode/passthrough.png' />
:::

## Data Isolation (Direct) Mode - DEPRECATED

<Alert variant="outlined" severity="warning">
  We will be removing support for Direct Mode on March 31, 2022. Existing clusters with Direct Mode enabled may continue using Direct Mode until support is discontinued, at which time the cluster will automatically be switched to Passthrough Mode. To manually switch a cluster from Direct to Passthrough mode, see the "Steps to Disable" in the section below. New and existing clusters without Direct Mode enabled will be prevented from enabling Direct Mode moving forward.
</Alert>

In Data Isolation Mode, the browser directly proxies into Pixie's Vizier Module and no customer data is transferred to Pixie's Control Cloud. Communication to Pixie's Control Cloud is limited to account and Kubernetes control data. See the [FAQ](/about-pixie/faq/#data-collection-how-does-pixie-secure-its-data) and [Architecture Diagram](/about-pixie/what-is-pixie/#architecture) for more details.

<Alert variant="outlined" severity="warning">
  Note that you must be behind your cluster's firewall to see data in the Live UI when Data Isolation Mode is enabled.
</Alert>

### Steps to Enable

To configure your cluster to use Data Isolation Mode, use Pixie's CLI tool to

1. Get your Cluster ID:

```bash
px get viziers
```

::: div image-xl
<svg title='Access your cluster id using the `px get viziers` command.'  src='data-mode/cluster-id.png' />
:::

2. Switch from Passthrough Mode (default) to Data Isolation Mode. Don't forget to copy in your Cluster ID.

```bash
px config update -c <YOUR_CLUSTER_ID> --passthrough=false
```

Once enabled, the Live UI [Admin Page](https://work.withpixie.ai/admin) will show your cluster's **Mode** as `Direct`.

::: div image-xl
<svg title='Admin page showing Data Isolation (Direct) mode.'  src='data-mode/direct.png' />
:::

### Steps to Disable

To switch from Data Isolation (Direct) Mode to Passthrough Mode, run:

```bash
px config update -c <YOUR_CLUSTER_ID> --passthrough=true
```

Once enabled, the Live UI [Admin Page](https://work.withpixie.ai/admin) will show your cluster's **Mode** as `Passthrough`.
