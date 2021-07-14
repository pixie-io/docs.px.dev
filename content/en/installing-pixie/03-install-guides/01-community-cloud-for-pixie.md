---
title: "Community Cloud for Pixie"
metaTitle: "Install | Install Guides | Community Cloud for Pixie"
metaDescription: "Getting started guide to setup Pixie"
order: 1
---

Please review Pixie's [requirements](/installing-pixie/requirements) to make sure that your Kubernetes cluster is supported. 

## 1. Sign up

Visit our [product page](https://work.withpixie.ai/) and sign up with your google or gsuite account.

## 2. Set up a Kubernetes environment (optional)

If you don't have a Kubernetes cluster available, you can set up Minikube as a local sandbox environment. Instructions are available [here](/installing-pixie/setting-up-k8s/minikube-setup).

## 3. Install the Pixie CLI

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

## 7. Deploy a demo app (optional)

Deploy a simple demo app to monitor:

```bash
# View available demo apps:
px demo list

# Example: deploy Weaveworks' "sock-shop":
px demo deploy px-sock-shop
```

Note that it will take several minutes for the application to stabilize after deployment. You can use `kubectl get pods -n px-sock-shop` to check the status of the application's pods.

## Need help? Something went wrong?

Reach out to us on [Slack](https://slackin.withpixie.ai/) or file an issue on [GitHub](https://github.com/pixie-labs/pixie/issues) if you face issues during installation.
