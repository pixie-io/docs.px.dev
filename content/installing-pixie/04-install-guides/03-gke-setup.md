---
title: "GKE"
metaTitle: "Install | Install Guides | GKE"
metaDescription: "How to install Pixie in GKE"
featuredGuide: true
icon: google-gke-logo.svg
---

## Set up your GKE Cluster

Skip this section if you already have a target cluster set up.

If you don't, follow the [GKE quick start](https://cloud.google.com/kubernetes-engine/docs/quickstart) guide or the steps below:

### Prerequisites

Install [gcloud SDK](https://cloud.google.com/sdk/install)

Install the `kubectl` by running:

```
gcloud components install kubectl
```

Set a default project:

```
gcloud config set project project-id
```

Set a default compute zone:

```
gcloud config set compute/zone compute-zone
```

### Create the cluster

Run the following command to create a 2 node cluster:

```
gcloud container clusters create cluster-name --num-nodes=2
```

Please review, GCP's [docs](https://cloud.google.com/kubernetes-engine/docs/concepts/cluster-architecture) for more deployment details and insructions.

### Connect to the Cluster

Once created, get authentication credentials:

```
gcloud container clusters get-credentials cluster-name
```

And, verify you have the intended nodes active:

```
kubectl get nodes
```

## Deploy Pixie

Once connected, follow the [quick-start guide](/installing-pixie/quick-start) to deploy Pixie.
