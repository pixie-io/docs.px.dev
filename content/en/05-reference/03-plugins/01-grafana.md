---
title: "Grafana Datasource Plugin"
metaTitle: "Reference | Plugins | Grafana Datasource Plugin "
metaDescription: "Pixie's Grafana Datasource Plugin"
order: 1
---

The Pixie Datasource plugin allows you to visualize data from the Pixie observability platform in Grafana.

## Installation

Instructions for installing the plugin can be found [here](https://github.com/pixie-io/grafana-plugin/blob/main/README.md).

## Usage

To get started using the plugin, check out the [tutorial](/tutorials/integrations/grafana).

### Configuration

The plugin requires a Pixie API key and cluster ID to execute queries. Grafana encrypts these values.

- To create an API key, follow the directions [here](/reference/admin/api-keys/#create-an-api-key).
- To find your cluster's ID, follow the directions [here](/reference/admin/cluster-id/#find-the-cluster-id).

### Queries

The plugin uses the Pixie Language (PxL) to query telemetry data collected by the Pixie platform.

- Learn more about the PxL language [here](/reference/pxl/).
- Learn how to write a PxL script [here](/tutorials/pxl-scripts/write-pxl-scripts).

<Alert variant="outlined" severity="warning">
  Note that the plugin does not support Vis Spec input. PxL queries must return a table using the `px.display()` call.
</Alert>

If there are syntax errors in your PxL query, Grafana will display an error message.

If an output table has a column containing timestamps, the plugin will sort the table by the first timestamp column.

Grafana requires wide table format to visualize data in a Graph or Time series. If a query output table has a column of timestamps with the heading `time_`, it will automatically convert the table to wide if necessary.

### Macros

Grafana uses macros to add dashboard context to a query. The following macros are supported for PxL queries executed by plugin:

- `__time_from` will be replaced by the start of the currently active time selection. Example usage:

```python
df = px.DataFrame(table='http_events', start_time= __time_from)
```

- `__time_to` will be replaced by the end of the currently active time selection. Example usage:

```python
df = px.DataFrame(table='http_events', start_time= __time_from, end_time=__time_to)
```

- `__interval` will be replaced by the suggested duration between time points. Interval is set by the Grafana UI in the **Query options** section in the **Query** tab. Example usage:

```python
df.timestamp = px.bin(df.time_, __interval)
```

## Develop

The plugin source code can be found on [GitHub](https://github.com/pixie-io/grafana-plugin/). To contribute to the Grafana Pixie Datasource plugin, please check out our [Contribution Guidelines](https://github.com/pixie-io/grafana-plugin/blob/main/CONTRIBUTING.md).

## Get Help

- Report issues on [GitHub](https://github.com/pixie-io/grafana-plugin/issues).
- Ask questions in the **#grafana-plugin** channel on Pixie's [Community Slack](http://slackin.px.dev/).
