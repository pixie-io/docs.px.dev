/*
 * Copyright 2018- The Pixie Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

const dotenv = require('dotenv');
const containers = require('remark-containers');
const config = require('./config');

if (!process.env.NETLIFY) {
  dotenv.config();
}

let algoliaApiKey = process.env.ALGOLIA_DEV_API_KEY;
let algoliaIndex = process.env.GATSBY_ALGOLIA_DEV_INDEX_NAME;
switch (process.env.GATSBY_DEPLOY_ENV) {
  case 'main':
    algoliaApiKey = process.env.ALGOLIA_MAIN_API_KEY;
    break;
  case 'prod':
    algoliaApiKey = process.env.ALGOLIA_PROD_API_KEY;
    algoliaIndex = process.env.GATSBY_ALGOLIA_PROD_INDEX_NAME;
    break;
  default:
    // Assume dev environment.
}

const algolia = {
  // This plugin must be placed last in your list of plugins to ensure that it can query
  // all the GraphQL data.
  resolve: 'gatsby-plugin-algolia',
  options: {
    appId: process.env.GATSBY_ALGOLIA_APP_ID,
    // Use Admin API key without GATSBY_ prefix, so that the key isn't exposed in the application.
    // Tip: use Search API key with GATSBY_ prefix to access the service from within components.
    apiKey: algoliaApiKey,
    indexName: algoliaIndex, // for all queries
    // eslint-disable-next-line global-require
    // eslint-disable-next-line import/extensions
    queries: require('./src/utils/algolia-queries.ts').queries,
    settings: {
      // optional, any index settings
      searchableAttributes: [
        'value',
      ],
    },
    enablePartialUpdates: true,
    matchFields: ['slug', 'modified'],
  },
};

const plugins = [
  'gatsby-plugin-sitemap',
  'gatsby-plugin-sharp',
  'gatsby-plugin-react-helmet',
  'gatsby-plugin-material-ui',
  'gatsby-plugin-styled-components',
  'gatsby-plugin-netlify',
  {
    resolve: 'gatsby-plugin-mdx',
    options: {
      gatsbyRemarkPlugins: [
        {
          resolve: 'gatsby-remark-relative-images',
        },
        {
          resolve: require.resolve('./src/plugins/gatsby-plugin-code-tabs'),
        },
        {
          resolve: 'gatsby-remark-images',
          options: {
            maxWidth: 1035,
            showCaptions: true,
            markdownCaptions: true,
          },
        },
        {
          resolve: 'gatsby-remark-copy-linked-files',
        },
      ],
      remarkPlugins: [containers],
      extensions: ['.mdx', '.md'],
    },
  },
  {
    resolve: 'gatsby-source-filesystem',
    options: {
      name: 'en',
      path: `${__dirname}/content/`,
    },
  },
  {
    resolve: 'gatsby-plugin-react-helmet-canonical-urls',
    options: {
      siteUrl: 'https://docs.px.dev',
    },
  },
  {
    resolve: 'gatsby-plugin-gtag',
    options: {
      // your google analytics tracking id
      trackingId: config.gatsby.gaTrackingId,
      // Puts tracking script in the head instead of the body
      head: true,
      // enable ip anonymization
      anonymize: false,
    },
  },
  {
    resolve: 'gatsby-plugin-typescript',
    options: {
      isTSX: true, // defaults to false
      jsxPragma: 'jsx', // defaults to "React"
      allExtensions: true, // defaults to false
    },
  },
  {
    resolve: 'gatsby-plugin-segment-js',
    options: {
      prodKey: process.env.SEGMENT_PRODUCTION_WRITE_KEY,
      devKey: process.env.SEGMENT_DEV_WRITE_KEY,
      trackPage: true,
    },
  },
  {
    resolve: 'gatsby-plugin-sass',
    options: {
      sassOptions: {
        includePaths: ['node_modules', './src/scss'],
      },
    },
  },
  {
    resolve: 'gatsby-plugin-google-fonts',
    options: {
      fonts: [
        'roboto:300,400,400i,700',
        'roboto+mono:300,400,400i,700',
      ],
      display: 'block',
    },
  },
  'gatsby-plugin-remove-serviceworker',
  'gatsby-plugin-meta-redirect',
  {
    resolve: 'gatsby-redirect-from',
    options: {
      query: 'allMdx',
    },
  },
];

if ('GATSBY_ALGOLIA_APP_ID' in process.env) {
  plugins.push(algolia);
}

module.exports = {
  pathPrefix: config.gatsby.pathPrefix,
  trailingSlash: 'always',
  siteMetadata: {
    title: config.siteMetadata.title,
    description: config.siteMetadata.description,
    docsLocation: config.siteMetadata.docsLocation,
    ogImage: config.siteMetadata.ogImage,
    favicon: config.siteMetadata.favicon,
    siteUrl: config.gatsby.siteUrl,
  },
  plugins,
};
