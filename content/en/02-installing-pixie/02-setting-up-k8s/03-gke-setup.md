---
title: "GKE"
metaTitle: "Install | Install Guides | GKE"
metaDescription: "How to install Pixie in GKE"
order: 3
featuredGuide: true
icon: google-gke-logo.svg
redirect_from:
    - /installing-pixie/install-guides/gke-setup/
---

## Set up your GKE Cluster

Skip this section if you already have a target cluster set up.

If you don't, follow the [GKE quick start](https://cloud.google.com/kubernetes-engine/docs/quickstart) guide or the steps below:

### Prerequisites

Install [gcloud SDK](https://cloud.google.com/sdk/install)

Install the `kubectl` by running:

```bash
gcloud components install kubectl
```

Set a default project:

```bash
gcloud config set project project-id
```

Set a default compute zone:

```bash
gcloud config set compute/zone compute-zone
```

### Create the cluster

Run the following command to create a 2 node cluster:

```bash
gcloud container clusters create cluster-name --num-nodes=2 --machine-type=e2-standard-2
```

Please review, GCP's [docs](https://cloud.google.com/kubernetes-engine/docs/concepts/cluster-architecture) for more deployment details and insructions.

### Connect to the Cluster

Once created, get authentication credentials:

```bash
gcloud container clusters get-credentials cluster-name
```

And, verify you have the intended nodes active:

```bash
kubectl get nodes
```

## Deploy Pixie

Once connected, follow the [install steps](/installing-pixie/install-guides) to deploy Pixie.
