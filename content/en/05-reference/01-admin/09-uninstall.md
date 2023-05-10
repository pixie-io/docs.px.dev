---
title: "Uninstalling Pixie"
metaTitle: "Reference | Admin | Uninstalling Pixie"
metaDescription: "Steps to uninstall and remove your Pixie installation."
order: 9
redirect_from:
    - /admin/uninstall/
    - /installing-pixie/uninstall/
---

Pixie can be uninstalled with Pixie's [CLI tool](/installing-pixie/install-schemes/cli) or with `kubectl`.

## Uninstall using the CLI (easiest)

The easiest way to uninstall Pixie is with the CLI. To delete Pixie from the current cluster, run:

```bash
px delete
```

Note that `px delete` will not delete the `olm` namespace. During installation, Pixie will install the [Operator Lifecycle Manager](https://docs.openshift.com/container-platform/4.5/operators/understanding/olm/olm-understanding-olm.html) (OLM) if it is not already present. Make sure that no other applications are using the OLM before manually deleting it with `kubectl delete namespace olm`.

## Uninstall using kubectl

To delete Pixie using `kubectl`, run the following commands. These commands assume that Pixie's components were deployed to their default namespaces.

Note that it is not necessary to delete Pixie Cloud (namespace=`plc`) in order to redeploy Pixie Vizier.

```bash
# Delete Pixie operator.
kubectl delete namespace px-operator

# Delete Pixie vizier.
kubectl delete namespace pl

# (Optional) Delete Pixie cloud.
kubectl delete namespace plc

# Delete Pixie ClusterRole, ClusterRoleBinding objects.
kubectl delete clusterroles -l "app=pl-monitoring"
kubectl delete clusterrolebindings -l "app=pl-monitoring"
```

During installation, Pixie will install the [Operator Lifecycle Manager](https://docs.openshift.com/container-platform/4.5/operators/understanding/olm/olm-understanding-olm.html) (OLM) if it is not already present in your cluster. Make sure that no other applications are using the OLM before deleting it with `kubectl delete namespace olm`.
