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
import { graphql, Link } from 'gatsby';
// eslint-disable-next-line
import { makeStyles } from '@mui/styles';
import SEO from 'components/seo';
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from '@mui/material';
import slugify from 'slugify';
import { groupBy } from 'lodash';

import { Layout } from 'components';
import parseUDF from 'utils/parseUdf';
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
const RenderFunctionRow = ({ functionGroup, classes }) => (
  <TableRow key={functionGroup[0].name}>
    <TableCell component='th' scope='row'>
      <Link
        to={`/reference/pxl/udf/${slugify(functionGroup[0].name.toLowerCase())}`}
        className={classes.link}
      >
        {functionGroup[0].name}
      </Link>
    </TableCell>
    <TableCell>
      {
        functionGroup.map((a) => parseUDF(a)).map((fct) => (
          <Box component='div'>
            {fct.definition.inputs ? fct.definition.inputs.map((i) => i.type).join(', ') : ''}
            {' '}
            {'->'}
            {' '}
            {fct.definition.result.type}
          </Box>
        ))
      }
    </TableCell>
    <TableCell>{functionGroup[0].brief}</TableCell>
  </TableRow>
);

const UdfFunctionsTemplate = ((props: any) => {
  const { data } = props;
  const classes = useStyles();
  const { pageContext: { data: context } } = props;
  const udfList = Object.values(groupBy(JSON.parse(context).udf, (x) => x.name));
  // eslint-disable-next-line no-prototype-builtins
  const aggregateFunctionGroups = udfList.filter((f) => f[0].hasOwnProperty('udaDoc'));
  // eslint-disable-next-line no-prototype-builtins
  const scalarFunctionGroups = udfList.filter((f) => f[0].hasOwnProperty('scalarUdfDoc'));

  return (
    <Layout {...props}>
      <SEO
        title={data.site.siteMetadata.title}
        description='PXL Functions'
      />
      <div className={classes.mainContainer}>
        <HLink id='title' variant='h1'>
          PXL Functions
        </HLink>
        <HLink id='scalar-functions' variant='h2'>
          Scalar Functions
        </HLink>
        <TableContainer component={Paper} sx={{ backgroundImage: 'none' }}>
          <Table className={classes.table} aria-label='table' sx={{ width: '100%' }}>
            <TableHead>
              <TableRow>
                <TableCell align='left'>Function</TableCell>
                <TableCell align='left'>Arguments</TableCell>
                <TableCell align='left'>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {scalarFunctionGroups
                .map((f) => (<RenderFunctionRow functionGroup={f} classes={classes} />))}
            </TableBody>
          </Table>
        </TableContainer>
        <HLink id='aggregate-functions' variant='h2'>
          Aggregate Functions
        </HLink>
        <TableContainer component={Paper} sx={{ backgroundImage: 'none' }}>
          <Table className={classes.table} aria-label='table'>
            <TableHead>
              <TableRow>
                <TableCell align='left'>Function</TableCell>
                <TableCell align='left'>Arguments</TableCell>
                <TableCell align='left'>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {aggregateFunctionGroups
                .map((f) => (<RenderFunctionRow functionGroup={f} classes={classes} />))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Layout>
  );
});

export default UdfFunctionsTemplate;

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
