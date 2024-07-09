---
title: "SOTW #2: Detect redundant DNS requests caused by dnsConfig ndots setting"
metaTitle: "Tutorials | PxL Scripts | Script of the Week | SOTW #2: Detect redundant DNS requests caused by dnsConfig ndots setting"
metaDescription: ""
order: 2
redirect_from:
    - /tutorials/script-of-the-week/script-of-the-week-1
---

This guide will show you how to use Pixie to see if the k8s "ndots" problem is negatively affecting application performance on your cluster.

[Marco Pracucci](https://pracucci.com/kubernetes-dns-resolution-ndots-options-and-why-it-may-affect-application-performances.html) and [Karan Sharma](https://mrkaran.dev/posts/ndots-kubernetes/) have both written great explanations of this issue, but the crux of the "ndots" problem is this:

When resolving external hostnames with the default `ndots:5` value in your `dnsConfig` pod policy, any DNS request containing fewer than 5 dots will cycle through the local search domains (listed in the `/etc/resolv.conf` file) before issuing an absolute name resolution query. These extraneous DNS requests can add latency to your application.

Let's use Pixie to examine the DNS requests in your cluster and see the impact of any extraneous requests that are being made.

## Demo

<YouTube youTubeId="p4rfVHV0Ub4" />

### Running Pixie

- [Install](/installing-pixie/) Pixie on your cluster.

- In the <CloudLink url="/">Live View</CloudLink>, select the `sotw/dns_external_fqdn_list` script. If you don't see any results, try increasing the timespan using the `start` value in the top right. Re-run the script with `cmd/ctrl+enter` or using the "RUN" button in the top right.

- This script outputs a list of all of the **external** fully qualified domain names from successful DNS requests made in your cluster. Click on the "NUM_REQUESTS" column title to sort by number of requests per fully qualified domain name (FQDN).

*This script identifies external FQDNs by excluding known internal FQDNs. To do so, we assume that your cluster’s internal search domains include `.local` and `.internal` as suffixes. If not, open the script editor (`ctrl/cmd+e`) and modify lines 32-33. Re-run the script before proceeding.*

<svg title='List of external FQDNs from DNS request traffic in your cluster.' src='sotw-2/fqdns.png'/>

- We will use this list to see how many redundant DNS requests are made per FQDN due to the ndots setting. Click on any of the links in the "LINK" column to run a second script (`sotw/dns_queries_filtered`) which outputs all DNS requests made in your cluster that contain that specific FQDN (from the row you selected) as a substring within the DNS request query name.

<svg title='All DNS requests containing a particular FQDNs as a substring in the DNS request query name.' src='sotw-2/all_requests.png'/>

- Here we can see that since `pixie-labs.auth0.com` contains less than 5 dots, the local search domains are tried before issuing an absolute name resolution query. There are several ways to fix this.

## Solutions

An `ndots:5` value can negatively affect application peformance. In the demo above, 5 extra DNS queries were issued before the hostname was successfully resolved.

There are two options to prevent this:

1. When using FQDNs, include a final dot to indicate to the DNS server that it should not search internal domains.

2. Customize the `ndots` value in the [dnsConfig](https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/#pod-dns-config) pod property.

If you have any questions about how to run this script, we’d be happy to help out over on our community [slack](https://slackin.px.dev/).

## References

- An [explanation](https://github.com/kubernetes/kubernetes/issues/33554#issuecomment-266251056) for the default `ndots:5` setting.

- A [demo](https://youtu.be/zbig8uH9eqQ) of Pixie's complete DNS tracing capabilities.
