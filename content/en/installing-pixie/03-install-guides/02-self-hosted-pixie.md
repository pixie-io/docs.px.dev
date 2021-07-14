---
title: "Self-Hosted Pixie"
metaTitle: "Install | Install Guides | Self-Hosted Pixie"
metaDescription: "Getting started guide to setup 100% self-hosted Pixie"
order: 2
---

Get Pixie fully-managed with [Pixie Community Cloud](https://docs.pixielabs.ai/installing-pixie/install-guides/community-cloud-for-pixie) (free forever) or run on your own infrastructure with the following self-managed option.

## Prerequisites

1. Pixie can be installed in many different Kubernetes environments. Please refer to Pixie's [requirements](/installing-pixie/requirements) to make sure that your Kubernetes cluster is supported.

2. Your cluster will need to support Pixie creating and using [PersistentVolumes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/). 

## 1. Deploy Pixie Cloud

<Alert variant="outlined" severity="info">
  Pixie also offers a free account with Pixie Community Cloud to make getting started even easier and faster. To get Pixie Cloud, check out the community cloud <a href="https://docs.pixielabs.ai/installing-pixie/install-guides/community-cloud-for-pixie">quick start guide</a>.
</Alert>

<Alert variant="outlined" severity="info">
  Self-managed Pixie Cloud has been tested on GKE only.
</Alert>

<Alert variant="outlined" severity="warning">
  There is a known issue with login on self-managed Pixie Cloud on Safari and Firefox. For now, use Chrome.
</Alert>

1. Clone the [Pixie repo](https://www.notion.so/pixielabs/New-OS-Pixie-Quick-Start-1a829bdd186f49b78630dd5e5a43349b#00eb63438a844a9e822d2832d37bf82c).

```bash
git clone https://github.com/pixie-labs/pixie.git
cd pixie
```

2. Install `mkcert` following the directions [here](https://github.com/FiloSottile/mkcert#installation). Pixie uses SSL to securely communicate between Pixie Cloud and the UI. Self-managed Pixie Cloud requires managing your own certificates. `mkcert` is a simple tool to create and install a local certificate authority (CA) in the system root store in order to generate locally-trusted certificates.

3. Start `mkcert`. This command will set up local CA and create a root certificate that Chrome and your CLI will now trust. To access Pixie Cloud from different machine that the one it was set up on, you will need to install this certificate there as well.

```bash
mkcert -install
```

4. Create the `plc` namespace. This namespace is not currently configurable. Several of the install scripts expect Pixie Cloud to be deployed to the `plc` namespace.

```bash
kubectl create namespace plc
```

5. Create the Pixie Cloud secrets. From the top level `pixie/` directory, run:

```bash
./scripts/create_cloud_secrets.sh
```

6. Install `kustomize` following the directions [here](https://kubectl.docs.kubernetes.io/installation/kustomize/).

7. Deploy Pixie Cloud dependencies and wait for all pods within the `plc` namespace to become ready and available before proceeding to the next step. 

```bash
kustomize build k8s/cloud_deps/public/ | kubectl apply -f - --namespace=plc
```

8. Deploy Pixie Cloud.

```bash
kustomize build k8s/cloud/public/ | kubectl apply -f - --namespace=plc
```

9. Wait for all pods within the `plc` namespace to become ready and available. Note that you may have one or more create-hydra-client-job pod errors, but as long as long as another instance of that pod successfully completes, that is ok.

```bash
kubectl get pods --all-namespaces -o wide
```

### Set up DNS

1. Setup your DNS. This produces a `dev_dns_updater` binary in the top level `pixie` directory.

```bash
go build src/utils/dev_dns_updater/dev_dns_updater.go
```

2. You'll need to hardcode in your kube config. Leave this tab open.

```bash
./dev_dns_updater --domain-name="dev.withpixie.dev"  --kubeconfig=$HOME/.kube/config --n=plc
```

3. Navigate to `dev.withpixie.dev` in your browser. Make sure that the network you are on can access your cluster.

### Authentication using Kratos / Hydra

Self-managed Pixie Cloud only supports one organization.

1. To setup the default admin account, check the logs for the `create-admin-job` pod by running:

```bash
kubectl log create-admin-job-<pod_string> -n plc
```

2. Open the URL from the pod's logs to set the password for the `admin@default.com` user.

3. Once the password has been set, login using `admin@default.com` for the `identifier` and your new password.

<Alert variant="outlined" severity="warning">
  There is a known issue with login on self-managed Pixie Cloud on Safari and Firefox. For now, use Chrome.
</Alert>

### Invite others to your organization (optional)

1. Navigate to `dev.withpixie.dev/admin/invite` in your browser. Fill out the neccessary information to send invite links to anyone who you'd like to share access with. Note that this link expires after a certain amount of time and cannot be recreated for the expired email address.

## 2. Install the Pixie CLI

1. Set the cloud address with an environment variable:

```bash
export PL_CLOUD_ADDR=dev.withpixie.dev
```

2. Install Pixie's CLI tool in one of four ways:

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

## 3. Deploy Pixie 🚀

You can deploy Pixie to your Kubernetes cluster with the Pixie CLI, [YAML](/installing-pixie/install-schemes/yaml), or [Helm](/installing-pixie/install-schemes/helm).

Pixie's CLI is the fastest and easiest way to deploy Pixie:

``` bash
# Deploy the Pixie Platform in your K8s cluster by running:
px deploy --dev_cloud_namespace plc
```

For more CLI deployment configuration options, see [here](/installing-pixie/install-schemes/cli).

### Deploy a demo microservices application (optional)

Deploy a simple demo app to monitor:

```bash
px demo deploy px-sock-shop
```

This demo application takes several minutes to stabilize after deployment. To check the status of the application's pods, run:

```bash
kubectl get pods -n px-sock-shop
```

### Run a script using the CLI

Use `px run` to run a script to demonstrate observability. The `demo_script` script shows the latency and request path of http traffic hitting your cluster.

``` bash
# List built-in scripts
px scripts list

# Run a script
px run px/demo_script
```

For more information, checkout our [CLI guide](/using-pixie/using-cli/) or see our [PxL script documentation](/reference/pxl/), but first, go on to the next step and explore our web app.

### Explore the web app

Open [Pixie's live UI](https://work.dev.withpixie.dev:443) in a new tab.

1. Select your cluster.
3. Now, select a script (e.g. `px/cluster` or `px/http_data`).

For more information, check out our [Live UI guide](/using-pixie/using-live-ui/).

## Get Help

Please reach out on our [Community Slack](https://slackin.px.dev/) or file an issue on [GitHub](https://github.com/pixie-labs/pixie/issues).
