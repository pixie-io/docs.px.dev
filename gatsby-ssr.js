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

/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */
import React from 'react';
import MainThemeProvider from './src/components/mainThemeProvider.tsx';
import './src/global.css';
import SidebarProvider from './src/components/sidebar/sidebarProvider.tsx';
import CloudLinkProvider from './src/components/cloudLinkProvider.tsx';

// eslint-disable-next-line import/prefer-default-export
export const wrapRootElement = ({ element }) => (
  <MainThemeProvider>
    <CloudLinkProvider>
      <SidebarProvider>
        {element}
      </SidebarProvider>
    </CloudLinkProvider>
  </MainThemeProvider>
);
