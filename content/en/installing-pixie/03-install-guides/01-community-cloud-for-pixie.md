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

The easiest way to install Pixie's CLI is using the install script:

``` bash
# Copy and run command to install the Pixie CLI.
bash -c "$(curl -fsSL https://withpixie.ai/install.sh)"
```

The CLI can also be installed by directly downloading the binary, using Docker or using the Debian package. For directions, see the [CLI install docs](/installing-pixie/install-schemes/cli/).

## 4. Deploy Pixie 🚀

Pixie's CLI is the fastest and easiest way to deploy Pixie:

``` bash
# List Pixie deployment options.
px deploy --help

# Deploy the Pixie Platform in your K8s cluster.
px deploy
```

You can also deploy Pixie using [YAML](/installing-pixie/install-schemes/yaml) or [Helm](/installing-pixie/install-schemes/helm).

## 5. Run a script

Use `px run` to run a script to demonstrate observability. The `demo_script` script shows the latency and request path of http traffic hitting your cluster.
``` bash
# List built-in scripts
px scripts list

# Run a script
px run px/demo_script
```

For more information, checkout our [CLI guide](/using-pixie/using-cli/).

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
