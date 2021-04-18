---
title: "Supported Protocols"
metaTitle: "About Pixie | Supported Protocols"
metaDescription: "Protocols automatically traced by Pixie"
order: 3
---

The following is a list of protocols automatically traced by Pixie's no-instrumentation logic. 

## Protocols

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
