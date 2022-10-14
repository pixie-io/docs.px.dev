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
import withStyles from '@mui/styles/withStyles';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Command = withStyles((theme) => ({
  input: {
    backgroundColor: theme.palette.mode === 'light' ? '#212324' : '#292929',
    borderRadius: '5px',
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.15)',
    marginBottom: '16px',
    marginTop: '12px',
    position: 'relative',

    maxWidth: '100%',
  },
  pre: {
    maxWidth: '100px',
  },
  output: {
    fontSize: '16px',
  },
  padding: {
    padding: '4px 55px 4px 12px',
  },

  expandTitle: {
    fontStyle: 'normal',
    fontSize: '10px',
    lineHeight: '21px',
    color: '#FFFFFF',
    background: '#353535',
    height: '20px',
    paddingLeft: '16px',
  },
  expandBtn: {
    position: 'absolute',
    top: 14,
    right: 10,
    color: 'white',
    cursor: 'pointer',
  },
}))(({
  children, classes, input, language = 'javascript',
}: any) => {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div className={`${classes.input} `}>
      <div className={classes.padding}>
        <div className='small-scroll'>
          <Highlight
            {...defaultProps}
            code={input.trim()}
            language={language}
          >
            {({
              className, style, tokens, getLineProps, getTokenProps,
            }: any) => (
              <pre
                className={`${className} ${classes.pre}`}
                style={{ ...style, backgroundColor: 'transparent' }}
              >
                {tokens.map((line, i) => (
                  <div {...getLineProps({ line, key: i })}>
                    {line.map((token, key) => (
                      <span {...getTokenProps({ token, key })} />
                    ))}
                  </div>
                ))}
              </pre>
            )}
          </Highlight>
        </div>
      </div>
      {!expanded && (
      <ChevronRightIcon
        className={classes.expandBtn}
        onClick={() => { setExpanded(true); }}
      />
      )}
      {expanded && (
        <>
          <ExpandMoreIcon className={classes.expandBtn} onClick={() => { setExpanded(false); }} />
          <div className={classes.expandTitle}>Sample Output</div>

          <div className='small-scroll'>
            <div className={classes.padding}>
              {children.split('/n').map((l) => (
                <Highlight
                  key={l}
                  {...defaultProps}
                  code={l.trim()}
                  language={language}
                >
                  {({
                    className, style, tokens, getLineProps, getTokenProps,
                  }: any) => (
                    <pre
                      className={`${className} ${classes.pre} ${classes.output}`}
                      style={{ ...style, backgroundColor: 'transparent' }}
                    >
                      {tokens.map((line, i) => (
                        <div {...getLineProps({ line, key: i })}>
                          {line.map((token, key) => (
                            <span {...getTokenProps({ token, key })} />
                          ))}
                        </div>
                      ))}
                    </pre>
                  )}
                </Highlight>
              ))}
            </div>
          </div>
        </>
      )}
    </div>

  );
});

export default Command;
