---
title: "Deploy Options"
metaTitle: "Reference | Admin | Deploy Options"
metaDescription: "Configuration options for Pixie on deploy"
order: 3
redirect_from:
    - /admin/deploy-options/
---

Pixie offers the following deploy options:

- [Annotate Pixie's resources](#annotating-pixie's-resources)
- [Label Pixie's resources](#labeling-pixie's-resources)
- [Deploy to a subset of nodes](#deploy-pixie-to-a-subset-of-nodes)
- [Provide a custom cluster name](#providing-a-custom-cluster-name)
- [Configure Pixie's memory usage](#configure-pixie-memory-usage)
- [Set the data access mode](#setting-the-data-access-mode)
- [Select metadata storage option](#select-metadata-storage-option)
- [Configure a custom image registry](#custom-image-registry)
- [Set a PEM flag](#set-a-pem-flag)

To see the full set of deploy options, install the [Pixie CLI](/installing-pixie/install-schemes/cli/) and run `px deploy --help`.

## Annotating Pixie's resources

When deploying Pixie, you have the option of adding one or more custom [annotations](https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations/) to the Kubernetes objects deployed by Pixie.

To annotate Pixie's resources when deploying with the [Pixie CLI](/installing-pixie/install-schemes/cli/), use the `--annotations` flag:

```bash
px deploy --annotations=key1=value1,key2=value2
```

To annotate Pixie's resources when deploying with [Helm](/installing-pixie/install-schemes/helm/), use the `annotations` field:

```bash
helm install pixie pixie-operator/pixie-operator-chart --set deployKey=<deploy-key-goes-here> --namespace pl --create-namespace --set annotations=key1=value1,key2=value2
```

## Labeling Pixie's resources

When deploying Pixie, you have the option of adding one or more custom [labels](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/) to the Kubernetes objects deployed by Pixie. Certain labels are reserved for internal use by Pixie. The following are reserved label strings that may _**not be**_ used:

- `"vizier-bootstrap"`
- `“component"`
- `“vizier-updater-dep"`
- `“app"`

To label Pixie's resources when deploying with the [Pixie CLI](/installing-pixie/install-schemes/cli/), use the `--labels` flag:

```bash
px deploy --labels=key1=value1,key2=value2
```

To label Pixie's resources when deploying with [Helm](/installing-pixie/install-schemes/helm/), use the `labels` field:

```bash
helm install pixie pixie-operator/pixie-operator-chart --set deployKey=<deploy-key-goes-here> --namespace pl --create-namespace --set labels=key1=value1,key2=value2
```

## Deploy Pixie to a subset of nodes

When deploying Pixie, you have the option of selecting which nodes Pixie will be deployed to in your cluster. For example, Pixie [runs on Linux nodes only](/installing-pixie/requirements/#operating-system), so you would use this option to deploy Pixie to clusters with mixed node types.

To deploy Pixie to a subset of the nodes in your cluster:

1. [Label the target nodes](https://kubernetes.io/docs/tasks/configure-pod-container/assign-pods-nodes/#add-a-label-to-a-node) with `pixie=allowed`.

2. Add a [`nodeSelector`](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector) to Pixie's [`vizier-pem`](/reference/architecture/#vizier) datacollector pods during deployment:

> When deploying with the [Pixie CLI](/installing-pixie/install-schemes/cli/), use the `--patches` flag:

```bash
px deploy --patches='vizier-pem:{\"spec\":{\"template\":{\"spec\":{\"nodeSelector\":{\"pixie\": \"allowed\"}}}}}'
```

> When deploying with [Helm](/installing-pixie/install-schemes/helm/), use the `patches.vizier-pem` field:

```bash
helm install pixie pixie-operator/pixie-operator-chart --set deployKey=<deploy-key-goes-here> --namespace pl --create-namespace --set patches.vizier-pem='\{\"spec\"\: \{\"template\"\: \{\"spec\"\: \{ \"nodeSelector\"\: \{\"pixie\"\: \"allowed\" \}\}\}\}\}'
```

## Providing a custom cluster name

When deploying Pixie, you have the option of providing a custom cluster name. If you do not provide a cluster name, the name will be taken from the current kubeconfig.

To provide a custom cluster name when deploying with the [Pixie CLI](/installing-pixie/install-schemes/cli/), use the `--cluster_name` flag:

```bash
# Deploy Pixie in your K8s cluster and use the provided name for the cluster.
px deploy --cluster_name=<CLUSTER_NAME>
```

To provide a custom cluster name when deploying with [Helm](/installing-pixie/install-schemes/helm/), use the `clusterName` field:

```bash
helm install pixie pixie-operator/pixie-operator-chart --set deployKey=<deploy-key-goes-here> --set clusterName=<CLUSTER_NAME> --namespace pl --create-namespace
```

## Configure Pixie memory usage

When deploying Pixie, you have three options for configuring PEM memory usage:

- [Set PEM pod memory limit](#configure-pixie-memory-usage-setting-the-memory-limit)
- [Set PEM pod memory request](#configure-pixie-memory-usage-setting-the-memory-request)
- [Set data table storage limit](#configure-pixie-memory-usage-setting-the-data-table-storage-memory-limit)

For more information about these options, please refer to the [Tuning Memory Usage](/reference/admin/tuning-mem-usage/) page.

### Setting the memory limit

The default memory limit is 2Gi per PEM. The lowest recommended value is [1Gi](/installing-pixie/requirements/#memory) per PEM. 1Gi is not a suitable limit for a cluster with high throughput, but it is suitable for a small cluster with limited resources.

To set Pixie's memory limit when deploying with the [Pixie CLI](/installing-pixie/install-schemes/cli/), use the `--pem_memory_limit` flag:

```bash
px deploy --pem_memory_limit=1Gi
```

To set Pixie's memory limit when deploying with [Helm](/installing-pixie/install-schemes/helm/), use the `pemMemoryLimit` field:

```bash
helm install pixie pixie-operator/pixie-operator-chart --set deployKey=<deploy-key-goes-here> --namespace pl --create-namespace --set pemMemoryLimit=1Gi
```

### Setting the memory request

By default, the PEM's memory request will be the same as the limit. When deploying Pixie, you can specify a different memory [request](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#requests-and-limits) than limit. This flag is useful for clusters in which the PEM pods are pending because there is not enough memory for them to be scheduled on the node.

<Alert variant="outlined" severity="info">Please note that PEM memory request must be less than or equal to the PEM memory limit.</Alert>

To set Pixie's memory request when deploying with the [Pixie CLI](/installing-pixie/install-schemes/cli/), use the `--pem_memory_request` flag:

```bash
px deploy --pem_memory_request=1Gi
```

To set Pixie's memory request when deploying with [Helm](/installing-pixie/install-schemes/helm/), use the `pemMemoryRequest` field:

```bash
helm install pixie pixie-operator/pixie-operator-chart --set deployKey=<deploy-key-goes-here> --namespace pl --create-namespace --set pemMemoryRequest=1Gi
```

### Setting the data table storage memory limit

This is an advanced option that most developers shouldn't need. For more discussion see the [Tuning Memory Usage](/reference/admin/tuning-mem-usage/) page.

To set Pixie's data store memory limit when deploying with the [Pixie CLI](/installing-pixie/install-schemes/cli/), use the `--pem_flags` flag:

```bash
px deploy --pem_flags="PL_TABLE_STORE_DATA_LIMIT_MB=1000"
```

To set Pixie's data store memory limit when deploying with [Helm](/installing-pixie/install-schemes/helm/), use the `dataCollectorParams.customPEMFlags.PL_TABLE_STORE_DATA_LIMIT_MB` field:

```bash
helm install pixie pixie-operator/pixie-operator-chart --set deployKey=<deploy-key-goes-here> --namespace pl --create-namespace --set dataCollectorParams.customPEMFlags.PL_TABLE_STORE_DATA_LIMIT_MB=750
```

## Setting the data access mode

When deploying Pixie, you have the option of setting the data access mode. This mode controls what data can be displayed when executing a [PxL script](/using-pixie) to query Pixie platform telemetry data. Pixie offers two data access modes:

- `Full` (default): The user has full data access, and Pixie does not redact any collected data from the user during script execution.

- `Restricted`: The user has restricted data access. Pixie will redact all columns that may potentially contain sensitive data (e.g. request/response bodies and headers). All rows in the column will be redacted, regardless of whether they do or do not actually contain PII.  Metadata about these columns, such as length, will still be queryable.

If no data access mode is specified when deploying Pixie, the deploy assumes `Full` as default.

To set the data access mode when deploying with the [Pixie CLI](/installing-pixie/install-schemes/cli/), use the `--data_access` flag:

```bash
px deploy --data_access=(Full|Restricted)
```

To set the data access mode when deploying with [Helm](/installing-pixie/install-schemes/helm/), use the `dataAccess` field:

```bash
helm install pixie pixie-operator/pixie-operator-chart --set deployKey=<deploy-key-goes-here> --namespace pl --create-namespace --set dataAccess=(Full|Restricted)
```

You may also directly update the `dataAccess` field in your `values.yaml` file.

## Select metadata storage option

By default, Pixie uses a persistent volume to store 24 hours' worth of Kubernetes metadata updates.

For clusters that don't support persistent volumes, we have an alternative mode that uses the etcd operator.

To deploy using the etcd operator using `px deploy`, use the `--use_etcd_operator` flag.

```bash
px deploy --use_etcd_operator
```

To deploy with Helm using the etcd operator, use the `--useEtcdOperator` flag.

```bash
helm install pixie pixie-operator/pixie-operator-chart --set deployKey=<deploy-key-goes-here> --namespace pl --create-namespace --set pixie-chart.useEtcdOperator=true
```

## Custom Image Registry

By default, Pixie uses images hosted on `gcr.io`. Pixie allows you to specify a custom image registry for clusters which may not have access to `gcr.io` or for users who simply want to host their own images.

### Collect the Vizier images

1. Download the Vizier artifacts:

```bash
curl https://storage.googleapis.com/pixie-dev-public/vizier/latest/vizier_yamls.tar | tar x
cd yamls
```

2. Determine whether you'd like to deploy Pixie with or without etcd. We recommend installing Pixie without etcd as long as your cluster supports Pixie creating and using PVs.

> To list the images required to deploy Pixie _without_ etcd **(Recommended)**:

```
cat images/vizier_image_list.txt
```

> To list the images required to deploy Pixie _with_ etcd:

```
cat images/vizier_etcd_image_list.txt
```

3. Collect and publish the images listed in **Step 2** to your custom registry.

> Note that Pixie expects hosted images to adhere to the following format: `${custom_registry}/${defaultImagePath | sed 's/\//-/g'}`. In other words, Pixie will expect your images to be hosted on your registry, where the image name in your registry is Pixie's full image path with any `/` replaced with `-`. For example: `gcr.io/pixie-oss/pixie-dev/vizier/metadata_server_image:latest` should pushed to `$registry/gcr.io-pixie-oss-pixie-dev-vizier-metadata_server_image:latest`.

### Collect the OLM images

Pixie depends on [OLM](https://olm.operatorframework.io/) to deploy its operator. The required OLM images are listed below:

```
quay.io/operator-framework/olm
quay.io/operator-framework/olm@sha256:b706ee6583c4c3cf8059d44234c8a4505804adcc742bcddb3d1e2f6eff3d6519
quay.io/operator-framework/configmap-operator-registry:latest
```

2. You will need to build your own OLM bundle.

2. Download [opm](https://docs.openshift.com/container-platform/4.6/cli_reference/opm-cli.html):

```bash
opm index export --index gcr.io/pixie-oss/pixie-prod/operator/bundle_index:0.0.1
```

3. Find the current operator version listed in the `downloaded/pixie-operator/package.yaml` file.

4. Locate the operator's csv in the `downloaded/pixie-operator/<version>/csv.yaml` file. Remove the `replaces` line and update the image tag for `gcr.io/pixie-oss/pixie-prod/operator/operator_image:<version>` to your hosted image.

5. Next, build your bundle by running the following:

```bash
opm alpha bundle generate --package pixie-operator --channels stable --default stable --directory downloaded/pixie-operator/<version>
docker build -t ${registry}/bundle:<version> -f bundle.Dockerfile .
docker push ${registry}/bundle:<version>
opm index add --bundles ${registry}/bundle:<version> --tag ${registry}/gcr.io-pixie-oss-pixie-prod-operator-bundle_index:0.0.1 -u docker
docker push ${registry}/pixie-oss-pixie-prod-operator-bundle_index:0.0.1
```

### Deploy Pixie using your custom registry

Deploy Pixie Vizier with the `registry` flag. You can deploy Pixie Vizier in one of three ways.

Using the CLI:

```bash
px deploy --registry <your-registry>
```

Using Helm:

```bash
helm install pixie pixie-operator/pixie-operator-chart --set deployKey=<deploy-key-goes-here> --namespace pl --create-namespace --set registry=<your registry>
```

Using Yamls:

> To deploy Pixie _without_ etcd, use the following yamls:

```
kubectl apply -f yamls/vizier/vizier_metadata_persist_prod.yaml
kubectl apply -f yamls/vizier_deps/nats_prod.yaml
```

> To deploy Pixie _with_ etcd, use the following yamls:

```
kubectl apply -f yamls/vizier/vizier_etcd_metadata_prod.yaml
kubectl apply -f yamls/vizier_deps/etcd_prod.yaml
```

## Set a PEM flag

PEM flags are used to configure the [Pixie Edge Module](/reference/architecture/#vizier-components), Pixie's data collector component. PEM flags are often used to enable beta features.

For example, to enable `STIRLING_ENABLE_AMQP_TRACING` when deploying with the [Pixie CLI](/installing-pixie/install-schemes/cli/), use the `--pem_flags` flag:

```bash
px deploy --pem_flags="STIRLING_ENABLE_AMQP_TRACING=true"
```

To enable `STIRLING_ENABLE_AMQP_TRACING` when deploying with [Helm](/installing-pixie/install-schemes/helm/), use the `dataCollectorParams.customPEMFlags` field:

```bash
helm install pixie pixie-operator/pixie-operator-chart --set deployKey=<deploy-key-goes-here> --namespace pl --create-namespace --set dataCollectorParams.customPEMFlags.STIRLING_ENABLE_AMQP_TRACING=true
```
