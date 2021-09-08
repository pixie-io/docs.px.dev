---
title: "Grafana Pixie Plugin"
metaTitle: "Tutorials | Integrations and Alerts | Using Pixie's Grafana Datasource Plugin"
metaDescription: "Using Pixie's Grafana Datasource Plugin"
order: 2
redirect_from:
    - /tutorials/grafana/
---

This tutorial will demonstrate how to use the Pixie datasource plugin to visualize data from Pixie in Grafana.

<YouTube youTubeId="wAiVzwPx1iM"/>

## Prerequisites

- A Kubernetes cluster with Pixie installed. If you do not have a cluster, you can create a minikube cluster and install Pixie using our [install guides](/installing-pixie/install-guides/).

- A [Grafana server](https://grafana.com/get/) with the Pixie datasource plugin installed. For installation directions, see the [instructions](https://github.com/pixie-io/grafana-plugin/#installing-the-plugin) on GitHub.

## Add Pixie as a datasource

Before you can create a dashboard, you will need to add Pixie as a datasource:

1. With Grafana open, select the cog icon from the left-side menu to show the configuration options.

::: div image-s
<svg title='' src='grafana/configuration.png'/>
:::

2. Click on **Data sources**. The data sources page opens showing a list of previously configured data sources for the Grafana instance.

3. Click **Add data source** to see a list of all supported data sources.

4. Search for **"Pixie Grafana Datasource Plugin"** and press the **Select** button. The datasource configuration page will open.

::: div image-l
<svg title='' src='grafana/plugin.png'/>
:::

5. The Pixie Plugin requires a Pixie API key and cluster ID to execute queries. To create an API Key, follow the directions [here](/reference/admin/api-keys/#create-an-api-key). To find your cluster's ID, follow the directions [here](/reference/admin/cluster-id/#find-the-cluster-id).

::: div image-l
<svg title='' src='grafana/configure-plugin.png'/>
:::

6. Select the **Save & Test** button.

## Create a Pixie panel

First, let's create a dashboard:

1. Click the + icon on the left side menu and select **Create Dashboard**.

Next, let's add a panel:

2. In the New Dashboard view, click **Add an empty panel**.

3. In the Edit Panel view, go to the **Query** tab.

4. Configure the query by selecting -- `Pixie Grafana Datasource Plugin` -- from the [data source selector](https://grafana.com/docs/grafana/latest/panels/queries/#data-source-selector).

5. Click the **Save** icon in the top right corner of your screen to save the dashboard.

::: div image-xl
<svg title='' src='datasource-selector.png'/>
:::

### Time series graph of HTTP throughput

1. Copy & paste the following query into the Query Editor.

```python
# Import Pixie's module for querying data.
import px

# Load data from Pixie's `http_events` table into a Dataframe.
df = px.DataFrame(table='http_events', start_time=__time_from)

# Bin the 'time_' column using the interval provided by Grafana.
df.timestamp = px.bin(df.time_, __interval)

# Group data by unique 'timestamp' and count the total number of
# requests per unique timestamp.
per_ns_df = df.groupby(['timestamp']).agg(
        throughput_total=('latency', px.count)
    )

# Calculate throughput by dividing # of requests by the time interval.
per_ns_df.request_throughput = per_ns_df.throughput_total / __interval

# Rename 'timestamp' column to 'time_'. The Grafana plugin expects a 'time_'
# column to display data in a Graph or Time series.
per_ns_df.time_ = per_ns_df.timestamp
per_ns_df.request_throughput = per_ns_df.request_throughput * 1e9

# Output select columns of the DataFrame.
px.display(per_ns_df['time_', 'request_throughput'])
```

This plugin uses the Pixie Language ([PxL](/reference/pxl)) to query telemetry data collected by the Pixie platform.

The above PxL query outputs a table of timeseries data showing overall HTTP request throughput. Request throughput is calculated by counting the number HTTP requests that Pixie automatically traces in your cluster.

This query uses the `__time_from` and `__interval` macros to add dashboard context to the query. See the full [list of macros](/reference/plugins/grafana/#macros) supported by this plugin.

2. On the Panel tab, under the **Visualization** drop-down menu, select **Time series**.

3. Add units to the graph: on the **Field** tab, under the **Standard options** drop-down menu, under the **Unit** menu, select **requests/sec**.

You should see data plotted over time, but the exact numbers will vary depending on the traffic in your cluster.

::: div image-xl
<svg title='' src='throughput.png'/>
:::

4. Select **Apply** to save the panel.

#### Debugging issues

If you don't see any data in your graph, try:

- Changing the [current time range](https://grafana.com/docs/grafana/latest/dashboards/time-range-controls/#current-time-range) to the "Last 5 minutes".

- Switching to the **Table** visualization to make sure that the query is returning some sort of data in table form.

- Making sure that your cluster has HTTP traffic that Pixie can automatically trace. Instructions for installing a demo application with HTTP traffic can be found [here](https://docs.px.dev/installing-pixie/install-guides/#start-a-demo-app). If you're using your own application, double check that [Pixie supports the protocols](/about-pixie/data-sources) for the traffic in your cluster.

### Time series graph of HTTP throughput per service

1. Create a new panel following the directions in the previous section.

2. Copy & paste this query into the Query Editor.

```python
# Import Pixie's module for querying data.
import px

# Load data from Pixie's `http_events` table into a Dataframe.
df = px.DataFrame(table='http_events', start_time=__time_from)

# Add K8s metadata context.
df.service = df.ctx['service']
df.namespace = df.ctx['namespace']

# Bin the 'time_' column using the interval provided by Grafana.
df.timestamp = px.bin(df.time_, __interval)

# Group data by unique pairings of 'timestamp' and 'service'
# and count the total number of requests per unique pairing.
per_ns_df = df.groupby(['timestamp', 'service']).agg(
        throughput_total=('latency', px.count)
    )

# Calculate throughput by dividing # of requests by the time interval.
per_ns_df.request_throughput = per_ns_df.throughput_total / __interval
per_ns_df.request_throughput = per_ns_df.request_throughput * 1e9

# Rename 'timestamp' column to 'time_'. The Grafana plugin expects a 'time_'
# column to display data in a Graph or Time series.
per_ns_df.time_ = per_ns_df.timestamp

# Output select columns of the DataFrame.
px.display(per_ns_df['time_', 'service', 'request_throughput'])
```

This PxL query outputs a table of timeseries data for HTTP request throughput per service

3. On the Panel tab, under the **Visualization** drop-down menu, select **Time series**.

4. Add units to the graph on the **Field** tab, under the **Standard options** drop-down menu, under the **Unit** menu, select **requests/sec**.

You should see data plotted over time, but the exact numbers will vary depending on the traffic in your cluster.

::: div image-xl
<svg title='' src='service-throughput.png'/>
:::

5. Select **Apply** to save the panel.

### Bar chart of HTTP errors per service

The following PxL query outputs a table of HTTP error count per service.

1. Create a new panel following the directions in the previous section.

2. Copy & paste this query into the Query Editor.

```python
import px

# Import HTTP events table.
df = px.DataFrame(table='http_events', start_time='-5m')

# Add columns for service, namespace info.
df.namespace = df.ctx['namespace']
df.service = df.ctx['service']

# Filter out requests that don't have a service defined.
df = df[df.service != '']

# Filter out requests from the Pixie (pl) namespace.
df = df[df.namespace != 'pl']

# Add column for HTTP response status errors.
df.error = df.resp_status >= 400

# Group HTTP events by service, counting errors and total HTTP events.
df = df.groupby(['service']).agg(
    error_count=('error', px.sum),
    total_requests=('resp_status', px.count)
)

# Output the DataFrame.
px.display(df)
```

3. On the Panel tab, under the **Visualization** drop-down menu, select **Bar chart**.

4. Flip the bar chart orientation to horizontal to more easily read the service names. On the **Field** tab, under the **Display** drop-down menu, select **Orientation** > **Horizontal**.

You should see data plotted over time, but the exact numbers will vary depending on the traffic in your cluster.

::: div image-xl
<svg title='' src='http-errors.png'/>
:::

5. Select **Apply** to save the panel.

## Get Help

- Check out the Pixie Grafana datasource plugin [reference docs](/reference/plugins/grafana).
- Inspect the source code, report issues, and contribute fixes in the [GitHub repo](https://github.com/pixie-io/grafana-plugin).
- Ask questions in the **#grafana-plugin** channel on Pixie's [Community Slack](http://slackin.px.dev).
