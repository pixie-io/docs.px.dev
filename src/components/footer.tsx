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
import { makeStyles } from '@mui/styles';

import github from './images/github-icon.svg';

const useStyles = makeStyles(() => ({
  copyrightBar: {
    background: '#000000',
    color: '#596274',
    fontSize: '13px',
    lineHeight: '24px',
    padding: '18px',
    display: 'flex',
    justifyContent: 'space-between',
    '& img': {
      height: '13px',
      marginRight: '8px',
      position: 'relative',
      top: '1px',
    },
    '& a': {
      color: '#12D6D6',
      textDecoration: 'none',
    },
    '& @media(max - width: 1000px)': {
      fontSize: '14px',
    },
    '& $mutedLink': {
      paddingLeft: '12px',
      paddingRight: '12px',
      color: 'inherit',
    },
    '& div': {
      flex: 1,
    },
    '& $centerContent': {
      flexGrow: 3,
      textAlign: 'center',
    },
    '& $verticalCenter': {
      alignSelf: 'center',
    },
    '& $githubLink': {
      textAlign: 'right',
    },
  },
  verticalCenter: {},
  mutedLink: {},
  centerContent: {},
  githubLink: {},
}));

const Footer = () => {
  const classes = useStyles();
  return (
    <footer style={{ position: 'relative' }}>
      <div className={classes.copyrightBar}>
        <div className={classes.verticalCenter}>
          <a href='https://www.linuxfoundation.org/terms' className={classes.mutedLink}>Terms of Service</a>
          <span>
            |
          </span>
          <a href='https://www.linuxfoundation.org/privacy' className={classes.mutedLink}>Privacy Policy</a>
        </div>
        <div className={classes.centerContent}>
          Copyright © 2018- The Pixie Authors. All Rights Reserved. |
          Documentation distributed under CC BY 4.0.
          <br />
          The Linux Foundation has registered trademarks and uses trademarks.
          For a list of trademarks of The Linux Foundation, please see our
          {' '}
          <a href='https://www.linuxfoundation.org/trademark-usage'>Trademark Usage Page</a>
          .
          <br />
          Pixie was originally created and contributed by
          {' '}
          <a href='https://newrelic.com/' target='_blank' rel='noreferrer'>New Relic, Inc.</a>
        </div>
        <div className={`${classes.githubLink} ${classes.verticalCenter}`}>
          <a href='https://github.com/pixie-io/docs.px.dev' target='_blank' rel='noreferrer'>
            <img src={github} alt='github' />
            Edit on GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
