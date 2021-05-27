---
title: "Quick Start"
metaTitle: "Install | Quick Start"
metaDescription: "Getting started guide to setup Pixie"
order: 2
---

Get Pixie fully-managed with [Pixie Community Cloud](https://docs.pixielabs.ai/installing-pixie/quick-start/) (free forever) or run on your own infrastructure with the following self-managed option.

Pixie can be installed in many different Kubernetes environments. Please refer to Pixie's [requirements](/installing-pixie/requirements) to make sure that your Kubernetes cluster is supported.

## 1. Setup a sandbox (optional)

### Setup a local K8s environment

On Linux, run:

```bash
minikube start --driver=kvm2 --cpus=4 --memory=6000 -p=<cluster-name>
```

The default `docker` driver is not currently supported, so using the `kvm2` driver is important.

On Mac, run:

```bash
minikube start --driver=hyperkit --cpus=4 --memory=6000 -p=<cluster-name>
```

More detailed instructions are available [here](/installing-pixie/install-guides/minikube-setup).

### Deploy a demo-app

Deploy a simple demo app to monitor:

```bash
px demo deploy px-sock-shop
```

This demo application takes several minutes to stabilize after deployment. To check the status of the application's pods, run:

```bash
kubectl get pods -n px-sock-shop
```

## Self-managed Pixie Cloud (optional)

**Note:** Pixie also offers a [free account with Pixie Cloud](https://docs.pixielabs.ai/installing-pixie/quick-start/) to make getting started even easier and faster. Pixie Cloud users do not need to (1) deploy Pixie Cloud, (2) configure DNS, (3) or set up authentication.

### Deploy Pixie Cloud

1. Clone the [Pixie repo](https://www.notion.so/pixielabs/New-OS-Pixie-Quick-Start-1a829bdd186f49b78630dd5e5a43349b#00eb63438a844a9e822d2832d37bf82c).

```bash
git clone https://github.com/pixie-labs/pixie.git
```

### Set up DNS

1. Setup your DNS. This produces a `dev_dns_updater` binary in the top level directory.

```bash
go build src/utils/dev_dns_updater/dev_dns_updater.go
```

2. You'll need to hardcode in your kube config

```bash
./dev_dns_updater --domain-name="dev.withpixie.dev"  --kubeconfig=/<kubeconfig path>/.kube/config --n=plc
```

3. Navigate to `dev.withpixie.dev` in your browser. Make sure that the network you are on can access your cluster.

### Authentication using Kratos / Hydra

Self-managed Pixie Cloud only supports one organization.

1. To setup the default admin account, find the URL in the logs for the `create-admin-job` pod by running:

```bash
kubectl log create-admin-job-<pod_string> -n plc
```

2. Open the URL from the logs and login using `admin@default.com` for the `identifier`.

### Invite others to your organization

## Install the Pixie CLI

You can install Pixie's CLI tool in one of 4 ways:

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

## 4. Deploy Pixie 🚀

You can deploy Pixie to your Kubernetes cluster with the Pixie CLI, [YAML](/installing-pixie/install-schemes/yaml), or [Helm](/installing-pixie/install-schemes/helm).

Pixie's CLI is the fastest and easiest way to deploy Pixie:

``` bash
# Deploy the Pixie Platform in your K8s cluster by running:
px deploy
```

For more CLI deployment configuration options, see [here](/installing-pixie/install-schemes/cli).

## 5. Run a script

Use `px run` to run a script to demonstrate observability. The `demo_script` script shows the latency and request path of http traffic hitting your cluster.

``` bash
# List built-in scripts
px scripts list

# Run a script
px run px/demo_script
```

For more information, checkout our [CLI guide](/using-pixie/using-cli/) or see our [PxL script documentation](/reference/pxl/), but first, go on to the next step and explore our web app.

## 6. Explore the web app

Open [Pixie's live UI](https://work.withpixie.ai) in a new tab.

1. After reviewing the hints, click the X in the upper left hand corner of the screen.
2. Select your cluster (you may see other clusters from members of your organization).
3. Now, select a script, e.g. `px/demo_script` or `px/http_data`.

For more information, check out our [Live UI guide](/using-pixie/using-live-ui/).

## Need help? Something went wrong?

Reach out to us on [Slack](https://slackin.withpixie.ai/) or file an issue on [GitHub](https://github.com/pixie-labs/pixie/issues) if you face issues during installation.
