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
| GKE              | Supported                                                       |
| EKS              | Supported (includes support on Bottlerocket AMIs)               |
| AKS              | Supported                                                       |
| Self-hosted      | Generally supported, see requirements below including Linux kernel version. |

### Local Development Environments

For local development, we recommend using Minikube with a VM driver (`kvm2` on Linux, `hyperkit` on Mac). Note that Kubernetes environments that run inside a container are not currently supported.

| K8s Environment                 | Support       |
| :------------------------------ | :------------ |
| Minikube with `driver=kvm2`     | Supported     |
| Minikube with `driver=hyperkit` | Supported     |
| Minikube with `driver=docker`   | Not Supported |
| Minikube with `driver=none`     | Not Supported |
| Kind                            | Not Supported |
| Docker Desktop                  | Not supported |

## Memory

Memory requirements for your cluster nodes are as follows:

|                       | Minimum   | Notes                                                   |
| :-------------------  | :-------- | :------------------------------------------------------ |
| Memory                | 2GiB      | To accommodate application pods, 8GiB+ is recommended.  |

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

For an explanation of what data is sent over this connection, see Pixie's [Data Transfer Modes](/reference/admin/data-transfer-mode) section.
