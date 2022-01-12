---
title: "Using the Scratch Pad"
metaTitle: "Tutorials | PxL Scripts | Using the Scratch Pad"
metaDescription: "Run a script in the Live UI Scratch Pad"
order: 20
---

Use the `Scratch Pad` in the [Live UI](https://docs.px.dev/using-pixie/using-live-ui/) to:

- Develop quick, one-off scripts.
- Run example scripts from the [`pixie-demos`](https://github.com/pixie-io/pixie-demos) repository.

## Using the Scratch Pad

1. Open the Live UI.

2. Select the `Scratch Pad` from the `script` drop-down menu in the top left.

<svg title='The Scratch Pad is the first item in the script menu.' src='pxl-scripts/scratch-pad.png'/>

3. Open the script editor using `ctrl+e` (Windows, Linux) or `cmd+e` (Mac). Alternatively, use the `Open editor` button in the top right.

>> The script editor contains two tabs: `PxL Script` and `Vis Spec`. The PxL script queries the Pixie platform for telemetry data. The Vis Spec describes how to visualize the query output.

>> To **run an example script** from the `pixie-demos` repo (like [this one](https://github.com/pixie-io/pixie-demos/tree/main/endpoint-deprecation/service_endpoints_summary)), copy the `.pxl` file into the script editor's `PxL Script` tab. Next, copy the `vis.json` file into the script editor's `Vis Spec` tab.

>> When **writing your own PxL script**, we recommend starting from an existing script which does something similar to the result you are looking for. Open the script editor to make edits to the existing script then press the RUN button to execute the modified script.

4. Copy the contents of the .pxl script file into the “PxL Script” tab of the script editor.
Copy the contents of the vis.json file into the “Vis Spec” tab of the script editor.
Hide the script editor using ctrl+e (Windows, Linux) or cmd+e (Mac).
The `Scratch Pad` is the first item in the `script` drop-down menu:

5. Run the script using the RUN button in the top right or using the keyboard shortcut: `ctrl+enter` (Windows, Linux) or `cmd+enter` (Mac).

6. Hide the script editor using the `ctrl+e` (Windows, Linux) or `cmd+e` (Mac).

<Alert variant="outlined" severity="info">
  Pixie's Live UI will soon support script persistence, but at the moment, any scripts modified in the Live UI will be lost if you refresh or switch to a different script. For extensive script development, we recommend using the <a href="https://docs.px.dev/tutorials/pxl-scripts/script-dev-environment/">Script Developer Environment</a>
</Alert>
