---
title: "Slack Alerts using the Pixie API"
metaTitle: "Tutorials | Integrations and Alerts | Slack Alerts using the Pixie API"
metaDescription: "Slack Alerts using using the Pixie API"
order: 1
redirect_from:
    - /tutorials/slackbot-alert/
---

This tutorial will show you how to create a Slackbot to monitor your Kubernetes cluster using data from Pixie's observability platform. This Slackbot reports the number of HTTP errors per service in your cluster. However, the [example code](https://github.com/pixie-io/pixie-demos/tree/main/slack-alert-app) can be modified to alert based on any data available from Pixie.

::: div image-l
<svg title='Slackbot alerting for per service HTTP errors.' src='slackbot/slack-alert.png'/>
:::

## Before you begin

This tutorial assumes:

1. You have a Slack workspace to install your Slack App to. If not, please [create a workspace](https://slack.com/help/articles/206845317-Create-a-Slack-workspace).

2. You have a Kubernetes cluster with Pixie installed. If you don't have a cluster, you can create a minikube test cluster and install Pixie, using our [install guides](/installing-pixie/install-guides).

## Setup Slack

First, you'll need to create a Slack App, which will allow our application to post messages in a Slack channel.

### Create a Slack app

1. Go to https://api.slack.com/apps and select `Create New App` on the top right.

::: div image-m
<svg title='Configuring your new Slack app.' src='slackbot/create-app.png'/>
:::

2. Name your app `Pixie Alerts` and select the workspace to test your app in.

3. After creating the Pixie Alerts App, you'll be taken to the `Basic Information` page for the app. Under `Add features and functionality`, select `Bots`.

::: div image-m
<svg title='Add Bot functionality to your Pixie Alerts Slack App.' src='slackbot/add-bot-feature.png'/>
:::

4. On the next page, select the `Review Scopes to Add` button.

5. On the next page, scroll down to the `Scopes` section, select the `Add an OAuth Scope` button and then the `chat:write` option.

The Pixie Alerts App will simply write to a channel, but if you wanted to add support for direct messaging or other functionality, you'll need to increase the bot's scope on this page.

::: div image-m
<svg title='Add OAuth scope for `chat:write`.' src='slackbot/add-oauth-scope.png'/>
:::

6. Scroll up to the top of this page (`OAuth & Permissions`) and select `Install to Workspace` to install the Pixie Alerts App to your workspace.

::: div image-m
<svg title='Install Pixie Alerts App to workspace.' src='slackbot/install-to-workspace.png'/>
:::

7. Copy the `Bot User OAuth Access Token`.

::: div image-m
<svg title='Save Bot OAuth Access Token after installation.' src='slackbot/bot-token.png'/>
:::

### Create an alerts channel

1. Create a new channel called `#pixie-alerts` for the Pixie Alerts App to post in. If you use a different channel name, you'll need to update the `CHANNEL` variable in the slackbot code.

2. Invite the Pixie Alerts App to the channel, using `/invite @Pixie Alerts`.

::: div image-l
<svg title='Adding the Pixie Alerts App to a channel.' src='slackbot/invite-bot-to-channel.png'/>
:::

## Setup your cluster

1. Use Pixie's CLI to deploy the `px-sock-shop` demo. Our Pixie Alerts App will report HTTP errors for services in the `px-sock-shop` namespace.

```bash
px demo deploy px-sock-shop
```

2. Find your cluster's ID following the directions [here](/reference/admin/cluster-id/#find-the-cluster-id). Save this string, we'll use it in Part 3.

3. Create an API Key following the directions [here](/reference/admin/api-keys/#create-an-api-key). Save this string, we'll use it in Part 3.

## Run the Slackbot app

This tutorial uses example code from Pixie's GitHub repository.

1. Get the example directory.

```bash
# Clone the Pixie repository.
git clone https://github.com/pixie-io/pixie-demos.git

# Change to the app directory.
cd slack-alert-app/<language>
```

2. (Python only) Install the dependencies.

```python
# Requires Python 3.8.7+
pip install -r requirements.txt
```

3. Create the environment variables required by the slackbot code:

```bash
# Slackbot token from Part 1.
export SLACK_BOT_TOKEN="your_slackbot_token"

# Pixie Cluster ID from Part 2.
export PIXIE_CLUSTER_ID="your_cluster_id"

# Pixie API Key from Part 2.
export PIXIE_API_KEY="your_api_key"
```

4. Run the slackbot app:

```python
python slackbot.py
```

```go
go run slackbot.go
```

Congrats, your Pixie Alerts App will now post automated alerts to the `#pixie-alerts` channel in your Slack workspace!

### (Optional) Modify the PxL Script

The slackbot can be modified to alert based on any information available from Pixie's observability platform. Some notes:

- We recommend testing your PxL code in the <CloudLink url="/">Live View</CloudLink>. Once it works, you can replace the `PXL_SCRIPT` string in the slackbot app code.

- The example `PXL_SCRIPT` filters for services in the `px-sock-shop` namespace only. Make sure to modify or remove this line to fit your cluster's needs.

- Make sure that the `start_time` variable in your `PXL_SCRIPT` matches the slack messaging interval to get data for that specific interval only.

- The table name supplied in the call to `px.display(df, "<table_name>")` needs to match the table name in the slackbot app call to the Pixie API, else you will receive a `ValueError: Table 'table_name' not received` error.

## References

- Python slackbot code forked from [How to build a basic slackbot: a beginner’s guide.](https://www.freecodecamp.org/news/how-to-build-a-basic-slackbot-a-beginners-guide-6b40507db5c5/)
