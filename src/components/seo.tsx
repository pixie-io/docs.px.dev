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

import * as React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import favDark from '../images/favicon-dark.png';
import favGreen from '../images/favicon-green.png';

const SEO = ({
  description, title, meta, type,
}) => {
  const favicon = {
    rel: 'icon',
    type: 'image/png',
    href:
      typeof window !== 'undefined'
      && window.matchMedia
      && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? favGreen
        : favDark,
  };
  const structuredDataOrganization = {
    '@context': 'http://schema.org',
    '@type': 'Organization',
    legalName: 'Pixie Labs',
    url: 'https://docs.px.dev/',
    logo: 'https://docs.px.dev/logo.svg',
    foundingDate: 'august 2018',
    founders: [{
      '@type': 'Person',
      name: 'Zain Asgar',
    },
    {
      '@type': 'Person',
      name: 'Ishan Mukherjee',
    }],
    contactPoint: [{
      '@type': 'ContactPoint',
      email: 'info@pixielabs.ai',
      telephone: '(415) 429-8361',
      contactType: 'Customer Support',
    }],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'San Francisco',
      addressRegion: 'California',
      addressCountry: 'United States',
      streetAddress: '300 Brannan St #405',
      postalCode: '94107',
    },
    sameAs: [
      'https://twitter.com/pixie_run',
      'https://www.linkedin.com/company/pixieai/',
      'https://www.youtube.com/channel/UCOMCDRvBVNIS0lCyOmst7eg',
      'https://instagram.com/pixie_run',
    ],
  };
  return (
    <Helmet
      htmlAttributes={{
        lang: 'en',
      }}
      title={title}
      link={[favicon]}
      meta={[
        {
          name: 'description',
          content: description,
        },
        {
          property: 'og:locale',
          content: 'en',
        },
        {
          property: 'og:title',
          content: title,
        },
        {
          property: 'og:description',
          content: description,
        },
        {
          name: 'google-site-verification',
          content: 'UGO9cvTv-mu9EiADezhiLENml6FLHzoZ3chp2rgWJ98',
        },
        {
          property: 'og:type',
          content: type,
        },
        {
          property: 'og:url',
          content: 'https://docs.px.dev/',
        },
        {
          property: 'og:image',
          content: 'https://docs.px.dev/logo.svg',
        },
        {
          property: 'og:image:alt',
          content: description,
        },
        {
          name: 'twitter:card',
          content: 'summary',
        },
        {
          name: 'twitter:creator',
          content: '@pixie_run',
        },
        {
          name: 'twitter:title',
          content: title,
        },
        {
          name: 'twitter:image',
          content: 'https://docs.px.dev/logo.svg',
        },
        {
          name: 'twitter:image:alt',
          content: description,
        },
        {
          name: 'twitter:description',
          content: description,
        },
      ].concat(meta)}
    >
      <script type='application/ld+json'>{JSON.stringify(structuredDataOrganization)}</script>
    </Helmet>
  );
};

SEO.defaultProps = {
  meta: [],
  description: '',
  type: 'website',
};

SEO.propTypes = {
  type: PropTypes.string,
  description: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object])),
  title: PropTypes.string.isRequired,
};

export default SEO;
