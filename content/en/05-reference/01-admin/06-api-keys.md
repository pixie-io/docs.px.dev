---
title: "Managing API Keys"
metaTitle: "Reference | Admin | API Keys"
metaDescription: "Why and when to use API keys."
order: 6
---

API keys are used to authenticate custom applications that use the [Pixie API](/reference/api/overview) to query data from the Pixie Platform.

Pixie API keys are opaque and start with the `px-api-` prefix. A single API key can be used by multiple applications.

## Create an API Key

You can create an API key using either the CLI or Live UI.

### Using the CLI

In the terminal, run

```bash
px api-key create
```

Copy the output value labeled `Key`:

::: div image-l
<svg title='CLI output for `px api-key create` command.' src='admin/cli-create-api-key.png'/>
:::

### Using the Live UI

To create an API key using the Live UI:

1. Select your profile picture in the top right corner.
2. Select "Admin" from menu.
3. Select the "API Keys" tab along the top of the Admin page.
4. Select the "+ New Key" button in the top right corner. A new key will be added to the table below.
5. From the "Actions" column of the table below, select the "..." button, then "Copy Value."

<svg title='API Key interface in the Live UI Admin page.' src='admin/live-ui-create-api-key.png'/>
