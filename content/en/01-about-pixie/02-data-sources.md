---
title: "Data Sources"
metaTitle: "About Pixie | Data Sources"
metaDescription: "Data sources automatically traced by Pixie"
order: 2
redirect_from:
    - /about-pixie/observability
---

Pixie uses [eBPF](https://www.brendangregg.com/ebpf.html) to automatically instrument Kubernetes applications.

Pixie ships with a set of default data sources, which can also be extended by the user.

## Data Sources

Pixie automatically collects the following data:

* **Protocol traces**: Full-body messages between the pods of your applications. Tracing currently supports the following [list of protocols](/about-pixie/data-sources#supported-protocols). For more information, see the [Request Tracing](/tutorials/pixie-101/request-tracing), [Service Performance](/tutorials/pixie-101/service-performance), and [Database Query Profiling](/tutorials/pixie-101/database-query-profiling) tutorials.

* **Resource metrics**: CPU, memory and I/O metrics for your pods. For more information, see the [Infra Health](/tutorials/pixie-101/infra-health) tutorial.

* **Network metrics**: Network-layer and connection-level RX/TX statistics. For more information, see the [Network Monitoring](/tutorials/pixie-101/network-monitoring) tutorial.

* **JVM metrics**: JVM memory management metrics for Java applications.

* **Application profiles**: Sampled stack traces from your application. Pixie’s continuous profiler is always running to help identify application performance bottlenecks when you need it. Currently supports compiled languages (Go, Rust, C/C++). For more information, see the [Continuous Application Profiling](/tutorials/pixie-101/profiler/) tutorial.

Pixie can also be configured by the user to collect [dynamic logs](/tutorials/custom-data/dynamic-go-logging/) from Go application code and to run [custom BPFTrace scripts](/tutorials/custom-data/distributed-bpftrace-deployment).

## Supported Protocols

Pixie automatically traces the following protocols:

| Protocol      | Support             | Notes                          |
| :------------ | :------------------ | :----------------------------- |
| HTTP          | Supported           |                                |
| HTTP2/gRPC    | Partially Supported | Currently only for Golang apps |
| DNS           | Supported           |                                |
| NATS          | Coming Soon         |                                |
| MySQL         | Supported           |                                |
| PostgreSQL    | Supported           |                                |
| Cassandra     | Supported           |                                |
| Redis         | Supported           |                                |
| Kafka         | Coming Soon         |                                |

Additional protocols are under development.

## Encryption Libraries

Pixie supports tracing of traffic encrypted with the following libraries:

* [OpenSSL](https://www.openssl.org/) (versions 1.1.0, 1.1.1)
* [Go TLS](https://golang.org/pkg/crypto/tls/)
