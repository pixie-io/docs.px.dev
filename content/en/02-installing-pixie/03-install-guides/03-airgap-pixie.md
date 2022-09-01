---
title: "Air Gapped Pixie"
metaTitle: "Install | Install Guides | Air Gapped Pixie"
metaDescription: "How to install Pixie in an air gapped environment."
order: 3
redirect_from:
    - /airgap
---

Follow these instructions to install Pixie in an air gapped environment. An air gapped environment is any environment that is not directly connected to the Internet.

<Alert variant="outlined" severity="info">
  Air Gapped Pixie is a beta feature. For questions or updates, see this <a href="https://github.com/pixie-io/pixie/issues/266"> GitHub issue</a>.
</Alert>

## Prerequisites

- Review Pixie's [requirements](/installing-pixie/requirements) to make sure that your Kubernetes cluster is supported.

- Pixie interacts with the Linux kernel to install BPF programs to collect telemetry data. In order to install BPF programs, Pixie [`vizier-pem-*`](/about-pixie/what-is-pixie/#architecture) pods require [privileged access](https://github.com/pixie-io/pixie/blob/e03434a5e41d82159aa7602638804159830f9949/k8s/vizier/base/pem_daemonset.yaml#L115).

## Deploy Pixie Cloud

1. Clone the [Pixie repo](https://github.com/pixie-io/pixie).

```bash
git clone https://github.com/pixie-io/pixie.git
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

6. Collect and publish the required images to a private image registry. To list the images needed to deploy Pixie Cloud, run these commands:

```
curl https://storage.googleapis.com/pixie-dev-public/cloud/latest/pixie_cloud.tar.gz | tar xj
cd pixie_cloud
cat cloud_image_list.txt
```

7. Modify the yaml files in the `pixie_cloud/yamls` folder to pull the images from your private image registry.

8. Modify the `pixie_cloud/yamls/cloud.yaml` file to remove the `plugin-db-updater-job` job.

9. Deploy Pixie Cloud dependencies and wait for all pods within the `plc` namespace to become ready and available before proceeding to the next step. If there is an error, you may need to retry this step.

```
kubectl apply -f yamls/cloud_deps_elastic_operator.yaml
kubectl apply -f yamls/cloud_deps.yaml
```

10. Deploy Pixie Cloud:

```
kubectl apply -f yamls/cloud.yaml
```

11. Wait for all pods within the `plc` namespace to become ready and available. Note that you may have one or more `create-hydra-client-job` pod errors, but as long as long as another instance of that pod successfully completes, that is ok.

```bash
kubectl get pods -n plc
```

> Note about **Step 10**: if you applied the `cloud.yaml` manifest multiple times (for example, while resolving an ImagePullError), you will see the following `create-admin-job` and `create-hydra-client-job` errors:

```
create-admin-job time="2022-07-05T21:27:40Z" level=fatal msg="Org 'default' with domain 'default.com' already exists. Remove the org from the database or change the org name."
```

```
create-hydra-client-job {
create-hydra-client-job   "error": "Unable to insert or update resource because a resource with that value exists already"
create-hydra-client-job }
```

> If you get these errors, delete the `plc` namespace and start over from **Step 4** of the install guide.

### Set up DNS

1. Ensure that the `cloud-proxy-service` and `vzconn-service` LoadBalancer services have External IPs assigned. If you are running Pixie Cloud on `minikube`, you likely need to run `minikube tunnel` before continuing with this setup.

```bash
# If using minikube, run:
minikube tunnel

# Check if external IPs have been assigned
kubectl get service cloud-proxy-service -n plc
kubectl get service vzconn-service -n plc
```

2. Setup your DNS. This produces a `dev_dns_updater` binary in the top level `pixie` directory.

```bash
go build src/utils/dev_dns_updater/dev_dns_updater.go
```

3. You'll need to hardcode in your kube config. Leave this tab open.

```bash
./dev_dns_updater --domain-name="dev.withpixie.dev"  --kubeconfig=$HOME/.kube/config --n=plc
```

4. Navigate to `dev.withpixie.dev` in your browser. Make sure that the network you are on can access your cluster.

### Authentication using Kratos / Hydra

Self-managed Pixie Cloud only supports one organization.

1. To setup the default admin account, check the logs for the `create-admin-job` pod by running:

```bash
kubectl logs create-admin-job-<pod_string> -n plc
```

2. Open the URL from the pod's logs to set the password for the `admin@default.com` user.

<Alert variant="outlined" severity="warning">
  If you've visited dev.withpixie.dev before, make sure to clear the cookies for this site or you'll get a login error.
</Alert>

3. Once the password has been set, login using `admin@default.com` for the `identifier` and your new password.

<Alert variant="outlined" severity="warning">
  There is a known issue with login on self-managed Pixie Cloud on Safari and Firefox. For now, use Chrome.
</Alert>

### Serve the Script Bundle

After logging into the Pixie UI using the admin account, you will see a blank UI with the following errors in the DevTools console:

<svg title='' src='airgap/ui-error.png' />

To resolve these errors, you'll need to set up the script dev environment:

```
git clone https://github.com/pixie-io/pixie.git
cd pixie/src/pxl_scripts
make dev
```

Open Chrome’s DevTools console and run the following:

```
localStorage.setItem('px-custom-oss-bundle-path', 'http://127.0.0.1:8000/bundle-oss.json')
localStorage.setItem('px-custom-core-bundle-path', 'http://127.0.0.1:8000/bundle-oss.json')
```

Once you have set these variables, do a **soft** reload of the UI webpage (a hard reload will clear the variable you just set).

Once you're able to see Pixie's UI, you'll need to use Pixie's UI to [create a deploy key](/reference/admin/deploy-keys/#create-a-deploy-key-using-the-live-ui). Record this value somewhere, we'll use it in a future step.

### Invite others to your organization (optional)

Add users to your organization to share access to Pixie Live Views, query running clusters, and deploy new Pixie clusters. For instructions, see the [User Management & Sharing](/reference/admin/user-mgmt) reference docs.

## Deploy Pixie

1. Download the vizier artifacts:

```
curl https://storage.googleapis.com/pixie-dev-public/vizier/latest/vizier_yamls.tar | tar x
cd yamls
```

2. Update the `deploy-key` and `PX_CLUSTER_NAME` values in the `vizier/secrets.yaml` file. Remember that you previously created the deploy key in [this step](#deploy-pixie-cloud-serve-the-script-bundle).

3. Deploy the `vizier/secrets.yaml` file.

```
kubectl apply -f vizier/secrets.yaml
```

5. Determine whether you'd like to deploy Pixie with or without `etcd`. We recommend installing Pixie without `etcd` as long as your cluster supports Pixie creating and using PVs.

> To deploy Pixie without `etcd`, use the following yamls:
>
> - `vizier/vizier_metadata_persist_prod.yaml`
> - `vizier_deps/nats_prod.yaml`

> To deploy Pixie with `etcd`, use the following yamls:
>
> - `vizier/vizier_etcd_metadata_prod.yaml`
> - `vizier_deps/etcd_prod.yaml`

6. Collect and publish the required Pixie Vizier images to a private registry. _Note: the below commands assume you are deploying Pixie without `etcd`._

> To list the images needed to deploy Pixie Cloud:

```
cat images/vizier_image_list.txt
```

7. Modify the yaml files you selected in **Step 5** to pull the images from your private image registry.

8. Apply the yamls. _Note: the below commands assume you are deploying Pixie without `etcd`._

```
kubectl apply -f vizier_deps/nats_prod.yaml
kubectl apply -f vizier/vizier_metadata_persist_prod.yaml
```

9. Wait for the pods in the `pl` namespace to become ready and available:

```
kubectl get pods -n pl
```

### Ignore this Pixie UI warning

You may see a warning in the Pixie UI that is similar to the following:

<svg title='' src='airgap/operator-warning.png' />

**You can ignore this warning.** Pixie air gap install uses the non-[operator](https://kubernetes.io/docs/concepts/extend-kubernetes/operator/) version of Pixie. The default install of Pixie recently switched to use an operator, which will allow us to add self-healing features in the future. This warning was to encourage users to upgrade to the operator version of Pixie, which is not currently available for air gap users.

### More Deploy Options

For more deploy options that you can specify to configure Pixie, refer to our [deploy options](/reference/admin/deploy-options).

## Use Pixie

Check out the next section of our docs for [Using Pixie](/using-pixie). You can also check out our [Tutorials](/tutorials) section.

Learn how to use Pixie for

- [Network Monitoring](/tutorials/pixie-101/network-monitoring/)
- [Infra Health](/tutorials/pixie-101/infra-health/)
- [Service Performance](/tutorials/pixie-101/service-performance/)
- [Database Query Profiling](/tutorials/pixie-101/database-query-profiling/)
- [Request Tracing](/tutorials/pixie-101/request-tracing/)
- [Kafka Monitoring](/tutorials/pixie-101/kafka-monitoring/)

## Production Readiness (advanced)

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

## Get Help

Please see our [Troubleshooting](/about-pixie/troubleshooting/) guide, reach out on our [Community Slack](https://slackin.px.dev/) or file an issue on [GitHub](https://github.com/pixie-io/pixie/issues).
