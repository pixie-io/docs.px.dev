---
title: "Requirements"
metaTitle: "Install | Requirements"
metaDescription: "Resource requirements to install Pixie"
order: 1
---

Below are the requirements for deploying Pixie to your Kubernetes (K8s) cluster.

Please refer to the [install guides](/installing-pixie/install-guides/) for information on how to install Pixie to your K8s cluster.

## Kubernetes

Kubernetes `v1.16+` is required.

### Production Environments

| K8s Environment  | Support                                                         |
| :--------------- | :-------------------------------------------------------------- |
| AKS              | Supported                                                       |
| EKS              | Supported (includes support on Bottlerocket AMIs)               |
| EKS Fargate      | Not Supported ([Fargate does not support eBPF](https://github.com/aws/containers-roadmap/issues/1027)) |
| GKE              | Supported                                                       |
| GKE Autopilot    | Not Supported ([Autopilot does not support eBPF](https://github.com/pixie-io/pixie/issues/278#issuecomment-853269290)) |
| OpenShift        | Supported                                                       |
| kOps             | Supported                                                       |
| Self-hosted      | Generally supported, see requirements below including Linux kernel version. |

### Local Development Environments

For local development, we recommend using Minikube with a VM driver (`kvm2` on Linux, `hyperkit` on Mac). Note that Kubernetes environments that run inside a container are not currently supported.

| K8s Environment                 | Support       |
| :------------------------------ | :------------ |
| Docker Desktop                  | Not supported |
| k0s                             | Supported     |
| k3s                             | Supported     |
| k3d                             | Not Supported ([k3d runs k3s clusters inside Docker container "nodes"](https://github.com/pixie-io/pixie/issues/337#issuecomment-949012061)) |
| kind                            | Not Supported ([kind runs K8s clusters inside Docker container "nodes"](https://github.com/pixie-io/pixie/issues/337#issuecomment-949012061)) |
| minikube with `driver=kvm2`     | Supported     |
| minikube with `driver=hyperkit` | Supported     |
| minikube with `driver=docker`   | Not Supported |
| minikube with `driver=none`     | Not Supported |

## Memory

Memory requirements for your cluster nodes are as follows:

| Minimum   | Notes                                                                  |
| :-------- | :--------------------------------------------------------------------- |
| 1GiB      | To accommodate application pods, 4GiB+ total per node is recommended.  |

## CPU

Pixie requires an `x86-64` architecture.

|         | Support           |
| :------ | :---------------- |
| x86-64  | Supported         |
| ARM     | Not supported     |

## Operating System

Pixie runs on Linux nodes only.

|         | Support         | Version           |
| :------ | :-------------  | :---------------- |
| Linux   | Supported       | v4.14+            |
| Windows | Not Supported   | Not in roadmap    |

### Linux Distributions

The following is a list of Linux distributions that have been tested.

|              |  Version              |
|:-----------  |  :------------------- |
| Ubuntu       |  18.04+               |
| Debian       |  10+                  |
| RHEL         |  8+                   |
| COS          |  73+                  |

Pixie may also work on other distributions.

<Alert variant="outlined" severity="info">We recommended that Linux headers be installed on a cluster's nodes.</Alert>

## Network Traffic

Pixie's Vizier Module sends outgoing HTTPS/2 requests to `withpixie.ai:443`.

Your cluster's data flows through Pixie's control cloud via a reverse proxy as encrypted traffic without any persistence. This allows users to access data without being in the same VPC/network as the cluster. Pixie offers [end-to-end encryption](https://docs.px.dev/about-pixie/faq#how-does-pixie-secure-its-data) for telemetry data in flight.
