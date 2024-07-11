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
import Cookies from 'js-cookie';

const availableClouds = [
  {
    name: 'New Relic Cloud',
    baseUrl: 'https://work.withpixie.ai',
    cloudAddr: 'withpixie.ai',
  },
  {
    name: 'Cosmic Cloud',
    baseUrl: 'https://work.getcosmic.ai',
    cloudAddr: 'getcosmic.ai',
  },
];

const initialCloud = availableClouds[0];

export const CloudLinkContext = React.createContext(
  {
    selectedCloud: initialCloud,
    // eslint-disable-next-line
    setSelectedCloud: (cloud) => { },
  },
);
const getDefaultOrSelectedCloud = () => {
  if (!Cookies.get('consent')) {
    return initialCloud;
  }
  const selectedCloud = Cookies.get('selected-cloud');
  if (selectedCloud) {
    return JSON.parse(selectedCloud);
  }
  return initialCloud;
};
export default function CloudLinkProvider({ children }) {
  const isBrowser = typeof window !== 'undefined';
  const [
    selectedCloud,
    setSelectedCloudState,
  ] = React.useState(isBrowser ? getDefaultOrSelectedCloud() : initialCloud);
  const setSelectedCloud = (cloud) => {
    setSelectedCloudState(cloud);
    // If the user has not consented to cookies, do not set a default cloud.
    if (Cookies.get('consent')) {
      Cookies.set('selected-cloud', cloud);
    }
  };
  return (
    <CloudLinkContext.Provider
      value={{
        selectedCloud,
        setSelectedCloud,
      }}
    >
      {children}
    </CloudLinkContext.Provider>
  );
}
