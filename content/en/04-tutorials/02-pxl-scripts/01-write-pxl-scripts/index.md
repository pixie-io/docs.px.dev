---
title: "How to Write a PxL Script"
metaTitle: "Tutorials | PxL Scripts | How to Write a PxL Script"
metaDescription: "Write Custom PxL Scripts"
order: 10
redirect_from:
    - /tutorials/pxl-scripts
---

## Overview

Pixie's API uses PxL scripts to both:

1. Query telemetry data collected by the Pixie Platform (DNS events, HTTP events, etc).
2. Extend Pixie to collect new data sources (in addition to those it collects by default).

PxL scripts can be executed by the Pixie platform by using the web based Live UI, CLI or API.

## Setup

Pixie needs to be installed on your Kubernetes cluster. If it is not already installed, please consult our [install guides](/installing-pixie/).

## Writing PxL Scripts

This tutorial series demonstrates how to write a PxL script to query data automatically collected by Pixie's platform. Pixie's CLI will be used to execute the script.

- [Prerequisite #1: Learn how to navigate the CLI.](/using-pixie/using-cli)
- [Tutorial #1: Write your first PxL script.](/tutorials/pxl-scripts/write-pxl-scripts/custom-pxl-scripts-1)
- [Tutorial #2: Finish your first PxL script.](/tutorials/pxl-scripts/write-pxl-scripts/custom-pxl-scripts-2)

## Writing PxL Scripts with Visualizations

This tutorial series adds visualizations to the PxL script developed in the [Writing PxL Scripts](/tutorials/pxl-scripts/#writing-pxl-scripts) tutorial series. Pixie's Live UI will be used to execute the script.

- [Prerequisite #1: Learn how to navigate the Live UI.](/using-pixie/using-live-ui)
- Prerequisite #2: Setup the script dev environment.
- Tutorial #1: Writing your first Vis Spec. (coming soon)
- Tutorial #2: Creating visualizations. (coming soon)

## Writing Advanced PxL Scripts

This tutorial series will demonstrate how to write a PxL script to extend the Pixie platform to collect new data sources. (coming soon)

## Getting Help

If you have questions about these tutorials, we’d be happy to help out on our [GitHub](https://github.com/pixie-io/pixie/issues) or community [Slack](https://slackin.px.dev/).
