---
title: "User Management & Sharing"
metaTitle: "Reference | Admin | User Management & Sharing"
metaDescription: "Share and manage access to your Pixie data."
order: 6
redirect_from:
    - /admin/permissions/
---

<Alert variant="outlined" severity="info">This information applies to Pixie instances that use Auth0 for Authentication. <a href="https://docs.px.dev/installing-pixie/install-guides/community-cloud-for-pixie/">Community Cloud for Pixie</a> ships with Auth0. <a href="https://docs.px.dev/installing-pixie/install-guides/self-hosted-pixie/">Self-Hosted Pixie</a> must be <a href="https://docs.px.dev/reference/admin/authentication/#enabling-auth0">manually configured</a> to use Auth0. To learn how to invite users to Self-Hosted Pixie instances using open source authentication, see the Quick Start <a href="https://docs.px.dev/installing-pixie/install-guides/self-hosted-pixie/#invite-others-to-your-organization-(optional)">instructions</a>.
</Alert>

Pixie has features to share and manage access your Pixie organization:

- [Invite users](/reference/admin/user-mgmt#invite-users)
- [Enable approvals for new users](/reference/admin/user-mgmt#enable-approvals-for-new-users)
- [Disable existing invite links](/reference/admin/user-mgmt#disable-invite-links)
- [Remove users](/reference/admin/user-mgmt#remove-users)

Users added to your organization can view Pixie live views, query running clusters, and deploy new Pixie clusters.

## Invite Users

### GSuite Organizations

Pixie handles GSuite orgs differently than other orgs.

You are part of a Pixie GSuite org if:

1. The original creator of the org signs into Pixie using the "Sign in with Google" button AND
2. The email the admin uses to sign in is part of a GSuite account.

GSuite orgs can invite two types of users:

- **Teammates with GSuite emails**: should use the "Sign-Up with Google" button on the [Sign up](https://work.withpixie.ai/auth/signup) page. GSuite emails will automatically join the Pixie org corresponding to their GSuite domain. _DO NOT use Invite Links to invite teammates with GSuite emails._ For greater control, enable [User Approvals](/reference/admin/user-mgmt#enable-approvals-for-new-users).

- **Teammates using Gmail or creating custom email/password Pixie accounts**: should be sent [Invite Links](/reference/admin/user-mgmt#invite-links).

### All Other Organizations

If your organization is not a [GSuite organization](/reference/admin/user-mgmt#gsuite-organnizations), you can invite users with [Invite Links](/reference/admin/user-mgmt#invite-links).

<Alert variant="outlined" severity="warning">Invited teammates using GSuite emails MUST sign up for Pixie using the "Sign-Up with Email" button. If a teammate accidentally signs up for Pixie using SSO ("Sign-Up with Google" button), they will not be able to join your Org. To fix this, they will need to sign up for Pixie again using the "Sign-Up with Email" button with a new or modified email (e.g. adding `+pixie` to their email, like anna+pixie@fakeemail.com)</Alert>

### Invite Links

1. Open the [Live UI](/using-pixie/using-live-ui) Admin page (`/admin`).
2. Select the Users tab (`/admin/org`).

<svg title='' src='admin/user-mgmt/users-tab-invite-button.png'/>

3. Click the “+ Invite Users” button in the top right corner. This will pop open a modal with a generated invite link for your organization.

<svg title='' src='admin/user-mgmt/invite-link.png'/>

4. Copy the link and send it to your teammates.

### Enable Approvals for New Users

Combine Invite Links with User Approvals for greater control over who joins your organization. If your organization enables User Approvals, every user must be manually approved after they join your organization before they are able use Pixie.

1. Open the [Live UI](/using-pixie/using-live-ui) Admin page (`/admin`).
2. Select the Org Settings tab (`/admin/org`).
3. Click “Enable” on the approval setting to enable Approvals. Note that if the button says “Disable”, this means User Approvals has already been enabled for your organization.

<svg title='' src='admin/user-mgmt/enable-approvals.png'/>

4. Manually approve new users under the Users tab (`/admin/org`).

>> Once User Approvals are enabled, any new users that join your org will join in a disabled state.

<svg title='' src='admin/user-mgmt/user-unapproved.png'/>

>> Click “Approve” on the appropriate user to allow that user complete access to your organization within Pixie.

<svg title='' src='admin/user-mgmt/user-approved.png'/>

### Disable Invite Links

Invite links are valid for 7 days from the time of creation and will expire automatically at the end of the 7 day period. If you would like to invalidate invite links before the 7 day period is over, you can do so on the Orgs page.

<Alert variant="outlined" severity="warning">When you reset invite links, ALL existing invite links for your organization will be invalidated.</Alert>

1. Open the [Live UI](/using-pixie/using-live-ui) Admin page (`/admin`).
2. Select the Org Settings tab (`/admin/org`).

<svg title='' src='admin/user-mgmt/reset-invite-links.png'/>

3. Click the red "Reset Invite Links” button. This will pop open a modal to confirm that you would like to reset all existing invite links for your org.

<svg title='' src='admin/user-mgmt/reset-invite-links-confirmation.png'/>

4. Click “Reset Invite Links” in the modal to confirm and invalidate all existing invite links.

## Remove Users

1. Open the [Live UI](/using-pixie/using-live-ui) Admin page (`/admin`).
2. Select the Users tab (`/admin/org`).
3. Click the "Remove" button next to the desired user.

<svg title='' src='admin/user-mgmt/users-tab.png'/>

4. Accept the prompt confirming the removal.

<svg title='' src='admin/user-mgmt/user-removal-prompt.png'/>

Once a user is removed, they will be automatically logged out from any active UI sessions and will be unable to query Pixie resources.
