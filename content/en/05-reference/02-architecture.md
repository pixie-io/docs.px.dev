---
title: "Architecture"
metaTitle: "Reference | Architecture"
metaDescription: "A detailed overview of Pixie's components"
order: 2 
---

## Overview

Pixie consists of three main components: 

- **Vizier**: Pixie's data plane for data collection and processing. An instance of Vizier is deployed to each cluster which needs to be monitored. 
- **Cloud**: Pixie's control plane for serving Pixie's API and UI, and managing and tracking metadata (e.g. orgs, users, Viziers).
- **Vizier Operator**: Pixie's [Kubernetes operator](https://kubernetes.io/docs/concepts/extend-kubernetes/operator/) which is used to help deploy and manage Vizier on a cluster, such as keeping all components running and up-to-date. 

## Vizier

Vizier is Pixie's data plane. It is responsible for collecting and processing data within the cluster that is being monitored.

### Components

1. **Pixie Edge Module (PEM)**: The data collectors, deployed to each node via a daemonset. PEMs serve as a short-term in-memory store (up to 24h) for all data collected in the cluster. The PEMs are also responsible for processing this data when they receive a script execution request. 
2. **Collector (Kelvin)**: Kelvin is the high-level data collector. During script execution, PEMs send partially processed data to Kelvins. Kelvins aggregate the node level view from each PEM into a cluster-level view and complete the script execution steps that requires all of the data, such as aggregates and joins.
3. **Cloud Connector**: The cloud connector handles message passing between Vizier and Pixie Cloud. These messages range from  heartbeats, used to indicate the Vizier's overall status, and script execution requests and results.
4. **Metadata**: The metadata service serves as the hub for all of Vizier's metadata. The metadata stored includes k8s objects (ie pods, services, namespaces) for adding context to execute scripts as well as metadata about the Vizier state (ie PEM status, [dynamic logs deployed](https://docs.px.dev/tutorials/custom-data/dynamic-go-logging/)) 
5. **Query Broker**: The query broker handles all script execution. It compiles any scripts need to be executed, distributes those scripts to the relevant PEMs, and helps proxy those results back to the cloud.

### Dependencies

Vizier relies on a couple of dependencies that are critical to its operation.

1. **[NATS](https://nats.io/)**: Pixie's message bus system, used to send messages between pods and services within Vizier. For example, PEMs send routine heartbeat messages to the metadata pod to inform it of its status.
2. **[etcd](https://etcd.io/)**: Only used when the cluster does not support persistent volumes, or when explicitly chosen. etcd serves as the Metadata pod's in-memory datastore.

## Cloud

Pixie's cloud components serves as the control plane. The cloud serves Pixie's API and UI to make it easy to query and access data from Viziers. It also manages metadata in the system, such as orgs, users, and Viziers. 

### Components

1. **Cloud Proxy**: An NGINX and Envoy proxy which serves as the main entrypoint when requests are made to the Cloud. The proxy also hosts the UI.
2. **API**: The API service serves as a proxy for any incoming API requests (GQL, GRPC, Python, Go), and redirects the request to the relevant downstream services in the Cloud.
3. **Auth**: The Auth service is responsible for handling authentication/authorization for ensuring that any tokens/cookies/API keys are valid before servicing a request.
4. **Vizier Connector (VZConn)**: VZConn serves as the communication point between Cloud and all connected Viziers. It proxies data between the Vizier and the relevant downstream services in the Cloud. 
5. **Vizier Manager (VZMgr)**: VZMgr tracks and manages the state of all connected Viziers, such as the version or current health of a Vizier.
6. **Artifact Tracker**: The artifact tracker manages version and release information for all Pixie-related artifacts, such as the Vizier and CLI. For example, it can be queried to obtain the necessary download links for a Vizier's base deployment YAMLs.
7. **Config Manager**: The config manager is responsible for customizing a Vizier's deployment YAMLs based on an user's/org's specified deployment options.
8. **Cron Script**: The cron script service handles registering and distributing any PxL scripts that should run on a scheduled cadence on a Vizier. For example, scripts can be scheduled to run data exports to an external datastore at regular intervals.
9. **Indexer**: The indexer receives any metadata that should be stored and indexed for future querying (for example, to perform autocompletes when searching for K8s namespaces within a cluster).
10. **Plugin**: The plugin service manages all plugin information in the Pixie Plugin System, such as which plugins are available and enabled.
11. **Profile**: The profile service manages all users and orgs registered in Pixie Cloud.

### Dependencies

1. **[Elastic](https://www.elastic.co/)**: Elastic serves as Pixie Cloud's indexing engine, for any data that needs to be easily searchable.
2. **[NATS/STAN](https://nats.io/)**: The Cloud's message bus system for distributing messages between services in Pixie Clouds. STAN is addtionally used for any messages that may need persistence.

## Vizier Operator

The Vizier Operator is used to help manage Vizier on a cluster. The operator executes the initial deploy of Vizier, deciding which Vizier configurations are best fit for an environment (if not already specified), and monitors the overall state of the Vizier. This includes restarting any failed dependencies and keeping Vizier up-to-date, based on the latest release information from Pixie Cloud.

### Dependencies 

1. **[Operator Lifecycle Manager](https://olm.operatorframework.io/)**: OLM is responsible for deploying the Vizier Operator to a cluster and keeping the Vizier Operator up-to-date.
