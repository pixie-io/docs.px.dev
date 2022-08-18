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

- Determine if you already have [Operator Lifecycle Manager](https://docs.openshift.com/container-platform/4.5/operators/understanding/olm/olm-understanding-olm.html) (OLM) deployed to your cluster, possibly to the default `olm` namespace. Pixie uses the Kubernetes [Operator pattern](https://kubernetes.io/docs/concepts/extend-kubernetes/operator/) to manage its Vizier, which handles data collection and query execution (see the [Architecture](/about-pixie/what-is-pixie/#architecture) diagram). The OLM is used to install, update and manage the Vizier Operator.

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
  If you are <a href="/installing-pixie/install-guides/self-hosted-pixie/">self-hosting Pixie Cloud</a>, set `devCloudNamespace`.
</Alert>

<Alert variant="outlined" severity="info">
  If your cluster already has Operator Lifecycle Manager (OLM) deployed, set `deployOLM=false`.
</Alert>

<Alert variant="outlined" severity="info">
  Please refer to <a href="/reference/admin/environment-configs">Environment-Specific Configurations</a> for other configurations that should be set for your specific Kubernetes environment.
</Alert>

```bash
# Add the Pixie operator chart.
helm repo add pixie-operator https://pixie-operator-charts.storage.googleapis.com

# Get latest information about Pixie chart.
helm repo update

# Install the Pixie chart (No OLM present on cluster).
helm install pixie pixie-operator/pixie-operator-chart --set deployKey=<deploy-key-goes-here> --set clusterName=<cluster-name> --namespace pl --create-namespace

# Install the Pixie chart (OLM already exists on cluster).
helm install pixie pixie-operator/pixie-operator-chart --set deployKey=<deploy-key-goes-here> --set clusterName=<cluster-name> --namespace pl --create-namespace --set deployOLM=false

# Install the Pixie chart (Self-hosting Pixie Cloud)
helm install pixie pixie-operator/pixie-operator-chart --set deployKey=<deploy-key-goes-here> --set clusterName=<cluster-name> --namespace pl --create-namespace --set devCloudNamespace plc

# Install Pixie with a memory limit for the PEM pods (per node). 2Gi is the default, 1Gi is the minimum recommended.
helm install pixie pixie-operator/pixie-operator-chart --set deployKey=<deploy-key-goes-here> --set clusterName=<cluster-name> --namespace pl --create-namespace --set deployOLM=false --set pemMemoryLimit=1Gi
```

Pixie will deploy pods to the `pl`, `px-operator`, and `olm`(if deploying the OLM) namespaces.

### More Deploy Options

For more deploy options that you can specify to configure Pixie, refer to our [deploy options](/reference/admin/deploy-options).

## 4. Verify

To verify that Pixie is running in your environment you can check the [admin page](https://work.withpixie.ai/admin) or run:

```bash
# Check pods are up
kubectl get pods -n pl

# Check Pixie Platform status
px get viziers

# Check PEM stats
px get pems
```
