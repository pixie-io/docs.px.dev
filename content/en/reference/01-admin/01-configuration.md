---
title: "Configuration"
metaTitle: "Administration | Configuration"
metaDescription: "How to configure Pixie"
redirect_from:
    - /admin/configuration/
---

Pixie's experience is designed to minimize the instrumentation burden for application developers. However, we do want to empower Admins with a power CLI which helps them manage and configure Pixie to best fit their teams' needs.

## Pixie CLI Commands

In Beta, we are constantly shipping new features and capabilities to the CLI so please run the following command to view all available Pixie CLI commands:

```curl
px help
```

## Recommendations

- **Configuring Memory Allocation:** Extract and manually update Pixie YAML files using the  `--extract_yaml string` flag.
