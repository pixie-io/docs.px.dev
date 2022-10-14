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
import Highlight, { defaultProps } from 'prism-react-renderer';
import prismTheme from 'prism-react-renderer/themes/dracula';
import {
  LiveProvider, LiveEditor, LiveError, LivePreview,
} from 'react-live';

import { CSSProperties } from '@mui/styles';
import Pre from 'components/mdxComponents/pre';

/** Removes the last token from a code example if it's empty. */
function cleanTokens(tokens) {
  const tokensLength = tokens.length;
  if (tokensLength === 0) {
    return tokens;
  }
  const lastToken = tokens[tokensLength - 1];
  if (lastToken.length === 1 && lastToken[0].empty) {
    return tokens.slice(0, tokensLength - 1);
  }
  return tokens;
}

/* eslint-disable react/jsx-key */
const CodeBlock = ({ children: exampleCode, ...props }) => {
  // eslint-disable-next-line
  if (props['react-live']) {
    return (
      <LiveProvider code={exampleCode}>
        <LiveEditor />
        <LiveError />
        <LivePreview />
      </LiveProvider>
    );
  }
  return (
    <Highlight
      {...defaultProps}
      code={exampleCode}
      language='javascript'
      theme={prismTheme}
    >
      {({
        className, style, tokens, getLineProps, getTokenProps,
      }) => (
        <Pre className={className} style={style} p={3}>
          {cleanTokens(tokens).map((line, i) => {
            let lineClass = {};
            let isDiff = false;
            if (
              line[0]
              && line[0].content.length
              && line[0].content[0] === '+'
            ) {
              lineClass = { backgroundColor: 'rgba(76, 175, 80, 0.2)' };
              isDiff = true;
            } else if (
              line[0]
              && line[0].content.length
              && line[0].content[0] === '-'
            ) {
              lineClass = { backgroundColor: 'rgba(244, 67, 54, 0.2)' };
              isDiff = true;
            } else if (
              line[0]
              && line[0].content === ''
              && line[1]
              && line[1].content === '+'
            ) {
              lineClass = { backgroundColor: 'rgba(76, 175, 80, 0.2)' };
              isDiff = true;
            } else if (
              line[0]
              && line[0].content === ''
              && line[1]
              && line[1].content === '-'
            ) {
              lineClass = { backgroundColor: 'rgba(244, 67, 54, 0.2)' };
              isDiff = true;
            }
            const lineProps = getLineProps({ line, key: i });
            lineProps.style = lineClass;
            const diffStyle: CSSProperties = {
              userSelect: 'none',
              '-moz-user-select': '-moz-none',
            };
            let splitToken;
            return (
              <div {...lineProps}>
                {line.map((token, key) => {
                  if (isDiff) {
                    if (
                      (key === 0 || key === 1)
                      && (token.content.charAt(0) === '+'
                        || token.content.charAt(0) === '-')
                    ) {
                      if (token.content.length > 1) {
                        splitToken = {
                          types: ['template-string', 'string'],
                          content: token.content.slice(1),
                        };
                        const firstChar = {
                          types: ['operator'],
                          content: token.content.charAt(0),
                        };
                        return (
                          <>
                            <span
                              {...getTokenProps({ token: firstChar, key })}
                              style={diffStyle}
                            />
                            <span
                              {...getTokenProps({ token: splitToken, key })}
                            />
                          </>
                        );
                      }
                      return (
                        <span
                          {...getTokenProps({ token, key })}
                          style={diffStyle}
                        />
                      );
                    }
                  }
                  return <span {...getTokenProps({ token, key })} />;
                })}
              </div>
            );
          })}
        </Pre>
      )}
    </Highlight>
  );
};

export default CodeBlock;
