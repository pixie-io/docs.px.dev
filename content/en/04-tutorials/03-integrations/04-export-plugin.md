---
title: "Exporting Live View data to a plugin"
metaTitle: "Tutorials | Integrations and Alerts | Exporting a Live View Script"
metaDescription: "Export Live view data to a plugin"
order: 4
redirect_from:
    - /tutorials/export-live-view/
---

This tutorial will demonstrate how to convert a Live View Script into a Plugin script.
Plugin scripts make it easy to extend Pixie's capabilities: you can enable a wide-range of use-cases
including long-term storage and [control signals for autoscalers](https://blog.px.dev/autoscaling-custom-k8s-metric/).

We have talked about exporting data from [Pixie](https://blog.px.dev/plugin-system/) before via
the [OTel Exporter](/tutorials/integrations/otel). Here we expand on the OTel Exporter feature by automating the script writing
process.

In this short tutorial, we'll show you how to use this new feature to convert your custom PxL scripts into export scripts using a few simple steps.

## Prerequisites

1. You will need a Kubernetes cluster. If you don’t already have one, you can create a minikube cluster following the directions [here](/installing-pixie/setting-up-k8s/minikube-setup/).

2. You will need to install Pixie on your cluster using one of our [install guides](/installing-pixie/install-guides/).

3. You will need to setup a [Pixie plugin](/reference/plugins/plugin-system/). You can [setup a simple demo collector](https://github.com/pixie-io/pixie-demos/tree/main/otel-collector) to try the feature out.

## The PxL script

PxL scripts are used to query telemetry data collected by the Pixie Platform. Our PxL script will also export the Pixie data in the OTel format. We'll use the Live UI's `Scratch Pad` to develop our PxL script.

1. Open Pixie's [Live UI](/using-pixie/using-live-ui/).

2. Select the `Scratch Pad` script from the `script` drop-down menu in the top left.
<svg src='plugin/scratch_pad_selection.png'/>

3. Open the script editor using the keyboard shortcut: `ctrl+e` (Windows, Linux) or `cmd+e` (Mac).

4. Replace the contents of the `PxL Script` tab with the following. Hover over the code block below to show the copy button in the top-right.

```python:numbers
import px
# Read in the http_events table
df = px.DataFrame(table='http_events', start_time='-10s', end_time=px.now())

# Attach the pod and service metadata
df.pod = df.ctx['pod']
df.service = df.ctx['service']
# Count the number of requests per pod and service
df = df.groupby(['pod', 'service', 'req_path']).agg(
  throughput=('latency', px.count),
  time_=('time_', px.max),
)

px.display(df, 'http')
```

5. Run the script using the `RUN` button in the top right or by using the keyboard shortcut: `ctrl+enter` (Windows, Linux) or `cmd+enter` (Mac).

6. Hide the script editor using `ctrl+e` (Windows, Linux) or `cmd+e` (Mac).

> Your Live UI should output something similar to the following:

<svg src='plugin/generate_otel_results.png'/>

> This PxL script calculates the throughput of HTTP requests made to each pod in your cluster.

## Exporting the PxL Script

Now that we have our Live View script, let's export it.

7. Open the script editor again (`ctrl+e` or `cmd+e`)

8. On the top right corner, click "Export to Plugin". Pixie will process the script and attempt to generate an OpenTelemetry export configuration for it.
<svg src='plugin/export_button.png'/>

9. If the generation fails, you'll see an error in the canvas
<svg src='plugin/time_column_missing.png'/>

10. If the export is successful , you'll be redirected to the "Create Export Script" page with the generated OTel Script already filled in! You should see that all `INT64` and `FLOAT64` columns have become Gauge metrics while the other columns have become resource attributes.
<svg src='plugin/create_export_script.png'/>

11. Now set the name, the Plugin provider and configure the optional arguments as you wish. I chose the name
`my-export-script` and will send it to the OpenTelemetry plugin.
<svg src='plugin/named_create_export_script.png'/>

12. You'll also want to replace any px.DataFrame arguments for `start_time` and `end_time` with `px.plugin.start_time` and `px.plugin.end_time`
<svg src='plugin/plugin_times.png'/>

13. Check over the generated PxL one last time and make any desired modifications.
14. Click `Create` and you should see `my-export-script` in the "Custom Scripts" section. Your data should now be sent to whatever Plugin you configured.
<svg src='plugin/export_status.png'/>


## Next Steps
So you've now deployed your first OpenTelemetry script using the auto-generating export. You can
dive deeper into PxL scripts by checking out our ["How to Write a PxL Script"](/tutorials/pxl-scripts/write-pxl-scripts/) series or by reading through the [PxL documentation](/reference/pxl/).

You can also learn how to more deeply interact with Pixie's OpenTelemetry integration [in this tutorial](/reference/pxl/otel-export/) and through the [OTel Export documentation](/reference/pxl/otel-export/)


## Troubleshooting

Having problems? Check out the [Pixie Plugin Troubleshooting](/about-pixie/troubleshooting/#troubleshooting-a-pixie-plugin) guide.
