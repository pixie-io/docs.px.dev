---
title: "Environment-Specific Configurations"
metaTitle: "Reference | Admin | Environment Configurations"
metaDescription: "Configurations for running Pixie on specific Kubernetes environments"
order: 4
---

Due to differences across various Kubernetes environments and providers, extra configurations may be necessary to run Pixie.

## Minikube, GKE, EKS, AKS

No extra configuration should be necessary to run on these environments. However, please consult with your cluster admin regarding cluster network setup, such as firewalls, and podSecurityPolicies.

## OpenShift

### OLM

Pixie utilizes the [Operator Lifecycle Manager](https://olm.operatorframework.io/). However, OLM runs by default in OpenShift Container Platform 4.5.

If deploying Pixie through CLI/manifests, ensure you are settting `--deploy_olm=false` when running `px deploy`.

If deploying Pixie through Helm, ensure you are setting `-set deployOLM=false` or update `deployOLM` in your `values.yaml`.

### SCC

OpenShift utilizes [SCCs](https://docs.openshift.com/container-platform/4.6/authentication/managing-security-context-constraints.html) to restrict pod actions and access. If your cluster is running a more restrictive set of SCCs, you will need to give Pixie privileged access.

```yaml
kind: SecurityContextConstraints
apiVersion:  security.openshift.io/v1
metadata:
 name: pl-scc
allowPrivilegedContainer: true
allowHostPID: true
allowHostIPC: false
allowHostPorts: false
readOnlyRootFilesystem: false
seccompProfiles:
- runtime/default
allowedCapabilities:
- SYS_ADMIN
- SYS_PTRACE
allowHostNetwork: true
allowHostDirVolumePlugin: true
runAsUser:
 type: RunAsAny
seLinuxContext:
 type: RunAsAny
users:
- system:serviceaccount:pl:default
- system:serviceaccount:pl:cloud-conn-service-account
- system:serviceaccount:pl:metadata-service-account
- system:serviceaccount:pl:pl-cert-provisioner-service-account
- system:serviceaccount:pl:pl-updater-service-account
- system:serviceaccount:pl:query-broker-service-account

```

Note: Make sure to set the namespace on the serviceAccount to the namespace you deployed Pixie to.
