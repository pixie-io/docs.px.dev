---
title: "Verifying Images"
metaTitle: "Reference | Admin | Verifying Images"
metaDescription: "Verifying container images"
order: 12 
---

Pixie’s container images are signed with [cosign](https://github.com/sigstore/cosign). Each image is signed with Pixie’s private key and can be verified using Pixie’s public key. This can help you ensure the images you are running and deploying to your cluster are trustworthy.  

## Verifying a Container 

1. Download cosign by following the instructions [here](https://docs.sigstore.dev/cosign/installation/).

2. Run cosign to verify the image:

```bash
cosign verify --key https://px.dev/cosign.pub <image path>
```

3. Running `cosign verify` will log the verification to stdout and return an exit code of 0 if the signature matches the public key.
