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

import React from 'react';

import { withStyles } from '@mui/styles';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import Link from 'components/link';
import { urlFromSlug } from 'components/utils';
import nextBtn from '../images/btn-next-icon.svg';
import prevBtn from '../images/btn-prev-icon.svg';

const NextPrevButton = styled(Button)(({ theme }) => ({
  height: '62px',
  fontSize: '16px',
  lineHeight: '20px',
  minWidth: '230px',
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '24px',
  borderColor: theme.palette.mode === 'light' ? '#DBDDE0' : '#353738',
  color: theme.palette.primary.main,
}));

const NextPrevious = withStyles((theme) => ({
  main: {
    paddingTop: theme.spacing(14),
    paddingBottom: theme.spacing(14),
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      alignItems: 'center',
    },
    '& a': {
      textDecoration: 'none',
    },
  },
}))(({ mdx, nav, classes }: any) => {
  // need refactor (CP)
  let currentIndex;
  nav.forEach((el, index) => {
    if (el.url === mdx.fields.slug) {
      currentIndex = index;
    }
  });
  const nextInfo = { url: null, title: null };
  const previousInfo = { url: null, title: null };
  if (currentIndex === undefined) {
    // index
    nextInfo.url = nav[0].url;
    nextInfo.title = nav[0].title;
    previousInfo.url = null;
    previousInfo.title = null;
    currentIndex = -1;
  } else if (currentIndex === 0) {
    // first page
    nextInfo.url = nav[currentIndex + 1] ? nav[currentIndex + 1].url : null;
    nextInfo.title = nav[currentIndex + 1]
      ? nav[currentIndex + 1].title
      : null;
    previousInfo.url = null;
    previousInfo.title = null;
  } else if (currentIndex === nav.length - 1) {
    // last page
    nextInfo.url = null;
    nextInfo.title = null;
    previousInfo.url = nav[currentIndex - 1]
      ? nav[currentIndex - 1].url
      : null;
    previousInfo.title = nav[currentIndex - 1]
      ? nav[currentIndex - 1].title
      : null;
  } else if (currentIndex) {
    // any other page
    nextInfo.url = nav[currentIndex + 1].url;
    nextInfo.title = nav[currentIndex + 1].title;
    previousInfo.url = nav[currentIndex - 1].url;
    previousInfo.title = nav[currentIndex - 1].title;
  }
  return (
    <div className={classes.main}>
      {previousInfo.url && currentIndex >= 0 ? (
        <Link to={urlFromSlug(nav[currentIndex - 1].url)}>
          <NextPrevButton
            color='secondary'
            variant='outlined'
            startIcon={<img src={prevBtn} alt='previous' className='btn-horizontal-icon' />}
          >
            {nav[currentIndex - 1].title}
          </NextPrevButton>

        </Link>
      ) : null}
      {nextInfo.url && currentIndex >= 0 ? (
        <Link to={urlFromSlug(nav[currentIndex + 1].url)}>
          <NextPrevButton
            color='secondary'
            variant='outlined'
            endIcon={<img src={nextBtn} alt='next' className='btn-horizontal-icon' />}
          >
            {nav[currentIndex + 1] && nav[currentIndex + 1].title}
          </NextPrevButton>
        </Link>
      ) : null}
    </div>
  );
});

export default NextPrevious;
