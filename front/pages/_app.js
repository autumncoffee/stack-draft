import NextApp from 'next/app';
import React from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { ThemeProvider as MaterialThemeProvider } from '@material-ui/core/styles';
import ScopedCssBaseline from '@material-ui/core/ScopedCssBaseline';
import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({});

export default class App extends NextApp {
  componentDidMount() {
    const jssStyles = document.querySelector('#jss-server-side');

    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <>
        <ScopedCssBaseline>
          <StyledThemeProvider theme={theme}>
            <MaterialThemeProvider theme={theme}>
              <Component {...pageProps} />
            </MaterialThemeProvider>
          </StyledThemeProvider>
        </ScopedCssBaseline>
      </>
    );
  }
}
