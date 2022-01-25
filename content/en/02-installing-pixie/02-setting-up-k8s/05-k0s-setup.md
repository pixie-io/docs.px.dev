---
title: "k0s"
metaTitle: "Install | Install Guides | k0s"
metaDescription: "How to install Pixie in k0s"
order: 5
featuredGuide: true
icon: kubernetes-logo.svg
---

To set up Pixie on [k0s](https://kubernetes.io/docs/getting-started-guides/minikube/), you'll need to:

1. Create a k0s cluster
2. (Optional) Install a volume provisioner in the cluster
3. Install Pixie

## Create a k0s Cluster

Follow the k0s [Quick Start Guide](https://docs.k0sproject.io/latest/install/) to set up a K8s cluster with a single node that includes both the controller and the worker.

```bash
# Download k0s
curl -sSLf https://get.k0s.sh | sudo sh

# Install k0s as a service
sudo k0s install controller --single

# Start k0s as a service
sudo k0s start

# Check service, logs and k0s status
sudo k0s status
```

## (Optional) Install a Volumne Provisioner

[Self-Hosted Pixie](/installing-pixie/install-guides/self-hosted-pixie) users will need a PersistentVolume.

1. Follow the [OpenEBS Guide](https://docs.openebs.io/docs/next/uglocalpv-hostpath.html) to set up a local PV.

```bash
export KUBECONFIG=path-to-kubeconfig-from-previous-step
kubectl apply -f https://openebs.github.io/charts/openebs-operator-lite.yaml
kubectl apply -f https://openebs.github.io/charts/openebs-lite-sc.yaml
```

2. create your own StorageClass with custom BasePath, save the following StorageClass definition as sc.yaml

```bash
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: local-hostpath
  annotations:
    openebs.io/cas-type: local
    cas.openebs.io/config: |
      - name: StorageType
        value: hostpath
      - name: BasePath
        value: /var/local-hostpath
provisioner: openebs.io/local
reclaimPolicy: Delete
volumeBindingMode: WaitForFirstConsumer
```

3. Apply the yaml:

```bash
kubectl apply -f sc.yaml
```

## Install Pixie

Once your cluster is up, follow the [install steps](/installing-pixie/install-guides) to deploy Pixie.
