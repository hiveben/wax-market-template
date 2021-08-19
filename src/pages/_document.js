import Document, {Head, Html, Main, NextScript} from 'next/document'

import React from "react";

export class MyDocument extends Document {
  render() {
      return (
          <Html lang="en">
              <Head>
                    <meta property="og:type" content="website" />
                    <meta id="og-url" property="og:url" content="https://www.nfthive.io/" />
                    <meta name="msapplication-TileColor" content="#1235ba" />
                    <meta name="theme-color" content="#1A1A1A"  />
                    <style type="text/css">
                        {
                            'body {' +
                                'background-color: #1A1A1A;' +
                                'color: #1235ba;' +
                            '}'
                        }
                    </style>
                    <meta property="twitter:card" content="summary_large_image" />
                    <meta id="twitter-url" property="twitter:url" content="https://www.nfthive.io/" />
              </Head>
              <body>
                  <Main />
                  <NextScript />
              </body>
          </Html>
      )
  }
}

MyDocument.getInitialProps = async (ctx) => {
    const initialProps = await Document.getInitialProps(ctx);

    return { ...initialProps }
};

export default MyDocument;
