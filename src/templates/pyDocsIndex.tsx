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

import React from 'react';
// eslint-disable-next-line
import { makeStyles } from '@mui/styles';
import SEO from 'components/seo';

import { Layout } from 'components';
import { Typography } from '@mui/material';
import { graphql } from 'gatsby';
import HLink from '../components/mdxComponents/h-link';
import parseMd from '../components/parseMd';
import CodeRenderer from '../components/mdxComponents/codeRenderer';

const useStyles = makeStyles(() => ({
  mainContainer: {
    margin: '0 auto',
    padding: '16px',
    paddingLeft: '32px',
    maxWidth: '1280px',
  },
  link: {
    color: '#12D6D6',
    textDecoration: 'none',
  },
  ul: {
    listStyle: 'none',
    maxWidth: '768px',
    paddingLeft: '0',
    '&  ul': {
      paddingLeft: '30px',
    },
  },
  spacer: {
    height: '30px',
  },
}));

const PyDocsIndex = ((props: any) => {
  const { data } = props;
  const classes = useStyles();
  const { pageContext: { data: context } } = props;
  const classesList = JSON.parse(context).classes;
  return (
    <Layout {...props}>
      <SEO
        title={data.site.siteMetadata.title}
        description='PXL Functions'
      />
      <div className={classes.mainContainer}>
        <HLink id='title' variant='h1'>
          Python API Reference
        </HLink>
        <Typography variant='h3'>
          Index
        </Typography>

        <ul className={classes.ul}>
          {classesList.map((c) => (
            <li key={c.def.name}>
              <a href={`#${c.def.name}`} className={classes.link}>
                {c.def.name}
              </a>
              <ul className={classes.ul}>
                {c.methods && c.methods.map((m) => (
                  <li key={m.name}>
                    <a href={`#${m.name}`} className={classes.link}>
                      {m.name}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <div className={classes.spacer} />

        <ul className={classes.ul}>
          {classesList.map((c) => (
            <li key={c.def.name}>
              <HLink id={c.def.name} variant='h3'>
                {c.def.name}
              </HLink>
              <Typography variant='body1'>
                <CodeRenderer
                  wrap
                  code={c.def.declaration}
                  lang='python'
                />
                {parseMd(c.def.docstring)}
              </Typography>
              <ul className={classes.ul}>
                {c.methods && c.methods.map((m) => (
                  <li key={m.name}>
                    <HLink id={m.name} variant='h4'>
                      {m.name}
                    </HLink>
                    <Typography variant='body1'>
                      <CodeRenderer
                        wrap
                        code={m.declaration}
                        lang='python'
                      />
                      {parseMd(m.docstring)}
                    </Typography>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
});

export default PyDocsIndex;

export const pageQuery = graphql`
    query {
        site {
            siteMetadata {
                title
                docsLocation
            }
        }
    }
`;
