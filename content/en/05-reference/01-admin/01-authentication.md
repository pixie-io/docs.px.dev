---
title: "Authentication"
metaTitle: "Reference | Admin | Authentication"
metaDescription: "Ways to authenticate end-user accounts."
order: 1
redirect_from:
    - /admin/authentication/
---

## Open Source Auth

[Self-Hosted Pixie](/installing-pixie/install-guides/self-hosted-pixie/) uses [Hydra](https://www.ory.sh/hydra/)/[Kratos](https://www.ory.sh/kratos/) to provide an open source authentication flow.

To set up authentication and invite others to join your organization, check out the Quick Start [directions](/installing-pixie/install-guides/self-hosted-pixie/#authentication-using-kratos-hydra).

To read about how we designed our open source authentication flow, check out the [blog post](https://blog.px.dev/open-source-auth/ossauth/).

## Enabling Auth0

Pixie also supports using [Auth0](https://auth0.com/docs) for authentication. To set up Auth0:

1. Create an Auth0 account.

2. Create a Machine-To-Machine Application.

::: div image-l
<svg title='' src='authentication/m2mapp.png'/>
:::

::: div image-l
<svg title='' src='authentication/create_app.png'/>
:::

3. Add the callback URLs and save changes.

::: div image-l
<svg title='' src='authentication/add_callback_url.png'/>
:::

4. In the Advanced Settings, under the Grant Types tab, enable `client_credentials` and save the changes.

::: div image-l
<svg title='' src='authentication/enable_credentials.png'/>
:::

5. Enable the Autho0 Management API, filter for user permissions and enable all. Make sure you have `read:user_idp_tokens` [for identity provider access](https://auth0.com/docs/connections/calling-an-external-idp-api). Make sure to hit Update.

::: div image-l
<svg title='' src='authentication/mgmt_api.png'/>
:::

6. Create an `oauth_config.yaml` file, filling in the values for Domain and Client ID.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
    name: pl-oauth-config
    namespace: plc-dev
data:
    PL_OAUTH_PROVIDER: auth0
    PL_AUTH_URI: <auth0-domain>
    PL_AUTH_CLIENT_ID: <auth0-client-id>
```

7. Create an auth0_config.yaml file, filling in the values for Client ID and Client Secret.

```yaml
apiVersion: v1
kind: Secret
metadata:
    name: cloud-auth0-secrets
    namespace: plc-dev
type: Opaque
stringData:
    auth0-client-id: <client-id>
    auth0-client-secret: <your-secret>
```

8. Apply the yaml files.

```bash
kubectl apply -f auth0_config.yaml -f oauth_config.yaml
```

9. Restart the following pods: `auth`, `profile`, `cloud-proxy` in the cloud deployment.

### Enable Email/Password Login for Auth0

1. In Authentication > Database, create a database connection in Auth0. This is where your email/password users will be stored. The default settings should suffice.

2. Make sure your connection is enabled for your Auth0 application. This can be enabled in the "Applications" tab for your connection.

3. Update `pl-oauth-config` (`oauth_config.yaml`) to include `PL_AUTH_EMAIL_PASSWORD_CONN: <your auth0 connection name here>`. Redeploy the config and cloud services, if already running.

#### Customize Branding (Optional)

 The following contains basic instructions for customizing email/password flows in Auth0, using Auth0's functionality for sending out verification/password reset emails and showing the username/password login screen. By default, Auth0 will provide their own default templates.

1. Update the email provider: To have Auth0 send out the email using your domain, configure your mail provider in Branding > Email Provider.

2. Update the email templates: Customize emails templates at Branding > Email Templates.

3. Update the login/signup pages: Pixie's UI is compatible with both Auth0's new and legacy universal login pages. Both pages are highly customizable. This can be done in  Branding > Universal Login.
