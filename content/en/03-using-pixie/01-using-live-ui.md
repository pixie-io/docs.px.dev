---
title: "Using the Live UI"
metaTitle: "Using Pixie | Using the Live UI"
metaDescription: "Use the Live UI to run PxL scripts"
order: 1
redirect_from:
    - /using-pixie/interfaces/using-live-ui/
---

You can interact with the Pixie platform using the web-based Live UI, [CLI](/using-pixie/using-cli) or [API](/using-pixie/api-quick-start).

Scripts run in the Live UI offers rich visualizations that are not available with the CLI or API. For this reason, we recommend that developers who are new to Pixie begin by using the Live UI.

## Setup

Pixie needs to be installed on your Kubernetes cluster. If it is not already installed, please consult our [install guides](/installing-pixie/).

## Running your First PxL Script

1. Open Pixie's [Live UI](https://work.withpixie.ai).

2. Select your cluster using the `cluster` drop-down menu.

<svg title='Selecting your cluster in the Live UI.' src='live-ui/live-ui-1.png'/>

3. Select the `px/cluster` script from the `script` drop-down menu. The right-half of this menu displays a description of the selected script.

<svg title='Selecting your script in Live UI.' src='live-ui/live-ui-2.png'/>

4. Run the script using the `RUN` button in the top right. The `px/cluster` script lists all of the namespaces, services, nodes and pods on your cluster. After running the script, you should see something similar to the following.

<svg title='Output of the px/cluster script.' src='live-ui/live-ui-3.png'/>

Tables in the script output can be sorted by column by clicking on the column title. Rows in the table can be expanded by clicking on the row.

### Editing Script Arguments

Scripts often take arguments, which will appear next to the `cluster` and `script` drop-down menus. This script takes an argument for `start_time`.

5. Modify the `start_time` to set it to `-10m` and re-run the script using the `RUN` button.

<svg title='Modify the start_time.' src='live-ui/live-ui-4.png'/>

### Deep Linking

Deep links embedded in the script output allow you to easily navigate between Kubernetes entities.

The "Nodes" table in the `px/cluster` script output lists all of the nodes in your cluster.

6. Click on any of the node names in the blue underlined text to be taken to the output of the `px/node` script for that particular node.

<svg title='Click on deep links to easily navigate between Kubernetes entities.' src='live-ui/live-ui-5.png'/>

### Keyboard Shortcuts

Navigating the Live UI is much faster using keyboard shortcuts. To see the shortcut menu, press `shift+?` or open the menu item (shown below).

<svg title='Opening the Live UI shortcuts menu.' src='live-ui/live-ui-6.png'/>

Try out the following 2 shortcuts, we'll use them often.

1. Run the current script: `ctrl+enter` (Windows, Linux) or `cmd+enter` (Mac)

2. Show / hide the script editor: `ctrl+e` (Windows, Linux) or `cmd+e` (Mac)

## Pixie's Open Source Scripts

The Live UI's `script` drop-down menu lists all of Pixie's [open source scripts](https://github.com/pixie-io/pixie/tree/main/src/pxl_scripts).

To learn how to use Pixie scripts for a specific use case, check out one of the following tutorials:

- [Network Monitoring](/tutorials/pixie-101/network-monitoring/)
- [Infra Health](/tutorials/pixie-101/infra-health/)
- [Service Performance](/tutorials/pixie-101/service-performance/)
- [Database Query Profiling](/tutorials/pixie-101/database-query-profiling/)
- [Request Tracing](/tutorials/pixie-101/request-tracing/)

## Write Your Own PxL Scripts

To learn how to write your own PxL script, check out the [tutorial](/tutorials/pxl-scripts/write-pxl-scripts).

For writing quick, one-off scripts, use the `Scratch Pad`. The `Scratch Pad` is the first item in the drop-down `script` menu. Open the script editor to add code to the empty PxL Script.

<svg title='Use the Scratch Pad script .' src='live-ui/live-ui-7.png'/>

The `Scratch Pad` does not yet support persistence, so if you are extensively developing a script, we recommend using the [Script Developer Environment](/tutorials/pxl-scripts/script-dev-environment).
