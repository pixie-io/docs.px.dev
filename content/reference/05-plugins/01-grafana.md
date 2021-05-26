---
title: "Grafana Datasource Plugin"
metaTitle: "Reference | Grafana Datasource Plugin "
metaDescription: "Pixie's Grafana Datasource Plugin"
order: 5
---

The Grafana Pixie Datasource allows you to visualize data from the Pixie observability platform in Grafana.

## Installation

Install the plugin using Grafana's command line tool or using

## Usage

To get started using the plugin, check out the tutorial [here](/tutorials/grafana).

### Configuration

The plugin requires a Pixie API key and cluster ID to execute queries:

- To create an API key, follow the directions [here](/using-pixie/api-quick-start/#get-an-api-token).
- To find your cluster's ID, follow the directions [here](/using-pixie/api-quick-start/#get-a-cluster-id).

Grafana encrypts these values.

### Queries

The plugin uses the Pixie Language (PxL) to query telemetry data collected by the Pixie platform.

- Learn more about the PxL language [here](/reference/pxl/).
- Learn how to write a PxL script [here](/tutorials/pxl-scripts).

If there are syntax errors in your PxL query, Grafana will display an error message.

<Alert variant="outlined" severity="warning">
  Note that the plugin does not support Vis Spec input. PxL queries must return a table using the `px.display()` call.
</Alert>

### Macros

Grafana uses macros to add dashboard context to a query. The following macros are supported for PxL queries executed by plugin:

- `__time_from` will be replaced by the start of the currently active time selection. Example usage:

```python
import px
df = px.DataFrame(table='http_events', start_time= __time_from)
```

- `__time_to` will be replaced by the end of the currently active time selection. Example usage:

```python
import px
df = px.DataFrame(table='http_events', start_time= __time_from, end_time=__time_to)
```

- `__interval` will be replaced by the suggested duration between time points. Interval is set by the Grafana UI in the **Query options** section in the **Query** tab. Example usage:

```python
import px
df = px.DataFrame(table='http_events', start_time= __time_from, end_time=__time_to)
df.timestamp = px.bin(df.time_, __interval)
per_ns_df = df.groupby(['timestamp', 'service']).agg(
        throughput_total=('latency', px.count)
    )
per_ns_df.request_throughput = per_ns_df.throughput_total / __interval
per_ns_df.time_ = per_ns_df.timestamp
```

## Develop

The plugin source code can be found on [GitHub](https://github.com/pixie-labs/grafana-plugin/). To contribute to the Grafana Pixie Datasource plugin, please check out our [Contribution Guidelines](https://github.com/pixie-labs/grafana-plugin/blob/main/CONTRIBUTING.md).

## Get Help

- Report issues on [GitHub](https://github.com/pixie-labs/grafana-plugin/issues).
- Ask questions in the **#grafana-plugin** channel on Pixie's [Community Slack](http://slackin.withpixie.ai/).
