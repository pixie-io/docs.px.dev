---
title: "CI Build Health"
metaTitle: "Using Pixie | Use Cases | CI Build Health"
metaDescription: "Instant visibility into performance and status of builds in K8s based CI build systems."
featuredInstall: true
---

## Objectives

- Monitor performance of canary builds in your CD system without having to add any instrumentation

## Example Questions
- _"Is the CPU utilization below baseline for manual judgement?"_
- _"What are my upstream dependencies?"_

## How to Set-up

You can use Pixie in your CD system by following these steps:

- If you have Spinnaker or equivalent CD system deploy Pixie in the same cluster by following the [quick-start install steps](/installing-pixie/quick-start).
- If you don't you can install Spinnaker by following this [guide](https://cloud.google.com/solutions/automated-canary-analysis-kubernetes-engine-spinnaker) and install Pixie.
- Once installed your setup will look like the system diagram shown below.
- With Pixie installed you can monitor the canary build's [service health](/using-pixie/use-cases/service-health) and [pod health](/using-pixie/use-cases/infra-health) by using community scripts.

![](canary-arch.svg)

Note: We will be adding community scripts tailored for canary analysis in the future.

**60 Sec Walkthrough:**

<YouTube youTubeId="2J7XmJTbqAc" />
