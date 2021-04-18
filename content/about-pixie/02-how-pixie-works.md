---
title: "How Pixie Works"
metaTitle: "About Pixie | How Pixie Works"
metaDescription: "Overview of Pixie's product architecture"
order: 2
---

Pixie's magical developer experience is enabled by the **Pixie Platform**, an edge machine intelligence system designed for secure and scalable auto-telemetry.

## Architecture

The platforms key primitives are:

- **Pixie Command Driven Interfaces** End-user facing Pixie CLI and Live UI for programmatic data and visualization access.
- **Pixie Vizier Module:** Deployed as a set of K8s services within the monitored cluster. They are responsible for script execution, data aggregation, data integration, and data backup.
- **Pixie Edge Modules (PEM):** Deployed as DaemonSets, PEMs leverage Pixie's eBPF collector to collect network transactions and system metrics without any code changes.
- **Pixie Control Cloud:** Pixie hosted and managed control plane used to support auth, metadata tracking, and "passthrough" deployment mode.

The system-level design is shown below:

::: div image-xl
<svg title='Platform Architecture' src='product-arch.svg' />
:::

## Data Transfer Modes

The connection mode between the Vizier Module and Control Cloud is dependent on how Pixie is deployed. To configure Pixie's data transfer mode, see the [instructions here](/installing-pixie/data-transfer-mode).

### Data Isolation Mode

In this scheme, the browser directly proxies into the Pixie Vizier Module and no customer data is transferred to Pixie's Control Cloud. Communication to Pixie's Control Cloud is limited to account and Kubernetes control data.

### Data Passthrough Mode

In this scheme, data flows through the Control Cloud via a reverse proxy as encrypted traffic without any persistence. This allows users to access data without being in the same VPC/network and avoids connectivity issues between the browser and the cluster. This is set as the default scheme in Pixie Community.

## Performance Overhead

The Pixie Platform collects data with less than 5% CPU overhead and latency degradation. As shown [here](https://docsend.com/view/zbini44), the effective overhead attains steady state ~2% in environments running any substantial workloads. This is dramatically more efficient than legacy monitoring systems.

## Multi-Cluster Scale-out (coming soon)

Pixie Platform's distributed architecture allows deployment spanning multiple clusters, clouds and deployment platforms.

As shown in the architecture, this is achieved by deploying PEM's in Linux nodes in both K8s or non-K8s clusters which are connected to Pixie Vizier Modules.

_Note: Support for central Pixie Vizier Module and PEM deployments in non-K8s linux nodes have not yet been launched_
