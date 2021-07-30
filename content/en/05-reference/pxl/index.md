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

PxL has a rich type system consisting of both concrete and semantic types.

### Concrete Types

| Type     | Description                                                        |
| -------- | ------------------------------------------------------------------ |
| INT64    | 64-bit integer                                                     |
| FLOAT64  | Double precision floating point                                    |
| TIME64NS | Time represented as 64-bit integer in nanoseconds since UNIX epoch |
| STRING   | A UTF-8 encoded string value.                                      |
| JSON     | A JSON value represented as a string.                              |

### Semantic Types

This is a comprehensive list of all Kubernetes, infrastructure and metric types. For example: pod, deployment, latency_ms, etc.

More details coming soon...

## Value concepts

PxL is a declarative language: programs specify what is to be done and evaluation is performed by the PxL engine based on calling a function with side-effects (for example `px.display`). All value types with PxL are immutable, and every assignment creates an implicit copy (don't worry these are automatically optimized by our engine).

The basic unit of operation for PxL is a Dataframe. A Dataframe is basically a table of data and associated metadata operations. You can perform operations on a Dataframe to derive new Dataframes. As a matter of fact, PxL basically specifies a sequence of dataflows necessary to transform a set of Dataframes into the final result.

## PxL Details

- DataFrame Docs
  - [Operator Overview](/reference/pxl/operators): The DataFrame methods that correspond to operators.
  - [Engine Execution Functions](/reference/pxl/udf): Functions that are executed after execution, during compilation.
  - [Compile Time Functions](/reference/pxl/compiler-fns): Helper functions that are evaluated and used at compile-time.
- Tracepoint Docs
  - [Tracepoint Fields](/reference/pxl/tracepoint-field): The fields to use in the probe function
  - [Tracepoint Management](/reference/pxl/mutation): Decorators to write around the tracepoint functions.
  - [Tracepoint Decorators](/reference/pxl/tracepoint-decorator): The decorators used as part to wrap probe functions.
