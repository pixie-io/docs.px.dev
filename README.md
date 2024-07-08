# [docs.px.dev](http://docs.px.dev/) &middot; [![Netlify Status](https://api.netlify.com/api/v1/badges/0e00be9c-373b-43b5-9b31-f4ce40b9fea9/deploy-status)](https://app.netlify.com/sites/blog-px-dev/deploys) <a href="https://twitter.com/intent/follow?screen_name=pixie_run"><img src="https://img.shields.io/twitter/follow/pixie_run.svg?label=Follow%20@pixie_run" alt="Follow @pixie_run" /></a> [![Snyk](https://img.shields.io/badge/snyk-report-green)](https://snyk.io/test/github/pixie-io/docs.px.dev)

This repo contains the source code and content for the [Pixie Docs](http://docs.px.dev/) website.

## Reporting Issues

Submit any issues or enhancement requests by [filing an issue](https://github.com/pixie-io/docs.px.dev/issues/new). Please search for and review the existing open issues before submitting a new issue.

## Contributing

We're excited to have you contribute to Pixie's documentation!

Pixie has adopted the [Contributor Covenant](https://github.com/pixie-io/docs.px.dev/blob/main/CODE_OF_CONDUCT.md) as its code of conduct, and we expect all participants to adhere to it. Please report any violations to <community@pixielabs.ai>. All code contributions require signing, please refer to the [Contribution Guide](https://github.com/pixie-io/docs.px.dev/blob/main/CONTRIBUTING.md).

### Dev Setup

To run in development mode, run the following commands:

```shell
yarn install
yarn start
```

Then visit `http://localhost:8000/` to view the app.

To generate a production build, run:

```shell
yarn install
yarn build
```

### Adding New Language Translations

1. Create a new empty folder in the `content` folder. Name the folder with the new language's [2-letter code](https://quicksilvertranslate.com/712/iso6392-letterlanguagecodes/).
2. Add a new item for the new language to the `languages` list in the `available-languages.js` file.
3. Copy the file you want to translate from the `en` folder into the new folder. Make sure to maintain the same folder structure, folder names, and file name as the `en` directory.
4. Translate the file and create a PR.

### Updating Automated Content

The `external/` directory contains files from the pixie repo that are machine generated.

There is automation that updates the `external/pxl_documentation.json` file automatically, while the `datatable_documentation.json` file must be manually updated.


### Deploy Previews

Once you submit a pull request to this repo, Netlify creates a [deploy preview](https://www.netlify.com/blog/2016/07/20/introducing-deploy-previews-in-netlify/) for the changes in the specific PR. You can view the deploy preview in the Netlify panel that appears under the PR description.

### Publishing the Site

The Pixie website is published automatically by [Netlify](https://www.netlify.com/). Whenever changes are merged into the `prod` branch, Netlify re-builds and re-deploys the site.

## Documentation License

<a rel="license" href="http://creativecommons.org/licenses/by/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International License</a>.

Please note the Creative Commons Attribution 4.0 license applies to the creative work of this site (documentation, visual assets, etc.) and not to the underlying code and does not supersede any licenses of the source code, its dependencies, etc.
