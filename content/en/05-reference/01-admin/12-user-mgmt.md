---
title: "User Management & Sharing"
metaTitle: "Reference | Admin | User Management & Sharing"
metaDescription: "Share and manage access to your Pixie data."
order: 12
redirect_from:
    - /admin/permissions/
---

Pixie has features to share and manage access to your Pixie organization.

Instructions are based on identity provider. To determine your identity provider, open the Live UI sign in page (`/auth/login`):

::: div image-m
<svg title='Your Pixie uses Auth0 if you see the option to "Login with Google".' src='admin/user-mgmt/determine-auth.png'/>
:::

Follow the

- [Auth0 Instructions](/reference/admin/user-mgmt/#auth0): if you have the option to `"Login With Google"
- [Hydra / Kratos Instructions](/reference/admin/user-mgmt/#hydra-kratos): if you _do not_ have the option to `"Login With Google"

## Auth0

Pixie instances using Auth0 as an identity provider can:

- [Invite users](/reference/admin/user-mgmt/#auth0-invite-users)
- [Enable approvals for new users](/reference/admin/user-mgmt/#auth0-enable-approvals-for-new-users)
- [Invalidate Invite Links](/reference/admin/user-mgmt/#auth0-invalidate-invite-links)
- [Remove users](/reference/admin/user-mgmt/#auth0-remove-users)

### Invite Users

Users added to your organization can view live views, query running clusters, and deploy new Pixie clusters.

1. Open the Live UI and navigate to the Users tab on the Admin page (`/admin/users`).

<svg title='' src='admin/user-mgmt/users-tab-invite-button.png'/>

2. Click the `“+ Invite Users”` button in the top right corner and follow the directions in the modal popup box.

Note that Pixie Organizations managed by Google Workspaces may only invite other members of that Google Workspace. Pixie Google Workspace Organizations have the following notification at the top of the Users tab (`/admin/users`):

<svg title='' src='admin/user-mgmt/google-workspace-org.png'/>

### Enable Approvals for New Users

For an additional layer of control over who joins your organization, enable User Approvals. Once enabled, every user who joins your org must be manually approved before they are able to use Pixie.

1. Open the Live UI and navigate to the Org Settings tab on the Admin page (`/admin/users`).

2. Click `“Enable”` on the approval setting to enable Approvals. Note that if the button says `“Disable”`, this means User Approvals has already been enabled for your organization.

<svg title='' src='admin/user-mgmt/enable-approvals.png'/>

3. Manually approve new users under the Users tab (`/admin/users`). Once User Approvals is enabled, any new users that join your org will join in a disabled state. Click `“Approve”` on the appropriate user to allow that user complete access to your organization within Pixie.

<svg title='' src='admin/user-mgmt/user-unapproved.png'/>

### Invalidate Invite Links

Invite links are valid for 7 days from the time of creation and will expire automatically at the end of the 7 day period. If you would like to invalidate invite links before the 7 day period is over, you can do so on the Orgs page.

<Alert variant="outlined" severity="warning">When you reset invite links, ALL existing invite links for your organization will be invalidated.</Alert>

1. Open the Live UI and navigate to the Org Settings tab on the Admin page (`/admin/users`).

<svg title='' src='admin/user-mgmt/reset-invite-links.png'/>

2. Click the red `"Reset Invite Links"` button. This will pop open a modal to confirm that you would like to reset all existing invite links for your org.

<svg title='' src='admin/user-mgmt/reset-invite-links-confirmation.png'/>

3. Click `“Reset Invite Links”` in the modal to confirm and invalidate all existing invite links.

### Remove Users

1. Open the Live UI and navigate to the Users tab on the Admin page (`/admin/users`).

2. Click the `"Remove"` button next to the desired user.

<svg title='' src='admin/user-mgmt/users-tab.png'/>

3. Accept the prompt confirming the removal.

<svg title='' src='admin/user-mgmt/user-removal-prompt.png'/>

Once a user is removed, they will be automatically logged out from any active UI sessions and will be unable to query Pixie resources.

## Hydra / Kratos

Pixie instances using Hydra / Kratos as an identity provider can:

- [Invite users](/reference/admin/user-mgmt/#hydra-kratos-invite-users)
- [Enable approvals for new users](/reference/admin/user-mgmt/#hydra-kratos-enable-approvals-for-new-users)

### Invite Users

Users added to your organization can view live views, query running clusters, and deploy new Pixie clusters.

1. Open the Live UI and navigate to the Invitations tab on the Admin page (`/admin/invite`).

2. Fill out the necessary information, then click the `"Invite"` button.

3. Copy and share the created link with your teammate. _Note that this link expires after 1 hour and cannot be recreated for the expired email address._

<svg title='' src='admin/user-mgmt/os-auth-invite-link.png'/>

### Enable Approvals for New Users

Once enabled, every user who joins your org via an Invite Link must be manually approved before they are able to use Pixie.

1. Open the Live UI and navigate to the Org Settings tab on the Admin page (`/admin/org`).

2. Click `“Enable”` on the Approvals setting to enable Approvals. Note that if the button says `“Disable”`, this means User Approvals has already been enabled for your organization.

<svg title='' src='admin/user-mgmt/os-enable-approvals.png'/>

3. Manually approve new users under the Users tab (`/admin/users`). Once User Approvals is enabled, any new users that join your org will join in a disabled state. Click `“Approve”` on the appropriate user to allow that user complete access to your organization within Pixie.
