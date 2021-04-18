---
title: "YAML"
metaTitle: "Install | Install Schemes | YAML"
metaDescription: "How to install Pixie via YAML"
order: 2
---

## 1. Check requirements

Check if your K8s cluster meets Pixie's [requirements](/installing-pixie/requirements) by running:

```bash
px deploy --check_only
```

If your cluster fails any checks, you may still proceed with installation, but it is unlikely that Pixie will work on your cluster. 

## 2. Create deployment key
Create a deployment key from the [admin page](https://work.withpixie.ai/admin) or by running:

``` bash
# Create deployment key
px deploy-key create
```
**Note:** The deploy key can be used to install on any number of clusters. If you are installing in a cluster previously seen by Pixie, then the install merges the history with the previous version in Pixie.

## 3. Extract manifests

Create a directory to save Pixie's manifest files and run the following CLI commands to extract them:

``` bash
# Extract YAML
px deploy \
    --extract_yaml <NAME_OF_PIXIE_YAMLS_FOLDER> \
    --deploy_key <PIXIE_DEPLOYMENT_KEY>
```

**Note:** The extracted YAMls does not include manifests for each sub-component of Pixie. It includes manifests for etcd, NATS and the cloud-connector service which downloads the manifests for the necessary services and daemonsets.

## 4. Deploy

Deploy Pixie in your target cluster by running:

``` bash
# Deploy
kubectl apply --recursive -f <NAME_OF_PIXIE_YAMLS_FOLDER>
```

## 5. Verify

To verify that Pixie is running in your environment you can check the [admin page](https://work.withpixie.ai/admin) or run:

``` bash
# Check pods are up
kubectl get pods -n pl

# Check Pixie Platform status
px get viziers

# Check PEM stats
px get pems
```
