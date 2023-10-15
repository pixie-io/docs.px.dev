The following tutorial demonstrates how to configure scripts for Pixie's observability platform using Kubernetes ConfigMaps, rather than the default Control Plane.

## Motivation

This feature is for customers who want to manage their PxL scripts outside of a control plane. It provides to ability to supply PxL scripts via in-cluster ConfigMaps either instead of or in addition to scripts from a control plane.

As an example, if your product needed to install Pixie with a set of scripts pre-loaded, this would solve that problem.



## Turning on the feature

You can enable loading scripts from ConfigMaps by setting the `PL_CRON_SCRIPT_SOURCES` environment variable on the `vizier-query-broker` deployment. The value of this environment variable should be a space-separated list of sources. Currently, the valid sources are `cloud` and `configmaps`. If nothing is supplied, the query broker will default to `cloud` only.

As an example, you could enable both sources by running:

```bash
px deploy -y --patches "vizier-query-broker:{\"spec\":{\"template\":{\"spec\":{\"containers\":[{\"env\":[{\"name\":\"PL_CRON_SCRIPT_SOURCES\",\"value\":\"cloud configmaps\"}], \"name\":\"app\"}]}}}}
```

## ConfigMap Format

Each ConfigMap must be in the same namespace as the query broker, and must also have the `purpose=cron-script` label.

Each ConfigMap must contain the following data:
- a `script.pxl` key with the pixel script as its value
- a `cron.yaml` key that a valid YAML string with a `frequency_s` key, whose value controls how frequently in seconds the script is executed
- an optional `configs.yaml` key which contains a YAML string that configures OpenTelemetry data export

An example configured to send data to an OpenTelemetry endpoint:
```yaml
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: my-configmap-script
  namespace: pl
  labels:
    purpose: cron-script
data:
  script.pxl: |
    # YOUR PIXEL SCRIPT
  configs.yaml: |
    otelEndpointConfig:
      insecure: true
      url: <otel-url>
  cron.yaml: |
    frequency_s: 15
```

An example without data export:
```yaml
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: my-configmap-script
  namespace: pl
  labels:
    purpose: cron-script
data:
  script.pxl: |
    # YOUR PIXEL SCRIPT
  cron.yaml: |
    frequency_s: 15
```
