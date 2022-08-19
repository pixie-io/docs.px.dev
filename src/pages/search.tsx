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
import { Typography } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import { Link } from 'gatsby';
import { SearchContext } from 'components/search-context';
import Layout from '../components/layout';

// For a use of dangerouslySetInnerHTML later that takes in highlight spans from a search result
/* eslint-disable react/no-danger */

const SearchResultsPage = withStyles((theme) => ({
  mainContainer: {
    margin: '0 auto',
    padding: '16px',
    paddingLeft: '32px',
    maxWidth: '1280px',
  },
  resultItem: {
    paddingBottom: '42px',
  },
  resultsCounter: {
    fontSize: '20px',
    lineHeight: '32px',
    color: '#4A4C4F',
    borderBottom: '1px solid #353738',
    marginBottom: '35px',
  },
  resultTitle: {
    fontSize: '20px',
    lineHeight: '32px',
    color: theme.palette.mode === 'light' ? '#000000' : '#B2B5BB',
    padding: '2px 0',
    margin: '0',
  },
  excerpt: {
    fontSize: '14px',
    lineHeight: '24px',
    color: theme.palette.mode === 'light' ? '#000000' : '#9696A5',
    padding: '2px 0',
    margin: '0',
    '& em': {
      color: 'yellow',
    },
  },
  link: {
    fontSize: '16px',
    lineHeight: '22px',
    color: '#12D6D6',
  },

}))(({ location, classes }) => (
  <Layout location={location}>
    <SearchContext.Consumer>
      {({ results, noOfHits, searchQuery }) => (
        searchQuery ? (
          <div className={classes.mainContainer}>
            <Typography variant='h1'>Search Results</Typography>
            <div className={classes.resultsCounter}>
              {noOfHits}
              {' '}
              results found for &quot;
              {searchQuery}
              &quot;
            </div>
            {(results.map((result) => (
              <div key={result.id} className={classes.resultItem}>
                <h2 className={classes.resultTitle}>{result.title}</h2>
                <p
                  className={classes.excerpt}
                  dangerouslySetInnerHTML={{ __html: result.highlighted }}
                />
                <Link to={result.slug} className={classes.link}>Read More</Link>
              </div>
            )))}
          </div>
        )
          : (
            <div className={classes.mainContainer}>
              <Typography variant='h3'>Type something in the search bar at the top</Typography>
            </div>
          )

      )}
    </SearchContext.Consumer>
  </Layout>
));

export default SearchResultsPage;
