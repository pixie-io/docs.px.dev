---
title: 'PxL'
metaTitle: 'PxL'
metaDescription: 'This contains a high level overview of the Pixie Language. (PxL)'
order: 60
---

## PxL Language Overview

Pixie Language (PxL) is a domain-specific language for working with machine data, and uses a Python dialect. It is heavily influenced by the popular data processing library [Pandas](https://pandas.pydata.org/), and is almost a subset of Pandas. PxL is used by the Pixie Platform, allowing developers to create high performance data processing pipelines to monitor, secure and operate their applications and infrastructure.

Like Python, PxL is implicitly and strongly typed, supports high-level data types, and functions. Unlike Python, PxL is a [dataflow](https://en.wikipedia.org/wiki/Dataflow_programming) language allows the Pixie platform to heavily optimize it's execution performance, while maintaining expressiveness for data processing. PxL programs are typically short-lived and have no implicit side effects. As a result, PxL has no support for classes, exceptions, other such features of Python

PxL can be executed by the Pixie platform by using either the web based UI, API or CLI.

## Data Types

PxL has a rich type system consisting of both concrete and semantic types. Semantic types are used for the following purposes:

- The query planner uses types to determine which PEM agents to pull data from.
- The UI uses types to determine how to visualize the data. For example, data of the `ST_BYTES` semantic type will be displayed with the appropriate label (`KB`, `MB`, etc).

### Concrete Types

The Pixie execution engine supports many concrete data types:

| Type     | Description                                                        |
| -------- | ------------------------------------------------------------------ |
| INT64    | 64-bit integer                                                     |
| UINT128  | Unsigned 128-bit integer                                           |
| FLOAT64  | Double precision floating point                                    |
| TIME64NS | Time represented as 64-bit integer in nanoseconds since UNIX epoch |
| STRING   | UTF-8 encoded string value                                       |
| BOOLEAN  | Bool                                                               |

See the complete [list of concrete data types](https://github.com/pixie-io/pixie/blob/c08aaa2c53ce95ee40817acae3f662a95994f6fb/src/api/proto/vizierpb/vizierapi.proto#L29).

### Semantic Types

The Pixie execution engine supports many semantic data types, including those related to the following:

- Kubernetes (e.g. pod name, node name, namespace name, pod status)
- Infrastructure (e.g. IP address, port name, upid)
- Metrics (e.g. bytes, duration in nanoseconds, throughput per nanosecond)

See the complete [list of semantic data types](https://github.com/pixie-io/pixie/blob/c08aaa2c53ce95ee40817acae3f662a95994f6fb/src/api/proto/vizierpb/vizierapi.proto#L51).

## Value concepts

PxL is a declarative language: programs specify what is to be done and evaluation is performed by the PxL engine based on calling a function with side-effects (for example `px.display`). All value types with PxL are immutable, and every assignment creates an implicit copy (don't worry these are automatically optimized by our engine).

The basic unit of operation for PxL is a Dataframe. A Dataframe is basically a table of data and associated metadata operations. You can perform operations on a Dataframe to derive new Dataframes. As a matter of fact, PxL basically specifies a sequence of dataflows necessary to transform a set of Dataframes into the final result.

## PxL Details

- DataFrame Docs
  - [Operator Overview](/reference/pxl/operators): The DataFrame methods that correspond to operators.
  - [Engine Execution Functions](/reference/pxl/udf): Functions that are executed inside of the Pixie data engine.
  - [Compile Time Functions](/reference/pxl/compiler-fns): Helper functions that are evaluated and used at compile-time.
- Tracepoint Docs
  - [Tracepoint Fields](/reference/pxl/tracepoint-field): The fields to use in the probe function
  - [Tracepoint Management](/reference/pxl/mutation): Decorators to write around the tracepoint functions.
  - [Tracepoint Decorators](/reference/pxl/tracepoint-decorator): The decorators used as part to wrap probe functions.
- [OpenTelemetry Export Docs](/reference/pxl/otel-export)
  