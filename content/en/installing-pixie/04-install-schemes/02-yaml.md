---
title: "YAML"
metaTitle: "Install | Install Schemes (optional) | YAML"
metaDescription: "How to install Pixie via YAML"
order: 2
---

## 1. Install the Pixie CLI

The CLI is used to get Pixie's YAML files. You can install the Pixie CLI following the directions [here](/installing-pixie/install-schemes/cli/).

## 2. (Optional) Use the CLI to Check Pixie's Requirements

Check if your K8s cluster meets Pixie's [requirements](/installing-pixie/requirements) by running:

```bash
px deploy --check_only
```

If your cluster fails any checks, you may still proceed with installation, but it is unlikely that Pixie will work on your cluster.

## 3. Create a Deployment Key

Create a deployment key following the directions [here](/reference/admin/deploy-keys/#create-a-deploy-key).

## 4. Extract Manifests

Create a directory to save Pixie's manifest files and run the following CLI commands to extract them:

``` bash
# Extract YAML
px deploy \
    --extract_yaml <NAME_OF_PIXIE_YAMLS_FOLDER> \
    --deploy_key <PIXIE_DEPLOYMENT_KEY>
```

**Note:** The extracted YAMls does not include manifests for each sub-component of Pixie. It includes manifests for etcd, NATS and the cloud-connector service which downloads the manifests for the necessary services and daemonsets.

## 5. Deploy

Deploy Pixie in your target cluster by running:

``` bash
# Deploy
kubectl apply --recursive -f <NAME_OF_PIXIE_YAMLS_FOLDER>
```

## 6. Verify

To verify that Pixie is running in your environment you can check the [admin page](https://work.withpixie.ai/admin) or run:

``` bash
# Check pods are up
kubectl get pods -n pl

# Check Pixie Platform status
px get viziers

# Check PEM stats
px get pems
```
