---
title: "Updating Pixie"
metaTitle: "Reference | Admin | Updating Pixie"
metaDescription: "Steps to update Pixie."
order: 10
redirect_from:
    - /installing-pixie/updating-pixie
---

Pixie has three components that can be updated:

- [Updating the CLI](/reference/admin/updating-pixie/#updating-the-cli)
- [Updating Pixie Cloud & Vizier](/reference/admin/updating-pixie/#updating-pixie-cloud-and-vizier)

## Updating the CLI

1. Check the version of Pixie's [CLI tool](/installing-pixie/install-schemes/cli) you are running with:

```bash
px version
```

2. Compare your CLI version with the [latest release](/reference/admin/product-updates/#pixie-cli).

3. If necessary, update the CLI with:

```bash
px update cli
```

## Updating Pixie Cloud & Vizier

Pixie's [CLI tool](/installing-pixie/install-schemes/cli) is required to update Pixie Vizier. To update Pixie Cloud and Vizier:

1. Check your Vizier version with the CLI or by looking at the Live UI Admin page (`/admin/clusters`). To check the `Vizier Version` using the CLI, run:

```bash
# Check Pixie Vizier Version
px get viziers
```

2. Compare your Vizier version to the [latest release](/reference/admin/product-updates/#pixie-platform).

3. Update your fork / clone of the [Pixie repo](https://github.com/pixie-io/pixie).

4. (Optional) Update the version numbers in the [`artifact_tracker_versions.yaml` file](https://github.com/pixie-io/pixie/blob/main/k8s/cloud/public/artifact_tracker_versions.yaml). The release versions in this file are periodically updated, but do not track the latest release. To find the latest release, check the release notes:

>> - [PL_VIZIER_VERSION](/reference/admin/product-updates/#pixie-platform)
>> - [PL_CLI_VERSION](reference/admin/product-updates/#pixie-cli)
>> - [PL_OPERATOR_VERSION](/reference/admin/product-updates/#pixie-operator)

5. Re-deploy Pixie Cloud by running the following . This step assumes you previously deployed Pixie cloud to the default namespace (`plc`).

```bash
kustomize build k8s/cloud/public/ | kubectl apply -f - --namespace=plc
```

6. Update Pixie Vizier with:

```
px update vizier
```
