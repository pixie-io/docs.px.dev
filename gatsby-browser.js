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
import SearchProvider from './src/components/search-context.tsx';
import { processClientEntry, runZoom } from './src/components/image-zoom-modal.plugin.ts';
import TabSwitcherProvider from './src/components/tabSwitcherProvider.tsx';

export const onClientEntry = () => {
  processClientEntry();
};

export const onInitialClientRender = () => {
  const gatsbyFocusWrapper = document.getElementById('gatsby-focus-wrapper');
  if (gatsbyFocusWrapper) {
    gatsbyFocusWrapper.removeAttribute('style');
    gatsbyFocusWrapper.removeAttribute('tabIndex');
  }
};

export const onRouteUpdate = () => {
  if (typeof window === 'undefined') return;
  window.locations = window.locations || [document.referrer];
  if (!sessionStorage.getItem('referrer')) {
    sessionStorage.setItem('referrer', window.locations[0]);
  }
  runZoom();

  const mmsc = document.getElementById('main-meu-scroll-container');
  if (mmsc) {
    mmsc.scrollTop = window.mmscScrollTop || 0;
  }
};

// eslint-disable-next-line import/prefer-default-export
export const wrapRootElement = ({ element }) => (
  <TabSwitcherProvider>
    <MainThemeProvider>
      <CloudLinkProvider>
        <SidebarProvider>
          <SearchProvider>
            {element}
          </SearchProvider>
        </SidebarProvider>
      </CloudLinkProvider>
    </MainThemeProvider>
  </TabSwitcherProvider>
);
