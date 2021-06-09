---
title: "CLI (Recommended)"
metaTitle: "Install | Install Schemes | CLI"
metaDescription: "How to install Pixie via CLI"
order: 1
---

Pixie's CLI is the fastest and easiest way to install and manage your Pixie installation.

As shown in the [quick-start guide](/installing-pixie/quick-start), you can install and deploy Pixie with the following commands:

``` bash
# Install the Pixie CLI
bash -c "$(curl -fsSL https://withpixie.ai/install.sh)"

# Deploy the Pixie Platform in your K8s cluster
px deploy
```

## (Optional) Labeling Pixie's Resources

When deploying Pixie using the CLI, you have the option of adding one or more custom [labels](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/) to the K8s objects deployed by Pixie.

``` bash
# Deploy the Pixie Platform in your K8s cluster and give the deployed objects label(s)
px deploy --labels=key1=value1,key2=value2

# Example deployment with labeling:
px deploy --labels=application=pixie
```

Certain labels are reserved for internal use by Pixie. The following are reserved label strings that may _**not be**_ used:
- `"vizier-bootstrap"`
- `“component"`
- `“vizier-updater-dep"`
- `“app"`
