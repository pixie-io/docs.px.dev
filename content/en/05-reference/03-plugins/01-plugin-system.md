---
title: "Pixie Plugin System"
metaTitle: "Reference | Plugins | Pixie Plugin System "
metaDescription: "Pixie's Plugin System"
order: 1
---

Pixie's primary focus is to build a real-time debugging platform, not a full-fledged observability solution. Use the plugin system to integrate with external tools to enable capabilities like long-term data retention and alerting.

- [Long-term Data Retention](#long-term-data-retention): Pixie retains up to 24 hours of data. Leverage an external datastore for long-term data retention by sending Pixie data in the [OpenTelemetry](https://opentelemetry.io/) format. Future support will be added for querying long-term data from within the Pixie UI.

- [Alerts](#alerts) (coming soon): Power alerts using Pixie's rich dataset, all configurable from within the Pixie UI.

## Enabling a Plugin

Plugins can be configured from within the Admin UI.

<svg title='Plugins are accessible through the Admin UI.' src='plugin/plugins_page.png'/>

1. Open the Live UI and navigate to the Plugins tab on the Admin page (`/admin/plugins`).
2. Find the plugin you wish to enable and click the toggle to enable/disable the plugin.
3. Expand the plugin row to specify the necessary configuration values. The required set of fields differs per plugin provider, and usually contains information such as API keys which are used for authentication.

## Long-term Data Retention

<Alert variant="outlined" severity="info">Check out the <a href="/tutorials/integrations/otel/">tutorial</a> to how to export data in the OTel format.</Alert>

Enable a plugin which offers long-term data retention capabilities to send Pixie data to an external datastore. This plugin allows you to configure PxL scripts to export data at regularly scheduled intervals. This only currently supports exporting data through the [OpenTelemetry](https://opentelemetry.io/) format.

By default, the plugin provider has configured a set of preset scripts. These will automatically start running and exporting data from all clusters in the org as soon as the plugin is enabled. Users can also choose to export custom data by creating a custom export script.

### Configuring Preset Export Scripts

<svg title='You can view preset scripts for a plugin in the Data Export page.' src='plugin/preset_scripts.png'/>

1. [Enable a plugin provider](#enabling-a-plugin) which supports long-term data retention.
2. Open the Live UI and navigate to the Data Export page in the sidebar (`/configure-data-export`).
3. All preset scripts are listed under `<Plugin Provider> Scripts`.
4. Click the toggle to enable/disable the export from the preset script.
5. Click the gear icon to configure the preset script. Name, description, and PxL is uneditable. However, users may choose which clusters to export from and how frequently the script is run.
6. Click "Save" to update the script with your changes.

### Creating Custom Export Scripts

<svg title='Create a custom script in the Data Export page by clicking `Create Scripts`.' src='plugin/custom_scripts.png'/>

1. [Enable a plugin provider](#enabling-a-plugin) which supports long-term data retention.
2. Open the Live UI and navigate to the Data Export page in the sidebar (`/configure-data-export`).
3. Under `Custom Scripts`, click the `Create Scripts` button on the right-hand side.
4. Enter a script name and description.
5. Select which clusters to export from. If none is specified, data will be exported from all clusters in the org.
6. Enter the PxL script. This script should contain a `px.export` call for exporting data to the OpenTelemetry format. See our [OpenTelemetry export tutorial](/tutorials/integrations/otel/) and [OpenTelemetry export reference docs](/reference/pxl/otel-export/) for more information. No `endpoint` needs to be specified to the `px.otel.Data` object, as this will be filled in automatically based on the selected plugin provider.
7. Select how often this script should run.
8. Select the plugin provider to export this data to.
9. Click "Create" to save your settings. Data export should start immediately.

## Alerts

Coming soon!

## Contributing a Plugin

Interested in contributing a Pixie plugin?

Check out our [Plugin Repository](https://github.com/pixie-io/pixie-plugin) for more details.
