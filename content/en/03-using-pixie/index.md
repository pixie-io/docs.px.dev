---
title: "Using Pixie"
metaTitle: "Using Pixie"
metaDescription:  "This section covers how you can use Pixie."
order: 30
redirect_from:
    - /using-pixie/pxl-overview/
    - /using-pixie/scripts/pxl-scripts/
    - /using-pixie/scripts/contributing-pxl-scripts/
    - /using-pixie/scripts/script-catalog/
---

The following tutorials demonstrate the different ways you can interact with Pixie's observability platform.

- [Using the web-based Live UI](/using-pixie/using-live-ui) (recommended for new users)
- [Using the CLI](/using-pixie/using-cli)
- [Using the API](/using-pixie/api-quick-start)

All three interfaces execute PxL scripts.

## PxL Scripts

Scripts are written using the [Pixie Language](/reference/pxl) (PxL). PxL is a DSL that follows the API of the the popular Python data processing library Pandas. All PxL is valid Python.

PxL scripts can both:

1. Query [telemetry data](/about-pixie/data-sources) collected by the Pixie Platform (DNS events, HTTP events, etc).
2. Extend Pixie to collect [new data sources](/tutorials/custom-data/) (in addition to those it collects by default).

## Script Catalog

Pixie provides many [open source scripts](https://github.com/pixie-io/pixie/tree/main/src/pxl_scripts), which appear under the `px/` namespace in Pixie's Live UI and CLI.

These community scripts enable the developer community with a broad repository of use-case specific scripts out of the box. Over time, we hope this grows into a community driven knowledge base of tools to observe, debug, secure and manage applications.

## Use Case Tutorials

To use Pixie for a specific use case, check one of the following tutorials:

- [Network Monitoring](/tutorials/pixie-101/network-monitoring)
- [Infrastructure Health](/tutorials/pixie-101/infra-health)
- [Service Performance](/tutorials/pixie-101/service-performance)
- [Database Query Profiling](/tutorials/pixie-101/database-query-profiling)
- [Request Tracing](/tutorials/pixie-101/request-tracing)
- [Continuous Application Profiling](/tutorials/pixie-101/profiler)
