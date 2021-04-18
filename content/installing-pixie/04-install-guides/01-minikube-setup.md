---
title: "Minikube"
metaTitle: "Install | Install Guides | Minikube"
metaDescription: "How to install Pixie in Minikube"
featuredGuide: true
icon: kubernetes-logo.svg
---

Here are the steps to set-up Pixie in a local K8s environment using [minikube](https://kubernetes.io/docs/getting-started-guides/minikube/).


## Install kubectl

Install `v1.10.0+` as described here: [install kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)

## Install minikube

Install `v1.3.1+` with as decribed here: [install minikube](https://kubernetes.io/docs/tasks/tools/install-minikube/)

#### For Mac users:

To run minikube, your mac will need a way to run a Linux VM. We recommend hyperkit as the most compatible and lightweight option: [install hyperkit](https://minikube.sigs.k8s.io/docs/drivers/hyperkit/)


## Create Cluster

Run `minikube start --cpus=4 --memory=6000 -p=<cluster-name>`. To deploy a specific K8s version [supported by Pixie](/installing-pixie/requirements), also add the following flag `--kubernetes-version=v1.12.0`.

Linux users: The `docker` driver is not supported, so also add `--driver=kvm2` to the minikube start command.

Note: CPU and memory requirements are set to accommodate the included demo application.

## Verify

Run `minikube dashboard` or `kubectl get nodes` to verify your cluster is up and running.

## Deploy Pixie

Once your cluster is up, follow the [quick-start guide](/installing-pixie/quick-start) to deploy Pixie.
