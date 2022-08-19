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

import { createTheme } from '@mui/material';
import { createStyles } from '@mui/styles';

const theme = createTheme();
const common = {
  spacing: 4,
  shadows: ['none'],
  typography: {
    fontFamily: ['Roboto'],
    textRendering: 'optimizeLegibility',
    button: {
      textTransform: 'none',
      marginLeft: '7px',
      marginRight: '7px',
    },
    h1: {
      fontFamily: ['Roboto'],
      marginBottom: '16px',
      marginTop: '0px',
      fontSize: '32px',
      lineHeight: '40px',
      paddingBottom: '10px',
      paddingTop: '30px',
      fontStyle: 'normal',
      fontWeight: 'bold',
    },
    h2: {
      fontFamily: ['Roboto'],
      marginBottom: '16px',
      marginTop: '24px',
      paddingBottom: '8px',
      fontStyle: 'normal',
      fontWeight: 'bold',
      fontSize: '24px',
      lineHeight: '30px',
      borderBottom: '1px solid #dcdde0',
    },
    h3: {
      fontFamily: ['Roboto'],
      marginBottom: '16px',
      marginTop: '24px',
      fontStyle: 'normal',
      fontWeight: 'bold',
      fontSize: '20px',
      lineHeight: '25px',
    },
    h4: {
      fontFamily: ['Roboto'],
      marginBottom: '16px',
      marginTop: '24px',
      fontStyle: 'normal',
      fontWeight: 'bold',
      fontSize: '16px',
      lineHeight: '20px',
      WebkitFontSmoothing: 'antialiased',
      [theme.breakpoints.down('md')]: {
        fontSize: '14px',
        lineHeight: '18px',
      },
    },
    h5: {
      fontFamily: ['Roboto'],
      marginBottom: '16px',
      marginTop: '24px',
      fontStyle: 'normal',
      fontWeight: 'bold',
      fontSize: '14px',
      lineHeight: '17.5px',
      WebkitFontSmoothing: 'antialiased',
    },
    h6: {
      fontFamily: ['Roboto'],
      marginBottom: '16px',
      marginTop: '24px',
      fontStyle: 'normal',
      fontWeight: 'bold',
      fontSize: '13.5px',
      lineHeight: '17px',
      WebkitFontSmoothing: 'antialiased',
    },
    body1: {
      marginBottom: '16px',
      marginTop: '0px',
      fontSize: '16px',
      lineHeight: '24px',
      fontStyle: 'normal',
      fontWeight: 'normal',
      textRendering: 'optimizeLegibility',
      WebkitFontSmoothing: 'antialiased',
      overflowWrap: 'break-word',
    },
    body2: {
      marginBottom: '8px',
      marginTop: '10px',
      fontSize: '13px',
      lineHeight: '21px',
      textRendering: 'optimizeLegibility',
      WebkitFontSmoothing: 'antialiased',
      overflowWrap: 'break-word',
    },
  },
};

const appThemeOptions = createStyles({
  light: {
    ...common,
    palette: {
      mode: 'light',
      primary: {
        main: '#000000',
      },
      secondary: {
        main: '#12D6D6',
      },
      background: {
        default: '#ffffff',
        paper: '#ffffff',
      },
    },
    overrides: {
      MuiTreeItem: {
        group: {
          marginLeft: '10px',
        },
      },
      MuiPopover: {
        root: {
          zIndex: '1303 !important',
        },
      },
      MuiDrawer: {
        paper: {
          height: 'calc(100vh - 54px)',
        },
      },
      MuiToolbar: {
        root: {
          minHeight: '54px',
          backgroundColor: '#212324',
          boxShadow: '0px 4px 8px 0px rgba(0,0,0,0.35)',
        },
        icon: {
          color: 'red',
        },
        regular: {
          [theme.breakpoints.up('xs')]: {
            minHeight: '54px',
          },
        },
      },
      MuiGrid: {
        root: {
          position: 'relative',
        },
      },
      MuiTable: {
        root: {
          width: 'auto',
          minWidth: '50%',
          marginBottom: '24px',
        },
      },
      MuiTableHead: {
        root: {
          borderBottomWidth: '3px',
          borderBottomStyle: 'solid',
        },
      },
      MuiTableRow: {
        root: {
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          '&:last-child': {
            borderBottom: 'none',
          },
        },
      },
      MuiTableCell: {
        root: {
          borderBottom: 'none',
          padding: '4px',
        },
        head: {
          fontWeight: 'bold',
        },
      },
      MuiTab: {
        root: {
          '&$textColorInherit': {
            color: 'rgb(126, 127, 132)',
          },
          '&$selected': {
            color: '#17AAAA',
          },
        },
        wrapper: {
          fontWeight: 500,
        },
      },
      MuiTypography: {
        h1: {
          color: '#000000',
          borderBottomColor: '#DBDDE0',
        },
        h2: {
          color: '#17AAAA',
          borderBottomColor: '#DBDDE0',
        },
        h3: {
          color: '#000000',
        },
        h4: {
          color: '#000000',
        },
        h5: {
          color: '#272822',
        },
        h6: {
          color: '#000000',
        },
        body2: {
          color: '#272822',
        },
        body1: {
          color: '#4F4F4F',
        },
      },
    },
    components: {
      MuiTreeItem: {
        styleOverrides: {
          group: {
            marginLeft: '10px',
          },
        },
      },
      MuiPopover: {
        styleOverrides: {
          root: {
            zIndex: '1303 !important',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            height: 'calc(100vh - 54px)',
          },
        },
      },
      MuiToolbar: {
        styleOverrides: {
          root: {
            minHeight: '54px',
            backgroundColor: '#212324',
            boxShadow: '0px 4px 8px 0px rgba(0,0,0,0.35)',
          },
          icon: {
            color: 'red',
          },
          regular: {
            [theme.breakpoints.up('xs')]: {
              minHeight: '54px',
            },
          },
        },
      },
      MuiGrid: {
        styleOverrides: {
          root: {
            position: 'relative',
          },
        },
      },
      MuiTable: {
        styleOverrides: {
          root: {
            width: 'auto',
            minWidth: '50%',
            marginBottom: '24px',
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            borderBottomWidth: '3px',
            borderBottomStyle: 'solid',
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            '&:last-child': {
              borderBottom: 'none',
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: 'none',
            padding: '4px',
          },
          head: {
            fontWeight: 'bold',
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            '&$textColorInherit': {
              color: 'rgb(126, 127, 132)',
            },
            '&$selected': {
              color: '#17AAAA',
            },
          },
          wrapper: {
            fontWeight: 500,
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          h1: {
            color: '#000000',
            borderBottomColor: '#DBDDE0',
          },
          h2: {
            color: '#17AAAA',
            borderBottomColor: '#DBDDE0',
          },
          h3: {
            color: '#000000',
          },
          h4: {
            color: '#000000',
          },
          h5: {
            color: '#272822',
          },
          h6: {
            color: '#000000',
          },
          body2: {
            color: '#272822',
          },
          body1: {
            color: '#4F4F4F',
          },
        },
      },
    },
  },
  dark: {
    ...common,
    palette: {
      mode: 'dark',
      primary: {
        main: '#ffffff',
      },
      secondary: {
        main: '#3FE7E7',
      },
      text: {
        primary: '#ffffff',
      },
      background: {
        default: '#212324',
        paper: '#212324',
      },
    },
    overrides: {
      MuiTreeItem: {
        group: {
          marginLeft: '10px',
        },
      },
      MuiPopover: {
        root: {
          zIndex: '1303 !important',
        },
      },
      MuiDrawer: {
        paper: {
          height: 'calc(100vh - 54px)',
        },
      },
      MuiToolbar: {
        root: {
          backgroundColor: '#161616',
          minHeight: '54px',
          boxShadow: '0px 4px 8px 0px rgba(0,0,0,0.30)',
        },
        icon: {
          color: 'red',
        },
        regular: {
          [theme.breakpoints.up('xs')]: {
            minHeight: '54px',
          },
        },
      },
      MuiGrid: {
        root: {
          position: 'relative',
        },
      },
      MuiTable: {
        root: {
          width: 'auto',
          minWidth: '50%',
          marginBottom: '24px',
        },
      },
      MuiTableHead: {
        root: {
          borderBottomWidth: '3px',
          borderBottomStyle: 'solid',
        },
      },
      MuiTableRow: {
        root: {
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          '&:last-child': {
            borderBottom: 'none',
          },
        },
      },
      MuiTableCell: {
        root: {
          borderBottom: 'none',
          padding: '4px',
        },
        head: {
          fontWeight: 'bold',
        },
      },
      MuiTab: {
        root: {
          '&$textColorInherit': {
            color: 'rgb(126, 127, 132)',
          },
          '&$selected': {
            color: '#3EF3F3',
          },
        },
        wrapper: {
          fontWeight: 500,
        },
      },
      MuiTypography: {
        h1: {
          color: '#ffffff',
          borderBottomColor: '#353738',
        },
        h2: {
          color: '#3EF3F3',
          borderBottomColor: '#353738',
        },
        h3: {
          color: '#ffffff',
        },
        h4: {
          color: '#ffffff',
        },
        h5: {
          color: '#ffffff',
        },
        h6: {
          color: '#D2D5DD',
        },
        body2: {
          color: '#D2D5DD',
        },
        body1: {
          color: '#E2E5EE',
        },
      },
    },
    components: {
      MuiTreeItem: {
        styleOverrides: {
          group: {
            marginLeft: '10px',
          },
        },
      },
      MuiPopover: {
        styleOverrides: {
          root: {
            zIndex: '1303 !important',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            height: 'calc(100vh - 54px)',
          },
        },
      },
      MuiToolbar: {
        styleOverrides: {
          root: {
            backgroundColor: '#161616',
            minHeight: '54px',
            boxShadow: '0px 4px 8px 0px rgba(0,0,0,0.30)',
          },
          icon: {
            color: 'red',
          },
          regular: {
            [theme.breakpoints.up('xs')]: {
              minHeight: '54px',
            },
          },
        },
      },
      MuiGrid: {
        styleOverrides: {
          root: {
            position: 'relative',
          },
        },
      },
      MuiTable: {
        styleOverrides: {
          root: {
            width: 'auto',
            minWidth: '50%',
            marginBottom: '24px',
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            borderBottomWidth: '3px',
            borderBottomStyle: 'solid',
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            '&:last-child': {
              borderBottom: 'none',
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: 'none',
            padding: '4px',
          },
          head: {
            fontWeight: 'bold',
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            '&$textColorInherit': {
              color: 'rgb(126, 127, 132)',
            },
            '&$selected': {
              color: '#3EF3F3',
            },
          },
          wrapper: {
            fontWeight: 500,
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          h1: {
            color: '#ffffff',
            borderBottomColor: '#353738',
          },
          h2: {
            color: '#3EF3F3',
            borderBottomColor: '#353738',
          },
          h3: {
            color: '#ffffff',
          },
          h4: {
            color: '#ffffff',
          },
          h5: {
            color: '#ffffff',
          },
          h6: {
            color: '#D2D5DD',
          },
          body2: {
            color: '#D2D5DD',
          },
          body1: {
            color: '#E2E5EE',
          },
        },
      },
    },
  },
});

export default appThemeOptions;
