---
title: "Production Readiness"
metaTitle: "Production Readiness"
metaDescription: "Sharing a single Pixie Cloud across multiple Pixie deployments"
order: 4
---

Pixie allows you to connect multiple Kubernetes clusters to a single Pixie Cloud instance. The main advantage of such a deployment is that you can monitor all your Kubernetes clusters from a single point. 

This guide explains how to share a Pixie Cloud instance across multiple Pixie deployments.


## Prerequisites

- A domain name that you own
- Prerequisites of the install method your choice; [Self-hosted Pixie](/installing-pixie/install-guides/self-hosted-pixie/#prerequisites) or [Air Gapped Pixie](/installing-pixie/install-guides/airgap-pixie/#prerequisites)

## Steps

## 1. Install the NGINX Ingress Controller

Install the NGINX Ingress Controller in your Kubernetes cluster. Please refer to the [NGINX Ingress Controller Installation Guide](https://kubernetes.github.io/ingress-nginx/deploy/) for more information.

Note the IP address assigned to the Ingress Controller service. All requests to the Pixie Cloud will be sent through this.

E.g. The following image shows the services created in the namespace where the NGINX Ingress Controller was installed. Note the IP address in the `EXTERNAL-IP` column of the `ingress-nginx-controller` Load Balancer service.

<svg title='' src='production-readiness/ingress-controller-ip.png'/>

## 2. Create DNS A records

Two DNS `A` records need to be created pointing to the NGINX Ingress controller IP address obtained above.

Suppose that your Pixie custom domain name is `pixie.example.com` and the IP address obtained above is `a.b.c.d`. Two `A` records need to be created as follows.
```
pixie.example.com           a.b.c.d
work.pixie.example.com      a.b.c.d
```

## 3. Install Pixie Cloud

If you are using the [Self-Hosted installation](/installing-pixie/install-guides/self-hosted-pixie/),
1. Follow steps 1 - 5 and 8 in [Deploy Pixie Cloud](/installing-pixie/install-guides/self-hosted-pixie/#1.-deploy-pixie-cloud).
2. Comment lines 94 to 106 in `./scripts/create_cloud_secrets.sh`
3. Execute the script as explained in step 9 of [Deploy Pixie Cloud](/installing-pixie/install-guides/self-hosted-pixie/#1.-deploy-pixie-cloud)

If you are using the [Air Gapped installation](/installing-pixie/install-guides/airgap-pixie/),
1. Follow steps 1 and 4 in [Deploy Pixie Cloud](/installing-pixie/install-guides/airgap-pixie/#deploy-pixie-cloud)
2. Comment lines 94 to 106 in `./scripts/create_cloud_secrets.sh`
3. Execute the script as explained in step 6 of [Deploy Pixie Cloud](/installing-pixie/install-guides/airgap-pixie/#deploy-pixie-cloud)


## 4. Create TLS certificate

A TLS certificate is required for the custom domains that you wish to use with Pixie.

Suppose that your Pixie custom domain name is `pixie.example.com`. You need to obtain a single certificate that is valid for both `pixie.example.com` and `work.pixie.example.com`. Finally, create a Kubernetes secret (of type `kubernetes.io/tls`) named `cloud-proxy-tls-certs` in the `plc` namespace using the certificate.

One way to obtain it is by creating a Let's Encrypt certificate using [cert-manager](https://cert-manager.io/). [Securing NGINX-ingress tutorial](https://cert-manager.io/docs/tutorials/acme/nginx-ingress/) from cert-manager has detailed information about the process.

Here are sample resources that can be used with cert-manager:

Sample `ClusterIssuer` resource
```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-cluster-issuer
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin@example.com
    privateKeySecretRef:
      name: letsencrypt-cluster-issuer-key
    solvers:
    - http01:
       ingress:
          class: nginx
``` 

Sample `Certificate` resource
```yaml
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: cloud-proxy-tls-certs
  namespace: plc
spec:
  dnsNames:
  - pixie.example.com
  - work.pixie.example.com
  secretName: cloud-proxy-tls-certs
  issuerRef:
    name: letsencrypt-cluster-issuer
    kind: ClusterIssuer
```

## 5. Create Ingress resources

Two Kubernetes Ingresses are required for Pixie Cloud; One for HTTPs and the other for gRPCs communication.

Create two ingresses as follows.

```bash
kubectl apply -f k8s/cloud/overlays/exposed_services_nginx/cloud_ingress_grpcs.yaml
kubectl apply -f k8s/cloud/overlays/exposed_services_nginx/cloud_ingress_https.yaml
```

## 6. Install Pixie Cloud (contd)

If you are using the [Self-Hosted installation](/installing-pixie/install-guides/self-hosted-pixie/),

1. In `k8s/cloud/public/domain_config.yaml` set the value of `PASSTHROUGH_PROXY_PORT` to be empty.

```bash
PASSTHROUGH_PROXY_PORT: ""
```
2. Complete steps 10 - 13 in [Deploy Pixie cloud](/installing-pixie/install-guides/self-hosted-pixie/#1.-deploy-pixie-cloud)
3. Skip the [Set up DNS](/installing-pixie/install-guides/self-hosted-pixie/#1.-deploy-pixie-cloud-set-up-dns) section
4. Complete the steps in [Authentication using Kratos / Hydra](/installing-pixie/install-guides/self-hosted-pixie/#1.-deploy-pixie-cloud-authentication-using-kratos-hydra)
5. (Optional) - Complete the steps in [Invite others to your organization (optional)](/installing-pixie/install-guides/self-hosted-pixie/#1.-deploy-pixie-cloud-invite-others-to-your-organization-(optional))
6. Install the Pixie CLI as explained in [Install the Pixie CLI](/installing-pixie/install-guides/self-hosted-pixie/#2.-install-the-pixie-cli)

If you are using the [Air Gapped installation](/installing-pixie/install-guides/airgap-pixie/),

1. Complete steps 7 - 11 in [Deploy Pixie Cloud](/installing-pixie/install-guides/airgap-pixie/#deploy-pixie-cloud)
2. In `yamls/cloud.yaml`, find the ConfigMap named `pl-domain-config`. Set the value of `PASSTHROUGH_PROXY_PORT` in it to be empty.

```bash
PASSTHROUGH_PROXY_PORT: ""
```
3. Complete the remaining steps (from step 12 onwards) in [Deploy Pixie Cloud](/installing-pixie/install-guides/airgap-pixie/#deploy-pixie-cloud)
4. Skip the [Set up DNS](/installing-pixie/install-guides/airgap-pixie/#deploy-pixie-cloud-set-up-dns) section
5. Complete the steps in [Authentication using Kratos / Hydra](/installing-pixie/install-guides/airgap-pixie/#deploy-pixie-cloud-authentication-using-kratos-hydra)
6. Complete the steps in [Serve the Script Bundle](/installing-pixie/install-guides/airgap-pixie/#deploy-pixie-cloud-serve-the-script-bundle)
7. (Optional) - Complete the steps in [Invite others to your organization (optional)](/installing-pixie/install-guides/self-hosted-pixie/#1.-deploy-pixie-cloud-invite-others-to-your-organization-(optional))


## 6. Deploy Pixie

Finally, deploy Pixie in each cluster that you wish to monitor.

If you are using the [Self-Hosted installation](/installing-pixie/install-guides/self-hosted-pixie/), in [Deploy Pixie instructions](/installing-pixie/install-guides/self-hosted-pixie/#3.-deploy-pixie), skip the `--dev_cloud_namespace plc` flag when executing `px deploy` commands.

If you are using the [Air Gapped installation](/installing-pixie/install-guides/airgap-pixie/), deploy Pixie as explained [here](/installing-pixie/install-guides/airgap-pixie/#deploy-pixie-cloud).
