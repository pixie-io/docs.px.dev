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
import { ReactElement, useEffect } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { useTheme } from '@material-ui/core/styles';
import { Theme, useMediaQuery } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import Helmet from 'react-helmet';
import { graphql, useStaticQuery } from 'gatsby';
import CookiesBanner from 'components/cookies-banner/cookies-banner';
import Sidebar from './sidebar/sidebar';
import Header from './Header';
import { ThemeModeContext } from './mainThemeProvider';
import favDark from '../images/favicon-dark.png';
import favGreen from '../images/favicon-green.png';

interface PageItemProps {
  children: ReactElement[],
  location: any,
  classes: any,
  lang: string,
  globalUrlTree: any[],
  availableLanguages: any[],
  availableClouds: any[],
}

const Layout = withStyles((theme: Theme) => ({
  pageLayout: {
    display: 'flex',
    position: 'relative',
    marginTop: '54px',
    minHeight: 'calc(100vh - 54px)',
    backgroundColor: theme.palette.background.default,

  },
  drawer: {
    width: '336px',
  },
  drawerPaper: {
    marginTop: '54px',
  },
  content: {
    width: '100%',
    flexGrow: 1,
    maxHeight: 'calc(100vh - 54px)',
    overflow: 'auto',
  },
}))(({
  children,
  location,
  classes,
  lang,
  globalUrlTree,
  availableLanguages,
  availableClouds,
}: PageItemProps) => {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
          }
        }
      }
    `,
  );

  const isFixedMenuPage = ['/'].includes(location.pathname);
  const isMobile = useMediaQuery(useTheme()
    .breakpoints
    .down('sm'));
  const [needsFloat, setNeedsFloat] = React.useState(isFixedMenuPage);

  useEffect(
    () => {
      if (!isFixedMenuPage) {
        setNeedsFloat(isMobile);
      }
    },
    [isMobile],
  );
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const { metaTitle } = site.siteMetadata.title;
  const { metaDescription } = site.siteMetadata.description;
  const favicon = {
    rel: 'icon',
    type: 'image/png',
    href:
      typeof window !== 'undefined'
      && window.matchMedia
      && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? favGreen
        : favDark,
  };

  return (
    <>
      <Helmet link={[favicon]}>

        {metaTitle ? <title>{metaTitle}</title> : null}
        {metaTitle ? <meta name='title' content={metaTitle} /> : null}
        {metaDescription ? (
          <meta name='description' content={metaDescription} />
        ) : null}
        {metaTitle ? (
          <meta property='og:title' content={metaTitle} />
        ) : null}
        {metaDescription ? (
          <meta property='og:description' content={metaDescription} />
        ) : null}
        {metaTitle ? (
          <meta property='twitter:title' content={metaTitle} />
        ) : null}
        {metaDescription ? (
          <meta property='twitter:description' content={metaDescription} />
        ) : null}
      </Helmet>
      <ThemeModeContext.Consumer>
        {({
          toggleTheme,
          theme,
        }) => (
          <div className={classes.pageLayout}>
            <Header
              availableLanguages={availableLanguages}
              availableClouds={availableClouds}
              lang={lang}
              location={location}
              drawerOpen={drawerOpen}
              setDrawerOpen={setDrawerOpen}
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
              onThemeTypeSwitch={toggleTheme}
              theme={theme}
            />
            {needsFloat && (
              <Drawer
                disableEnforceFocus
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                className={classes.drawer}
                classes={{
                  paper: classes.drawerPaper,
                }}
              >
                <Sidebar
                  location={location}
                  lang={lang}
                  globalUrlTree={globalUrlTree}
                />
              </Drawer>
            )}
            {sidebarOpen && !needsFloat && (
              <Sidebar
                location={location}
                lang={lang}
                globalUrlTree={globalUrlTree}
                className={classes.drawer}
              />
            )}
            <div className={classes.content}>
              {children}
            </div>
            <CookiesBanner />
          </div>

        )}
      </ThemeModeContext.Consumer>
    </>
  );
});

export default Layout;
