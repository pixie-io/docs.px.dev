---
title: "PxL Scripts"
metaTitle: "Using Pixie | PxL Scripts"
metaDescription: "Overview of why Pixie uses PxL Scripts"
order: 3
redirect_from:
    - /using-pixie/scripts/pxl-scripts/
    - /using-pixie/scripts/contributing-pxl-scripts/
    - /using-pixie/scripts/script-catalog/
---


Pixie's API uses PxL scripts to both:

1. Query telemetry data collected by the Pixie Platform (DNS events, HTTP events, etc).
2. Extend Pixie to collect new data sources (in addition to those it collects by default).

PxL scripts can be executed by the Pixie platform by using the web based Live UI, CLI or API.

## PxL Script Catalog

Pixie provides many [open source scripts](https://github.com/pixie-labs/pixie/tree/main/src/pxl_scripts). These community scripts enable the developer community with a broad repository of use-case specific scripts out of the box.

Pxl Community Scripts appear under the `px/` namespace in Pixie's Live UI, CLI and API.

### Run your first PxL Script

Check out one of our guides to see how to run one of these pre-built PxL script using the web based Live UI, CLI or API:

- [Using the Live UI](/using-pixie/using-live-ui)
- [Using the CLI](/using-pixie/using-cli)
- [Using the API](/using-pixie/api-quick-start)

## PxL Language

Pixie's scripts are written using the Pixie Language (PxL), a DSL that follows the API of the the popular Python data processing library Pandas. All PxL is valid Python. You can learn more about the PxL language [here](/reference/pxl).

### Write your own PxL Script

Check out our [tutorials](/tutorials/pxl-scripts) to learn how to write your own PxL scripts.

## Contributing Scripts

Over time, we hope that our PxL script repository grows into a community driven knowledge base of data-driven tools to observe, debug, secure and manage applications.

<iframe width="560" height="315" src="https://www.youtube.com/embed/So4ep2mMcSI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

### Steps to Contribute

#### Step 1: File an issue

Filing an [issue](https://github.com/pixie-labs/pixie/issues/new/choose) with an explanation of what use-case you are looking to address help us make sure these community scripts are broadly applicable and useful.

#### Step 2: Prepare your script

Develop and test your script with the CLI or using the Live UI's [script dev environment](/tutorials/script-dev-environment).

#### Step 3: Create a pull-request

Once your script is ready, you can submit it for review by:

- Create a branch on your fork
- Commit your script folder(s) and push to origin
- Create a pull request with your original issue tagged
- Once accepted, it'll appear under the `px/` namespace in Pixie for the entire Pixie community
