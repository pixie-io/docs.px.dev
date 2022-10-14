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

// eslint-disable-next-line import/no-extraneous-dependencies
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const cloudFetch = (uri, options) => window.fetch(uri, options).then((resp) => {
  const result = {};
  result.ok = true;
  result.text = () => new Promise((resolve) => {
    resolve(resp.text());
  });
  return result;
});

const cloudLink = new HttpLink({
  uri: 'https://withpixie.ai/api/unauthenticated/graphql',
  fetch: cloudFetch,
});

const cloudAuthLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
  },
}));

const gqlCache = new InMemoryCache();

const cloudClient = new ApolloClient({
  cache: gqlCache,
  link: cloudAuthLink.concat(cloudLink),
});

export default cloudClient;
