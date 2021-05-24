---
title: "EKS"
metaTitle: "Install | Install Guides | EKS"
metaDescription: "How to install Pixie in EKS"
featuredGuide: true
icon: amazon-eks-logo.svg
---

## Set up your EKS Cluster

Note: Skip this section if you already you have a target cluster set up.

If you don't have a cluster ready you can set one up based on the [Getting Started with Amazon EKS](https://docs.aws.amazon.com/eks/latest/userguide/getting-started.html) guide. An easier approach we recommend is to set it up with [eksctl](https://github.com/weaveworks/eksct) by following these steps:


### Prerequisites

- [Install](https://aws.amazon.com/cli/) and [configure](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html) the AWS CLI
- Verify your AWS credentials are stored in `~/.aws/credentials` or are stored as [environment variables](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-envvars.html)
- Verify your user profile by running `aws sts get-caller-identity`
- Install eksctl based on these [instructions](https://docs.aws.amazon.com/eks/latest/userguide/getting-started-eksctl.html)

### Create the cluster


Create a cluster with managed node-pools using [eksctl](https://eksctl.io/usage/eks-managed-nodegroups/):

```
eksctl create cluster --managed
```

Update kubeconfig to point to the right cluster:

```
aws eks update-kubeconfig --name <cluster-name>
```

Verify that you are pointing to the right cluster

```
kubectl get svc
```

You can deploy clusters with alternate configurations or by using the AWS console. You can view our [requirements](/installing-pixie/requirements) to determine recommended node level compute requirements.

## Deploy Pixie

Once connected, follow the [quick-start guide](/installing-pixie/quick-start) to deploy Pixie.
