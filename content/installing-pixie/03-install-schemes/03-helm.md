---
title: "Helm"
metaTitle: "Install | Install Schemes | Helm"
metaDescription: "How to install Pixie via Helm"
order: 3
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

## 3. Deploy

Deploy Pixie in your target cluster by running:

``` bash
# add the Pixie chart
helm repo add pixie https://pixie-helm-charts.storage.googleapis.com

# get latest information about Pixie chart
helm repo update

# install the Pixie chart
helm install pixie pixie/pixie-chart --set deployKey=<deploy-key-goes-here>
```

## 4. Verify

To verify that Pixie is running in your environment you can check the [admin page](https://work.withpixie.ai/admin) or run:

``` bash
# Check pods are up
kubectl get pods -n pl

# Check Pixie Platform status
px get viziers

# Check PEM stats
px get pems
```
