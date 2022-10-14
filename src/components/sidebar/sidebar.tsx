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
import { useEffect } from 'react';

import { graphql, StaticQuery } from 'gatsby'; // import navigate from gatsby
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import withStyles from '@mui/styles/withStyles';
import { TreeView } from '@mui/lab';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { SidebarContext } from './sidebarProvider';
import CategoryItem from './categoryItem';

export const GET_ARTIFACTS = gql`
  query artifacts($artifactName: String!) {
    artifacts(artifactName: $artifactName) {
      items {
        version
      }
    }
  }
`;

const ExpandFirstLevelOnce = (props) => {
  const { firstRun, setFirstRun, setExpanded, edges } = props;
  useEffect(() => {
    if (firstRun) {
      setTimeout(() =>
        setExpanded(
          edges
            .filter((e) => e.node.fields && e.node.fields.level === 1)
            .map((e) => e.node.fields.id),
        ),
      );
      setFirstRun(false);
    }
  }, []);
  return null;
};
const Sidebar = withStyles((theme) => ({
  main: {
    backgroundColor: theme.palette.background.default,
    borderRight:
      theme.palette.mode === 'light'
        ? '1px solid #DBDDE0'
        : '1px solid #353738',
    minWidth: '260px',
    boxSizing: 'border-box',
    height: 'calc(100vh - 54px)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingTop: theme.spacing(8),
    overflow: 'auto',
  },
  toc: {
    marginBottom: '80px',
  },
  toggle: {
    color: theme.overrides.MuiTypography.body1.color,
    paddingLeft: '24px',
    paddingBottom: '20px',
    fontFamily: theme.typography.fontFamily,
    fontSize: '12px',
    lineHeight: '15px',
    cursor: 'pointer',
  },

  footer: {
    boxSizing: 'border-box',
    paddingBottom: '16px',
    display: 'flex',
    justifyContent: 'space-around',
    width: '100%',
    '& a': {
      textDecoration: 'none',
    },
  },
  link: {
    display: 'block',
    textDecoration: 'none',
    color: theme.overrides.MuiTypography.body1.color,
    fontSize: '14px',
    lineHeight: '18px',
  },
  version: {
    color: theme.overrides.MuiTypography.body1.color,
    fontSize: '14px',
    lineHeight: '18px',
  },
}))(({
  location,
  classes,
  artifactName,
  lang,
}: any) => {
  const { data } = useQuery(GET_ARTIFACTS, {
    variables: { artifactName },
  });

  const handleToggle = (
    event: React.ChangeEvent<{}>,
    nodeIds: string[],
    setExpanded,
  ) => {
    setExpanded(nodeIds);
  };

  const getAllIds = (edges) => {
    const allIds = [];
    const fields1 = edges.filter((e) => e.node.fields.title)
      .map((e) => e.node.fields)
      .filter((e) => e.level === 1);
    fields1.forEach((e) => allIds.push(e.id));
    return allIds;
  };

  const processCategories = (edges) => {
    const newedges = edges.filter((e) => e.node.fields?.title);
    const fields1 = newedges.map((e) => e.node.fields).filter((e) => e.level === 1);
    const fields2 = newedges.map((e) => e.node.fields).filter((e) => e.level === 2);
    const fields3 = newedges.map((e) => e.node.fields).filter((e) => e.level === 3);
    const fields4 = newedges.map((e) => e.node.fields).filter((e) => e.level === 4);
    return fields1.map((e) => ({
      title: e.title,
      slug: e.slug,
      id: e.id,
      level: 1,
      subCategories: fields2
        .filter((item) => item.slug.split('/')[1] === e.slug.split('/')[1])
        .map((subCat) => {
          const thirdLevelCategories = fields3.filter(
            (item) => item.slug.split('/')[2] === subCat.slug.split('/')[2],
          );
          return {
            ...subCat,
            ...{
              subCategories: thirdLevelCategories.map((sc) => ({
                ...sc,
                subCategories: fields4.filter(
                  (item) => item.slug.split('/')[3] === sc.slug.split('/')[3],
                ),
              })),
            },
          };
        }),
    }));
  };
  return (
    <StaticQuery
      query={graphql`
        query {
          allSitePage(sort: {fields: fields___slug}) {
            edges {
              node {
                fields {
                  slug
                  title
                  level
                  id
                  directory
                }
              }
            }
          }
          allMdx(
            sort: { fields: [frontmatter___order], order: ASC }
            filter: { frontmatter: { hidden: { ne: true } } }
          ) {
            edges {
              node {
                fields {
                  slug
                  title
                  level
                  lang
                  id
                  directory
                }
              }
            }
          }
        }
      `}
      render={({ allMdx, allSitePage }) => {
        const filteredMdxEdges = allMdx.edges.filter((n) => {
          if (lang !== 'en') {
            if (
              n.node.fields.lang === lang
              || !allMdx.edges
                .filter((nn) => nn.node.fields.lang === lang)
                .find((e) => e.node.fields.slug.includes(n.node.fields.slug))
            ) {
              return true;
            }
            return false;
          }
          return n.node.fields.lang === lang;
        });

        const allDocsForExpand = [...allMdx.edges, ...allSitePage.edges];
        const allDocs = [...filteredMdxEdges, ...allSitePage.edges];

        return (
          <SidebarContext.Consumer>
            {({
              expanded,
              setExpanded,
              selected,
              setSelected,
              firstRun,
              setFirstRun,
            }) => (
              <div className={classes.main} id='main-meu-scroll-container'>
                <ExpandFirstLevelOnce
                  setExpanded={setExpanded}
                  edges={allDocsForExpand}
                  firstRun={firstRun}
                  setFirstRun={setFirstRun}
                />
                <div className={classes.toc}>
                  {expanded.length ? (
                    <div
                      className={classes.toggle}
                      onClick={() => setExpanded([])}
                    >
                      COLLAPSE ALL
                    </div>
                  ) : (
                    <div
                      className={classes.toggle}
                      onClick={() => setExpanded(getAllIds(allDocs))}
                    >
                      EXPAND ALL
                    </div>
                  )}
                  <TreeView
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ChevronRightIcon />}
                    expanded={expanded}
                    selected={selected}
                    onNodeToggle={(e, nodeIDs) => handleToggle(e, nodeIDs, setExpanded)}
                  >
                    <CategoryItem
                      location={location}
                      expanded={expanded}
                      category={{
                        title: 'Home',
                        slug: '/',
                        subCategories: [],
                        level: 1,
                      }}
                    />
                    {processCategories(allDocs).map((category) => (
                      <CategoryItem
                        setExpanded={setExpanded}
                        setSelected={setSelected}
                        expanded={expanded}
                        key={category.id}
                        location={location}
                        category={category}
                      />
                    ))}
                  </TreeView>
                </div>
                <div className={classes.footer}>
                  <a
                    href='https://px.dev/'
                    target='_blank'
                    rel='noopener noreferrer'
                    className={classes.link}
                  >
                    Website
                  </a>
                  <a
                    href='https://slackin.px.dev'
                    target='_blank'
                    rel='noopener noreferrer'
                    className={classes.link}
                  >
                    Slack Us
                  </a>
                  <div className={classes.version}>
                    Ver.&nbsp;
                    {data && data.artifacts.items
                      ? data.artifacts.items[0].version
                      : 'n/a'}
                  </div>
                </div>
              </div>
            )}
          </SidebarContext.Consumer>
        );
      }}
    />
  );
});
export default Sidebar;
