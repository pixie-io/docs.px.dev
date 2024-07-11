---
title: "CLI (Recommended)"
metaTitle: "Install | Install Schemes (optional) | CLI"
metaDescription: "How to install Pixie via CLI"
order: 1
---

Pixie's CLI is the fastest and easiest way to install and manage your Pixie installation.

## Prerequisites

- Review Pixie's [requirements](/installing-pixie/requirements) to make sure that your Kubernetes cluster is supported.

- Determine if you already have [Operator Lifecycle Manager](https://docs.openshift.com/container-platform/4.5/operators/understanding/olm/olm-understanding-olm.html) (OLM) deployed to your cluster, possibly to the default `olm` namespace. Pixie uses the Kubernetes [Operator pattern](https://kubernetes.io/docs/concepts/extend-kubernetes/operator/) to manage its Vizier, which handles data collection and query execution (see the [Architecture](/about-pixie/what-is-pixie/#architecture) diagram). The OLM is used to install, update and manage the Vizier Operator.

## 1. Install the Pixie CLI

You can install the CLI in one of four ways:

### Using the install script (easiest)

```bash
# Copy and run command to install the Pixie CLI.
bash -c "$(curl -fsSL https://withpixie.ai/install.sh)"
```

### Using Homebrew

```bash
brew install pixie
```

### Directly downloading the binary

#### Assets

- [cli_darwin_universal](https://storage.googleapis.com/pixie-dev-public/cli/latest/cli_darwin_universal)
- [cli_darwin_universal.sha256](https://storage.googleapis.com/pixie-dev-public/cli/latest/cli_darwin_universal.sha256)
- [cli_linux_amd64](https://storage.googleapis.com/pixie-dev-public/cli/latest/cli_linux_amd64)
- [cli_linux_amd64.sha256](https://storage.googleapis.com/pixie-dev-public/cli/latest/cli_linux_amd64.sha256)

Download the correct binary for your operating system and make it executable:

```bash
# Download the latest Pixie linux binary.
curl -o px https://storage.googleapis.com/pixie-dev-public/cli/latest/cli_linux_amd64

# (Optional) Check the signature matches.
curl -o px_checksum https://storage.googleapis.com/pixie-dev-public/cli/latest/cli_linux_amd64.sha256
cat px_checksum
sha256sum px

# Make it executable.
chmod +x px

# (Optional) Move it to another location that has executables.
mv px /usr/local/bin
```

### Using Docker

```bash
alias px="docker run -i --rm -v ${HOME}/.pixie:/root/.pixie pixielabs/px"
```

You may validate the signature on the docker image by [verifying the image with cosign](/reference/admin/verifying-images/).

### Using Debian package

Download the assets:

- [pixie-px.x86_64.deb](https://storage.googleapis.com/pixie-dev-public/cli/latest/pixie-px.x86_64.deb)
- [pixie-px.x86_64.deb.sha256](https://storage.googleapis.com/pixie-dev-public/cli/latest/pixie-px.x86_64.deb.sha256)

Install the Pixie package:

```bash
# Install Pixie .deb package.
dpkg -i pixie-px.x86_64.deb
```

### Using RPM

Download the assets:

- [pixie-px.x86_64.rpm](https://storage.googleapis.com/pixie-dev-public/cli/latest/pixie-px.x86_64.rpm)
- [pixie-px.x86_64.rpm.sha256](https://storage.googleapis.com/pixie-dev-public/cli/latest/pixie-px.x86_64.rpm.sha256)

Install the Pixie package:

```bash
# Install Pixie .rpm package.
rpm -i pixie-px.x86_64.rpm
```

## 2. Deploy Pixie

<Alert variant="outlined" severity="info">
  If your cluster already has Operator Lifecycle Manager (OLM) deployed, deploy Pixie using the `--deploy_olm=false` flag.
</Alert>

<Alert variant="outlined" severity="info">
  Please refer to <a href="/reference/admin/environment-configs">Environment-Specific Configurations</a> for other configurations that should be set for your specific Kubernetes environment.
</Alert>

<CliDeployInstructions />


Pixie will deploy pods to the `pl`, `px-operator`, and `olm`(if deploying the OLM) namespaces.

### More Deploy Options

For more deploy options that you can specify to configure Pixie, refer to our [deploy options](/reference/admin/deploy-options).
