---
title: "SOTW #1: Network Flow Graph"
metaTitle: "Tutorials | PxL Scripts | Script of the Week | SOTW #1: Network Flow Graph"
metaDescription: ""
order: 1
redirect_from:
    - /tutorials/script-of-the-week/script-of-the-week-1
---

The [Network Flow Graph](https://github.com/pixie-io/pixie/tree/main/src/pxl_scripts/px/net_flow_graph) script displays a graph of the pods, services or namespaces that talk to the specified IP address(es).

<svg title='' src='sotw-1/sotw.gif'/>

## When would I use this script?

Pixie's auto-instrumentation platform can get fairly detailed information about HTTP, gRPC and other [supported](/about-pixie/data-sources/) protocols.  But there’s also a lot of traffic that we don’t yet support at a protocol capture level. This script provides basic network visbility for unsupported protocols, like CouchDB.

 If your protocol is supported by Pixie, then it is better to use one of the protocol-aware Pixie scripts, as those scripts are able to track QPS, latency, and error rate for specific protools. Without protocol awareness, Pixie onlys track throughput and number of connections.

Here are a few use-cases for this protocol-blind script:

- For a very high-level overview of which services communicate with each other
- Determining which services talk to an [unsupported](/about-pixie/data-sources/) database (e.g. MongoDB, Redis, Kafka)
- Determining which services talk to a third-party API endpoint (e.g. Stripe)

## How do I run this script?

Pixie (>= v0.4.0) needs to be installed on your Kubernetes cluster. If it is not already installed, please consult our [install guides](/installing-pixie/).

Steps to run the script:

- Open up Pixie's <CloudLink url="/">Live UI</CloudLink> and select your cluster.
- Select the `px/net_flow_graph` script using the drop down menu or with the Pixie Command button (`cmd/ctrl+k` keyboard shortcut).

<svg title='' src='sotw-1/enter-script.png'/>

- This script requires a comma-separated list of hardcoded IP addresses. You can type one or more IPs into the `ips` variable drop-down menu.

<svg title='' src='sotw-1/enter-ips.png'/>

- To run the script, press the run button in the top-right or use the `cmd/ctrl+enter` keyboard shortcut.

<svg title='' src='sotw-1/run-script.png'/>

- To group the network connections, enter `namespace`, `service` or `pod` into the `grouping_entity` variable drop-down menu.

<svg title='' src='sotw-1/enter-grouping-entity.png'/>

- To change the time window for which to display results, modify the `start` variable.

<svg title='' src='sotw-1/time-variable.png'/>

Once the script has run, the Live View window will show the graph of entities (namespaces, services or pods) that talk to the specified IP(s).

<svg title='' src='sotw-1/net-flow-graph.png'/>

The thickness of the line between the service and the specified IP(s), represented by the blue circle, indicates more network traffic. Hover over this line to see the traffic stats.

<svg title='' src='sotw-1/net-flow-graph-edge-stats.png'/>

The traffic stats are also available in the table below the graph, along with the process that initiated the communication to the IP, and the total bandwidth for the lifetime of the connection.

Back in the graph, click on the pod (or namespace, service) to see a different Live View containing more information on that particular entity.

For a higher-level view showing just the namespaces that communicate with the specified IP(s), set `grouping_entity` variable to `namespace`.

For a complete walkthrough of the motivation behind this script and how to run it:

<YouTube youTubeId="AEZHLHCpXsM" />

## How does it work?

You can read and modify the source code for any script using the editor in the Live UI. Open and close the editor using the editor button or with the `cmd/ctrl+e` keyboard shortcut.

<svg title='' src='sotw-1/open-editor.png'/>

There are two parts to every Pixie Live View:

1. The PxL script defines how to query and manipulate the data.
2. The Vis Spec describes how to display the data.

### PxL Script

Pixie's scripts are written using the [Pixie Language](/reference/pxl/) (PxL), a domain-specific language that is heavily influenced by [Pandas](https://pandas.pydata.org/docs/user_guide/index.html), a popular Python data processing library.

```python:numbers
import px


def net_flow_graph(start: str, ips: list, grouping_entity: str):
    df = px.DataFrame('conn_stats', start_time=start)
    df = df[px.equals_any(df.remote_addr, ips)]

    # Add the grouping entity column.
    df['from_entity'] = df.ctx[grouping_entity]

    # Insert the cmdline.
    df.cmdline = df.ctx['cmd']
    # Aggregate the connections.
    df = df.groupby(['from_entity', 'upid', 'cmdline', 'remote_addr']).agg(
        bytes_sent=('bytes_sent', px.max),
        bytes_recv=('bytes_recv', px.max),
    )
    df = df[df['from_entity'] != '']
    # Look up the names of the remote address.
    df.to_entity = px.nslookup(df.remote_addr)
    df.bytes_total = df.bytes_sent + df.bytes_recv
    return df.drop(['remote_addr'])

```

To build the Network Flow Graph PxL script:

- The `conn_stats` (or connection stats) table contains all of the data that Pixie has gathered about network transactions sent and received from pods within your cluster. The full set of data that is available within the `conn_stats` table can be seen by running the `px/schemas` script.

- On line `5`, we create a 2D `DataFrame` data structure populated with data from the `conn_stats` table that was collected after the `start_time` script input variable.

- On line `6`, we filter the table data to only include connections whose `remote_addr` match the IP(s) specified in the `ips` script input variable.

- This script takes in a 3rd variable: the `grouping_entity`, which allows the connections in the output to be aggreggated by `pod`, `service` or for a much higher-level view, by `namespace`. The default grouping entity is the `pod`.

- The `.ctx` function provides extra context based on the existing information in your DataFrame. In this case, because the `conn_stats` table contains the upid (an opaque numeric ID that globally identifies a process running inside the cluster), we can infer the pod name, namespace, and the command that initiated the connection. We add two columns to our DataFrame with this contextual information: on line `9` we add a `from_entity` column and on line `12`, we create another column called `cmdline`.

- On line `14`, we group the network connections in the table data by grouping entity, process id, cmdline, and IP address, summing their bytes sent and received.

- On line `18`, we remove any data in which the IP address is unknown.

- On line `20` we create a new column that sums the bytes sent and received.

- On line `22` we return the dataframe, dropping the remote address column first (this column is the list of IP(s) that we filtered by).

### Vis Spec

The Vis Spec is a json file that describes how the PxL script should be provided input, excecuted, and rendered. A Vis Spec has 3 components:

- `variables` lists the variables that should show up as interactive drop-down menu items in the UI.

- `globalFuncs` lists the functions defined in the PxL script with the input variables required by those functions.

- `widgets` lists the actual UI units (tables, graphs, etc) displayed within a Live View, their physical positions relative to each other, and more detailed information required to configure the widget.

```json:numbers
{
  "variables": [
    {
      "name": "ips",
      "type": "PX_STRING_LIST",
      "description": "The IP addresses you wish to get the network flow into.",
      "defaultValue": "10.16.0.1"
    },
    {
      "name": "start",
      "type": "PX_STRING",
      "description": "The start time of the window in time units before now.",
      "defaultValue": "-5m"
    },
    {
      "name": "grouping_entity",
      "type": "PX_STRING",
      "description": "The k8s object to group connections by.",
      "defaultValue": "pod"
    }
  ],
  "globalFuncs": [
    {
      "outputName": "net_flow",
      "func": {
        "name": "net_flow_graph",
        "args": [
          {
            "name": "start",
            "variable": "start"
          },
          {
            "name": "ips",
            "variable": "ips"
          },
          {
            "name": "grouping_entity",
            "variable": "grouping_entity"
          }
        ]
      }
    }
  ],
  "widgets": [
    {
      "name": "Net Flow Graph",
      "position": {
        "x": 0,
        "y": 0,
        "w": 12,
        "h": 4
      },
      "globalFuncOutputName": "net_flow",
      "displaySpec": {
        "@type": "pixielabs.ai/pl.vispb.Graph",
        "adjacencyList": {
          "fromColumn": "from_entity",
          "toColumn": "to_entity"
        },
        "edgeWeightColumn": "bytes_total",
        "edgeHoverInfo": [
          "bytes_total",
          "bytes_sent",
          "bytes_recv"
        ]
      }
    },
    {
      "name": "Table",
      "position": {
        "x": 0,
        "y": 4,
        "w": 12,
        "h": 4
      },
      "globalFuncOutputName": "net_flow",
      "displaySpec": {
        "@type": "pixielabs.ai/pl.vispb.Table"
      }
    }
  ]
}
```

To build the Network Flow Graph Vis Spec:

- lines `2-21` list the drop-down menu variables available in the UI for this script (`ips`, `start`, `grouping_entity`), along with their types, description and defualt values.

- lines `22-43` list the `net_flow_graph` function defined in the PxL script that will provide data to both widgets, along with the variable inputs the function takes.

- lines `44-81` list the widgets seen in the Live View output. In this script we have a graph positioned above a table. Both widgets pull data from the `net_flow` function defined in the `globalFuncs` list. The table is of the `pl.vispb.Table` type and requires no futher setup. The `pl.vispb.Graph` graph is setup to display an `edgeWeightColumn` to weight the graph edges by `bytes_total`. We've also added `edgeHoverInfo` to show display certain information when hovering over the graph's edges.
