import themeGet from "@styled-system/theme-get";
import styled from "styled-components";
import {
  space,
  lineHeight,
  size,
  color,
  borderRadius,
  display,
  textAlign,
  zIndex,
} from "styled-system";
import { base } from "../base";
import Image from "../Image";

const BubbleStyle = styled(Image)`
  display: none;
  position: absolute;
  width: 1300px;
  height: 1300px;
  z-index: -1;
  opacity: 1;
  filter: blur(50px);
  -webkit-filter: blur(50px);

  &.center,
  &.bottom {
    left: 50%;
    transform: translate(-50%) rotate(-57deg);
  }

  ${themeGet("mediaQueries.md")} {
    display: block;
    &.center,
    &.bottom {
      bottom: -950px;
    }

    &.top,
    &.right {
      top: -750px;
      right: -850px;
    }
  }
  ${themeGet("mediaQueries.xxl")} {
    &.center,
    &.bottom {
      bottom: -870px;
    }
  }
  ${base}
  ${space}
  ${color}
  ${size}
  ${lineHeight}
  ${borderRadius}
  ${display}
  ${textAlign}
  ${zIndex}
`;

export default BubbleStyle;
