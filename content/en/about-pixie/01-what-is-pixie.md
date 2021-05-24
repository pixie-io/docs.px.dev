---
title: "Pixie Overview"
metaTitle: "About Pixie | Pixie Overview"
metaDescription: "Motivation, goals and use-cases"
order: 1
---

## Why build Pixie now?

We now build applications as decoupled software systems for velocity, agility and scale. However, we continue to waste hours wrangling the data we need to explore, debug and manage them.

Couldn't we build data systems which do the grunt work for us and free us up to focus on shipping amazing customer experiences instead?

## How could we avoid grunt work?

We need to take three technological leaps to improve developer efficiency and joy:

- **Auto-collect baseline data:** Months are lost today in adding language specific instrumentation across our codebases to get visibility. We can avoid this by collecting baseline metrics, traces, logs and events without code changes while exposing tooling to ingest custom last-mile telemetry as needed.

- **Programmatic data access:** Exploration, debugging, and analysis workflows typically require manual configuration and navigation through siloed GUIs. Pixie exposes a unified data layer, and analysis signals via an expressive API which enables efficient developer workflows and frees up data to build powerful integrations.

- **Store useful data only:** We waste far too much time and money building centralized data systems to truck around telemetry which is mostly useless. Moving data closer to the source and storing only useful live data with summarized historicals would allow us to enable edge-ML on unsampled data, scale faster and fundamentally change the unit-economics of telemetry systems.

## How does Pixie save time?

Pixie gives instant, programmatic and unified access to application performance data and signals without needing to change code, configure manual GUIs or move data off-cluster.

Application-developers, Platform/Infra engineers and DevOps/SREs use Pixie to efficiently run a wide range of [analyses](/using-pixie/). Some of the most popular ones are:

- Log Go/C++/Rust applications without stopping production code.
- Access standardized performance metrics for all services and K8s entities.
- Trace and cluster full-body network requests.
- View and analyze raw database queries.
- Profile performance of builds in CI.
- Track utilization of K8s infrastructure primitives

As shown in the illustration below, this magical developer experience is powered by Pixie's distributed edge intelligence platform which we'll describe in detail in the [next section](/about-pixie/how-pixie-works/).

::: div image-xl
<svg title='Pixie Platform' src='pixie-overview.png' />
:::

_If you want to learn more about us check out our [website](https://pixielabs.ai/) or our [overview deck](https://docsend.com/view/kj38d76)_
