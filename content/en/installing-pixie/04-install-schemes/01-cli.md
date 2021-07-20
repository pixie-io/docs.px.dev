---
title: "CLI (Recommended)"
metaTitle: "Install | Install Schemes (optional) | CLI"
metaDescription: "How to install Pixie via CLI"
order: 1
---

## 1. Install the Pixie CLI

Pixie's CLI is the fastest and easiest way to install and manage your Pixie installation. You can install the CLI in one of four ways:

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

## 2. Check Requirements
Check if your K8s cluster meets Pixie's [requirements](/installing-pixie/requirements) by running:
```bash
px deploy --check_only
```
If your cluster fails any checks, you may still proceed with installation, but it is unlikely that Pixie will work on your cluster.


## 3. Deploy Pixie

``` bash
# List the deploy options.
px deploy --help

# Deploy the Pixie Platform in your K8s cluster.
px deploy
```

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
