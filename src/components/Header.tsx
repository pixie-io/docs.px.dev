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
import BodyClassName from 'react-body-classname';
import { graphql, Link, StaticQuery } from 'gatsby';
import {
  AppBar,
  Toolbar,
  IconButton,
  Hidden,
  Button,
  ClickAwayListener,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import { makeStyles } from '@mui/styles';

import logoImg from '../images/pixie-logo-header.svg';
import slackIcon from './images/slack-icon.svg';
import githubIcon from './images/github-icon.svg';
import SearchResultsDropdown from './search-results-dropdown';
import languages from '../../available-languages';

const useStyles = makeStyles((theme) => ({
  middle: {
    flexGrow: 1,
  },
  mainTocButton: {
    color: '#ffffff',
    marginRight: '12px',
  },
  menuButton: {
    marginRight: theme.spacing(2),
    height: '21px',
    verticalAlign: 'middle',
  },
  buttons: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
  },
  dropIcon: {
    '&:after': {
      content: '"▼"',
      display: 'inline-block',
      fontSize: '7px',
      paddingLeft: '8px',
      verticalAlign: 'middle',
    },
  },
  dropMenuRef: {
    position: 'relative',
    display: 'inline-block',
  },
  dropMenu: {
    position: 'absolute',
    top: `calc(${theme.overrides.MuiToolbar.root.minHeight} / 2 - 4px)`,
    boxShadow:
      theme.palette.mode === 'light'
        ? '0px 15px 130px 0px rgba(0,0,0,0.10)'
        : '0px 15px 130px 0px rgba(0,0,0,0.45)',
    right: 0,
    zIndex: 1,
    backgroundColor: theme.palette.mode === 'light' ? '#212324' : '#212324',
    width: '189px',
    borderRadius: '7px',
  },
  langMenu: {
    position: 'absolute',
    top: `calc(${theme.overrides.MuiToolbar.root.minHeight} / 2 - 4px)`,
    boxShadow:
      theme.palette.mode === 'light'
        ? '0px 15px 130px 0px rgba(0,0,0,0.10)'
        : '0px 15px 130px 0px rgba(0,0,0,0.45)',
    right: 0,
    zIndex: 1,
    backgroundColor: theme.palette.mode === 'light' ? '#212324' : '#212324',
    borderRadius: '7px',
  },
  langMenuItem: {
    color: theme.palette.mode === 'light' ? '#B2B5BB' : '#B2B5BB',
    fontSize: '14px',
    lineHeight: '24px',
    padding: '14px',
    textAlign: 'center',
    width: '52px',
    '& a': {
      textDecoration: 'none',
      display: 'block',
      margin: '-14px',
      padding: '14px',
      fontStyle: 'inherit',
      color: 'inherit',
    },
  },
  dropMenuItem: {
    color: theme.palette.mode === 'light' ? '#B2B5BB' : '#B2B5BB',
    fontSize: '14px',
    lineHeight: '24px',
    padding: '14px',
    '& a': {
      '& img': {
        paddingLeft: '20px',
        paddingRight: '20px',
        height: '18px',
        width: '18px',
      },
      textDecoration: 'none',
      fontStyle: 'inherit',
      color: 'inherit',
      padding: '14px',
      margin: '-14px',
      display: 'block',
    },
  },
}));

interface Props {
  availableLanguages: { lang: string; slug: string }[];
  lang: string;
  theme: string;
  onThemeTypeSwitch: any;
  setDrawerOpen: any;
  drawerOpen: boolean;
  setSidebarOpen: any;
  sidebarOpen: boolean;
}

interface RenderProps {
  site: {
    siteMetadata: {
      title: string;
    };
  };
}

const Header = ({
  drawerOpen,
  setDrawerOpen,
  availableLanguages,
  lang = 'en',
  setSidebarOpen,
  sidebarOpen,
  onThemeTypeSwitch,
  theme,
}: Props) => {
  const toggleToc = () => {
    setDrawerOpen(!drawerOpen);
    setSidebarOpen(!sidebarOpen);
  };

  const [openSupportMenu, setOpenSupportMenu] = React.useState(false);
  const [openLanguageMenu, setOpenLanguageMenu] = React.useState(false);

  const classes = useStyles();
  const getLanguageLabel = (languageId) => (languageId === 'en'
    ? 'English'
    : languages.find((l) => l.id === languageId).label);

  return (
    <StaticQuery
      query={graphql`
        query headerTitleQuery {
          site {
            siteMetadata {
              title
            }
          }
        }
      `}
      render={(data: RenderProps) => {
        const siteTitle = data.site.siteMetadata.title;
        return (
          // eslint-disable-next-line @typescript-eslint/no-shadow
          <AppBar title={siteTitle} position='fixed' sx={{ zIndex: (theme) => theme.zIndex.modal + 1 }}>
            <BodyClassName className={`theme-${theme}`} />
            <Toolbar
              sx={{
                flexGrow: 1,
                padding: { md: '0 30px' },
                paddingLeft: { md: '5px' },
              }}
            >
              <IconButton
                onClick={toggleToc}
                sx={{
                  color: '#ffffff',
                  marginRight: '12px',
                }}
                size='large'
              >
                <MenuIcon />
              </IconButton>
              <Link to='/'>
                <img className={classes.menuButton} src={logoImg} alt='logo' />
              </Link>
              <div className={classes.middle} />
              <div className={classes.buttons}>
                <IconButton
                  sx={{
                    padding: '3px',
                    color: '#fff',
                  }}
                  size='small'
                  onClick={(e) => {
                    e.preventDefault();
                    onThemeTypeSwitch();
                  }}
                >
                  {theme === 'light' ? (
                    <Brightness4Icon />
                  ) : (
                    <Brightness7Icon />
                  )}
                </IconButton>
                <Hidden mdDown implementation='css'>
                  <ClickAwayListener
                    onClickAway={() => setOpenSupportMenu(false)}
                  >
                    <Button
                      sx={{
                        color: '#fff',
                      }}
                      size='inherit'
                      aria-controls='support-menu'
                      aria-haspopup='true'
                      onClick={() => setOpenSupportMenu((prev) => !prev)}
                    >
                      Support
                      <span className={classes.dropIcon} />
                    </Button>
                  </ClickAwayListener>
                  <div className={classes.dropMenuRef}>
                    {openSupportMenu ? (
                      <div className={classes.dropMenu}>
                        <div
                          className={classes.dropMenuItem}
                          onClick={() => setOpenSupportMenu(false)}
                        >
                          <a
                            href='https://slackin.px.dev/'
                            target='_blank'
                            rel='noopener noreferrer'
                          >
                            <img
                              className={classes.menuButton}
                              src={slackIcon}
                              alt='logo'
                            />
                            Slack
                          </a>
                        </div>
                        <div
                          className={classes.dropMenuItem}
                          onClick={() => setOpenSupportMenu(false)}
                        >
                          <a
                            href='https://github.com/pixie-io/pixie'
                            target='_blank'
                            rel='noopener noreferrer'
                          >
                            <img
                              className={classes.menuButton}
                              src={githubIcon}
                              alt='logo'
                            />
                            GitHub
                          </a>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </Hidden>
                {availableLanguages && (
                  <Hidden mdDown implementation='css'>
                    <ClickAwayListener
                      onClickAway={() => setOpenLanguageMenu(false)}
                    >
                      <Button
                        sx={{
                          color: '#fff',
                        }}
                        size='inherit'
                        aria-controls='support-menu'
                        aria-haspopup='true'
                        onClick={() => setOpenLanguageMenu((prev) => !prev)}
                      >
                        {getLanguageLabel(lang)}
                        <span className={classes.dropIcon} />
                      </Button>
                    </ClickAwayListener>
                    <div className={classes.dropMenuRef}>
                      {openLanguageMenu ? (
                        <div className={classes.langMenu}>
                          {(availableLanguages || []).map((l) => (
                            <div
                              key={l.lang}
                              className={classes.langMenuItem}
                              onClick={() => setOpenSupportMenu(false)}
                            >
                              <Link
                                to={l.slug}
                                target='_blank'
                                rel='noopener noreferrer'
                              >
                                {getLanguageLabel(l.lang)}
                              </Link>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </Hidden>
                )}
                <SearchResultsDropdown />
                <Button
                  href='https://px.dev'
                  size='small'
                  color='secondary'
                  variant='contained'
                  sx={{ display: { xs: 'none', md: 'block' } }}
                >
                  Back to Pixie
                </Button>
              </div>
            </Toolbar>
          </AppBar>
        );
      }}
    />
  );
};
export default Header;
