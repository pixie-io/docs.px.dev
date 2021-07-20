---
title: "Minikube"
metaTitle: "Install | Install Guides | Minikube"
metaDescription: "How to install Pixie in Minikube"
featuredGuide: true
icon: kubernetes-logo.svg
redirect_from:
    - /installing-pixie/install-guides/minikube-setup/
---

Here are the steps to set-up Pixie in a local K8s environment using [minikube](https://kubernetes.io/docs/getting-started-guides/minikube/).


## Install kubectl

Install `v1.10.0+` as described here: [install kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)

## Install minikube

Install `v1.3.1+` with as decribed here: [install minikube](https://kubernetes.io/docs/tasks/tools/install-minikube/)

#### For Mac users:

To run minikube, your mac will need a way to run a Linux VM. We recommend hyperkit as the most compatible and lightweight option: [install hyperkit](https://minikube.sigs.k8s.io/docs/drivers/hyperkit/)


## Create Cluster

Run `minikube start --driver=<kvm2|hyperkit> --cpus=4 --memory=6000 -p=<cluster-name>`. 
Linux users should use the `kvm2`driver and Mac users should use the `hyperkit` driver. Other drivers, including the `docker` driver, are not supported.

CPU and memory requirements are set to accommodate the included demo application.

To deploy a specific K8s version [supported by Pixie](/installing-pixie/requirements), also add the following flag `--kubernetes-version=v1.12.0`.

## Verify

Run `minikube dashboard` or `kubectl get nodes` to verify your cluster is up and running.

## Deploy Pixie

Once your cluster is up, follow the [install steps](/installing-pixie/install-guides) to deploy Pixie.
