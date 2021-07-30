---
title: "Pixie Overview"
metaTitle: "About Pixie | Pixie Overview"
metaDescription: "Motivation, goals and use-cases"
order: 1
redirect_from:
    - /about-pixie/how-pixie-works
---

Pixie is an open source observability tool for Kubernetes applications. Pixie uses eBPF to automatically capture its telemetry data without the need for manual instrumentation.

Using Pixie, developers can view the high-level state of their cluster (service maps, cluster resources, application traffic) and also drill-down into more detailed views (pod state, flame graphs, individual application requests).

Pixie was contributed by New Relic to the CNCF as a sandbox project in June 2021.

## Features

* **Auto-telemetry**: Using [eBPF](http://www.brendangregg.com/ebpf.html), Pixie automatically collects telemetry data such as full-body requests, resource metrics, and network statistics.

* **In-cluster edge compute**: Pixie runs directly on the Kubernetes cluster and stores all telemetry data locally. Pixie uses less than 5% of cluster CPU, and in most cases less than 2%.

* **Scriptability**: [PxL](/reference/pxl/), Pixie’s flexible, Pythonic query language, can be used across Pixie’s UI, CLI, and client APIs.

## Data Sources

When Pixie is deployed on a Kubernetes cluster, it uses eBPF to automatically collect a rich set of data sources. These include full-body requests traces, resource and network metrics, and application profiles.

A full list of Pixie's supported datasources can be found [here](/about-pixie/data-sources).

## System Architecture

::: div image-xl
<svg title='Platform Architecture' src='product-arch.svg' />
:::

* **Pixie Edge Module (PEM)**: Pixie's agent, installed per node. PEMs use eBPF to collect data, which is stored locally on the node.

* **Vizier**: Pixie’s collector, installed per cluster. Responsible for query execution and managing PEMs.

* **Pixie Cloud**:  Used for user management, authentication, and proxying “passthrough” mode. Can be hosted or self-hosted.

* **Pixie CLI**: Used to deploy Pixie. Can also be used to run queries and manage resources like API keys.

* **Pixie Client API**: Used for programmatic access to Pixie (e.g. integrations, Slackbots, and custom user logic requiring Pixie data as an input)
