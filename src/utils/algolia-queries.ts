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

const mdxQuery = `
{

documentation: allSitePage(filter: {fields: {slug: {regex: "^pxl/"}}}) {
    edges {
      node {
        fields {
          slug
          title
          level
        }
        context {
          description
        }
      }
    }
  }

     allMdx {
      edges {
        node {
          mdxAST
          fields {
            title
            slug
          }
        }
      }
    }
    mainCategories:
     allMdx(filter: {fields: {level: {eq: 1}}}) {
    edges {
      node {
        fields {
          title
          slug
          level
          sorting_field
        }
      }
    }
   }
}
`;

const parseMdx = (data) => {
  const { mainCategories, documentation } = data;
  const items = [];
  const { allMdx: edges } = data;
  const pathTree = {
    0: '',
    1: '',
    2: '',
    3: '',
    4: '',
    5: '',
    6: '',
  };
  let slug = '';
  const clearLowerPath = (minLevel) => {
    for (let i = minLevel; i <= 6; i += 1) {
      pathTree[i] = '';
    }
  };
  const getMainCategoryFromSlug = (s) => {
    const segments = s.split('/')
      .filter(Boolean);
    const m = mainCategories.edges.find((c) => c.node.fields.slug === `/${segments[0]}`);
    return m ? m.node.fields.title : '';
  };
  const buildPath = (item) => {
    if (item.type === 'heading') {
      clearLowerPath(item.depth);
      pathTree[item.depth] = item.value;
    }
    return {
      ...item,
      path: { ...pathTree },
      mainCategory: getMainCategoryFromSlug(slug),
      slug,
    };
  };
  const buildIndex = (node) => `${node.position.start.line}-${node.position.start.column}-${node.position.start.offset}-${node.position.end.line}-${node.position.end.column}-${node.position.end.offset}`;

  const parseChildren = (node) => {
    (node.children || []).forEach((n) => {
      let { value } = n;
      if (n.type === 'heading') {
        value = n.children[0].value;
      }
      const item = buildPath({
        type: n.type,
        value,
        depth: n.depth || 0,
        id: buildIndex(n),
      });

      if (value && n.type !== 'export') {
        items.push(item);
      }

      if (n.children && n.type !== 'heading') {
        parseChildren(n);
      }
    });
  };

  edges.edges.forEach((page) => {
    clearLowerPath(0);
    pathTree[0] = page.node.fields.title;

    slug = page.node.fields.slug;
    const item = buildPath({
      type: page.node.mdxAST.type,
      value: page.node.fields.title,
      depth: 0,
      id: buildIndex(page.node.mdxAST),
    });
    items.push(item);
    parseChildren(page.node.mdxAST);
  });
  documentation.edges.forEach((page) => {
    clearLowerPath(0);
    pathTree[page.node.fields.level] = page.node.fields.title;

    slug = page.node.fields.slug;
    const item = buildPath({
      type: page.node.fields.level === 2 ? 'heading' : 'text',
      value: `${page.node.fields.title} ${page.node.context.description}`,
      depth: page.node.fields.level,
      id: page.node.id,
    });
    items.push(item);
  });

  return items;
};
const queries = [
  {
    query: mdxQuery,
    transformer: ({ data }) => parseMdx(data),
  },
];

module.exports.parseMdx = parseMdx;
module.exports.queries = queries;
