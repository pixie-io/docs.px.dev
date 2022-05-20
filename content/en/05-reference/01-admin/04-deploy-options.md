---
title: "Deploy Options"
metaTitle: "Reference | Admin | Deploy Options"
metaDescription: "Configuration options for Pixie on deploy"
order: 4
redirect_from:
    - /admin/deploy-options/
---

Pixie offers the following deploy options:

- [Annotate Pixie's resources](#annotating-pixie's-resources)
- [Label Pixie's resources](#labeling-pixie's-resources)
- [Select a subset of nodes](#selecting-the-nodes-to-deploy-pixie-on)
- [Provide a custom cluster name](#providing-a-custom-cluster-name)
- [Configure Pixie's memory usage](#configuring-pixie's-memory-usage)
- [Set the data access mode](#setting-the-data-access-mode)

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

## Selecting the nodes to deploy Pixie on

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

## Configuring Pixie's memory usage

When deploying Pixie, you have three options for configuring PEM memory usage:

- [Set PEM pod memory limit](#configuring-pixie's-memory-usage-setting-the-memory-limit)
- [Set PEM pod memory request](#configuring-pixie's-memory-usage-setting-the-memory-request)
- [Set data table storage limit](#configuring-pixie's-memory-usage-setting-the-data-table-storage-memory-limit)

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
