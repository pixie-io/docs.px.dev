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

// eslint-disable-next-line import/no-extraneous-dependencies
const visit = require('unist-util-visit');

function getFullMeta(node) {
  if (node.lang && node.meta) {
    return node.lang + node.meta;
  }
  return node.lang || node.meta;
}

function getTabTitle(node) {
  const meta = getFullMeta(node);
  const match = (meta || '').match(/\{tabTitle:\s*([^}]+)\}/);
  return (match && match[1]) || '';
}

module.exports = ({ markdownAST }, { className = 'code-tabs-wrapper' }) => {
  let lastParent = null;
  let pendingCode = [];
  let toRemove = [];
  function flushPendingCode() {
    if (pendingCode.length === 0) {
      return;
    }

    const rootNode = pendingCode[0][0];
    const children = pendingCode.reduce(
      (arr, [node]) => arr.concat([
        {
          type: 'jsx',
          value: `<CodeRenderer language='${node.lang
          || ''}' title='${getTabTitle(node)}' >`,
        },
        { ...node },
        {
          type: 'jsx',
          value: '</CodeRenderer>',
        },
      ]),
      [],
    );

    rootNode.type = 'element';
    rootNode.data = {
      hName: 'div',
      hProperties: {
        className,
      },
    };
    rootNode.children = [
      {
        type: 'jsx',
        value: '<CodeTabs>',
      },
      ...children,
      {
        type: 'jsx',
        value: '</CodeTabs>',
      },
    ];

    toRemove = toRemove.concat(pendingCode.splice(1));
  }

  visit(
    markdownAST,
    () => true,
    (node, _index, parent) => {
      if (node.type !== 'code' || parent !== lastParent) {
        flushPendingCode();
        pendingCode = [];
        lastParent = parent;
      }
      if (node.type === 'code') {
        pendingCode.push([node, parent]);
      }
    },
  );

  flushPendingCode();

  toRemove.forEach(([node, parent]) => {
    // eslint-disable-next-line no-param-reassign
    parent.children = parent.children.filter((n) => n !== node);
  });

  return markdownAST;
};
