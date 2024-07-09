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

1. Open Pixie's <CloudLink url="/">Live UI</CloudLink>.

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
- [Kafka Monitoring](/tutorials/pixie-101/kafka-monitoring/)

## Write Your Own PxL Scripts

Live views in the Live UI are constructed from two files:

- The `PxL Script` queries the Pixie platform for telemetry data.
- The `Vis Spec` describes how to visualize the query output.

To learn how to write your own PxL script, check out the [tutorial](/tutorials/pxl-scripts/write-pxl-scripts). When writing custom scripts, we recommend starting from an existing script which does something similar to the result you are looking for.

### Edit an Existing Script

To edit an existing PxL script in the Live UI:

1. Select the script you want to edit from the `script` drop-down menu in the top left.
2. Open the script editor using the keyboard shortcut: `ctrl+e` (Windows, Linux) or `cmd+e` (Mac).
3. Make edits in the `PxL script` and/or the `Vis Spec` tabs.
4. Run the script using the `RUN` button in the top right or by using the keyboard shortcut: `ctrl+enter` (Windows, Linux) or `cmd+enter` (Mac).
5. Hide the script editor using `ctrl+e` (Windows, Linux) or `cmd+e` (Mac).

### Use the Scratch Pad

Use the `Scratch Pad` to:

- Develop quick, one-off scripts.
- Run example scripts from the [`pixie-demos`](https://github.com/pixie-io/pixie-demos) repository.

To run an [example script](https://github.com/pixie-io/pixie-demos/tree/main/endpoint-deprecation/service_endpoints_summary) from the `pixie-demos` repo:

1. Select the `Scratch Pad` (first item) from the `script` drop-down menu. The script editor should automatically open.

<svg title='' src='live-ui/scratch-pad.png'/>

2. Copy the `.pxl` file into the script editor's `PxL Script` tab.
3. Copy the `vis.json` file into the script editor's `Vis Spec` tab.
4. Run the script using the RUN button in the top right or using the keyboard shortcut: `ctrl+enter` (Windows, Linux) or `cmd+enter` (Mac).
5. Show / hide the script editor using the `ctrl+e` (Windows, Linux) or `cmd+e` (Mac). Alternatively, use the `Open editor` button in the top right.

<Alert variant="outlined" severity="info">
  Pixie's Live UI will soon support script persistence, but at the moment, any scripts modified in the Live UI will be lost if you refresh or switch to a different script. For extensive script development, we recommend using the <a href="/tutorials/pxl-scripts/script-dev-environment/">Script Developer Environment</a>
</Alert>
