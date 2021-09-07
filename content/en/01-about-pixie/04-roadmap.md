---
title: "Roadmap"
metaTitle: "About Pixie | Roadmap"
metaDescription: "Pixie's roadmap for the near future."
order: 4
---

Pixie’s long-term vision is to be the data plane for Kubernetes clusters. Pixie should make machine data such as application traffic and cluster performance, accessible and useful to anyone using Kubernetes. As a result, we want to build up the following high-level capabilities:

### Expand Data Collection

Pixie currently provides rich, instant out-of-the-box visibility with basic metrics, infrastructure, and network traffic. We plan to expand our data collection to other forms of data, such as logs, full traces, and custom metrics. While we currently provide advanced code profiling for Go, C/C++, and Rust, we also plan to provide deeper support for other languages, such as Java, Ruby, and Python.

### Improve Kubernetes Support

Pixie currently supports integration with basic Kubernetes resources, such as namespaces, services, and pods. We aim to expand this to other Kubernetes resources, including events.

### Expand Edge ML/AI

Pixie’s edge compute engine allows us to apply ML/AI on unsampled data. We will expand on our applications of edge ML/AI, including detection of anomalous/interesting data, data compression, and more.

### Support the ecosystem

Pixie has a versatile execution engine which can ingest and export data in a variety of formats. We plan to export and ingest data in the OpenTelemetry format which will enable developers to consume Pixie data along with the data produced by other tools (Jaeger, Prometheus). We also plan to leverage our [client APIs](/reference/api) in order to support tighter integrations with other open source projects.

### Non-goals

We are building a data plane for Kubernetes rather than a full-fledged observability solution. Here are some of the items that we do not plan to tackle. Note that our API makes it possible to enable these use cases with downstream applications.

* Non-Kubernetes environments
* Alerting (available via Pixie’s New Relic One integration or [Slackbot](/tutorials/integrations/slackbot-alert) API integration)
* Advanced dashboarding (available with Pixie's [Grafana plugin](/reference/plugins/grafana))
* Long-term storage (available with [New Relic One integration](https://newrelic.com/platform/kubernetes-pixie))
