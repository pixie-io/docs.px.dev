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

import React, { createElement } from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import ReactMarkdown from 'react-markdown';
import Typography from '@mui/material/Typography';
import AnchorTag from './anchor';

const dateOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

export const GET_ARTIFACTS = gql`
  query artifacts($artifactName: String!) {
    artifacts(artifactName: $artifactName) {
      items {
        version
        changelog
        timestampMs
      }
    }
  }
`;

const renderers = {
  /* eslint-disable react/destructuring-assignment */
  heading: (props) => createElement(Typography, { ...props, variant: `h${props.level}` }),
  list: (props) => createElement(Typography, { ...props, component: 'ul' }),
  listItem: (props) => createElement(Typography, { ...props, component: 'li' }),
  paragraph: (props) => createElement(Typography, { ...props, component: 'p' }),
  link: (props) => createElement(AnchorTag, props),
};

const Releases = (props) => {
  const { artifactName } = props;
  const { loading, error, data } = useQuery(GET_ARTIFACTS, {
    variables: { artifactName },
  });

  if (loading) {
    return <span>Fetching releases...</span>;
  }
  if (error) {
    return <span>Error: Could not fetch releases.</span>;
  }

  let markdown = '';
  data.artifacts.items.slice(0, 10).forEach((item) => {
    const d = new Date(parseInt(item.timestampMs, 10));
    const ds = d.toLocaleDateString('en-US', dateOptions as Intl.DateTimeFormatOptions);

    markdown += `##### v${item.version} (${ds})\n ${item.changelog}\n`;
  });

  return <ReactMarkdown source={markdown} renderers={renderers} />;
};

export default Releases;
