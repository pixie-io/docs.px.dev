---
title: "Minikube"
metaTitle: "Install | Install Guides | Minikube"
metaDescription: "How to install Pixie in Minikube"
order: 1
featuredGuide: true
icon: kubernetes-logo.svg
redirect_from:
    - /installing-pixie/install-guides/minikube-setup/
---

<Alert variant="outlined" severity="warning">
  Pixie does not work on minikube on Mac M1 machines. Adding support for ARM machines is scheduled for Q1'2023. For updates, follow <a href="https://github.com/pixie-io/pixie/issues/147">this issue</a>.
</Alert>

Here are the steps to set-up Pixie in a local K8s environment using [minikube](https://kubernetes.io/docs/getting-started-guides/minikube/).

## Install kubectl

Install `v1.10.0+` as described here: [install kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)

## Install minikube

Install `v1.3.1+` with as decribed here: [install minikube](https://kubernetes.io/docs/tasks/tools/install-minikube/)

#### For Mac users

To run minikube, your mac will need a way to run a Linux VM. We recommend hyperkit as the most compatible and lightweight option: [install hyperkit](https://minikube.sigs.k8s.io/docs/drivers/hyperkit/)

## Create Cluster

<Alert variant="outlined" severity="warning">
  For minikube versions 1.16+, the flannel CNI (`--cni=flannel`) is required. See the <a href="https://github.com/pixie-io/pixie/issues/298">GitHub issue</a> for updates.
</Alert>

To create the minikube cluster, run the following command. Linux users should use the `kvm2`driver and Mac users should use the `hyperkit` driver. Other drivers, including the `docker` driver, are not supported.

```
minikube start --driver=<kvm2|hyperkit> --cni=flannel --cpus=4 --memory=8000 -p=<cluster-name>
```

CPU and memory requirements are set to accommodate the included demo application.

To deploy a specific K8s version [supported by Pixie](/installing-pixie/requirements), also add the following flag `--kubernetes-version=v1.12.0`.

## Verify

Run `kubectl get nodes` to verify your cluster is up and running. Run `kubectl config current-context` to verify that `kubectl` is pointing to your cluster.

## Deploy Pixie

Once your cluster is up, follow the [install steps](/installing-pixie/install-guides) to deploy Pixie.
