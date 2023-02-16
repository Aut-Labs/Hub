import { Modal } from "@redq/reuse-modal";
import React from "react";
import Head from "next/head";
import Sticky from "react-stickynode";
import { DrawerProvider } from "common/contexts/DrawerContext";
// import Navbar from "containers/Navbar";
import { ThemeProvider } from "styled-components";
import { theme } from "common/theme";
import ResetCSS from "common/assets/css/style";
import GlobalStyle from "containers/app.style";
import "common/assets/css/rc-collapse.css";
import "common/assets/css/fractul.css";
import Bubble from "common/components/Bubble";
import BubbleImage from "common/assets/image/bubble.svg";

export function reportWebVitals(metric) {
  // console.log(metric);
}

export default function CustomApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <>
        <Head>
          <title>Aut</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
            key="viewport"
          />
          <meta property="og:title" content="Aut" />
          <meta
            name="description"
            content="Do more with your DAO 👥. Āut is an expandable Protocol for Role-based Membership & Governance in Web3 Communities."
          />
          <meta
            property="og:description"
            content="Do more with your DAO 👥. Āut is an expandable Protocol for Role-based Membership & Governance in Web3 Communities."
          />
        </Head>
        <ResetCSS />
        <GlobalStyle />
        <Modal>
          <Sticky top={0} innerZ={200} activeClass="sticky-nav-active">
            <DrawerProvider>{/* <Navbar /> */}</DrawerProvider>
          </Sticky>
          <Component {...pageProps} />
        </Modal>
      </>
    </ThemeProvider>
  );
}
