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
import { useState } from 'react';
import algoliasearch from 'algoliasearch/lite';

export interface ResultType {
  id: string;
  slug: string;
  title: string;
  pageTitle: string;
  /**
   * This is a string of HTML text. Be careful if using this with dangerouslySetInnerHTML.
   * Remember: never trust the other end of the connection. You may not always control it.
   */
  highlighted: string;
  value: string;
  mainCategory: string;
  path: string[];
  _highlightResult: {
    value: {
      value: string;
    }
  }
}

export const SearchContext = React.createContext(
  {
    searchQuery: '',
    term: '',
    setTerm: null,
    results: [] as ResultType[],
    doSearch: null,
    noOfHits: 0,
  },
);
const SearchProvider = ({ children }) => {
  const [term, setTerm] = React.useState('');
  const [searchQuery, setSearchQuery] = React.useState('');
  const client = algoliasearch(
    process.env.GATSBY_ALGOLIA_APP_ID,
    process.env.GATSBY_ALGOLIA_SEARCH_KEY,
  );
  const index = client.initIndex(process.env.GATSBY_DEPLOY_ENV === 'prod' ? process.env.GATSBY_ALGOLIA_PROD_INDEX_NAME : process.env.GATSBY_ALGOLIA_DEV_INDEX_NAME);

  const [results, setResults] = useState([]);
  const [noOfHits, setNoOfHits] = useState(0);
  const getTitleFromPath = (path) => {
    let title = '';
    for (let i = 0; i < 6; i += 1) {
      title = path[i] ? path[i] : title;
    }
    return title;
  };
  const doSearch = (t, clear = false) => {
    const clearAll = () => {
      setResults([]);
      setNoOfHits(0);
      setSearchQuery('');
    };
    if (clear) {
      clearAll();
    }

    if (t && t.length > 0) {
      index.search<ResultType>(t).then(({ hits, nbHits, query }) => {
        setNoOfHits(nbHits);
        setSearchQuery(query);
        setResults(
          hits.map((h) => ({
            slug: h.slug,
            excerpt: h.value,
            mainCategory: h.mainCategory,
            pageTitle: h.path[0],
            /* eslint no-underscore-dangle: ["error", { "allow": ["_highlightResult"] }] */
            highlighted: h._highlightResult.value.value,
            title: getTitleFromPath(h.path),
            id: h.objectID,
          })),
        );
      });
    } else { clearAll(); }
  };

  return (
    <SearchContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        term, setTerm, results, doSearch, noOfHits, searchQuery,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default SearchProvider;
