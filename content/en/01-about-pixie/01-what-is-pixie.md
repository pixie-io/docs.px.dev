---
title: "Pixie Overview"
metaTitle: "About Pixie | Pixie Overview"
metaDescription: "Motivation, goals and use-cases"
order: 1
redirect_from:
    - /about-pixie/how-pixie-works
---

Pixie is an open source observability tool for Kubernetes applications. Pixie uses [eBPF](/about-pixie/pixie-ebpf) to automatically capture telemetry data without the need for manual instrumentation.

Developers can use Pixie to view the high-level state of their cluster (service maps, cluster resources, application traffic) and also drill-down into more detailed views (pod state, flame graphs, individual full body application requests).

Pixie was contributed by [New Relic, Inc.](https://newrelic.com/) to the [Cloud Native Computing Foundation](https://www.cncf.io/) as a sandbox project in June 2021.

## Features

* **Auto-telemetry**: Pixie uses eBPF to automatically collect telemetry data such as full-body requests, resource and network metrics, application profiles, and [more](/about-pixie/data-sources).

* **In-cluster edge compute**: Pixie collects, stores and queries all telemetry data [locally in the cluster](/about-pixie/faq#where-does-pixie-store-its-data). Pixie uses less than 5% of cluster CPU, and in most cases less than 2%.

* **Scriptability**: [PxL](/reference/pxl/), Pixie’s flexible Pythonic query language, can be used across Pixie’s UI, CLI, and client APIs. Pixie provides a set of [community scripts](https://github.com/pixie-io/pixie/tree/main/src/pxl_scripts) for common [use cases](/tutorials/pixie-101).

## Architecture

::: div image-xl
<svg title='Platform Architecture' src='product-arch.svg' />
:::

The Pixie platform consists of multiple components:

* **Pixie Edge Module (PEM)**: Pixie's agent, installed per node. PEMs use eBPF to collect data, which is stored locally on the node.

* **Vizier**: Pixie’s collector, installed per cluster. Responsible for query execution and managing PEMs.

* **Pixie Cloud**:  Used for user management, authentication, and proxying “passthrough” mode. Can be hosted or self-hosted.

* **Pixie CLI**: Used to deploy Pixie. Can also be used to run queries and manage resources like API keys.

* **Pixie Client API**: Used for programmatic access to Pixie (e.g. integrations, Slackbots, and custom user logic requiring Pixie data as an input)
