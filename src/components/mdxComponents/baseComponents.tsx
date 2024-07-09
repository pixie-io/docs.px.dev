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
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Alert } from '@material-ui/lab';
import Code from 'components/mdxComponents/code';
import Note from 'components/mdxComponents/note';
import Pre from 'components/mdxComponents/pre';
import { idFromSlug } from 'components/utils';
import AnchorTag from './anchor';
import CodeRenderer from './codeRenderer';
import ListItem from './listItem';
import HLink from './h-link';
import CloudLink from './cloud-link';
import PoiTooltip from '../poi-tooltip/poi-tooltip';

const getChildren = (props) => props.children;
const getLanguage = (props) => (props.className ? props.className.replace('language-', '') : 'bash');

export default {
  // There is a bug in material plugin that overwrites the H1 with the default typography,
  // so this cannot be set here. The default mui h1 has been updated to match
  // the design and overwritten on homepage (only 1 implementation).
  // The problem seems to occur only on the H1 (to be investigated).
  h1: (props: any) => (
    <HLink id={idFromSlug(getChildren(props), 1)} variant='h1' />
  ),
  h2: (props: any) => {
    const { children } = props;
    return <HLink id={idFromSlug(getChildren(props), 2)} variant='h2'>{children}</HLink>;
  },
  h3: (props: any) => {
    const { children } = props;
    return <HLink id={idFromSlug(getChildren(props), 3)} variant='h3'>{children}</HLink>;
  },
  h4: (props: any) => {
    const { children } = props;
    return <HLink id={idFromSlug(getChildren(props), 4)} variant='h4'>{children}</HLink>;
  },
  h5: (props: any) => {
    const { children } = props;
    return <HLink id={idFromSlug(getChildren(props), 5)} variant='h5'>{children}</HLink>;
  },
  h6: (props: any) => {
    const { children } = props;
    return <HLink id={idFromSlug(getChildren(props), 6)} variant='h6'>{children}</HLink>;
  },
  p: (props: any) => <Typography {...props} variant='body1' />,
  pre: Pre,
  code: (props: any) => (
    <CodeRenderer
      {...props}
      code={getChildren(props)}
      language={getLanguage(props)}
    />
  ),
  inlineCode: (props: any) => <Code {...props} />,
  a: (props: any) => <AnchorTag {...props} />,
  table: (props: any) => <Table {...props} />,
  tr: (props: any) => <TableRow {...props} />,
  td: ({ align, ...props }) => <TableCell {...props} align={align || undefined} />,
  th: ({ align, ...props }) => <TableCell {...props} align={align || undefined} />,
  tbody: (props: any) => <TableBody {...props} />,
  thead: (props: any) => <TableHead {...props} />,
  ul: (props: any) => <Typography {...props} component='ul' />,
  ol: (props: any) => <Typography {...props} component='ol' />,
  em: (props: any) => <Typography {...props} component='em' style={{ fontStyle: 'italic' }} />,
  li: (props: any) => <ListItem {...props} />,
  img: (props: any) => <img {...props} className='doc-image' />,
  note: (props: any) => <Note {...props} />,
  Alert,
  PoiTooltip,
  CloudLink: (props: any) => <CloudLink {...props} />,
};
