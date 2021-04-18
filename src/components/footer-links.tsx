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
import { makeStyles } from '@material-ui/core/styles';
// eslint-disable-next-line no-unused-vars
import { Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  linksRow: {
    margin: '28px auto',
    display: 'flex',
    justifyContent: 'center',
    padding: '0',
    color: theme.overrides.MuiTypography.body1.color,
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
      alignItems: 'center',
    },
    '& li':
      { listStyle: 'none', display: 'inline-block', marginBottom: '12px' },
    '& li:after':
      {
        content: '"|"',
        margin: '0 25px',
        color: 'inherit',
        [theme.breakpoints.down('md')]: {
          display: 'none',
        },
      },
    '& :last-child:after':
      { content: 'none' },
    '& a': {
      textDecoration: 'none',
      fontStyle: 'inherit',
      color: 'inherit',
    },
    '& a:hover': {
      color: theme.palette.secondary.main,
    },
  },
}));

const FooterLinks = () => {
  const classes = useStyles();

  return (
    <ul className={classes.linksRow}>
      <li>
        <a
          href='https://work.withpixie.ai/login'
        >
          SIGN IN
        </a>
      </li>
      <li>
        <a href='//pixielabs.ai/terms'>TERMS & PRIVACY</a>
      </li>
      <li>
        <a href='//pixielabs.ai/community'>COMMUNITY</a>
      </li>
      <li>
        <a href='//pixielabs.ai/careers'>CAREERS</a>
      </li>
      <li>
        <a href='https://blog.pixielabs.ai/' target='_blank' rel='noreferrer'>
          BLOG
        </a>
      </li>
      <li>
        <a href='//pixielabs.ai/contact'>CONTACT</a>
      </li>
    </ul>
  );
};

export default FooterLinks;
