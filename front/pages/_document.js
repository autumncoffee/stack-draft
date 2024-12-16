import createCache from '@emotion/cache';
import {
  DocumentHeadTags,
  documentGetInitialProps,
} from '@mui/material-nextjs/v15-pagesRouter';
import { Html, Head, Main, NextScript } from "next/document";

export default function Document(props) {
  return (
    <Html lang="en">
      <Head>
        <DocumentHeadTags {...props} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

const emotionCache = createCache({
    key: 'the-cache-thing',
});

Document.getInitialProps = async (ctx) => {
  const finalProps = await documentGetInitialProps(ctx, {
    emotionCache,
  });
  return finalProps;
};
