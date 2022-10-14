/* eslint-disable import/extensions */
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

const path = require('path');
const groupBy = require('lodash.groupby');

const startCase = require('lodash.startcase');
const utils = require('./src/functionPageUrl.ts');
const jsonDocumentation = require('./external/pxl_documentation.json');
const tableDocumentation = require('./external/datatable_documentation.json');

const globalUrlTree = [];
const languages = require('./available-languages');

const removeLanguageFromUrl = (url) => {
  const slugTree = url.split('/')
    .filter((n) => n);
  if (languages.some((l) => l.id === slugTree[0])) {
    slugTree.shift();
  }
  return slugTree.join('/');
};

exports.createPages = ({
  graphql,
  actions,
}) => {
  const { createPage } = actions;
  return new Promise((resolve, reject) => {
    resolve(
      graphql(
        `
          {
            site {
              pathPrefix
            }
            allMdx {
              edges {
                node {
                  fields {
                    id
                    lang
                  }
                  tableOfContents
                  fields {
                    slug
                  }
                }
              }
            }
          }
        `,
      )
        .then((result) => {
          if (result.errors) {
            console.log(result.errors); // eslint-disable-line no-console
            reject(result.errors);
          }
          // Create blog posts pages.
          result.data.allMdx.edges.forEach(({ node }) => {
            const { lang } = node.fields;
            const baseUrlWithoutLanguage = removeLanguageFromUrl(node.fields.slug);

            const langPrefix = lang === 'en' ? '' : `/${lang}`;

            const templatePath = node.fields.slug
              ? `${result.data.site.pathPrefix}${langPrefix}/${baseUrlWithoutLanguage}`
              : result.data.site.pathPrefix;
            const availableLanguages = [];

            languages
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              .forEach((_) => {
                globalUrlTree.forEach((t) => {
                  if (removeLanguageFromUrl(t.slug) === baseUrlWithoutLanguage) {
                    availableLanguages.push({
                      slug: t.slug,
                      lang: t.lang,
                    });
                  }
                });
              });

            createPage({
              path: templatePath,
              component: path.resolve('./src/templates/docs.tsx'),
              context: {
                id: node.fields.id,
                lang,
                languages,
                globalUrlTree,
                availableLanguages,
              },
            });
          });
          const pxlObjectDocsPages = (
            qlobjectDocs,
            catPath,
            title,
            description,
          ) => {
            qlobjectDocs.sort((docA, docB) => {
              if (docA.body.name < docB.body.name) {
                return -1;
              }
              if (docA.body.name > docB.body.name) {
                return 1;
              }
              return 0;
            });
            // Create the individual pages.
            qlobjectDocs.forEach((doc) => createPage({
              path: utils.functionPageUrl('/reference/pxl', catPath, doc.body.name),
              component: path.resolve('./src/templates/mutationDocs.tsx'),
              context: {
                data: JSON.stringify(doc),
                title: doc.body.name,
              },
            }));
            // Create index page.
            createPage({
              path: utils.functionPageUrl('/reference/pxl', catPath, ''),
              component: path.resolve('./src/templates/pxlObjectIndex.tsx'),
              context: {
                data: JSON.stringify(qlobjectDocs),
                pagePath: utils.functionPageUrl('/reference/pxl', catPath, ''),
                title,
                description,
              },
            });
          };
          pxlObjectDocsPages(
            jsonDocumentation.mutationDocs,
            'mutation',
            'Tracepoint Management',
            'Functions that manage the lifetime of a Tracepoint.',
          );
          pxlObjectDocsPages(
            jsonDocumentation.tracepointDecoratorDocs,
            'tracepoint-decorator',
            'Tracepoint Decorators',
            `The Decorator functions to wrap around a tracepoint function.
            When defining the body of the tracepoint, see Tracepoint Fields.`,
          );
          pxlObjectDocsPages(
            jsonDocumentation.tracepointFieldDocs,
            'tracepoint-field',
            'Tracepoint Fields',
            `Field accessors to use while writing a tracepoint. Must be written
            in a function wrapped by a Tracepoint Decorator.`,
          );
          pxlObjectDocsPages(
            jsonDocumentation.compileFnDocs,
            'compiler-fns',
            'Compile Time Functions',
            `Functions that are evaluated and usable at run time. Unlike [Execution Time Functions](/reference/pxl/udf), these are usable at compile-time
            meaning you can pass them as parameters to [Operators](/reference/pxl/operators) as well as [ExecTime functions](/reference/pxl/udf).`,
          );
          pxlObjectDocsPages(
            jsonDocumentation.dataframeOpDocs,
            'operators',
            'DataFrame',
            'The methods you can apply to DataFrames',
          );
          pxlObjectDocsPages(
            jsonDocumentation.otelDocs,
            'otel-export',
            'OpenTelemetry Export',
            'The methods to interact with Pixie\'s OpenTelemetry exporter',
          );

          const { udfDocs } = jsonDocumentation;
          udfDocs.udf.sort((docA, docB) => {
            if (docA.name < docB.name) {
              return -1;
            }
            if (docA.name > docB.name) {
              return 1;
            }
            return 0;
          });

          // create udfDocs index Pages
          createPage({
            path: utils.functionPageUrl('/reference/pxl', 'udf', ''),
            component: path.resolve('./src/templates/udfDocsIndex.tsx'),
            context: {
              data: JSON.stringify(udfDocs),
              title: 'Execution Time Functions',
              pagePath: utils.functionPageUrl('/reference/pxl', 'tracepoint-field', ''),
            },
          });
          // create udfDocs Pages
          Object.values(
            groupBy(jsonDocumentation.udfDocs.udf, (x) => x.name),
          )
            .forEach((functions) => {
              createPage({
                path: utils.functionPageUrl('/reference/pxl', 'udf', functions[0].name),
                component: path.resolve('./src/templates/udfDocs.tsx'),
                context: {
                  data: JSON.stringify(functions),
                  // TODO(philkuz/zasgar)  figure out better solution than just prepending here.
                  title:

                    `px.${functions[0].name}`

                  ,
                },
              });
            });
          // create pyApiDocs Pages
          createPage({
            path: '/reference/api/py',
            component: path.resolve('./src/templates/pyDocsIndex.tsx'),
            context: {
              data: JSON.stringify(jsonDocumentation.pyApiDocs),
              title: 'Python',
              pagePath: '/reference/api/py',
            },
          });
          // create datatableDocs index Page
          createPage({
            path: '/reference/datatables',
            component: path.resolve('./src/templates/datatableDocsIndex.tsx'),
            context: {
              data: JSON.stringify(tableDocumentation.datatableDocs),
              title: 'Data Tables',
              pagePath: '/reference/datatables',
            },
          });
          // create datatableDocs Pages
          Object.values(
            groupBy(tableDocumentation.datatableDocs, (x) => x.name),
          )
            .forEach((table) => {
              createPage({
                path: utils.functionPageUrl('/reference', 'datatables', table[0].name),
                component: path.resolve('./src/templates/datatableDocs.tsx'),
                context: {
                  data: JSON.stringify(table),
                  title: table[0].name,
                },
              });
            });
        }),
    );
  });
};
exports.onCreateWebpackConfig = ({ actions, plugins }) => {
  actions.setWebpackConfig({
    resolve: {
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
      alias: { $components: path.resolve(__dirname, 'src/components') },
      fallback: { 
        fs: false,
        path: require.resolve('path-browserify'),
        process: require.resolve('process/browser'),
        buffer: require.resolve('buffer'),
      },
    },
    plugins: [
      plugins.provide({
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer'],
      }),
    ],
  });
};

exports.onCreateBabelConfig = ({ actions }) => {
  actions.setBabelPlugin({
    name: '@babel/plugin-proposal-export-default-from',
  });
};

exports.onCreateNode = ({
  node,
  getNode,
  actions,
}) => {
  const { createNodeField } = actions;

  if (node.internal.type === 'Mdx') {
    const parent = getNode(node.parent);
    const treePath = parent.relativePath.replace(parent.ext, '')
      .split('/');

    const lang = treePath[0].toLowerCase();

    if (lang === 'en') {
      treePath.shift();
    }

    const level = treePath.filter((l) => l !== 'index' && !languages.some((ll) => ll.id === l)).length;

    const title = node.frontmatter.title || startCase(parent.name);
    const slug = treePath
      .filter((l) => l !== 'index')
      .map((l) => (!Number.isNaN(Number.parseInt(l.substr(0, 2), 10))
        ? l.substr(3, l.length - 1)
        : l))
      .join('/');

    const sortingField = treePath
      .map((s) => (s === 'index' ? '00-index' : s))
      .join('/');

    globalUrlTree.push({
      lang,
      slug: `/${slug}`,
    });

    createNodeField({
      name: 'slug',
      node,
      value: `/${slug}`,
    });

    createNodeField({
      name: 'id',
      node,
      value: node.id,
    });
    createNodeField({
      name: 'lang',
      node,
      value: lang,
    });

    createNodeField({
      name: 'title',
      node,
      value: title,
    });
    createNodeField({
      name: 'level',
      node,
      value: level,
    });
    createNodeField({
      name: 'sorting_field',
      node,
      value: sortingField,
    });
    createNodeField({
      name: 'featuredInstall',
      node,
      value: node.frontmatter.featuredInstall || false,
    });
    createNodeField({
      name: 'featuredGuide',
      node,
      value: node.frontmatter.featuredGuide || false,
    });
    createNodeField({
      name: 'icon',
      node,
      value: node.frontmatter.icon || null,
    });
    createNodeField({
      name: 'description',
      node,
      value: node.frontmatter.metaDescription,
    });
    createNodeField({
      name: 'directory',
      node,
      value: !!node.frontmatter.directory,
    });
  } else if (node.internal.type === 'SitePage' && (node.path.match('/reference/pxl/.*') || node.path.match('/reference/api/.*') || node.path.match('/reference/datatables') || node.path.match('/reference/datatables/.*'))) {
    const treePath = node.path.split('/');
    const level = treePath.length - 2;
    createNodeField({
      name: 'slug',
      node,
      value: node.path,
    });

    createNodeField({
      name: 'id',
      node,
      value: node.id,
    });

    createNodeField({
      name: 'title',
      node,
      value: node.context.title,
    });
    createNodeField({
      name: 'level',
      node,
      value: level,
    });
    // Set to false always to match the above, not completely sure why we need this.
    createNodeField({
      name: 'directory',
      node,
      value: false,
    });
  } else if (node.internal.type === 'SitePage' && (node.path.match('/reference/datatables/.*'))) {
    const treePath = node.path.split('/');
    const level = treePath.length - 3;
    createNodeField({
      name: 'slug',
      node,
      value: node.path,
    });

    createNodeField({
      name: 'id',
      node,
      value: node.id,
    });

    createNodeField({
      name: 'title',
      node,
      value: node.context.title,
    });
    createNodeField({
      name: 'level',
      node,
      value: level,
    });
    // Set to false always to match the above, not completely sure why we need this.
    createNodeField({
      name: 'directory',
      node,
      value: false,
    });
  }
};
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = `
  type Mdx implements Node {
    frontmatter: MdxFrontmatter
  }
  type MdxFrontmatter @infer {
    hidden: Boolean
  }
  type SitePage implements Node {
    fields: SitePageFields
    context: SitePageContext
  }
  type SitePageFields {
    slug: String
    id: String
    title: String
    level: Int
    directory: Boolean
  }
  type SitePageContext {
    description: String
  }
  `;
  createTypes(typeDefs);
};
