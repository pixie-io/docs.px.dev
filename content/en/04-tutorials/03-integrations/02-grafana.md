---
title: "Grafana Pixie Plugin"
metaTitle: "Tutorials | Integrations and Alerts | Using Pixie's Grafana Datasource Plugin"
metaDescription: "Using Pixie's Grafana Datasource Plugin"
order: 2
redirect_from:
    - /tutorials/grafana/
---

This tutorial will demonstrate how to use the [Pixie datasource plugin](https://grafana.com/grafana/plugins/pixie-pixie-datasource/) to visualize data from Pixie in Grafana.

<YouTube youTubeId="wAiVzwPx1iM"/>

## Prerequisites

- A Kubernetes cluster with Pixie installed. If you do not have a cluster, you can create a minikube cluster and install Pixie using our [install guides](/installing-pixie/install-guides/).

- A [Grafana server](https://grafana.com/get/) with the [Pixie datasource plugin](https://grafana.com/grafana/plugins/pixie-pixie-datasource/) installed. You can find the installation directions [here](https://grafana.com/grafana/plugins/pixie-pixie-datasource/?tab=installation).

## Add Pixie as a datasource

Before you can create a dashboard, you will need to add Pixie as a datasource:

1. With Grafana open, select the cog icon from the left-side menu to show the configuration options.

::: div image-s
<svg title='' src='grafana/configuration.png'/>
:::

2. Click on **Data Sources**. The data sources page opens showing a list of previously configured data sources for the Grafana instance.

3. Click **Add data source** to see a list of all supported data sources.

4. Search for **"Pixie Grafana Datasource Plugin"** and press the **Select** button. The datasource configuration page will open.

::: div image-l
<svg title='' src='grafana/plugin.png'/>
:::

5. The Pixie Plugin requires a Pixie API key and cluster ID to execute queries. To create an API Key, follow the directions [here](/reference/admin/api-keys/#create-an-api-key). To find your cluster's ID, follow the directions [here](/reference/admin/cluster-id/#find-the-cluster-id).

<Alert variant="outlined" severity="info">
The <b>Cluster ID</b> field is used to specify the default cluster to query. If you have Pixie installed on more than one cluster, you can <a href="#create-a-dashboard-panel-of-pixie-data-(optional)-add-dashboard-variables">create a cluster dashboard variable</a> to view data for any cluster in your Pixie organization. If you don't use a cluster dashboard variable, the plugin will default to showing data for the cluster specified in the <b>Cluster ID</b> field.
</Alert>

::: div image-l
<svg title='' src='grafana/configure-plugin.png'/>
:::

6. Select the **Save & Test** button.

## Add a Pixie dashboard

If you've used Pixie's [Live UI](/using-pixie/using-live-ui/) or [CLI](/using-pixie/using-cli/), you should be familiar with the concept of open source PxL scripts. [PxL scripts](/tutorials/pxl-scripts/write-pxl-scripts/) are used to query and visualize observability data collected by the Pixie platform. Developers use PxL scripts to monitor and debug a [wide range of use-cases](/tutorials/pixie-101/).

::: div image-xl
<svg title='The px/cluster script seen in the Pixie Live UI. This view includes an HTTP service map and lists the nodes, namespaces, services and pods that are available on the current cluster.' src='grafana/px-cluster-pixie.png'/>
:::

Several of Pixie's most popular PxL scripts have been made available as Grafana dashboards. You can find the dashboard JSON files [here](https://github.com/pixie-io/grafana-plugin/tree/main/dashboards).

::: div image-xl
<svg title='The px/cluster dashboard seen in Grafana.' src='grafana/px-cluster-grafana.png'/>
:::

### Import a Pixie dashboard

To import a Pixie dashboard:

1. Click **Import** under the **Dashboards** icon in the side menu.

::: div image-m
<svg title='' src='grafana/import-dashboard.png'/>
:::

2. Upload a dashboard JSON file or paste the dashboard JSON text directly into the text area. The JSON files for Pixie's dashboards are located [here](https://github.com/pixie-io/grafana-plugin/tree/main/dashboards).

::: div image-l
<svg title='' src='grafana/import-dashboard-page.png'/>
:::

### Discover Pixie dashboards on Grafana.com

Find Pixie dashboards at [Grafana.com/dashboards](https://grafana.com/dashboards).

(coming soon)

## Create a dashboard panel of Pixie data

First, we'll need to create a new dashboard:

1. Click the **New dashboard** item under the **Dashboards** icon in the side menu.

2. In the new dashboard view, click **Add an empty panel**.

### Select the Pixie datasource for your query

1. In the Edit Panel view, go to the **Query** tab.

2. Configure the query by selecting the **Pixie Grafana Datasource Plugin** from the data source selector.

3. Click the **Save** icon in the top right corner of your screen to save the dashboard.

::: div image-xl
<svg title='' src='grafana/datasource-selector.png'/>
:::

### Select a pre-made script

The Pixie Datasource Plugin offers several pre-written scripts that you can use to quickly create dashboard panels. Let's look at a script that creates a time series graph for HTTP throughput per service.

1. In the **Query** editor tab, select the **HTTP Request Throughput by Service** option from the **Script** drop-down selector.

::: div image-xl
<svg title='' src='grafana/script-menu.png'/>
:::

2. The description of the script in the **Script** drop-down menu tells you which Grafana [visualization panel](https://grafana.com/docs/grafana/latest/visualizations/) type to use with the query. Select the **Time series** visualization type from the top right drop-down menu.

> This script creates a time series graph of HTTP throughput per service. You should see data plotted over time, but the exact numbers will vary depending on the traffic in your cluster.

::: div image-xl
<svg title='Output of the "HTTP Request Throughput by Service" Pixie Grafana plugin script.' src='grafana/service-throughput.png'/>
:::

### (Optional) Add column filtering / grouping

You can apply filtering / grouping to the output columns of the pre-made scripts. Let's look at a script that creates a table of the raw HTTP requests flowing through your cluster.

1. From the **Query** editor tab, select the **Raw HTTP Events (Long Format)** option from the **Script** drop-down selector.

2. The description of the script in the **Script** drop-down menu tells you that this script should be used with the Table visualization panel. Select the Table panel type from the top right drop-down menu.

> This script shows all of the HTTP requests flowing through your cluster.

::: div image-xl
<svg title='Output of the "Raw HTTP Events (Long Format)" Pixie Grafana plugin script.' src='grafana/http-events.png'/>
:::

3. You can add or remove columns from the output table using the `Columns Display` selector.

::: div image-xl
<svg title='' src='grafana/http-events-column-picker.png'/>
:::

4. You can group the columns and apply an aggregate function using the `Groupby Columns` selector.

> In the image below, I've grouped the columns by unique HTTP request path (`req_path`) and selected the **Add Aggregate Pair** button to count the number of HTTP requests per unique request path.

::: div image-xl
<svg title='' src='grafana/http-events-groupby.png'/>
:::

5. Remove the Groupby column filtering before proceeding to the next section.

### (Optional) Add dashboard variables

Grafana offers dashboard variables to help you create more interactive dashboards.

#### Cluster name

If you have Pixie installed on more than one cluster, you can create a `pixieCluster` dashboard variable to view data for any cluster in your Pixie organization. If you do not create a `pixieCluster` dashboard variable, the plugin will default to showing data for the **Cluster ID** specified when [configuring the Pixie Datasource](#add-pixie-as-a-datasource).

To create a new dashboard variable for cluster name:

1. Navigate to the Grafana dashboard settings.

2. Select the **Variables** option in the side menu, then click the **Add variable** button.

3. Under the General section, name the variable `pixieCluster`.

4. Under the Query Options section, select `Clusters` for `Fetchable Data`.

::: div image-xl
<svg title='' src='grafana/dashboard-variable.png'/>
:::

5. Click the **Update** button.

6. You can now select your cluster from the `pixieCluster` drop-down menu above the panel:

::: div image-xl
<svg title='' src='grafana/clusterName.png'/>
:::

#### Pod name

Let's create a new dashboard variable for pod name and use it to filter the HTTP requests:

1. Following the same steps as above, navigate to the dashboard settings and add a new variable.

2. Under the General section, name the variable `podName`.

3. Under the Query Options section, select `Pods` for `Fetchable Data`.

4. Click the **Submit** button to preview the pod values.

::: div image-xl
<svg title='' src='grafana/podName.png'/>
:::

5. Click the **Update** button.

6. Modify the last few lines of the **Raw HTTP Events (Long Format)** query script to insert a filter using podName:

```python:lines
# Keep only the selected columns (and order them in the following order)
df = df[[$__columns]]

# Filter HTTP events to only include the ones made to the selected pod
df = df[df.pod == '$podName']

# Output the DataFrame
px.display(df)
```

8. Selecting a pod from the `podName` drop-down menu above the panel will now filter the results to only include HTTP requests made to the selected pod.

::: div image-xl
<svg title='' src='grafana/dashboard-variable-podName.png'/>
:::

## More pre-made scripts

Use the **Pod Metrics** script to see high-level metrics for each pod in your cluster:

::: div image-xl
<svg title='Output of the "Pod Metrics" Pixie Grafana plugin script.' src='grafana/pod-metrics-script.png'/>
:::

Use the **Node Metrics** script to see high-level metrics for each node in your cluster:

::: div image-xl
<svg title='Output of the "Node Metrics" Pixie Grafana plugin script.' src='grafana/node-metrics-script.png'/>
:::

Use the **Namespace Metrics** script to see high-level metrics for each namespace in your cluster:

::: div image-xl
<svg title='Output of the "Namespace Metrics" Pixie Grafana plugin script.' src='grafana/namespace-metrics-script.png'/>
:::

Use the **Service Metrics** script to see high-level metrics for each service in your cluster:

::: div image-xl
<svg title='Output of the "Service Metrics" Pixie Grafana plugin script.' src='grafana/service-metrics-script.png'/>
:::

Use the **HTTP Error Rate by Service (Wide Format)** script to see HTTP error and total request count for each service in your cluster:

::: div image-xl
<svg title='Output of the "HTTP Error Rate by Service" Pixie Grafana plugin script.' src='grafana/htttp-error-rate-script.png'/>
:::

Use the **Raw HTTP Requests** script to see overall HTTP request throughput for your cluster:

::: div image-xl
<svg title='Output of the "Raw HTTP Requests" Pixie Grafana plugin script.' src='grafana/http-request-throughput-script.png'/>
:::

Use the **HTTP Service Graph** script to see a graph of the HTTP requests in your cluster. Note: this node graph panel requires Grafana version `8.0.0+`.

::: div image-xl
<svg title='Output of the "HTTP Service Graph" Pixie Grafana plugin script.' src='grafana/http-service-map-script.png'/>
:::

Use the **Network Connections** script to see network connections to, from, and within your cluster. Note: this node graph panel requires Grafana version `8.0.0+`.

::: div image-xl
<svg title='Output of the "Network Connections" Pixie Grafana plugin script.' src='grafana/network-connections-script.png'/>
:::

Use the **Inbound Connections** script to see inbound network connections to your cluster (connections made from external IPs). Note: this node graph panel requires Grafana version `8.0.0+`.

::: div image-xl
<svg title='Output of the "Inbound Connections" Pixie Grafana plugin script.' src='grafana/inbound-connections-script.png'/>
:::

Use the **Outbound Connections** script to see outbound network connections from your cluster (connections made to external IPs). Note: this node graph panel requires Grafana version `8.0.0+`.

::: div image-xl
<svg title='Output of the "Outbound Connections" Pixie Grafana plugin script.' src='grafana/outbound-connections-script.png'/>
:::

## Write a custom script

Writing scripts that work with the Pixie Grafana datasource plugin is a lot like [writing a regular PxL script](/tutorials/pxl-scripts/write-pxl-scripts/), with a few exceptions that are noted in the [plugin reference docs](/reference/plugins/grafana).

When writing a custom script, it's often easiest to modify an existing script instead of starting from scratch. Start by identifying one of the pre-made scripts or dashboards that does something similar to what you're looking for. The **Script** selector in the **Query** editor tab shows descriptions for each pre-made script.

Once you've identified a script that does something similar to what you are aiming to do, edit the script and refresh the panel.

## Debugging

If you don't see any data in your graph, try:

- Changing the [current time range](https://grafana.com/docs/grafana/latest/dashboards/time-range-controls/#current-time-range) to the "Last 5 minutes".

- Switching to the **Table** visualization to make sure that the query is returning some sort of data in table form.

- Making sure that your cluster has HTTP traffic that Pixie can automatically trace. Instructions for installing a demo application with HTTP traffic can be found [here](/installing-pixie/install-guides/#start-a-demo-app). If you're using your own application, double check that [Pixie supports the protocols](/about-pixie/data-sources) for the traffic in your cluster.

## Get Help

- Check out the Pixie Grafana datasource plugin [reference docs](/reference/plugins/grafana).
- Inspect the source code, report issues, and contribute fixes in the [GitHub repo](https://github.com/pixie-io/grafana-plugin).
- Ask questions in the **#grafana-plugin** channel on Pixie's [Community Slack](http://slackin.px.dev).
