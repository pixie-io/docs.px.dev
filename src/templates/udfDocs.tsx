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
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import SEO from 'components/seo';
import { Layout } from 'components';
import parseUdf from 'utils/parseUdf';
import parseMd from '../components/parseMd';
import HLink from '../components/mdxComponents/h-link';

const useStyles = makeStyles(() => ({
  mainContainer: {
    margin: '0 auto',
    padding: '16px',
    paddingLeft: '32px',
    maxWidth: '1280px',
  },
  table: {
    width: '100%',
  },
}));

const UdfDocsTemplate = ((props: any) => {
  const { data } = props;
  const { pageContext: { data: jsonString } } = props;
  const firstFunction = JSON.parse(jsonString)[0];
  // only take the first overload
  const classes = useStyles();
  const {
    brief, name, examples, desc,
  } = firstFunction;

  const functions = JSON.parse(jsonString).map((f) => parseUdf(f));
  return (
    <Layout {...props}>
      <SEO
        title={data.site.siteMetadata.title}
        description={brief}
      />
      <div className={classes.mainContainer}>
        <HLink id='name' variant='h1'>
          {name}
        </HLink>
        <Typography variant='body1'>
          {parseMd(desc)}
        </Typography>
        <Typography variant='body1'>
          <Box fontWeight={700}>
            Returns:
            {' '}
            {functions[0].definition.result.type}
            {' '}

          </Box>
          <Typography variant='body1'>
            {functions[0].definition.result.desc}
          </Typography>
        </Typography>

        <HLink id='arguments' variant='h2'>
          Arguments
        </HLink>
        <TableContainer component={Paper} sx={{ backgroundImage: 'none' }}>
          <Table className={classes.table} aria-label='simple table' sx={{ width: '100%' }}>
            <TableHead>
              <TableRow>
                <TableCell align='left'>Variable</TableCell>
                <TableCell align='left'>Type</TableCell>
                <TableCell align='left'>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {functions[0].definition.inputs ? functions[0].definition.inputs.map((arg, index) => (
                <TableRow>
                  <TableCell align='left'>{arg.ident}</TableCell>
                  <TableCell align='left'>
                    {[...new Set(functions.filter((f) => !!f.definition.inputs[index]).map((f) => f.definition.inputs[index].type))].join(' / ')}
                  </TableCell>
                  <TableCell align='left'>{arg.desc}</TableCell>
                </TableRow>
              )) : ''}

            </TableBody>
          </Table>
        </TableContainer>
        {examples && examples.length && (
          // Using the shorthand <></> syntax here does not work, "React is not defined".
          // eslint-disable-next-line react/jsx-fragments
          <React.Fragment>
            <HLink id='examples' variant='h2'>
              Examples:
            </HLink>
            {examples.map((ex) => parseMd(ex.value))}
          </React.Fragment>
        )}
      </div>
    </Layout>
  );
});

export default UdfDocsTemplate;

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
