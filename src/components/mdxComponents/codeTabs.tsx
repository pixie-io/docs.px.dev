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
import { useContext, useEffect, useState } from 'react';
import withStyles from '@mui/styles/withStyles';
import { Tab, Tabs } from '@mui/material';
import { TabSwitcherProviderContext } from '../tabSwitcherProvider';

// human readable versions of names
const LANGUAGES = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  html: 'HTML',
  coffee: 'CoffeeScript',
  powershell: 'PowerShell',
  json: 'JSON',
  cpp: 'C++',
  csharp: 'C#',
  es6: 'JavaScript (ES6)',
  yml: 'YAML',
  yaml: 'YAML',
};

export const CodeContext = React.createContext(null);

// only fetch them once
let cachedCodeKeywords = null;

export function useCodeContextState(fetcher) {
  const [codeKeywords, setCodeKeywords] = useState(null);
  if (codeKeywords === null && cachedCodeKeywords !== null) {
    setCodeKeywords(cachedCodeKeywords);
  }

  useEffect(() => {
    if (cachedCodeKeywords === null) {
      fetcher()
        .then((config) => {
          cachedCodeKeywords = config;
          setCodeKeywords(config);
        });
    }
  });

  return {
    codeKeywords,
    sharedCodeSelection: useState(null),
    sharedKeywordSelection: useState({}),
  };
}

const CodeTabs = withStyles((theme) => ({
  codeTabsWrapper: {
    color: theme.palette.mode === 'light' ? '#3EF3F3' : '#17AAAA',
  },
}))((props: any) => {
  const {
    children,
    classes,
  } = props;
  const tabCtx = useContext(TabSwitcherProviderContext);

  let tempChildren;
  if (!Array.isArray(children)) {
    tempChildren = [children];
  } else {
    tempChildren = [...children];
  }

  tempChildren.sort((a, b) => {
    function makeKey({
      language,
      title,
    }) {
      return `${language || '_'}-${title || ''}`;
    }

    return makeKey(a.props)
      .localeCompare(makeKey(b.props), ['en'], {
        sensitivity: 'base',
      });
  });
  const [localSelection, setLocalSelection] = useState(null);

  const onSetLocalSelection = (e) => {
    setLocalSelection(e);
    tabCtx.setSharedChoice(e);
  };

  let possibleChoices = tempChildren.map((x) => {
    const {
      title,
      language,
    } = x.props;
    return (
      title
      || LANGUAGES[language]
      || (language ? language[0].toUpperCase() + language.substr(1) : 'Text')
    );
  });

  const tabTitleSeen = {};
  possibleChoices = possibleChoices.reduce((arr, tabTitle) => {
    if (possibleChoices.filter((x) => x === tabTitle).length > 1) {
      tabTitleSeen[tabTitle] = (tabTitleSeen[tabTitle] || 0);
      const num = tabTitleSeen[tabTitle] + 1;
      arr.push(`${tabTitle} ${num}`);
    } else {
      arr.push(tabTitle);
    }
    return arr;
  }, []);

  const localSelectionChoice = localSelection
    ? possibleChoices.find((x) => x === localSelection)
    : null;

  const finalSelection = (possibleChoices || []).find((c) => c === tabCtx.sharedChoice)
    || localSelectionChoice
    || possibleChoices[0];
  if (localSelection !== finalSelection) {
    setLocalSelection(finalSelection);
  }
  let code = null;

  const actualDifferentChoices = possibleChoices
    .filter((item, pos) => possibleChoices.indexOf(item) === pos);

  if (actualDifferentChoices.length === 1) {
    return possibleChoices.map((c, idx) => (
      <div
        key={tempChildren[idx]}
        className='tab-content'
      >
        {tempChildren[idx]}
      </div>
    ));
  }

  const names = possibleChoices.map((choice, idx) => {
    if (choice === finalSelection) {
      code = tempChildren[idx];
    }
    return (
      <Tab
        value={choice}
        onClick={() => {
          onSetLocalSelection(choice);
        }}
        key={choice}
        label={choice}
      />
    );
  });

  return (
    possibleChoices.length === 1 ? code : (
      <div className={classes.codeTabsWrapper}>
        <Tabs
          value={finalSelection}
          sx={{
            position: 'relative',
            bottom: '-14px',
            fontWeight: 'bold',
          }}
          indicatorColor='secondary'
          textColor='secondary'
        >
          {names}
        </Tabs>
        <div className='tab-content'>{code}</div>
      </div>
    )
  );
});

export default CodeTabs;
