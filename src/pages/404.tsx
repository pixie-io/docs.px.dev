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
import { graphql, Link } from 'gatsby';
import { withStyles } from '@mui/styles';
import { Layout } from 'components';
import SEO from 'components/seo';
import img404 from '../images/404.svg';

const NotFoundPage = withStyles((theme) => ({
  pageContainer: {
    backgroundColor: theme.palette.mode === 'light' ? theme.palette.background.default : '#212324',
    textAlign: 'center',
    paddingTop: '100px',
    color: theme.overrides.MuiTypography.body1.color,
    '& a': {
      textDecoration: 'none',
      fontStyle: 'inherit',
      color: '#3FE7E7',
    },
    '& a:hover': {
      color: theme.palette.secondary.main,
    },
  },
  img: {
    maxWidth: '80%',
    paddingBottom: '50px',
  },

}))(({ location, classes }: any) => (
  <Layout location={location}>
    <SEO title='404: Not found' />
    <section className={classes.pageContainer}>
      <img src={img404} alt='' className={classes.img} />
      <p>
        Oops! Looks like you are lost in space.
        <br />
        Let&apos;s head back&nbsp;
        <Link to='/'>home.</Link>
      </p>
    </section>
  </Layout>
));
export default NotFoundPage;

export const pageQuery = graphql`
    query {
        site {
            siteMetadata {
                title
            }
        }
    }
`;
