---
title: "AKS"
metaTitle: "Install | Install Guides | AKS"
metaDescription: "How to install Pixie in AKS"
featuredGuide: true
icon: microsoft-aks-logo.svg
---

## Set up your AKS Cluster

Skip this section if you already have a target cluster set up.

If you don't, follow the [AKS quick start](https://docs.microsoft.com/en-us/azure/aks/kubernetes-walkthrough) guide or the steps below:

### Prerequisites

- Install [CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest) and login by running `az login`
- You can also use Azure's [cloud shell](https://shell.azure.com) to manage from your browser.

### Create the cluster

Run the following command to create a 2 node cluster:

```
az aks create --resource-group myResourceGroup --name myAKSCluster --node-count 2 --enable-addons monitoring --generate-ssh-keys
```

Or, use the portal based on instructions [here](https://docs.microsoft.com/en-us/azure/aks/kubernetes-walkthrough-portal)


### Connect to the Cluster

Update kubeconfig to point to the right cluster:

```
az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
```

And, verify you have the intended nodes active:

```
kubectl get nodes
```

## Deploy Pixie

Once connected, follow the [quick-start guide](/installing-pixie/quick-start) to deploy Pixie.
