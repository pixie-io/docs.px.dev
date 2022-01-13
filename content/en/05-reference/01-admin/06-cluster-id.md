---
title: "Find a Cluster ID"
metaTitle: "Reference | Admin | Find a Cluster ID"
metaDescription: "How to find a Cluster's ID."
order: 6
---

Cluster IDs allow unique identification of clusters with Pixie installed.

Cluster IDs are assigned automatically when Pixie is deployed. Redeploying Pixie to the same cluster will not change the cluster ID.

## Find the Cluster ID

You can find a cluster's ID using either the CLI or Live UI.

### Using the CLI

In the terminal, run:

```bash
# display cluster IDs for all clusters with Pixie installed
px get viziers
```

Copy the output value labeled `ID` for the specified cluster:

<svg title='CLI output for `px get viziers` command.' src='admin/cli-cluster-id.png'/>

### Using the Live UI

1. Select your profile picture in the top right corner.
2. Select "Admin" from menu.
3. Select the "Clusters" tab along the top of the Admin page.
2. For the specified cluster, hover over the `ID` column value next to your cluster's name to display the full 36-character string.

<svg title='Cluster table in the Live UI Admin page.' src='admin/live-ui-cluster-id.png'/>
