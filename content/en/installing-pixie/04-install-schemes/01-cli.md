---
title: "CLI (Recommended)"
metaTitle: "Install | Install Schemes (optional) | CLI"
metaDescription: "How to install Pixie via CLI"
order: 1
---

## Prerequisites

- Review Pixie's [requirements](/installing-pixie/requirements) to make sure that your Kubernetes cluster is supported.

- Determine if you already have [Operator Lifecycle Manager](https://docs.openshift.com/container-platform/4.5/operators/understanding/olm/olm-understanding-olm.html) (OLM) deployed to your cluster, possibly to the default `olm` namespace. Pixie uses the Kubernetes [Operator pattern](https://kubernetes.io/docs/concepts/extend-kubernetes/operator/) to manage its Vizier, which handles data collection and query execution (see the [Architecture](/about-pixie/what-is-pixie/#system-architecture) diagram). The OLM is used to install, update and manage the Vizier Operator.

## 1. Install the Pixie CLI

Pixie's CLI is the fastest and easiest way to install and manage your Pixie installation.

You can install the CLI in one of four ways:

### Using the install script (easiest)

``` bash
# Copy and run command to install the Pixie CLI.
bash -c "$(curl -fsSL https://withpixie.ai/install.sh)"
```

### Directly downloading the binary

``` bash
# Download the latest Pixie binary.
curl -o px https://storage.googleapis.com/pixie-prod-artifacts/cli/latest/cli_darwin_amd64

# Check the signature matches.
sha256sum px

# Make it executable.
chmod +x px

# (Optional) Move it to another location that has executables.
mv px /usr/local/bin
```

### Using Docker

``` bash
alias px="docker run -i --rm -v ${HOME}/.pixie:/root/.pixie pixielabs/px"
```

### Using Debian package

- [https://storage.googleapis.com/pixie-prod-artifacts/cli/latest/pixie-px.x86_64.deb](https://storage.googleapis.com/pixie-prod-artifacts/cli/latest/pixie-px.x86_64.deb)
- [https://storage.googleapis.com/pixie-prod-artifacts/cli/latest/pixie-px.x86_64.deb.sha256](https://storage.googleapis.com/pixie-prod-artifacts/cli/latest/pixie-px.x86_64.deb.sha256)

``` bash
# Install Pixie .deb package.
dpkg -i pixie-px.x86_64.deb
```

### Using RPM

- [https://storage.googleapis.com/pixie-prod-artifacts/cli/latest/pixie-px.x86_64.rpm](https://storage.googleapis.com/pixie-prod-artifacts/cli/latest/pixie-px.x86_64.rpm)
- [https://storage.googleapis.com/pixie-prod-artifacts/cli/latest/pixie-px.x86_64.rpm.sha256](https://storage.googleapis.com/pixie-prod-artifacts/cli/latest/pixie-px.x86_64.rpm.sha256)

``` bash
# Install Pixie .rpm package.
rpm -i pixie-px.x86_64.rpm
```

## 2. Deploy Pixie

<Alert variant="outlined" severity="info">
  If your cluster already has Operator Lifecycle Manager (OLM) deployed, deploy Pixie using the `--deploy_olm=false` flag.
</Alert>

``` bash
# List Pixie deployment options.
px deploy --help

# Deploy the Pixie Platform in your K8s cluster (No OLM present on cluster).
px deploy

# Deploy the Pixie Platform in your K8s cluster (OLM already exists on cluster).
px deploy --deploy_olm=false
```

Pixie will deploy pods to the `pl`, `px-operator`, and `olm`(if deploying the OLM) namespaces.

### (Optional) Labeling Pixie's Resources

When deploying Pixie using the CLI, you have the option of adding one or more custom [labels](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/) to the K8s objects deployed by Pixie.

``` bash
# Deploy the Pixie Platform in your K8s cluster and give the deployed objects label(s)
px deploy --labels=key1=value1,key2=value2

# Example deployment with labeling:
px deploy --labels=application=pixie
```

Certain labels are reserved for internal use by Pixie. The following are reserved label strings that may _**not be**_ used:

- `"vizier-bootstrap"`
- `“component"`
- `“vizier-updater-dep"`
- `“app"`
