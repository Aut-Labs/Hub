import { themeGet } from "@styled-system/theme-get";
import { base } from "common/components/base";
import styled from "styled-components";

export const BubbleImageWrapper = styled("div")`
  position: relative;
  margin: 0 auto;

  .inner-content {
    transform: translate(-50%, -50%);
    left: 50%;
    top: 50%;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 100%;
    }
    .aut-card-flip {
      display: flex;
      position: absolute;
      border-radius: 50%;
    }
  }

  ${themeGet("mediaQueries.md")} {
    width: 300px;
    height: 300px;
    .inner-content {
      width: 480px;
      height: 480px;

      .aut-card-flip {
        width: 347px;
        height: 347px;
      }
    }
  }

  ${themeGet("mediaQueries.lg")} {
    width: 350px;
    height: 350px;
    .inner-content {
      width: 550px;
      height: 550px;

      .aut-card-flip {
        width: 347px;
        height: 347px;
      }
    }
  }

  ${themeGet("mediaQueries.xxl")} {
    width: 620px;
    height: 620px;
    .inner-content {
      width: 800px;
      height: 800px;

      .aut-card-flip {
        width: 506px;
        height: 506px;
      }
    }
  }
  ${base}
`;

export const BlackHoleWrapper = styled("div")`
  flex: 1;
  width: 100%;
  height: 100%;
  position: relative;

  &:not(.complete):not(.current) {
    opacity: 0.5;
  }
  ${base}
`;

export const Grid = styled("div")`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  grid-gap: 20px;
  display: grid;

  ${themeGet("mediaQueries.xs")} {
    grid-gap: 15px;
    grid-template-areas: "first";
  }

  ${themeGet("mediaQueries.sm")} {
    grid-gap: 15px;
    grid-template-areas: "first second";
  }

  ${themeGet("mediaQueries.md")} {
    grid-template-areas: "first second third";
    grid-gap: 25px;
  }

  ${themeGet("mediaQueries.xl")} {
    grid-template-areas: "first second third forth";
    grid-gap: 25px;
  }
`;
