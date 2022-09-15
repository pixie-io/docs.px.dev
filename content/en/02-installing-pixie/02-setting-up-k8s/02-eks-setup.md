---
title: "EKS"
metaTitle: "Install | Install Guides | EKS"
metaDescription: "How to install Pixie in EKS"
order: 2
featuredGuide: true
icon: amazon-eks-logo.svg
redirect_from:
    - /installing-pixie/install-guides/eks-setup/
---

## Set up your EKS Cluster

Note: Skip this section if you already you have a target cluster set up.

If you don't have a cluster ready you can set one up based on the [Getting Started with Amazon EKS](https://docs.aws.amazon.com/eks/latest/userguide/getting-started.html) guide.

### Prerequisites

- [Install](https://aws.amazon.com/cli/) and [configure](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html) the AWS CLI
- Verify your AWS credentials are stored in `~/.aws/credentials` or are stored as [environment variables](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-envvars.html)
- Verify your user profile by running `aws sts get-caller-identity`
- Install eksctl based on these [instructions](https://docs.aws.amazon.com/eks/latest/userguide/getting-started-eksctl.html)

### Create the cluster

Create a cluster with managed node-pools using [eksctl](https://eksctl.io/usage/creating-and-managing-clusters/):

```bash
eksctl create cluster
```

Update kubeconfig to point to the right cluster:

```bash
aws eks update-kubeconfig --name <cluster-name>
```

Verify that you are pointing to the right cluster

```bash
kubectl get svc
```

You can deploy clusters with alternate configurations or by using the AWS console. You can view our [requirements](/installing-pixie/requirements) to determine recommended node level compute requirements.

### Verify whether your cluster has a storage class

If you want to use the default settings for installing Pixie's Vizier module, you'll want to ensure that your EKS cluster has [persistent volume and storage classes](https://docs.aws.amazon.com/eks/latest/userguide/storage-classes.html) set up.

If your cluster does not have an accessible storage class type, you'll want to deploy with the [etcd operator](/reference/admin/deploy-options/#select-metadata-storage-option). Note that self-hosted Pixie Cloud requires persistent volumes.

## Deploy Pixie

Once connected, follow the [install steps](/installing-pixie/install-guides) to deploy Pixie.
