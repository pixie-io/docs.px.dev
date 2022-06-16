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

import withStyles from '@material-ui/core/styles/withStyles';
import { Box, Tooltip } from '@material-ui/core';
import Highlight, { defaultProps } from 'prism-react-renderer';
import * as React from 'react';
import vsLight from 'prism-react-renderer/themes/duotoneLight';
import vsDark from 'prism-react-renderer/themes/duotoneDark';
import { ThemeModeContext } from '../mainThemeProvider';
import copyBtn from '../../images/copy-btn.svg';

const LineNumber = withStyles((theme) => ({
  lineBlock: {
    display: 'inline-block',
    width: '20px',
    textAlign: 'right',
    paddingRight: '20px',
    color: theme.palette.type === 'light' ? '#ccc' : '#e0ebf7',
    fontFamily: '"Roboto Mono", Monospace',
    userSelect: 'none',
  },
}
))(({ lineNumber, classes }: any) => (<span className={classes.lineBlock}>{lineNumber}</span>));

const CodeRenderer = withStyles((theme) => ({
  code: {
    backgroundColor: theme.palette.type === 'light' ? '#f3f3f3' : '#292929',
    borderRadius: '5px',
    boxShadow: theme.palette.type === 'light' ? '0 2px 2px rgba(0,0,0, 0.15)' : '0px 4px 16px rgba(0, 0, 0, 0.15)',
    marginBottom: '32px',
    marginTop: '12px',
    position: 'relative',
    padding: '4px 0 4px 12px',
    maxWidth: '100%',
    '&:hover': {
      '& img': {
        display: 'inline-flex!important' as any,
      },
    },

  },
  noWrap: {
    whiteSpace: 'normal',
  },
  codeHighlight: {
    display: 'block',
    width: '100%',
    overflowX: 'auto',
    fontFamily: '"Roboto Mono", Monospace',

  },

  copyBtn: {
    display: 'none',
    position: 'absolute',
    top: '18px',
    transform: 'translateY(-50%)',
    right: '16px',
    cursor: 'pointer',
    height: '16px',
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },

}))((props: any) => {
  const {
    classes, code, wrap, lang,
  } = props;
  const optionsArr = props.className ? props.className.split(':') : [''];
  const options = {
    hasNumbers: optionsArr.some((o) => o === 'numbers' || o === 'language-numbers'),
    height: +((optionsArr.find((o) => o.startsWith('H') || o.startsWith('language-H')) || '').substring(1)),
  };
  const language = lang || (props.className ? (props.className.split(':')[0] || 'bash').replace('language-', '') : 'bash');
  return (
    <div className={classes.code}>
      <ThemeModeContext.Consumer>
        {({ theme }) => (
          <Box className={`${classes.codeHighlight} small-scroll`} style={{ height: options.height ? options.height : 'auto' }}>
            <Highlight
              {...defaultProps}
              code={code.trim()}
              language={language}
              theme={theme === 'light' ? vsLight : vsDark}
            >
              {({
                className, style, tokens, getLineProps, getTokenProps,
              }: any) => (
                <pre
                  className={`${className} ${wrap ? classes.noWrap : ''}`}
                  style={{ ...style, backgroundColor: 'transparent' }}
                >
                  {tokens.map((line, i) => (
                    <div {...getLineProps({ line, key: i })}>
                      {options.hasNumbers && <LineNumber lineNumber={i + 1} />}
                      {line.map((token, key) => (
                        <span {...getTokenProps({ token, key })} />
                      ))}
                    </div>
                  ))}
                </pre>
              )}
            </Highlight>
          </Box>
        )}
      </ThemeModeContext.Consumer>
      <Tooltip title='Copy to clipboard' aria-label='copy' placement='top'>
        <img src={copyBtn} alt='' className={classes.copyBtn} onClick={() => { navigator.clipboard.writeText(code); }} />
      </Tooltip>
    </div>
  );
});
export default CodeRenderer;
