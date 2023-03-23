---
title: "Self-Hosted Pixie"
metaTitle: "Install | Install Guides | Self-Hosted Pixie"
metaDescription: "Getting started guide to setup 100% self-hosted Pixie"
order: 2
---

Get Pixie fully managed with [Pixie Community Cloud](/installing-pixie/install-guides/community-cloud-for-pixie) (free forever) or run on your own infrastructure with the following self-managed option.

## Prerequisites

- Review Pixie's [requirements](/installing-pixie/requirements) to make sure that your Kubernetes cluster is supported.

- Determine if you already have [Operator Lifecycle Manager](https://docs.openshift.com/container-platform/4.5/operators/understanding/olm/olm-understanding-olm.html) (OLM) deployed to your cluster, possibly to the default `olm` namespace. Pixie uses the Kubernetes [Operator pattern](https://kubernetes.io/docs/concepts/extend-kubernetes/operator/) to manage its Vizier, which handles data collection and query execution (see the [Architecture](/about-pixie/what-is-pixie/#architecture) diagram). The OLM is used to install, update and manage the Vizier Operator.

- Ensure that your cluster supports Pixie creating and using [PersistentVolumes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/).

- Pixie interacts with the Linux kernel to install BPF programs to collect telemetry data. In order to install BPF programs, Pixie [`vizier-pem-*`](/about-pixie/what-is-pixie/#architecture) pods require [privileged access](https://github.com/pixie-io/pixie/blob/e03434a5e41d82159aa7602638804159830f9949/k8s/vizier/base/pem_daemonset.yaml#L115).

## 1. Deploy Pixie Cloud

<Alert variant="outlined" severity="info">
  Pixie also offers a free account with Pixie Community Cloud to make getting started even easier and faster. To get Pixie Cloud, check out the community cloud <a href="/installing-pixie/install-guides/community-cloud-for-pixie">Install Guide</a>.
</Alert>

<Alert variant="outlined" severity="warning">
  There is a known issue with login on self-managed Pixie Cloud on Safari and Firefox. For now, use Chrome.
</Alert>

1. Clone the [Pixie repo](https://github.com/pixie-io/pixie).

    ```bash
    git clone https://github.com/pixie-io/pixie.git
    cd pixie
    ```

1. Pick a cloud release version from the [tags](https://github.com/pixie-io/pixie/tags) on the repo. The following should pick the latest release for you.

    ```bash
    export LATEST_CLOUD_RELEASE=$(git tag | grep 'release/cloud/prod'  | sort -r | head -n 1 | awk -F/ '{print $NF}')
    ```

1. Checkout the release tag.

    ```bash
    git checkout "release/cloud/prod/${LATEST_CLOUD_RELEASE}"
    ```

1. Update the versions in the appropriate kustomization file.

    ```bash
    perl -pi -e "s|newTag: latest|newTag: \"${LATEST_CLOUD_RELEASE}\"|g" k8s/cloud/public/kustomization.yaml
    ```

1. (Optional) By default, the self-hosted Pixie Cloud will be accessible through `dev.withpixie.dev`. If you wish to use a custom domain name, replace all occurances of `dev.withpixie.dev` in the following files with the domain name of your choice.

    ```bash
    k8s/cloud/public/proxy_envoy.yaml
    k8s/cloud/public/domain_config.yaml
    scripts/create_cloud_secrets.sh
    ```

1. Install `mkcert` following the directions [here](https://github.com/FiloSottile/mkcert#installation). Pixie uses SSL to securely communicate between Pixie Cloud and the UI. Self-managed Pixie Cloud requires managing your own certificates. `mkcert` is a simple tool to create and install a local certificate authority (CA) in the system root store in order to generate locally-trusted certificates.

1. Start `mkcert`. This command will set up local CA and create a root certificate that Chrome and your CLI will now trust. To access Pixie Cloud from different machine that the one it was set up on, you will need to install this certificate there as well.

    ```bash
    mkcert -install
    ```

1. Create the `plc` namespace. This namespace is not currently configurable. Several of the install scripts expect Pixie Cloud to be deployed to the `plc` namespace.

    ```bash
    kubectl create namespace plc
    ```

1. Create the Pixie Cloud secrets. From the top level `pixie/` directory, run:

    ```bash
    ./scripts/create_cloud_secrets.sh
    ```

1. Install `kustomize` following the directions [here](https://kubectl.docs.kubernetes.io/installation/kustomize/).

1. Deploy Pixie Cloud dependencies and wait for all pods within the `plc` namespace to become ready and available before proceeding to the next step. If there is an error, you may need to retry this step.

    ```bash
    kustomize build k8s/cloud_deps/base/elastic/operator | kubectl apply -f -
    kustomize build k8s/cloud_deps/public | kubectl apply -f -
    ```

1. Deploy Pixie Cloud.

    ```bash
    kustomize build k8s/cloud/public/ | kubectl apply -f -
    ```

1. Wait for all pods within the `plc` namespace to become ready and available. Note that you may have one or more `create-hydra-client-job` pod errors, but as long as long as another instance of that pod successfully completes, that is ok.

    ```bash
    kubectl get pods -n plc
    ```

### Set up DNS

1. Ensure that the `cloud-proxy-service` and `vzconn-service` LoadBalancer services have External IPs assigned. If you are running Pixie Cloud on `minikube`, you likely need to run `minikube tunnel` before continuing with this setup.

    ```bash
    minikube tunnel # if running on minikube
    kubectl get service cloud-proxy-service -n plc
    kubectl get service vzconn-service -n plc
    ```

1. Setup your DNS. This produces a `dev_dns_updater` binary in the top level `pixie` directory.

    ```bash
    go build src/utils/dev_dns_updater/dev_dns_updater.go
    ```

1. You'll need to hardcode in your kube config. If you are using a custom domain name, specify it as the value of the `--domain-name` flag. Leave this tab open.

    ```bash
    ./dev_dns_updater --domain-name="dev.withpixie.dev"  --kubeconfig=$HOME/.kube/config --n=plc
    ```

1. Navigate to `dev.withpixie.dev` in your browser. Make sure that the network you are on can access your cluster.

### Authentication using Kratos / Hydra

<Alert variant="outlined" severity="warning">
  There is a known issue with login on self-managed Pixie Cloud on Safari and Firefox. For now, use Chrome.
</Alert>

<Alert variant="outlined" severity="warning">
  If you've visited dev.withpixie.dev before, make sure to clear the cookies for this site or you'll get a login error.
</Alert>

1. Login to the admin account using `admin@default.com` for the email and `admin` for the password.

<Alert variant="outlined" severity="info">
    If you would like to change the admin account credentials, modify the email and password values for the `ADMIN_IDENTITY` in `k8s/cloud/base/ory_auth/kratos/kratos_deployment.yaml`. You will need to redeploy from scratch if you've already deployed with the default admin account, since the admin account is automatically provisioned for you.
</Alert>

### Invite others to your organization (optional)

Add users to your organization to share access to Pixie Live Views, query running clusters, and deploy new Pixie clusters. For instructions, see the [User Management & Sharing](/reference/admin/user-mgmt) reference docs.

## 2. Install the Pixie CLI

1. Set the cloud address with an environment variable. If you configured a custom domain name, use that as the variable's value:

    ```bash
    export PL_CLOUD_ADDR=dev.withpixie.dev
    ```

1. Install Pixie's CLI. The easiest way to install Pixie's CLI is using the install script:

    ```bash
    # Copy and run command to install the Pixie CLI.
    bash -c "$(curl -fsSL https://withpixie.ai/install.sh)"
    ```

    For alternate install options (Docker, Debian package, RPM, direct download of the binary) see the [CLI Install](/installing-pixie/install-schemes/cli/) page.

## 3. Deploy Pixie 🚀

Pixie's CLI is the fastest and easiest way to deploy Pixie. You can also deploy Pixie using [YAML](/installing-pixie/install-schemes/yaml) or [Helm](/installing-pixie/install-schemes/helm).

To deploy Pixie using the CLI:

<Alert variant="outlined" severity="info">
  If your cluster already has Operator Lifecycle Manager (OLM) deployed, deploy Pixie using the `--deploy_olm=false` flag.
</Alert>

<Alert variant="outlined" severity="info">
  Please refer to <a href="/reference/admin/environment-configs">Environment-Specific Configurations</a> for other configurations that should be set for your specific Kubernetes environment.
</Alert>

```bash
# Deploy the Pixie Platform in your K8s cluster (No OLM present on cluster).
px deploy --dev_cloud_namespace plc

# Deploy the Pixie Platform in your K8s cluster (OLM already exists on cluster).
px deploy  --dev_cloud_namespace plc --deploy_olm=false

# Deploy Pixie with a specific memory limit (2Gi is the default, 1Gi is the minimum recommended)
px deploy --dev_cloud_namespace plc --pem_memory_limit=1Gi
```

Pixie will deploy pods to the `pl`, `plc`, `px-operator`, and `olm`(if deploying the OLM) namespaces.

### More Deploy Options

For more deploy options that you can specify to configure Pixie, refer to our [deploy options](/reference/admin/deploy-options).

## 4. Use Pixie

Check out the next section of our docs for [Using Pixie](/using-pixie). You can also check out our [Tutorials](/tutorials) section.

Learn how to use Pixie for

- [Network Monitoring](/tutorials/pixie-101/network-monitoring/)
- [Infra Health](/tutorials/pixie-101/infra-health/)
- [Service Performance](/tutorials/pixie-101/service-performance/)
- [Database Query Profiling](/tutorials/pixie-101/database-query-profiling/)
- [Request Tracing](/tutorials/pixie-101/request-tracing/)
- [Kafka Monitoring](/tutorials/pixie-101/kafka-monitoring/)

## 5. Production Readiness (advanced)

### Deploying Pixie to another Kubernetes cluster

There are two options for deploying Pixie to another Kubernetes cluster.

#### Repeat these instructions for the new cluster

This will spin up a separate instance of Pixie Cloud for each Pixie deployment that you have.

#### Share a single Pixie Cloud instance across your Pixie deployments

If you select this option, each of your Pixie deployments will point to the same instance of Pixie Cloud. In order to ensure that all of your clusters can access Pixie Cloud, you will need to do the following:

- Rename your Pixie Cloud address from dev.withpixie.dev to something specific to your environment.
- Set up DNS rules for your new Pixie Cloud address. The specifics of this will depend on your environment.
- Ensure your cloud TLS certificates are for your new Pixie Cloud domain.
- Ping the new Pixie Cloud address from the new cluster before deploying Pixie to make sure traffic is successfully reaching Pixie Cloud.

Please refer to the [Production Readiness](/installing-pixie/install-guides/production-readiness) guide for detailed instructions.

## Get Help

Please see our [Troubleshooting](/about-pixie/troubleshooting/) guide, reach out on our [Community Slack](https://slackin.px.dev/) or file an issue on [GitHub](https://github.com/pixie-io/pixie/issues).
