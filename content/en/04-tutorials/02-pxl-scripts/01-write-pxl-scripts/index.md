---
title: "How to Write a PxL Script"
metaTitle: "Tutorials | PxL Scripts | How to Write a PxL Script"
metaDescription: "Write Custom PxL Scripts"
order: 10
---

## Overview

Pixie uses PxL scripts to both:

1. Query telemetry data collected by the Pixie Platform (DNS events, HTTP events, etc).
2. Extend Pixie to collect new data sources (in addition to those it collects by default).

PxL scripts can be executed by the Pixie platform by using the web based [Live UI](/using-pixie/using-live-ui/), [CLI](/using-pixie/using-cli/) or [API](/using-pixie/api-quick-start/).

## Setup

Pixie needs to be installed on your Kubernetes cluster. If it is not already installed, please consult our [install guides](/installing-pixie/install-guides/).

## Writing a PxL Script

This tutorial series demonstrates how to write a PxL script to query data automatically collected by Pixie's platform. Pixie's [CLI](/using-pixie/using-cli/) is used to execute the script.

- (Prerequisite) [Install Pixie's CLI tool](/installing-pixie/install-schemes/cli/#1.-install-the-pixie-cli)
- (Optional Prerequisite) [Learn how to navigate the CLI](/using-pixie/using-cli)
- [Tutorial #1: Write your first PxL script](/tutorials/pxl-scripts/write-pxl-scripts/custom-pxl-scripts-1)
- [Tutorial #2: Finish your first PxL script](/tutorials/pxl-scripts/write-pxl-scripts/custom-pxl-scripts-2)

## Writing a Vis Spec

This tutorial series demonstrates how to write a Vis Spec to accompany the PxL script developed in Tutorial #1 and Tutorial #2. Pixie's [Live UI](/using-pixie/using-live-ui/) is used to execute the script.

- (Optional Prerequisite) [Learn how to navigate the Live UI](/using-pixie/using-live-ui)
- [Tutorial #3: Write your first Vis Spec](/tutorials/pxl-scripts/write-pxl-scripts/custom-pxl-scripts-3)
- [Tutorial #4: Add a Timeseries chart to your Vis Spec](/tutorials/pxl-scripts/write-pxl-scripts/custom-pxl-scripts-4)
- [Tutorial #5: Add a Graph to your Vis Spec](/tutorials/pxl-scripts/write-pxl-scripts/custom-pxl-scripts-5)

<Alert variant="outlined" severity="info">
  Pixie's Live UI will soon support script persistence, but at the moment, any scripts modified in the Live UI will be lost if you refresh or switch to a different script. For extensive script development, we recommend using the <a href="/tutorials/pxl-scripts/script-dev-environment/">Script Developer Environment</a>
</Alert>

## Writing PxL Scripts to Collect Custom Data

These tutorials demonstrate how to write a PxL script that extends the Pixie platform to collect new data sources:

- [Tutorial: Distributed bpftrace deployment](/tutorials/custom-data/distributed-bpftrace-deployment/)
- [Tutorial: Dynamic Go logging](/tutorials/custom-data/dynamic-go-logging/)

To see these features in action, check out the following blog posts:

- [Dumpster Diving the Go Garbage Collector](https://blog.px.dev/go-garbage-collector/): using Pixie's dynamic Go logging to understand how Go garbage collection works.
- [Distributed bpftrace with Pixie](https://blog.px.dev/distributed-bpftrace/): how to deploy bpftrace tools across your cluster using Pixie.

## Getting Help

If you have questions about these tutorials, we’d be happy to help out on our [GitHub](https://github.com/pixie-io/pixie/issues) or community [Slack](https://slackin.px.dev/).
