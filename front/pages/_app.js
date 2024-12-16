import { AppCacheProvider } from '@mui/material-nextjs/v15-pagesRouter';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Roboto } from 'next/font/google';
import "@/styles/globals.css";

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

const theme = createTheme({
  cssVariables: true,
  typography: {
    fontFamily: 'var(--font-roboto)',
  },
});

export default function App({ Component, pageProps }) {
  return (
    <AppCacheProvider {...pageProps}>
        <ThemeProvider theme={theme}>
            <div className={roboto.variable}>
              <Component {...pageProps} />
            </div>
        </ThemeProvider>
    </AppCacheProvider>
  );
}
