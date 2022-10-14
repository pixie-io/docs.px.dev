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
import withStyles from '@mui/styles/withStyles';

const Note = withStyles(() => ({
  note: {
    color: 'black',
    boxShadow: '-5px 5px 20px rgba(0, 0, 0, 0.2)',
    borderRadius: '4px',
    padding: '34px 16px',
    margin: '16px 0',
    '& > *': {
      color: 'black',
    },
  },
  title: {
    fontSize: '22px',
    lineHeight: '26px',
    paddingBottom: '16px',
  },
  purple: {
    background: 'linear-gradient(0deg, #D7AEFB, #D7AEFB), linear-gradient(0deg, #E8EAED, #E8EAED), linear-gradient(0deg, #CBF0F8, #CBF0F8), #FFE8A5',
  },
  blue: {
    background: 'linear-gradient(0deg, #CBF0F8, #CBF0F8), #FFE8A5',
  },
  yellow: {
    background: '#FFE8A5',
  },
  red: {
    background: 'rgb(236,101,140)',
  },
  gray: {
    background: 'linear-gradient(0deg, #E8EAED, #E8EAED), linear-gradient(0deg, #CBF0F8, #CBF0F8), #FFE8A5',
  },

}))(({
  children,
  classes,
  title,
  color = 'purple',
}) => {
  const getColorClass = () => {
    switch (color) {
      case 'purple': {
        return classes.purple;
      }
      case 'blue': {
        return classes.blue;
      }
      case 'yellow': {
        return classes.yellow;
      }
      case 'red': {
        return classes.red;
      }
      case 'gray': {
        return classes.gray;
      }
      default: {
        return classes.purple;
      }
    }
  };
  return (
    <div className={`${classes.note} ${getColorClass()}`}>
      <div className={classes.title}>{title}</div>
      {children}
    </div>
  );
});

export default Note;
