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
import { makeStyles } from '@mui/styles';
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography,
} from '@mui/material';
import SEO from 'components/seo';
import { Layout } from 'components';
import HLink from '../components/mdxComponents/h-link';

const useStyles = makeStyles(() => ({
  mainContainer: {
    margin: '0 auto',
    padding: '16px',
    paddingLeft: '32px',
    maxWidth: '1280px',
  },
  table: {},
  link: {
    color: '#12D6D6',
    textDecoration: 'none',
  },
}));
const RenderTableRow = ({ docObj }) => (
  <TableRow key={docObj.name}>
    <TableCell component='th' scope='row'>{docObj.name}</TableCell>
    <TableCell>{docObj.type}</TableCell>
    <TableCell>{docObj.pattern}</TableCell>
    <TableCell>{docObj.desc}</TableCell>
  </TableRow>
);

const TableDocsTemplate = ((props: any) => {
  const { data } = props;
  const classes = useStyles();
  const {
    pageContext: {
      data: context, title,
    },
  } = props;
  const datatables = JSON.parse(context);

  return (
    <Layout {...props}>
      <SEO
        title={data.site.siteMetadata.title}
        description={title}
      />
      <div className={classes.mainContainer}>
        <HLink id='title' variant='h1'>
          {title}
        </HLink>
        <Typography variant='body1'>{datatables[0].desc}</Typography>
        <TableContainer component={Paper} sx={{ backgroundImage: 'none' }}>
          <Table className={classes.table} aria-label='table' sx={{ width: '100%' }}>
            <TableHead>
              <TableRow>
                <TableCell align='left'>Column</TableCell>
                <TableCell align='left'>Type</TableCell>
                <TableCell align='left'>Pattern</TableCell>
                <TableCell align='left'>Desc</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {datatables[0].cols
                .map((f) => (
                  <RenderTableRow docObj={f} />
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Layout>
  );
});

export default TableDocsTemplate;

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
