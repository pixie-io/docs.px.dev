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
import { graphql } from 'gatsby';
// eslint-disable-next-line
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import SEO from 'components/seo';
import { Layout } from 'components';
import parseMd from '../components/parseMd';
import HLink from '../components/mdxComponents/h-link';
// import parseMd from 'components/parseMd';

const useStyles = makeStyles(() => ({
  mainContainer: {
    margin: '0 auto',
    padding: '16px',
    paddingLeft: '32px',
    maxWidth: '1280px',
  },
  table: {},
}));

const DocsTemplate = ((props: any) => {
  const { data } = props;
  let { pageContext: { data: context } } = props;
  context = (JSON.parse(context));

  const classes = useStyles();

  const {
    funcDoc: { args, returnType },
    body: {
      brief, name, desc, examples,
    },
  } = context;

  return (
    <Layout {...props}>
      <SEO
        title={data.site.siteMetadata.title}
        description={brief}
      />
      <div className={classes.mainContainer}>
        <HLink id='title' variant='h1'>
          {name}
        </HLink>
        <HLink id='brief' variant='h2'>
          {brief}
        </HLink>
        <Typography variant='body1'>{parseMd(desc)}</Typography>
        <HLink id='arguments' variant='h2'>
          Arguments
        </HLink>
        <TableContainer component={Paper} sx={{ backgroundImage: 'none' }}>
          <Table className={classes.table} aria-label='simple table' sx={{ width: '100%' }}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align='left'>Type</TableCell>
                <TableCell align='left'>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {args.map((arg) => (
                <TableRow key={arg.ident}>
                  <TableCell component='th' scope='row'>
                    {arg.ident}
                  </TableCell>
                  <TableCell>{arg.types.join(',')}</TableCell>
                  <TableCell>{arg.desc}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {returnType && returnType.types && returnType.desc && (
        <div>
          <HLink id='returns' variant='h2'>
            Returns
          </HLink>
          <Typography variant='body1'>
            {parseMd(`\`${returnType.types}\`: ${returnType.desc}`)}
          </Typography>
        </div>
        )}
        {examples && examples.length ? (
          <div>
            <HLink id='examples' variant='h2'>
              Examples
            </HLink>
            <Typography variant='body1'>
              {examples.map((e) => parseMd(e.value))}
            </Typography>
          </div>
        ) : (<div />)}
      </div>
    </Layout>
  );
});

export default DocsTemplate;

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
