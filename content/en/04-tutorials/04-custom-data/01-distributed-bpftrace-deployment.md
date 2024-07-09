---
title: "Distributed bpftrace Deployment"
metaTitle: "Tutorials | Collecting Custom Data | Distributed bpftrace Deployment"
metaDescription: "Deploy bpftrace scripts using Pixie"
order: 1
redirect_from:
    - /tutorials/distributed-bpftrace-deployment/
---

Pixie can deploy [bpftrace](https://github.com/iovisor/bpftrace) programs to your cluster, collect the resulting data, and display it in the Live UI. This tutorial will demonstrate how to run a `bpftrace` program using a PxL script and discuss the guidelines for running arbitrary bpftrace code using Pixie.

<YouTube youTubeId="xT7OYAgIV28"/>

## Background

Most of the data in Pixie's no-instrumentation monitoring platform is collected by the Pixie Edge Modules ([PEMs](/about-pixie/what-is-pixie/#architecture)), which are deployed as a daemonset onto every node in your cluster. These PEMs use eBPF based tracing to collect network transactions without any code changes.

One increasingly popular way to write eBPF programs is to use [bpftrace](https://github.com/iovisor/bpftrace), an open source high-level tracing language for Linux. bpftrace provides a simplified front-end language that makes it easier to write BPF programs when compared to frameworks such as `BCC`. Many bpftrace programs are written as one-liners or stand-alone scripts.

Now, using Pixie, developers can dynamically run their own bpftrace programs on their cluster. Pixie will handle:

- deploying the bpftrace program to all of the nodes in your cluster.
- capturing the output of the bpftrace program's `printf` statements into a table.
- making the data available to be queried and visualized in the Pixie UI.
- removing the probe(s) after a set expiration time.

### Output

bpftrace programs output data through a variety of built-in functions. Examples include `printf` for general purpose printing, `print` for printing map contents, and `time` for printing the current time. bpftrace also automatically prints all maps on termination, which many bpftrace programs rely on.

Pixie's distributed bpftrace deployment feature captures outputs made through bpftrace `printf` statements, and pushes the arguments into an automatically created table, as shown below.

<svg title='Bpftrace printf-based output, and its mapping to auto-generated tables' src='distributed-bpftrace-deployment/bpftrace-printf-output.svg'/>

There are some requirements for bpftrace programs you wish to deploy with Pixie, all of which concern the output mechanism:

- The program must have at least 1 `printf` statement.
- If the program has more than 1 `printf` statement, the format string of all `printfs` must be exactly the same, as it defines the table output columns.
- There should be no `printf` statements in the `BEGIN` or `END` blocks.
- If wishing to specify column names, they must be done by prepending the column name to the format specifier with a colon (example: `name:%d`). The column names cannot contain any whitespaces.
- To output time in a manner that is recognizable by Pixie, label the column `time_` and pass the argument `nsecs`.

Note that not all programs in the `bpftrace` repository meet these requirements, but most can be easily adapted to be compatible. For example, in programs with multiple printfs, the extraneous printfs can be removed. Also, programs that output data on termination instead of through `printf` statements can be converted to instead print the data on a regular interval using an `interval` block. [`pidpersec.bt`](https://github.com/iovisor/bpftrace/blob/master/tools/pidpersec.bt) is a good example of this design pattern.

### Limitations

This **beta** feature has limitations:

- Support for bpftrace kprobes only. Other types of probes will be supported in the future.

## Tutorial

In this demo, we'll deploy Dale Hamel's bpftrace [TCP retransmit tool](https://github.com/iovisor/bpftrace/blob/master/tools/tcpretrans.bt) using Pixie. TCP retransmits are usually a sign of poor network health and this open-source tool will help us discover if any connections in our cluster are experiencing a high number of retransmits.

### Running the PxL Script in the Live UI

We've incorporated this trace into a PxL script called [`bpftrace/tcp_retransmits`](https://github.com/pixie-io/pixie/tree/main/src/pxl_scripts/bpftrace/tcp_retransmits). To run this script:

- Open up Pixie's <CloudLink url="/">Live View</CloudLink> and select your cluster.
- Select the `bpftrace/tcp_retransmits` script using the drop down `script` menu or with Pixie Command. Pixie Command can be opened with the `ctrl/cmd+k` keyboard shortcut.
- Run the script using the Run button in the top right, or with the `ctrl/cmd+enter` keyboard shortcut.

Once the probe is deployed to all the nodes in the cluster, the probes will begin to push out data into tables. The PxL script queries this data and the Vis Spec defines how this data will be displayed.

<svg title='Pixie Live UI view of TCP Retransmissions' src='distributed-bpftrace-deployment/tcp-retransmissions.png'/>

In the Live View, we'll see a graph of the pods (hexagonal grey box icons) and the services (hexagonal grey tree icons) who are are experiencing TCP retransmits.

The color and weight of the arrows between these entities indicates the number of retransmits. Hovering over an arrow will display the number of retransmits for a particular connection. The data displayed in this graph can also be seen in the Data Drawer (use the `ctrl/cmd+d` keyboard shortcut to open and close this table).

In this particular example, the 3 pods experiencing high levels of retransmits are located on the same node, perhaps indicating an issue with that particular node.

### How does the PxL script work?

```python:numbers
# Copyright (c) Pixie Labs, Inc.
# Licensed under the Apache License, Version 2.0 (the "License")

import pxtrace
import px

# Adapted from https://github.com/iovisor/bpftrace/blob/master/tools/tcpretrans.bt
program = """
// tcpretrans.bt Trace or count TCP retransmits
//               For Linux, uses bpftrace and eBPF.
//
// Copyright (c) 2018 Dale Hamel.
// Licensed under the Apache License, Version 2.0 (the "License")

#include <linux/socket.h>
#include <net/sock.h>

kprobe:tcp_retransmit_skb
{
  $sk = (struct sock *)arg0;
  $inet_family = $sk->__sk_common.skc_family;
  $AF_INET = (uint16) 2;
  $AF_INET6 = (uint16) 10;
  if ($inet_family == $AF_INET || $inet_family == $AF_INET6) {
    if ($inet_family == $AF_INET) {
      $daddr = ntop($sk->__sk_common.skc_daddr);
      $saddr = ntop($sk->__sk_common.skc_rcv_saddr);
    } else {
      $daddr = ntop($sk->__sk_common.skc_v6_daddr.in6_u.u6_addr8);
      $saddr = ntop($sk->__sk_common.skc_v6_rcv_saddr.in6_u.u6_addr8);
    }
    $sport = $sk->__sk_common.skc_num;
    $dport = $sk->__sk_common.skc_dport;
    // Destination port is big endian, it must be flipped
    $dport = ($dport >> 8) | (($dport << 8) & 0x00FF00);

    printf(\"time_:%llu src_ip:%s src_port:%d dst_ip:%s dst_port:%d\",
      nsecs,
      $saddr,
      $sport,
      $daddr,
      $dport);
  }
}
"""


def demo_func():
    table_name = 'tcp_retransmits_table'
    pxtrace.UpsertTracepoint('tcp_retranmits_probe',
                             table_name,
                             program,
                             pxtrace.kprobe(),
                             "10m")
    # Rename columns
    df = px.DataFrame(table=table_name,
                      select=['time_', 'src_ip', 'src_port', 'dst_ip', 'dst_port'])

    # Convert IPs to domain names.
    df.src = px.pod_id_to_pod_name(px.ip_to_pod_id(df.src_ip))
    df.dst = px.Service(px.nslookup(df.dst_ip))

    # Count retransmits.
    df = df.groupby(['src', 'dst']).agg(retransmits=('ns_src', px.count))

    # Filter for a particular service, if desired.
    df = df[px.contains(df['dst'], '')]

    return df

```

Pixie's scripts are written using the [Pixie Language](/reference/pxl/) (PxL), a domain-specific language that is heavily influenced by the popular Python data processing library [Pandas](https://pandas.pydata.org/docs/user_guide/index.html).

On line 8, we've included Dale Hamel's [tcpretrans.bt](https://github.com/iovisor/bpftrace/blob/master/tools/tcpretrans.bt) bpftrace tool from the iovisor/bpftrace repo as a string. We've tweaked the original trace in order to work with Pixie's bpftrace rules (seen in the "Output" section above):

- removed the informational print statements on lines 25-26 of `tcpretrans.bt` so that the program contains a single `printf` statement.
- modified the `printf` statement on line 72 of `tcpretrans.bt` to name the output columns (no whitespaces)
- modified the `printf` statement on line 72 of `tcpretrans.bt` to output time using the reserved column name `time_` and passing it the `nsecs` argument.

Some further modifications were made to simplify the program for the purposes of this tutorial (for example, removing the TCP state), but those are not required changes.

On line 50, we call `UpsertTracepoint` with the following arguments:

- the name of the tracepoint
- the name of the table to push data into
- the type of the trace probe
- the expiration time for the tracepoint

Lines 55-69 query the collected data, convert known IPs to domain names, and group the retransmits by source and destination IPs tallying the number of retransmits.

If you'd like to filter the results to a particular service, modify line 67 to include the namespace:

```python
df = df[px.contains(df['dst'], 'sock-shop')]
```

### Deploying different BPFtrace programs depending on properties of the host

Pixie has introduced a `TraceProgram` object in the `pxtrace` module, which allows you to specify deployment restrictions for your BPFtrace programs. You can use the `TraceProgram` object to define a BPFtrace program and specify the kernel versions on which it should be deployed (more selectors may be added in the future).

The `TraceProgram` object currently accepts the following parameters:

- `program`: The BPFtrace program as a string.
- `max_kernel`: The maximum kernel version on which the program should be deployed.
- `min_kernel`: The minimum kernel version on which the program should be deployed.

You can use the `TraceProgram` object to deploy different BPFtrace programs based on the kernel version of the nodes in your cluster. For example, you might have one version of a BPFtrace program that works on kernel versions up to 5.18, and another version that works on kernel versions 5.19 and above. $0 and $1 are placeholders for BPFtrace programs. You can define two `TraceProgram` objects and use them both in the `UpsertTracepoint` function.

Here's an example:

```python
import pxtrace
import px

before_518_trace_program = pxtrace.TraceProgram(
  program="""$0""",
  max_kernel='5.18',
)
after_519_trace_program = pxtrace.TraceProgram(
  program="""$1""",
  min_kernel='5.19',
)

table_name = 'tcp_drop_table'
pxtrace.UpsertTracepoint('tcp_drop_tracer',
                          table_name,
                          [before_518_trace_program, after_519_trace_program],
                          pxtrace.kprobe(),
                          '10m')
```

In this example, the `before_518_trace_program` will be deployed on nodes with kernel versions up to 5.18, and the `after_519_trace_program` will be deployed on nodes with kernel versions 5.19 and above.

### Tracepoint status

Run `px/tracepoint_status` to see the information about all of the tracepoints running on your cluster. The `STATUS` column can be used to debug why a tracepoint fails to deploy.

### Running other bpftrace programs

The following [bpftrace](https://github.com/iovisor/bpftrace) programs are available today for use in Pixie:

- `capable.bt`: use the `bpftrace/capable` script
- `dcsnoop.bt`: use the `bpftrace/dc_snoop` script.
- `mdflush.bt`: use the `bpftrace/md_flush` script.
- `naptime.bt`: use the `bpftrace/nap_time` script.
- `oomkill.bt`: use the `bpftrace/oom_kill` script.
- `syncsnoop.bt`: use the `bpftrace/sync_snoop` script.
- `tcpdrop.bt`: use the `bpftrace/tcp_drops` script.
- `tcpretrans.bt`: use the `bpftrace/tcp_retransmits` script.

Many other bpftrace programs can work with Pixie. Some may require a few modifications to obey the rules listed above.

If you have any questions about this feature or how to incorporate your own bpftrace code, we'd be happy to help out over on our [Slack](https://slackin.px.dev/).
