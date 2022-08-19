---
title: "Install Guides"
metaTitle: "Installing Pixie | Install Guides"
metaDescription: "Install guides for Pixie deployment options"
order: 3
redirect_from:
    - /installing-pixie/quick-start/
---

There are multiple hosting options for Pixie.

- [Community Cloud for Pixie (easiest)](/installing-pixie/install-guides/community-cloud-for-pixie)
- [Self-Hosted Pixie](/installing-pixie/install-guides/self-hosted-pixie)
- [Air Gapped Pixie](/installing-pixie/install-guides/airgap-pixie)

Pixie is a hybrid system, with a cloud component (Pixie Cloud) and an in-cluster component for data persistence and storage (Vizier). See [Architecture](/about-pixie/what-is-pixie/#architecture) for more details.

While Vizier will always be deployed directly onto your Kubernetes cluster, there are multiple options for Pixie Cloud.

## Community Cloud for Pixie (easiest)

Follow the [Community Cloud for Pixie Guide](/installing-pixie/install-guides/community-cloud-for-pixie) if you want to deploy Pixie without needing to host your own version of Pixie Cloud. Community Cloud for Pixie provides community hosting of the cloud component to simplify your Pixie deployment.

With Community Cloud for Pixie, telemetry data is exclusively stored on your Kubernetes cluster (not in Pixie Cloud).

## Self-Hosted Pixie

Pixie also supports for self-hosting of the entire platform, including Pixie Cloud. Follow the [Self-Hosted Pixie Guide](/installing-pixie/install-guides/self-hosted-pixie) for the steps.

## Air Gapped Pixie

Pixie works in air gapped environments. Follow the [Air Gapped Pixie Guide](/installing-pixie/install-guides/airgap-pixie) for the install steps.

## Add Your Own

Does your organization offer Pixie? [Open a PR](https://github.com/pixie-io/pixie-docs) to list it here.
