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
import { Theme } from '@material-ui/core';
import { MDXProvider } from '@mdx-js/react';
import { makeStyles } from '@material-ui/core/styles';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import SEO from 'components/seo';
import { Layout } from 'components';
import RightSidebar from '../components/rightSidebar';
import NextPrevious from '../components/NextPrevious';
import mdxComponents from '../components/mdxComponents';
import Footer from '../components/footer';
import HLink from '../components/mdxComponents/h-link';

const useStyles = makeStyles((theme: Theme) => ({
  mainContainer: {
    margin: '0 auto',
    padding: '16px',
    paddingLeft: '32px',
    maxWidth: '1280px',
  },
  mainRenderer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: 'calc(100vh - 70px)',
    justifyContent: 'space-between',
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
  fullWidth: {
    width: '100%',
  },
  allowToc: {
    width: 'calc(100% - 332px)',
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
  rightAside: {
    float: 'right',
    width: '300px',
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
}));

const MDXDocsRender = ((props: any) => {
  const classes = useStyles();
  const {
    data,
    pageContext,
  } = props;
  // eslint-disable-next-line react/destructuring-assignment
  const { availableClouds, availableLanguages, lang } = pageContext;
  const {
    allMdx,
    mdx,
  } = data;
  const nav = allMdx.edges.map((edge) => ({
    title: edge.node.fields.title,
    url: edge.node.fields.slug,
  }));
  // meta tags

  const tableOfContents = (mdx.headings || []).filter((x) => (x.depth > 1 && x.depth <= 3));
  const needToc = tableOfContents.length > 0;

  return (
    <Layout
      {...props}
      lang={lang}
      globalUrlTree={pageContext.globalUrlTree}
      availableLanguages={availableLanguages}
      availableClouds={availableClouds}
    >
      <SEO
        title={mdx.frontmatter.metaTitle}
        description={mdx.frontmatter.metaDescription}
      />
      <MDXProvider components={mdxComponents}>
        <div className={classes.mainContainer}>
          <div
            className={`${needToc ? classes.allowToc : classes.fullWidth} ${classes.mainRenderer} DocSearch-content`}
          >
            <div>
              <HLink id='title' variant='h1'>
                {mdx.fields.title}
              </HLink>
              <MDXRenderer>{mdx.body}</MDXRenderer>
              <NextPrevious mdx={mdx} nav={nav} />
            </div>
          </div>
          {needToc && (
            <div className={classes.rightAside}>
              <RightSidebar tableOfContents={tableOfContents} />
            </div>
          )}
        </div>
        <Footer />
      </MDXProvider>
    </Layout>
  );
});

export default MDXDocsRender;
export const pageQuery = graphql`
    query($id: String!) {
        site {
            siteMetadata {
                title
                docsLocation
            }
        }
        mdx(fields: { id: { eq: $id } }) {
            fields {
                id
                title
                slug
            }
            body
            parent {
                ... on File {
                    relativePath
                }
            }
            frontmatter {
                metaTitle
                metaDescription
            }
            headings {
                value
                depth
            }
        }
        allMdx(sort: {fields: [fields___sorting_field], order: ASC}, filter: {wordCount: {words: {gt: 0}}}) {
            edges {
                node {
                    fields {
                        slug
                        title
                        level
                        id
                        lang
                    }
                }
            }
        }
    }

`;
