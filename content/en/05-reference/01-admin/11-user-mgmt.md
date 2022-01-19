---
title: "User Management & Sharing"
metaTitle: "Reference | Admin | User Management & Sharing"
metaDescription: "Share and manage access to your Pixie data."
order: 11
redirect_from:
    - /admin/permissions/
---

Pixie has features to share and manage access to your Pixie organization.

Instructions are based on your identity provider:

- [**Hydra / Kratos Instructions**](/reference/admin/user-mgmt#hydra-kratos): apply to any Self-Hosted Pixie instances using the default authentication.
- [**Auth0 Instructions**](/reference/admin/user-mgmt#auth0): apply to all Community Cloud for Pixie instances and any Self-Hosted Pixie instances that have been [manually configured](/reference/admin/authentication/#enabling-auth0) to use Auth0.

## Hydra / Kratos

<Alert variant="outlined" severity="info">This information applies to <a href="https://docs.px.dev/installing-pixie/install-guides/self-hosted-pixie/">Self-Hosted Pixie</a> instances that use the default <a href="https://docs.px.dev/reference/admin/authentication/#open-source-auth">open source authentication</a>.
</Alert>

Pixie instances using Hydra / Kratos as an identity provider can:

- [Invite users](/reference/admin/user-mgmt#invite-users)
- [Enable approvals for new users](/reference/admin/user-mgmt#enable-approvals-for-new-users)
- [Remove users](/reference/admin/user-mgmt#enable-approvals-for-new-users)

### Invite Users

Users added to your organization can view live views, query running clusters, and deploy new Pixie clusters.

1. Navigate to [`dev.withpixie.dev/admin/invite`](https://dev.withpixie.dev/admin/invite) in your browser.

2. Fill out the necessary information, then click the `"Invite"` button.

3. Copy and share the created link with your teammate. _Note that this link expires after 1 hour and cannot be recreated for the expired email address._

<svg title='' src='admin/user-mgmt/os-auth-invite-link.png'/>

### Enable Approvals for New Users

Once enabled, every user who joins your org via an Invite Link must be manually approved before they are able to use Pixie.

1. Navigate to [`dev.withpixie.dev/admin/org`](https://dev.withpixie.dev/admin/org) in your browser.

2. Click `“Enable”` on the Approvals setting to enable Approvals. Note that if the button says `“Disable”`, this means User Approvals has already been enabled for your organization.

<svg title='' src='admin/user-mgmt/os-enable-approvals.png'/>

3. Manually approve new users under the Users tab ([`dev.withpixie.dev/admin/users`](https://dev.withpixie.dev/admin/users)). Once User Approvals is enabled, any new users that join your org will join in a disabled state. Click `“Approve”` on the appropriate user to allow that user complete access to your organization within Pixie.

### Remove Users

1. Navigate to [`dev.withpixie.dev/admin/users`](https://dev.withpixie.dev/admin/users) in your browser.

2. Click the `"Remove"` button next to the desired user.

<svg title='' src='admin/user-mgmt/users-tab.png'/>

3. Accept the prompt confirming the removal.

<svg title='' src='admin/user-mgmt/user-removal-prompt.png'/>

Once a user is removed, they will be automatically logged out from any active UI sessions and will be unable to query Pixie resources.

## Auth0

<Alert variant="outlined" severity="info">This information applies to all <a href="https://docs.px.dev/installing-pixie/install-guides/community-cloud-for-pixie/">Community Cloud for Pixie</a> instances and any <a href="https://docs.px.dev/installing-pixie/install-guides/self-hosted-pixie/">Self-Hosted Pixie</a> instances that have been <a href="https://docs.px.dev/reference/admin/authentication/#enabling-auth0">manually configured</a> to use Auth0.
</Alert>

Pixie instances using Auth0 as an identity provider can:

- [Invite users](/reference/admin/user-mgmt#invite-users-1)
- [Enable approvals for new users](/reference/admin/user-mgmt#enable-approvals-for-new-users-1)
- [Disable Invite Links](/reference/admin/user-mgmt#invite-users-1)
- [Remove users](/reference/admin/user-mgmt#enable-approvals-for-new-users-1)

### Invite Users

Users added to your organization can view live views, query running clusters, and deploy new Pixie clusters.

1. Open the [Live UI](https://work.withpixie.ai/) Admin page (`/admin`).

2. Select the Users tab (`/admin/users`).

<svg title='' src='admin/user-mgmt/users-tab-invite-button.png'/>

3. Click the `“+ Invite Users”` button in the top right corner and follow the directions in the modal popup box.

Note that Pixie Organizations managed by Google Workspaces may only invite other members of that Google Workspace. Pixie Google Workspace Organizations have the following notification at the top of the Users tab (`/admin/users`):

<svg title='' src='admin/user-mgmt/google-workspace-org.png'/>

### Enable Approvals for New Users

For an additional layer of control over who joins your organization, enable User Approvals. Once enabled, every user who joins your org must be manually approved before they are able to use Pixie.

1. Open the [Live UI](https://work.withpixie.ai/) Admin page (`/admin`).

2. Select the Org Settings tab (`/admin/org`).

3. Click `“Enable”` on the approval setting to enable Approvals. Note that if the button says `“Disable”`, this means User Approvals has already been enabled for your organization.

<svg title='' src='admin/user-mgmt/enable-approvals.png'/>

4. Manually approve new users under the Users tab (`/admin/users`). Once User Approvals is enabled, any new users that join your org will join in a disabled state. Click `“Approve”` on the appropriate user to allow that user complete access to your organization within Pixie.

<svg title='' src='admin/user-mgmt/user-unapproved.png'/>

### Disable Invite Links

Invite links are valid for 7 days from the time of creation and will expire automatically at the end of the 7 day period. If you would like to invalidate invite links before the 7 day period is over, you can do so on the Orgs page.

<Alert variant="outlined" severity="warning">When you reset invite links, ALL existing invite links for your organization will be invalidated.</Alert>

1. Open the [Live UI](https://work.withpixie.ai/) Admin page (`/admin`).

2. Select the Org Settings tab (`/admin/org`).

<svg title='' src='admin/user-mgmt/reset-invite-links.png'/>

3. Click the red `"Reset Invite Links"` button. This will pop open a modal to confirm that you would like to reset all existing invite links for your org.

<svg title='' src='admin/user-mgmt/reset-invite-links-confirmation.png'/>

4. Click `“Reset Invite Links”` in the modal to confirm and invalidate all existing invite links.

### Remove Users

1. Open the [Live UI](https://work.withpixie.ai/) Admin page (`/admin`).

2. Select the Users tab (`/admin/users`).

3. Click the `"Remove"` button next to the desired user.

<svg title='' src='admin/user-mgmt/users-tab.png'/>

4. Accept the prompt confirming the removal.

<svg title='' src='admin/user-mgmt/user-removal-prompt.png'/>

Once a user is removed, they will be automatically logged out from any active UI sessions and will be unable to query Pixie resources.
