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

import styled from '@emotion/styled';

const notificationTypes = {
  warning: {
    dark: 'goldenrod',
    light: 'papayawhip',
  },
  error: {
    dark: 'firebrick',
    light: 'rosybrown',
  },
  info: {
    dark: '#663399',
    light: '#FFFFFF',
  },
};

const getColor = (type = 'info', shade = 'dark') => notificationTypes[type][shade];

const Notification = styled('section')`
  color: ${(props) => getColor(props.type, 'light')};
  background: ${(props) => getColor(props.type)};
  width: 100%;
  padding: 1rem;
  text-align: center;
`;

export default Notification;
