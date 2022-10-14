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
import Scrollspy from 'react-scrollspy';
import { makeStyles } from '@mui/styles';
import { darken, lighten } from '@mui/material';
import { idFromSlug } from 'components/utils';

const useStyles = makeStyles(theme => ({
  main: {
    marginTop: theme.spacing(4),
    marginLeft: theme.spacing(8),
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    position: 'fixed',
    top: '100px',
    borderLeft:
      theme.palette.mode === 'light'
        ? '1px solid #DBDDE0'
        : '1px solid #353738',
    width: '240px',
    textIndent: '-9px',
  },
  link: {
    color: theme.overrides.MuiTypography.body2.color,
    fontFamily: theme.typography.fontFamily,
    textDecoration: 'none',
    fontWeight: 'normal',
    fontSize: '14px',
    lineHeight: '18px',
    marginTop: '11px',
    marginBottom: '11px',
    marginLeft: '-1.5px',
    paddingLeft: theme.spacing(4),
    display: 'block',
    '&:hover, &.is-current': {
      color: theme.palette.secondary.main,
    },
    '&.is-current': {
      borderLeft: `3px solid ${theme.palette.secondary.main}`,
      paddingLeft: `calc(${theme.spacing(4)} - 3px)`,
    },
  },
  indent: {
    paddingLeft: theme.spacing(8),
    color:
      theme.palette.mode === 'light'
        ? lighten(theme.overrides.MuiTypography.body2.color, 0.4)
        : darken(theme.overrides.MuiTypography.body2.color, 0.4),
    '&.is-current': {
      paddingLeft: `calc(${theme.spacing(8)} - 3px)`,
    },
  },
}));

const RightSidebar = ({ tableOfContents }) => {
  const classes = useStyles();
  const [activeId, setActiveId] = React.useState(null);

  const onScrollUpdate = (e) => {
    if (e) {
      setActiveId(e.getAttribute('id'));
    }
  };
  const highLight = (id) => {
    setActiveId(id);
  };

  const toc = tableOfContents.map((item) => ({
    ...item,
    ref: idFromSlug(item.value, item.depth),
  }));
  return (
    <div className={classes.main}>
      <Scrollspy
        items={toc.map((item) => item.ref)}
        currentClassName='is-current-'
        componentTag='div'
        onUpdate={e => onScrollUpdate(e)}
      >
        {toc.map((item) => (
          <a
            key={item.value}
            href={`#${item.ref}`}
            className={`${classes.link} ${
              item.depth === 3 ? classes.indent : ''
            }  ${activeId === item.ref ? 'is-current' : ''}`}
            onClick={() => highLight(item.ref)}
          >
            {item.value}
          </a>
        ))}
      </Scrollspy>
    </div>
  );
};

export default RightSidebar;
