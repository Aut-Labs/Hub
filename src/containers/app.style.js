import { themeGet } from "@styled-system/theme-get";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import AutLogo from "common/assets/image/noise.png";

const Wobble_Vertical = keyframes`
  16.65% {
    transform: translateY(8px);
  }
  33.3% {
    transform: translateY(-6px);
  }
  49.95% {
    transform: translateY(4px);
  }
  66.6% {
    transform: translateY(-2px);
  }
  83.25% {
    transform: translateY(1px);
  }
  100% {
    transform: translateY(0);
  }
`;

const shake = keyframes`
  16%{
      transform:skew(-14deg)
  }
  33%{
      transform:skew(12deg)
  }
  49%{
      transform:skew(-8deg)
  }
  66%{
      transform:skew(6deg)
  }
  83%{
      transform:skew(-4deg)
  }
`;

const Hvr_Ripple_Out = keyframes`
  100% {
    top: -12px;
    right: -12px;
    bottom: -12px;
    left: -12px;
    opacity: 0;
  }
`;

const GlobalStyle = createGlobalStyle`
  :root {
    --wobbleVertical: ${Wobble_Vertical} 1s ease-in-out;
    --shakeAnim: ${shake} 600ms ease-in-out;
    --HvrRippleOut: ${Hvr_Ripple_Out} 1s ease-in-out;
  }

  html {
    background-color: ${themeGet("colors.nightBlack")};
    overflow: hidden;

    &:before {
      content: ' ';
      display: block;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      background: transparent url(${AutLogo.src}) 0% 0% no-repeat padding-box;
      mix-blend-mode: overlay;
      opacity: 0.5;
      background-position: center;
      background-size: cover;
    }
  }

  .ps__rail-y {
    z-index: 99999;
  }

  body {
    color: ${themeGet("colors.textColor")};
    font-family: ${themeGet("fonts.primary")};
    font-weight: 400;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: ${themeGet("fonts.primary")};
    color: ${themeGet("colors.headingColor")};
  }

  input, textarea {
    font-family: ${themeGet("fonts.primary")};
  }

  button {
    font-family: ${themeGet("fonts.primary")};
  }

  .customModal {
    borderColor: ${themeGet("colors.divider")} !important;
    transform: scale(1) !important;
  }

  section {
    position: relative;
    &.snap {
      @media only screen and (min-width: 992px) {
        scroll-snap-align: start;
        height: 100vh;
      }
    }
  }

  .main-container {
    @media only screen and (min-width: 992px) {

    height: 100vh;
    scrollSnapType: y mandatory;
    scrollPadding: 10px;
    overflowY: scroll;
    }
  }


  /* Modal default style */
  button.modalCloseBtn {
    color: ${themeGet("colors.white", "#ffffff")} !important;
    &.alt {
      background-color: ${themeGet("colors.primary", "#10ac84")} !important;
      box-shadow: 0 8px 38px rgba(16, 172, 132, 0.5) !important;
    }
  }
  .reuseModalHolder {
    border: 0 !important;
    background-color: transparent !important;
    &.search-modal,
    &.video-modal {
      background-color: rgba(255, 255, 255, 0.96) !important;
      overflow-y: auto !important;
      .innerRndComponent {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        iframe {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
        }
      }
    }
    &.demo_switcher_modal {
      border: 0 !important;
      background-color: rgba(16, 30, 77, 0.8) !important;
      .innerRndComponent {
        border-radius: 8px !important;
      }
    }
    &.video-modal {
      background-color: transparent !important;
    }
    .innerRndComponent {
      padding-right: 0 !important;
    }
  }
  .reuseModalCloseBtn {
    cursor: pointer !important;
  }

  .reuseModalOverlay,
  .reuseModalParentWrapper{
    z-index: 99999!important;
  }

  .reuseModalHolder.login-modal{
    @media (min-width: 768px) {
      top: 0!important;
      left: 0!important;
      max-width: 100%!important;
      max-height: 100%!important;
    }
  }

  .drawer-content-wrapper{
    right: -1px;
    @media (max-width: 767px) {
      width: 300px!important;
    }
    .drawer-content {
      padding: 60px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      @media (max-width: 767px) {
        padding: 50px 40px 30px 40px;
      }
      .mobile_menu {
        margin-bottom: 40px;
        flex-grow: 1;
        @media (max-width: 767px) {
          margin-bottom: 30px;
        }
        li{
          margin-bottom: 35px;
          @media (max-width: 767px) {
            margin-bottom: 25px;
          }
          a{
            font-size: 20px;
            font-weight: 400;
            color: #343d48;
            position: relative;
            transition: 0.15s ease-in-out;
            @media (max-width: 767px) {
              font-size: 18px;
            }
            &:hover {
              color: ${themeGet("colors.primary")};
            }
            &:before{
              content: '';
              width: 7px;
              height: 7px;
              background: ${themeGet("colors.primary")};
              border-radius: 50%;
              position: absolute;
              top: 50%;
              left: -15px;
              transform: translateY(-50%);
              opacity: 0;
            }

            &.is-current {
              color: ${themeGet("colors.primary")};
              &:before{
                opacity: 1;
              }
            }
          }
          &.is-current {
            a {
              color: ${themeGet("colors.primary")};
              &:before{
                opacity: 1;
              }
            }
          }
        }
      }
      .navbar_drawer_button button{
        width: 100%;
      }
    }

    .reusecore-drawer__close{
      width: 34px;
      height: 34px;
      position: absolute;
      top: 20px;
      right: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 26px;
      color: ${themeGet("colors.black")};
      @media (max-width: 767px) {
        top: 15px;
        right: 15px;
      }
    }
  }

  .PhoneInputCountry {
    --PhoneInputCountrySelectArrow-color: ${themeGet("colors.white")};
    --PhoneInputCountrySelectArrow-opacity: 1;
  }
`;

export const ContentSnapWrapper = styled.div`
  height: 100vh;
  scroll-snap-type: y mandatory;
  scroll-padding: 10px;
  overflow-y: scroll;
`;

export const ContentWrapper = styled.div`
  overflow: hidden;
`;

export const AppWrapper = styled.div`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  .swiper {
    width: 100%;
    height: 100%;
  }

  .swiper-slide {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100%;
  }

  .sticky-active {
    .navbar {
      padding: 20px 0 21px;
      background-color: ${themeGet("colors.white", "#ffffff")};
      @media only screen and (max-width: 1366px) {
        padding: 15px 0 16px;
      }
      .mobile-menu {
        top: 72px;
      }
    }
  }
`;

export const SectionHeader = styled.header`
  max-width: 550px;
  width: 100%;
  margin: 0 auto 85px;
  text-align: center;
  @media only screen and (max-width: 1600px) {
    margin-bottom: 60px;
  }
  p {
    font-weight: normal;
    line-height: 2;
    margin-bottom: 12px;
    color: ${themeGet("colors.textColor", "#343D48")};
  }
  h2 {
    font-size: 1.75rem;
    line-height: 1.3;
    font-weight: 500;
    color: ${themeGet("colors.headingColor", "#0F2137")};
    margin-bottom: 18px;
    letter-spacing: -0.5px;
    @media only screen and (max-width: 1600px) {
      letter-spacing: -0.7px;
      margin-bottom: 12px;
    }
    @media only screen and (max-width: 991px) {
      line-height: 38px;
      letter-spacing: -0.5px;
    }
  }
  &.section-header-two {
    text-align: left;
    margin-top: -10px;
    margin-bottom: 40px;
    h2 {
      font-size: 2.5rem;
      line-height: 1.35;
      margin-bottom: 25px;
      letter-spacing: -0.5px;
    }
  }
`;

export const GradientWrapper = styled.section`
  flex: 1 0 auto;
  width: 100%;
  overflow: hidden;
  background-image: linear-gradient(
    180deg,
    rgba(246, 247, 249, 0) 0%,
    #f3f7fb 36.35%
  );
`;

export default GlobalStyle;
