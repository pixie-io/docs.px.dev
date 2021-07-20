---
title: "Helm"
metaTitle: "Install | Install Schemes (optional) | Helm"
metaDescription: "How to install Pixie via Helm."
order: 3
---

<Alert variant="outlined" severity="warning">
  Pixie's charts require the use of Helm 3. Helm 2 is not currently supported. 
</Alert>

## 1. (Optional) Use the Pixie CLI to Check the Requirements

Install the Pixie CLI following the directions [here](/installing-pixie/install-schemes/cli/).

Check if your K8s cluster meets Pixie's [requirements](/installing-pixie/requirements) by running:

```bash
px deploy --check_only
```

If your cluster fails any checks, you may still proceed with installation, but it is unlikely that Pixie will work on your cluster.

## 2. Create deployment key

Create a deployment key following the directions [here](/reference/admin/deploy-keys/#create-a-deploy-key).
## 3. Deploy

Deploy Pixie in your target cluster by running:

``` bash
# add the Pixie chart
helm repo add pixie https://pixie-helm-charts.storage.googleapis.com

# get latest information about Pixie chart
helm repo update

# install the Pixie chart
helm install pixie pixie/pixie-chart --set deployKey=<deploy-key-goes-here> --set clusterName=<cluster-name> --namespace <desired-namespace> --create-namespace
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
