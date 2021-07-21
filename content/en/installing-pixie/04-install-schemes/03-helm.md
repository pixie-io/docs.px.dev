---
title: "Helm"
metaTitle: "Install | Install Schemes (optional) | Helm"
metaDescription: "How to install Pixie via Helm."
order: 3
---

<Alert variant="outlined" severity="warning">
  Pixie's charts require the use of Helm 3. Helm 2 is not currently supported.
</Alert>

## Prerequisites

- Review Pixie's [requirements](/installing-pixie/requirements) to make sure that your Kubernetes cluster is supported.

- Determine if you already have an [operator lifecycle manager](https://docs.openshift.com/container-platform/4.5/operators/understanding/olm/olm-understanding-olm.html) (OLM) deployed to your cluster, possibly to the default `olm` namespace. Pixie uses the Kubernetes [Operator pattern](https://kubernetes.io/docs/concepts/extend-kubernetes/operator/) to manage its Vizier, which handles data collection and query execution (see the [Architecture](/about-pixie/what-is-pixie/#system-architecture) diagram). The OLM is used to install, update and manage the Vizier Operator.

## 1. (Optional) Use the Pixie CLI to Check the Requirements

Install the Pixie CLI following the directions [here](/installing-pixie/install-schemes/cli/).

Check if your K8s cluster meets Pixie's [requirements](/installing-pixie/requirements) by running:

```bash
px deploy --check_only
```

If your cluster fails any checks, you may still proceed with installation, but it is unlikely that Pixie will work on your cluster.

## 2. Create deployment key

Create a deployment key following the directions [here](/reference/admin/deploy-keys/#create-a-deploy-key).

## 3. Deploy Pixie

Deploy Pixie in your target cluster by running:

<Alert variant="outlined" severity="info">
  If your cluster already has an operator lifecycle manager (OLM) deployed, install Pixie using the `deployOLM=false` flag.
</Alert>

``` bash
# Add the Pixie operator chart.
helm repo add pixie-operator https://pixie-operator-charts.storage.googleapis.com

# Get latest information about Pixie chart.
helm repo update

# Install the Pixie chart (No OLM present on cluster).
helm install pixie pixie-operator/pixie-operator-chart --set deployKey=<deploy-key-goes-here> --set clusterName=<cluster-name> --namespace pl --create-namespace

# Install the Pixie chart (OLM already exists on cluster).
helm install pixie pixie-operator/pixie-operator-chart --set deployKey=<deploy-key-goes-here> --set clusterName=<cluster-name> --namespace pl --create-namespace
--deployOLM=false
```

Pixie will deploy pods to the `pl`, `px-operator`, and `olm`(if deploying the OLM) namespaces.

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
