---
title: "Roadmap"
metaTitle: "About Pixie | Roadmap"
metaDescription: "Pixie's vision and roadmap."
order: 4
---

## Vision

Our vision is to build a product that enables software developers to engineer the systems of the future. To start we are:

- **Eliminating grunt work**: to improve developer efficiency and happiness by building an observability platform that eliminates the work required to monitor your applications. 

- **Building a product for developers by developers**. At Pixie it’s our goal to make solving easy problems easy, and solving hard problems possible. With that in mind we strive to be useful out of the box, but allow for easy extensibility through an open API and Python based programming language.

- **Building a community**: Pixie Community is free forever. By making the majority of our product free for individuals to use, as well as open sourcing all of our scripts, we hope to build a community knowledge base of data-driven tools to observe, debug and manage applications. 


## Guiding Principles

- **Store useful data only**: Developers waste far too much time and money building centralized data systems to truck around telemetry which is mostly useless. Moving data closer to the source and storing only useful live data with summarized historicals allows us to enable edge-ML on unsampled data, scale faster and fundamentally change the unit-economics of telemetry systems.

- **Auto-collect baseline data**: Months of engineering time are in adding language specific instrumentation across codebases in order to get visibility. Pixie avoids this by collecting baseline metrics, traces, logs and events without code changes while exposing tooling to ingest custom last-mile telemetry as needed.

- **Programmatic data access**: Exploration, debugging, and analysis workflows typically require manual configuration and navigation through siloed GUIs. Pixie exposes a unified data layer, and analysis signals via an expressive API which enables efficient developer workflows and frees up data to build powerful integrations.


## Roadmap
Pixie is already deployed in production environments at internet scale companies. Our goal over the next two years is to expand the current capabilities of the product: data collection, data import/export and edge AI. We are also working on hardening and performance improvements for very large Kubernetes clusters. 

Internally Pixie is composed of many different sub-components: data collection, data processing, cloud, and the CLI. We plan to publish a roadmap for each of these components by mid May. The roadmap is a tentative plan that drives feature work for the Pixie project. This plan is subject to revision and change as a result of changing priorities. 

### Expand Data Collection
Pixie currently provides rich, instant out-of-the-box visibility with basic metrics, infrastructure, and network traffic. We plan to expand our data collection to other forms of data, such as logs, full traces, and custom metrics. We also plan to improve for vm based & dynamic languages, including Java and interpreted languages such as Ruby and Python.

### Improve Kubernetes Support
Pixie currently supports integration with basic Kubernetes resources, such as namespaces, services, and pods. We aim to expand this to other Kubernetes resources, including events. 

### Expand Edge ML/AI
Pixie’s edge compute engine allows us to apply ML/AI on unsampled data. We will expand on our applications of edge ML/AI, including detection of anomalous/interesting data, data compression, and more. 

### Support the ecosystem
Pixie has a versatile execution engine which can ingest and export data in a variety of formats. We plan to export and ingest data in the OpenTelemetry format which will enable developers to consume Pixie data in other tools (Jaeger, Prometheus) and use the Pixie to explore data from other sources, respectively. This work includes providing a Pixie API to enable API integrations, such as a Grafana plugin.
