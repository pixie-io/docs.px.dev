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
import { useEffect, useRef } from 'react';
import { createTheme, ThemeProvider, Theme } from '@mui/material/styles';
import { useMediaQuery, StyledEngineProvider } from '@mui/material';

import './styles.css';
import AppThemeOptions from './theme';

declare module '@mui/styles/defaultTheme' {
  interface DefaultTheme extends Theme {}
}

export const ThemeModeContext = React.createContext({
  theme: null,
  toggleTheme: null,
});

const MainThemeProvider = ({ children }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [theme, setTheme] = React.useState('dark');
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    setTheme(prefersDarkMode ? 'dark' : 'light');
  }, [prefersDarkMode]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  const muiTheme = createTheme(AppThemeOptions[theme]);

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <ThemeModeContext.Provider value={{ theme, toggleTheme }}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>
      </StyledEngineProvider>
    </ThemeModeContext.Provider>
  );
};

export default MainThemeProvider;
