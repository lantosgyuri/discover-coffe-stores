import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link
            rel="preload"
            href="/static/fonts/IBMPlexSans-Bold.ttf"
            crossOrigin="anonymous"
            as="font"
          ></link>
          <link
            rel="preload"
            href="/static/fonts/IBMPlexSans-Regular.ttf"
            crossOrigin="anonymous"
            as="font"
          ></link>
          <link
            rel="preload"
            href="/static/fonts/IBMPlexSans-SemiBold.ttf"
            crossOrigin="anonymous"
            as="font"
          ></link>
        </Head>
        <body>
          <Main></Main>
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
