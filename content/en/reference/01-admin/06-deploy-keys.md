---
title: "Managing Deploy Keys"
metaTitle: "Reference | Admin | Deploy Keys"
metaDescription: "Why and when to use deploy keys."
order: 6
---

Deploy keys allow Pixie's Cloud to associate a cluster with an organization.

When deploying Pixie onto a cluster [using the CLI](/installing-pixie/install-schemes/cli/), a deploy key is automatically created behind the scenes. When deploying with [YAML](/installing-pixie/install-schemes/yaml/) or [Helm](/installing-pixie/install-schemes/helm/), you will need to manually create a deploy key for use in the deployment process.

A deploy key can be used to install Pixie on any number of clusters. If you are installing in a cluster previously seen by Pixie, the install merges the history with the previous version in Pixie.

## Create a Deploy Key

You can create a deploy key using either the CLI or Live UI.

### Using the CLI

In the terminal, run

```bash
px deploy-key create
```

Copy the output value labeled `Key`:

::: div image-l
<svg title='CLI output for `px api-key create` command.' src='admin/cli-create-deploy-key.png'/>
:::

### Using the Live UI

1. Select your profile picture in the top right corner.
2. Select "Admin" from the menu.
3. From the Admin page, select the "Deployment Keys" tab along the top.
4. Select the "+ New Key" button in the top right corner. A new key will be added to the table below.
5. From the "Actions" column of the table below, select the "..." button, then "Copy Value."

<svg title='Deploy Key interface in the Live UI Admin page.' src='admin/live-ui-create-deploy-key.png'/>
