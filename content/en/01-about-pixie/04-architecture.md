---
title: "Architecture"
metaTitle: "About Pixie | Architecture"
metaDescription: "What Pixie deploys to your cluster and what each component does."
order: 4 
---

## Main Components 

Pixie's deploy consists of three main components:
1. Vizier
    - Vizier is the core of Pixie. It is responsible for collecting and processing data in a cluster. 
2. Pixie Operator
    - The Pixie operator is responsible for managing a Vizier instance. It deploys Vizier, tracks its state, keeps it up-to-date, and helps auto-recover in bad situations.
    - The latest version of the Pixie operator is automatically deployed by OLM once OLM is up and running.
3. [Operator Lifecycle Manager](https://olm.operatorframework.io/)
    - OLM is responsible for deploying the Pixie operator, and keeping it up-to-date.
    - OLM comes with a `olm` namespace by default. The resources in here are responsible for keeping OLM running.
    - Pixie additionally deploys the `px-operator` namespace. Most of the jobs/pods in here are deployed by OLM and are responsible for checking for updates to the Pixie operator and re/deploying the Pixie operator.

::: div image-m
<svg title='Pixie Deploy Flow' src='deploy-flow.svg' />
:::

## Vizier

### Dependencies

When deploying Vizier, dependencies are deployed first as they are critical to the operation of the Vizier components. 

1. [NATS](https://nats.io/) 
    - NATS is the message bus system in Pixie. We use it to send messages between pods in Vizier. For example, PEMs send routine heartbeat messages to the metadata pod to inform it of its status.
2. [etcd](https://etcd.io/)
    - `etcd` is only a dependency if `use_etcd_operator` is enabled. This is recommended only if you cannot use PersistentVolumes in your cluster. 
    - The responsibility of etcd is to persist metadata in-memory, such as K8s metadata, the status of the PEMs on the cluster, and historical trends.

### Components
1. Cloud Connector
    - The cloud connector is responsible for communicating with Pixie Cloud, and passing messages back and forth. These messages include:
        - Registration: Once the cloud connector starts up for the first time, it informs Pixie Cloud about the cluster by sending info about the cluster (clusterName, version, etc). It is assigned an ID, which is used to track it in Pixie Cloud.
        - Heartbeats: The cloud connector continually sends messages to Pixie Cloud about its current state.
2. Metadata
    - The metadata service is responsible for tracking K8s metadata and the state of the PEMs. 
    - Since it tracks the state of the PEMs (done via NATS), it is important for the metadata service to be healthy before scripts can be run on the cluster.
3. Query Broker
    - The query broker is responsible for compiling any scripts that need to be executed, distributing those scripts to the relevant PEMs, and collecting data from the PEMs to be surfaced to the user. 
4. PEMs
    - PEMs are the data-collectors. They are responsible for processing this data when they receive a scriptExecution request.
    - Since our PEMs use eBPF, they will require privileged access.
5. Kelvin
    - The Kelvin is a higher-level data processor. The PEMs send data to the Kelvin for further aggregation/processing. It is then responsible for sending the processed data back to the query broker.
    - Due to Kelvin’s important role in the scriptExecution process, the Kelvin must be healthy before the user can run any scripts.
