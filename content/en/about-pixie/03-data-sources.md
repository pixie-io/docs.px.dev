---
title: "Data Sources"
metaTitle: "About Pixie | Data Sources"
metaDescription: "Data sources automatically traced by Pixie"
order: 3
redirect_from:
    - /about-pixie/observability
---

Pixie uses eBPF to automatically instrument Kubernetes applications. Pixie ships with a set of default data sources, which can also be extended by the user.

## Data Sources

Pixie automatically collects the following data:

* **Protocol traces**: Full-body messages between the pods of your applications. Tracing currently supports the following [list of protocols](/about-pixie/data-sources#supported-protocols).

* **Resource metrics**: CPU, memory and I/O metrics for your pods.

* **Network metrics**: Network-layer and connection-level RX/TX statistics.

* **JVM metrics**: JVM memory management metrics for Java applications.

* **Application profiles**: Sampled stack traces from your application. Pixie’s [continuous profiler](/tutorials/profiler/) is always running to help identify application performance bottlenecks when you need it. Currently works for compiled languages (Go, Rust, C/C++).

Pixie can also be configured by the user to collect [dynamic logs](/tutorials/simple-go-tracing/) from your Go code and to run [custom BPFTrace scripts](/tutorials/distributed-bpftrace-deployment/).

## Supported Protocols

The following is a list of protocols automatically traced by Pixie. 

| Protocol      | Support             | Notes                          |
| :------------ | :------------------ | :----------------------------- |
| HTTP          | Supported           |                                |
| HTTP2/gRPC    | Partially Supported | Currently only for Golang apps |
| DNS           | Supported           |                                |
| MySQL         | Supported           |                                |
| PostgreSQL    | Supported           |                                |
| Cassandra     | Supported           |                                |
| Redis         | Supported           |                                |

Additional protocols are under development.

## Encryption Libraries

Pixie supports tracing of traffic encrypted with the following libraries:
- [OpenSSL](https://www.openssl.org/) (versions 1.1.0, 1.1.1)
- [Go TLS](https://golang.org/pkg/crypto/tls/)
