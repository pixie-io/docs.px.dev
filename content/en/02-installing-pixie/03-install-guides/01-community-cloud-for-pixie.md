---
title: "Community Cloud for Pixie"
metaTitle: "Install | Install Guides | Community Cloud for Pixie"
metaDescription: "Getting started guide to setup Pixie"
order: 1
---

## Prerequisites

- Review Pixie's [requirements](/installing-pixie/requirements) to make sure that your Kubernetes cluster is supported.

- Determine if you already have [Operator Lifecycle Manager](https://docs.openshift.com/container-platform/4.5/operators/understanding/olm/olm-understanding-olm.html) (OLM) deployed to your cluster, possibly to the default `olm` namespace. Pixie uses the Kubernetes [Operator pattern](https://kubernetes.io/docs/concepts/extend-kubernetes/operator/) to manage its Vizier, which handles data collection and query execution (see the [Architecture](/about-pixie/what-is-pixie/#architecture) diagram). The OLM is used to install, update and manage the Vizier Operator.

- Pixie interacts with the Linux kernel to install BPF programs to collect telemetry data. In order to install BPF programs, Pixie [`vizier-pem-*`](/about-pixie/what-is-pixie/#architecture) pods require [privileged access](https://github.com/pixie-io/pixie/blob/e03434a5e41d82159aa7602638804159830f9949/k8s/vizier/base/pem_daemonset.yaml#L115).

## 1. Sign up

Visit our [product page](https://work.withpixie.ai/) and sign up.

## 2. Set up a Kubernetes cluster (optional)

If you don't have a Kubernetes cluster available, you can set up Minikube as a local sandbox environment following these [instructions](/installing-pixie/setting-up-k8s/minikube-setup).

## 3. Install the Pixie CLI

The easiest way to install Pixie's CLI is using the install script:

```bash
# Copy and run command to install the Pixie CLI.
bash -c "$(curl -fsSL https://withpixie.ai/install.sh)"
```

For alternate install options (Docker, Debian package, RPM, direct download of the binary) see the [CLI Install](/installing-pixie/install-schemes/cli/) page.

## 4. Deploy Pixie 🚀

Pixie's CLI is the fastest and easiest way to deploy Pixie. You can also deploy Pixie using [YAML](/installing-pixie/install-schemes/yaml) or [Helm](/installing-pixie/install-schemes/helm). You can use these steps to install Pixie to one or more clusters.

To deploy Pixie using the CLI:

<Alert variant="outlined" severity="info">
  If your cluster already has Operator Lifecycle Manager (OLM) deployed, deploy Pixie using the `--deploy_olm=false` flag.
</Alert>

<Alert variant="outlined" severity="info">
  Please refer to <a href="/reference/admin/environment-configs">Environment-Specific Configurations</a> for other configurations that should be set for your specific Kubernetes environment.
</Alert>

```bash
# List Pixie deployment options.
px deploy --help

# Deploy the Pixie Platform in your K8s cluster (No OLM present on cluster).
px deploy

# Deploy the Pixie Platform in your K8s cluster (OLM already exists on cluster).
px deploy --deploy_olm=false

# Deploy Pixie with a specific memory limit (2Gi is the default, 1Gi is the minimum recommended)
px deploy --pem_memory_limit=1Gi
```

Pixie deploys the following pods to your cluster. Note that the number of `vizier-pem` pods correlates with the number of nodes in your cluster, so your  deployment may contain more PEM pods.

```bash
NAMESPACE           NAME
olm                 catalog-operator
olm                 olm-operator
pl                  kelvin
pl                  nats-operator
pl                  pl-nats-1
pl                  vizier-certmgr
pl                  vizier-cloud-connector
pl                  vizier-metadata
pl                  vizier-pem
pl                  vizier-pem
pl                  vizier-proxy
pl                  vizier-query-broker
px-operator         77003c9dbf251055f0bb3e36308fe05d818164208a466a15d27acfddeejt7tq
px-operator         pixie-operator-index
px-operator         vizier-operator
```

To deploy Pixie to another cluster, change your `kubectl config current-context` to point to that cluster. Then repeat the same deploy commands shown in this step.

### More Deploy Options

For more deploy options that you can specify to configure Pixie, refer to our [deploy options](/reference/admin/deploy-options).

## 5. Invite others to your organization (optional)

Add users to your organization to share access to Pixie Live Views, query running clusters, and deploy new Pixie clusters. For instructions, see the [User Management & Sharing](/reference/admin/user-mgmt) reference docs.

## 6. Use Pixie

### Deploy a demo microservices app (optional)

Deploy a simple demo app to monitor using Pixie:

```bash
# List available demo apps.
px demo list

# Example: deploy Weaveworks' "sock-shop".
px demo deploy px-sock-shop
```

This demo application takes several minutes to stabilize after deployment.

To check the status of the application's pods, run:

```bash
kubectl get pods -n px-sock-shop
```

### Test out the CLI

Use `px live` to run a script to demonstrate observability. The `http_data` script shows a sample of the HTTP/2 traffic flowing through your cluster.

```bash
# List built-in scripts
px scripts list

# Run a script
px live px/http_data
```

For more information, checkout our [CLI guide](/using-pixie/using-cli/).

### Explore the web app

Open [Pixie's Live UI](https://work.withpixie.ai) in a new tab.

1. After reviewing the hints, click the X in the upper left hand corner of the screen.
2. Select your cluster (you may see other clusters from members of your organization).
3. Now, select a script, e.g. `px/cluster` or `px/http_data`.

For more information, check out our [Live UI guide](/using-pixie/using-live-ui/).

### Check out the tutorials

Learn how to use Pixie for

- [Network Monitoring](/tutorials/pixie-101/network-monitoring/)
- [Infra Health](/tutorials/pixie-101/infra-health/)
- [Service Performance](/tutorials/pixie-101/service-performance/)
- [Database Query Profiling](/tutorials/pixie-101/database-query-profiling/)
- [Request Tracing](/tutorials/pixie-101/request-tracing/)
- [Kafka Monitoring](/tutorials/pixie-101/kafka-monitoring/)

## Get Help

Please see our [Troubleshooting](/about-pixie/troubleshooting/) guide, reach out on our [Community Slack](https://slackin.px.dev/) or file an issue on [GitHub](https://github.com/pixie-io/pixie/issues).
