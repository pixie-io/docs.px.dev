---
title: "Using the CLI"
metaTitle: "Using Pixie | Using the CLI"
metaDescription:  "Use the CLI to run PxL scripts"
order: 2
redirect_from:
    - /using-pixie/interfaces/using-cli/
---

You can interact with the Pixie platform using the CLI, web-based [Live UI](/using-pixie/using-live-ui) or [API](/using-pixie/api-quick-start).

Scripts run in the CLI omit certain visualizations seen in the Live UI. For this reason, we recommend that developers who are new to Pixie begin by using the [Live UI](/using-pixie/using-live-ui).

## Setup

Pixie needs to be installed on your Kubernetes cluster. If it is not already installed, please consult our [install guides](/installing-pixie/).

## Pixie's Open Source Scripts

Run the following command to list all of Pixie's [open source scripts](https://github.com/pixie-io/pixie/tree/main/src/pxl_scripts).

```bash
px run -l		# list pre-built scripts
```

## Running your first PxL Script

You can run any PxL script using:

```bash
px run <script_name>		# run a pxl script
```

Let's try run Pixie's`px/namespaces` script:

```bash
px run px/namespaces		# run the pre-built px/namespace script
```

<svg title='Output of the px/namespaces script in the CLI.' src='cli/cli-1.png'/>

This script outputs two tables. The first table lists the namespaces on the current cluster and their pod and service counts. The second table lists the high-level resource consumption by namespace.

### Selecting the Cluster

If Pixie is installed on multiple clusters, Pixie will use the cluster in the current kubectl context. To specify a different cluster, pass the `cluster_ID` with the `-c` flag.

```bash
px get viziers		# display cluster IDs for all clusters with Pixie installed

px run <script_name> -c <cluster_ID>		# run a script on a specific cluster
```

### Passing Arguments to a Script

To show a the input arguments for any PxL script:

```bash
px run <script_name> -- --help		# show the arguments for a script.

px run <script_name> -- --arg_name val		# pass arguments to a script
```

Pixie's `px/namespace` script gives a top-level summary of the pods and services for a specific namespace. This script takes two arguments. If you don't provide arguments, the script will output an empty table (Pixie will soon enforce required arguments).

```bash
px run px/namespace -- --help		# show the arguments for a script.

px run px/namespace -- --namespace pl		# pl is the namespace that Pixie is installed to (by default)
```

<svg title='Output of the px/namespace script in the CLI. ' src='cli/cli-2.png'/>

This script outputs three tables and the output is difficult to view in the terminal.

## Different Ways of Viewing a Script's Output

For scripts with verbose output (like the `px/namespace` script you ran above), we recommend the following ways of interacting with the output.

### Output in a Different Format

Pixie supports `json` and `csv` output using the `-o` flag, making it easy to consume the script's output using other CLI tools.

```bash
px run <script_name> -o csv > table_data.csv		# output in csv format and redirect to a file

px run <script_name> -o json | jq		# output in json format and pipe to jq
```

### Use the Live CLI

The Live CLI provides interactive views for output tables. To run the Live CLI, use `px live` instead of `px run`.

```bash
px live <script_name>		# run a script using the Live CLI

px live px/namespace -- --namespace pl		# run Pixie's px/namespace script
```

The `px/namespace` script outputs three tables, one per tab at the bottom left of the terminal window.

<svg title='Output of the px/namespace script in the Live CLI.' src='cli/cli-3.png'/>

You can interact with the Live CLI output:

- To switch between the output tables, use the number keys (or a mouse click) to select the table tabs listed at the bottom left of the terminal.
- To sort a column, click on a column title.
- To navigate the table cells, use your arrow keys (or click with your mouse).
- To expand a truncated table cell, use `ctrl+enter` or `ctrl+click`.
- To display/hide the script, use `ctrl+v`.
- To run a different PxL script, use `ctrl+k`.

### Switch to the Live View

PxL has support for building visualizations (graphs, charts, etc), which can be viewed in Pixie's Live UI.  A link to the Live UI view of a particular script is included in each script output in the CLI.

The Live UI link appears at the bottom of the output of any `px run <script_name>` output.

<svg title='Linking to the Live UI view of a script from the CLI.' src='cli/cli-4.png'/>

And at the top of the Live CLI output.

<svg title='Linking to the Live UI view of a script from the Live CLI.'  src='cli/cli-5.png'/>

## Use Case Tutorials

To learn how to use Pixie for a specific use case, check out one of the following tutorials:

- [Network Monitoring](/tutorials/pixie-101/network-monitoring/)
- [Infra Health](/tutorials/pixie-101/infra-health/)
- [Service Performance](/tutorials/pixie-101/service-performance/)
- [Database Query Profiling](/tutorials/pixie-101/database-query-profiling/)
- [Request Tracing](/tutorials/pixie-101/request-tracing/)

## Running a Custom PxL Script

To learn how to write custom PxL scripts, check out this [tutorial](/tutorials/pxl-scripts/write-pxl-scripts).

To run your own PxL script using the CLI, use the `-f` flag to provide the script's filename.

```bash
px run -f <script.pxl>		# Use Pixie's CLI to run the pxl script with the provided filename

px live -f <script.pxl>		# Use Pixie's Live CLI to run the pxl script with the provided filename
```

## Advanced

### End-to-End Encryption

Pixie offers end-to-end encryption for telemetry data requested by the CLI. For more information, see the [FAQ](/about-pixie/faq#how-does-pixie-secure-its-data).

Encryption is controlled by the `--e2e_encryption` flag during script execution. Enabling E2E encryption adds some overhead to encrypt the results on the Vizier side and decrypt it on the CLI side.

```bash
# Enable encryption when running a script with the CLI.
px run <script_name> --e2e_encryption

# Disable encryption when running a script with the CLI.
px run <script_name> --e2e_encryption=false
```

### Debugging Pixie using the CLI

Use the following commands to show the status of Pixie on your cluster:

```bash
px get viziers		# shows the registered K8s clusters that are running Pixie and their current status

px get pems			# shows the current status of the Pixie Edge Modules. Also, usable as `px run px/agent_status`

px collect-logs		# collect Pixie logs on the cluster
```

To view all available Pixie CLI commands:

```bash
px --help
```
