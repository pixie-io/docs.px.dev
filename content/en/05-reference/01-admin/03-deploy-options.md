---
title: "Deploy Options"
metaTitle: "Reference | Admin | Deploy Options"
metaDescription: "Configuration options for Pixie on deploy"
order: 3
redirect_from:
    - /admin/deploy-options/
    - /reference/admin/deploy-options/
---

## Data Access
You can configure Pixie's data access mode in order to control what data can be displayed when executing a script. 
Pixie offers two modes:
1. `Full` (default): The user has full data access, and Pixie does not redact any collected data from the user during script execution.  
2. `Restricted`: The user has restricted data access. Pixie will redact all columns that may potentially contain sensitive data (e.g. request/response bodies and headers). All rows in the column will be redacted, regardless of whether they do or do not actually contain PII.  Metadata about these columns, such as length, will still be queryable.

### CLI/YAML Install
You may specify the desired data access mode using the `--data_access` flag. If no mode is specified, the deploy assumes `Full` as default.

```
px deploy --data_access=(Full|Restricted)
```

### Helm Install
You may specify the desired data access mode using the `dataAccess` field.

```
helm install pixie pixie-operator/pixie-operator-chart --set deployKey=<deploy-key-goes-here> --set clusterName=<cluster-name> --namespace pl --create-namespace
--dataAccess=(Full|Restricted)
```
You may also directly update the `dataAccess` field in your `values.yaml` file.
