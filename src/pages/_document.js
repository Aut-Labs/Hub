import Document, { Html, Head, Main, NextScript } from "next/document";
import { ServerStyleSheet } from "styled-components";
import { Player } from "@lottiefiles/react-lottie-player";
import animationData from "common/assets/aut-load.json";

export default class CustomDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;
    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta name="author" content="Aut Labs" />
          <link
            href="/favicon-light.ico"
            rel="icon"
            media="(prefers-color-scheme: light)"
          />
          <link
            href="/favicon-dark.ico"
            rel="icon"
            media="(prefers-color-scheme: dark)"
          />
          <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        </Head>
        <body>
          <div id="aut-splash-loading">
            <Player
              autoplay
              loop
              src={animationData}
              style={{ height: "300px", width: "300px" }}
            />
          </div>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
