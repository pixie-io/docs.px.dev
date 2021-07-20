---
title: "Authentication"
metaTitle: "Reference | Admin | Authentication"
metaDescription: "Ways to authenticate end-user accounts."
order: 1
redirect_from:
    - /admin/authentication/
---

## Open Source Auth

Pixie uses [Hydra](https://www.ory.sh/hydra/)/[Kratos](https://www.ory.sh/kratos/) to provide an  open source authentication flow.

To set up authentication and invite others to join your organization, check out the Quick Start [directions](/installing-pixie/quick-start/#authentication-using-kratos-hydra).

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

5. Enable the Autho0 Management API, filter for user permissions and enable all. Make sure to hit Update.

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
