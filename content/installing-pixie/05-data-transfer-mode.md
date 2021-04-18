---
title: "Configure Data Transfer Mode"
metaTitle: "Install | Configure Data Transfer Mode"
metaDescription: "Configure Pixie's data transfer mode."
order: 5
---

Pixie supports two methods for accessing your cluster's data from the [Live UI](https://work.withpixie.ai/). More information on these two modes can be found [here](/about-pixie/how-pixie-works/#data-transfer-modes). 

## Data Passthrough Mode (Default)

In data passthrough mode, your cluster's data flows through Pixie's control cloud via a reverse proxy as encrypted traffic without any persistence. This allows users to access data without being in the same VPC/network and is the default mode for Pixie. The [admin page](https://work.withpixie.ai/admin) of Pixie's Live UI, will show your cluster's mode as "Passthrough". 

::: div image-xl
<svg title='Admin page showing Passthrough mode.'  src='data-mode/passthrough.png' />
:::

## Data Isolation Mode

In data isolation mode, the browser directly proxies into Pixie's Vizier module in your cluster. To see data in the Live UI, you must be behind your cluster's firewall.

To configure your cluster to use Data Isolation Mode, use Pixie's CLI tool to

1. Get your cluster's ID:

```
px get viziers
```

::: div image-xl
<svg title='Access your cluster id using the `px get viziers` command.'  src='data-mode/cluster-id.png' />
:::

2. Switch from Passthrough Mode (default) to Data Isolation Mode. Don't forget to copy in your cluster's id.

```
px config update -c <YOUR_CLUSTER_ID> --passthrough=false
```

The [admin page](https://work.withpixie.ai/admin) of Pixie's Live UI, now shows the cluster's mode as "Direct". 

::: div image-xl
<svg title='Admin page showing Data Isolation (Direct) mode.'  src='data-mode/direct.png' />
:::

