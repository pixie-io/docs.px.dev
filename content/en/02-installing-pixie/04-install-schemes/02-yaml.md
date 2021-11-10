---
title: "YAML"
metaTitle: "Install | Install Schemes (optional) | YAML"
metaDescription: "How to install Pixie via YAML"
order: 2
---

## Prerequisites

- Review Pixie's [requirements](/installing-pixie/requirements) to make sure that your Kubernetes cluster is supported.

- Determine if you already have [Operator Lifecycle Manager](https://docs.openshift.com/container-platform/4.5/operators/understanding/olm/olm-understanding-olm.html) (OLM) deployed to your cluster, possibly to the default `olm` namespace. Pixie uses the Kubernetes [Operator pattern](https://kubernetes.io/docs/concepts/extend-kubernetes/operator/) to manage its Vizier, which handles data collection and query execution (see the [Architecture](/about-pixie/what-is-pixie/#architecture) diagram). The OLM is used to install, update and manage the Vizier Operator.

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

<Alert variant="outlined" severity="info">
  If your cluster already has Operator Lifecycle Manager (OLM) deployed, install Pixie using the `deployOLM=false` flag.
</Alert>

``` bash
# Extract YAML (No OLM present on cluster).
px deploy --extract_yaml <NAME_OF_PIXIE_YAMLS_FOLDER> --deploy_key <PIXIE_DEPLOYMENT_KEY>

# Extract YAML (OLM already exists on cluster).
px deploy --extract_yaml <NAME_OF_PIXIE_YAMLS_FOLDER> --deploy_key <PIXIE_DEPLOYMENT_KEY> --deploy_olm=false

```

**Note:** The extracted YAMls does not include manifests for each sub-component of Pixie. It includes manifests for etcd, NATS and the cloud-connector service which downloads the manifests for the necessary services and daemonsets.

## 5. Deploy Pixie

Deploy Pixie in your target cluster by running:

``` bash
# Deploy
kubectl apply --recursive -f <NAME_OF_PIXIE_YAMLS_FOLDER>
```

Pixie will deploy pods to the `pl`, `px-operator`, and `olm`(if deploying the OLM) namespaces.

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

### More Deploy Options

For more deploy options that you can specify to configure Pixie, refer to our [deploy options](/reference/admin/deploy-options).
