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

import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { makeStyles } from '@mui/styles';
import Button from '@mui/material/Button';

const useStyles = makeStyles(() => ({
  banner: {
    position: 'fixed',
    bottom: '0',
    left: '0',
    width: '100%',
    height: '60px',
    opacity: 0.9,
    backgroundColor: '#353535',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  innerText: {
    padding: '8px',
    fontSize: '14px',
    color: 'white',

  },
  link: {
    color: '#12d6d6',
    textDecoration: 'underline',
  },
  closeButton: {
    cursor: 'pointer',
    padding: '6px',
    fontWeight: 500,
    marginLeft: '8px',
    marginRight: '12px',
    paddingLeft: '8px',
    borderRadius: '4px',
    paddingRight: '8px',
    textTransform: 'none',
    letterSpacing: 'normal',
    border: '1px solid white',
  },
}));

const CookiesBanner = () => {
  const classes = useStyles();
  const isBrowser = typeof window !== 'undefined';
  const [consent, setConsent] = useState(isBrowser ? Cookies.get('consent') : null);
  const close = () => {
    Cookies.set('consent', true);
    setConsent(true);
  };
  return !consent ? (
    <div className={classes.banner}>
      <div className={classes.innerText}>
        This site uses cookies to provide you with a better user experience.
        By using Pixie, you consent to our&nbsp;
        <a className={classes.link} href='https://linuxfoundation.org/cookies/' target='_blank' rel='noopener noreferrer'>use of cookies</a>
        .
      </div>
      <Button
        type='button'
        className={classes.closeButton}
        onClick={() => close()}
        sx={{ border: '1px solid white' }}
      >
        Close
      </Button>
    </div>
  ) : null;
};
export default CookiesBanner;
