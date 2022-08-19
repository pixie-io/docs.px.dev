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
import BodyClassName from 'react-body-classname';
import { Link } from 'gatsby';
import { ClickAwayListener } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ResultType, SearchContext } from './search-context';
import searchIcon from './images/search.svg';

// This is for a use of dangerouslySetInnerHTML deep in the JSX tree. The data in question is
// trusted, but ideally we'd be sanitizing it anyway to limit vulnerable surface area.
/* eslint-disable react/no-danger */

const useStyles = makeStyles((theme) => ({

  search: {
    position: 'relative',
    display: 'inline',
    [theme.breakpoints.down('md')]: {
      width: '40px',
      marginLeft: '20px',
    },
  },
  searchInput: {
    position: 'relative',
    '& input': {
      borderRadius: '7px',
      width: '300px',
      outline: 'none',
      height: '32px',
      border: '1px solid #4A4C4F',
      background: 'transparent',
      marginLeft: 0,
      marginRight: 0,
      fontFamily: 'Roboto',
      paddingLeft: '16px',
      color: '#ffffff',
      '&::placeholder': {
        fontFamily: 'Roboto',
        fontStyle: 'italic',
        fontWeight: 'normal',
        fontSize: '12px',
        lineHeight: '14px',
        color: '#4A4C4F',
      },
      [theme.breakpoints.down('md')]: {
        width: '16px',
        '&::placeholder': {
          opacity: 0,
        },
      },
    },

  },
  searchIcon: {
    pointerEvents: 'none',
    position: 'absolute',
    right: '12px',
    top: '11px',
    height: '14px',
    [theme.breakpoints.down('md')]: {
      top: '13px',
      right: '14px',
    },
  },
  dropdown: {
    position: 'absolute',
    right: 0,
    top: '40px',
    maxHeight: '50vh',
    overflow: 'auto',
    background: '#212324',
    borderRadius: '7px',
    padding: '24px',
    width: '564px',

    boxShadow: '0px 15px 130px 0px rgba(0,0,0,0.45)',
    '&.empty': {
      opacity: 0,
    },
    [theme.breakpoints.down('md')]: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: 'calc(100vw - 50px)',
      height: 'calc(100vh - 124px)',
      maxHeight: 'none',
      borderRadius: 0,
      paddingTop: '76px',
      opacity: '1!important',
    },
  },
  searchInputMobile: {
    position: 'fixed',
    border: 0,
    top: 0,
    left: 0,
    display: 'none',
    background: '#161616',
    width: '100vw',
    height: '54px',
    boxShadow: '0px 4px 8px 0px rgba(0,0,0,0.30)',
    '& input': {
      borderRadius: '7px',
      outline: 'none',
      height: '32px',
      border: '1px solid #4A4C4F',
      background: 'transparent',
      marginLeft: '8px',
      marginTop: '8px',
      fontFamily: 'Roboto',
      paddingLeft: '16px',
      color: '#ffffff',
      width: 'calc(100vw - 110px)',
      '&::placeholder': {
        fontFamily: 'Roboto',
        fontStyle: 'italic',
        fontWeight: 'normal',
        fontSize: '12px',
        lineHeight: '14px',
        color: '#4A4C4F',
      },
    },
    '& img': {
      pointerEvents: 'none',
      position: 'absolute',
      right: '90px',
      top: '20px',
      height: '14px',
    },
    [theme.breakpoints.down('md')]: {
      display: 'inline',
    },

  },
  cancelButton: {
    position: 'fixed',
    top: '18px',
    right: '16px',
    color: '#12D6D6',
  },

  hitsCounter: {
    fontSize: '12px',
    lineHeight: '14px',
    color: '#4A4C4F',
    textTransform: 'uppercase',
    textAlign: 'right',
  },
  result: {
    textDecoration: 'none',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultMain: {
    fontSize: '16px',
    lineHeight: '28px',
    color: '#9696A5',
    borderBottom: '1px solid #353738',
    paddingBottom: '4px',
  },
  resultPageTitle: {
    width: '140px',
    flexShrink: 0,
    fontSize: '16px',
    fontWeight: 'bold',
    lineHeight: '28px',
    textAlign: 'right',
    color: '#596274',
    paddingRight: '29px',
  },
  resultRightSide: {
    borderLeft: '1px solid #353738',
    marginBottom: '23px',
    paddingLeft: '25px',
    height: '100%',
  },
  resultTitle: {
    fontWeight: 'bold',
    fontSize: '16px',
    lineHeight: '28px',
    color: '#12D6D6',
    marginTop: '8px',
    marginBottom: '8px',
  },
  resultBody: {
    fontSize: '14px',
    lineHeight: '24px',
    color: '#9696A5',
    '& em': {
      color: 'yellow',
    },
  },
}));

const SearchResultsDropdown = () => {
  const classes = useStyles();
  const [openResultsDrop, setOpenResultsDrop] = React.useState(false);

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setOpenResultsDrop(false);
    }
  };

  const groupByCategory = (list: ResultType[]) => list.reduce((obj, result) => {
    const arr = obj[result.mainCategory] || [];
    arr.push(result);
    return { ...obj, [result.mainCategory]: arr };
  }, {} as Record<string, ResultType[]>);

  const handleChange = (doSearch, setTerm, term) => {
    setTerm(term);
    doSearch(term);
    setOpenResultsDrop(true);
  };
  const cancel = (doSearch, setTerm) => {
    setTerm('');
    doSearch('', true);
    setOpenResultsDrop(false);
  };

  return (
    <SearchContext.Consumer>
      {({
        term, setTerm, doSearch, noOfHits, searchQuery, results,
      }) => (
        <ClickAwayListener onClickAway={() => setOpenResultsDrop(false)}>
          <div className={classes.search}>
            {/* eslint-disable-next-line react/jsx-no-undef */}
            <BodyClassName className={`${openResultsDrop ? 'search-menu-open' : ''}`} />
            <div className={classes.searchInput}>
              <input
                placeholder='Search documentation'
                value={term || ''}
                onFocus={() => setOpenResultsDrop(true)}
                onKeyDown={(e) => handleKeyDown(e)}
                onChange={(event) => handleChange(doSearch, setTerm, event.target.value)}
              />
              <img src={searchIcon} alt='search' className={classes.searchIcon} />
            </div>
            {openResultsDrop ? (
              <div className={`${classes.dropdown} ${searchQuery ? '' : 'empty'}`}>
                <div className={classes.searchInputMobile}>
                  <input
                    placeholder='Search documentation'
                    value={term || ''}
                    onFocus={() => setOpenResultsDrop(true)}
                    onKeyDown={(e) => handleKeyDown(e)}
                    onChange={(event) => handleChange(doSearch, setTerm, event.target.value)}
                  />
                  <img src={searchIcon} alt='search' />
                  <div
                    className={classes.cancelButton}
                    onClick={() => cancel(doSearch, setTerm)}
                  >
                    Cancel
                  </div>
                </div>
                {searchQuery && (
                  <div className={classes.hitsCounter}>
                    {noOfHits}
                    {' '}
                    results found for &quot;
                    {searchQuery}
                    &quot;
                  </div>
                )}
                {(Object.entries(groupByCategory(results || [])).map(([index, cat]) => (
                  <div key={index}>
                    <h3 className={classes.resultMain}>{index}</h3>
                    {cat.map((result) => (
                      <Link key={result.id} to={result.slug} className={classes.result}>
                        <div className={classes.resultPageTitle}>{result.pageTitle}</div>
                        <div className={classes.resultRightSide}>
                          <div className={classes.resultTitle}>{result.title}</div>
                          <div
                            className={classes.resultBody}
                            dangerouslySetInnerHTML={{ __html: result.highlighted }}
                          />
                        </div>
                      </Link>
                    ))}
                  </div>
                )))}

              </div>
            ) : ''}
          </div>
        </ClickAwayListener>
      )}
    </SearchContext.Consumer>
  );
};

export default SearchResultsDropdown;
