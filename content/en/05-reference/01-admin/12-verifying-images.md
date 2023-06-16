---
title: "Verifying Images"
metaTitle: "Reference | Admin | Verifying Images"
metaDescription: "Verifying container images"
order: 12 
---

Pixie’s container images are signed with [cosign](https://github.com/sigstore/cosign). Each image is signed with Pixie’s private key and can be verified using Pixie’s public key. This can help you ensure the images you are running and deploying to your cluster are trustworthy.  

## Verifying a Container 

1. Download cosign by following the instructions [here](https://docs.sigstore.dev/cosign/installation/).

2. Download Pixie’s public key:

```bash
wget https://raw.githubusercontent.com/pixie-io/px.dev/main/static/cosign.pub
```

3. Run cosign to verify the image:

```bash
cosign verify --key cosign.pub <image path>
```

4. Running `cosign verify` will return an exit code of 0 if the signature matches the public key. To check the exit code, you can run:

```bash
echo $?
```
