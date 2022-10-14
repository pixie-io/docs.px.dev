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
import { WithStyles, withStyles, createStyles } from '@mui/styles';

const styles = (theme) => createStyles({
  code: {
    fontFamily: '"Roboto Mono", Monospace',
    color: theme.palette.mode === 'light' ? '#c7254e' : '#E0EBF7',
    borderWidth: '0.5px',
    borderStyle: 'solid',
    borderRadius: '4px',
    padding: '2.72px 5.44px',
    margin: 0,
    fontSize: '85%',
    backgroundColor: theme.palette.mode === 'light' ? '#f9f7fb' : '#292929',
    borderColor: theme.palette.mode === 'light' ? '#ede7f3' : '#171717',
  },
});

const Code: React.FC<WithStyles<typeof styles>> = ({ children, classes }) => (
  <code className={classes.code}>{children}</code>
);

export default withStyles(styles)(Code);
