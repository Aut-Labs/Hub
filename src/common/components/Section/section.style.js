import styled from "styled-components";
import {
  space,
  lineHeight,
  size,
  color,
  borderRadius,
  display,
  textAlign,
} from "styled-system";
import { base } from "../base";

const SectionStyle = styled("section")`
  ${space}
  ${color}
  ${size}
  ${lineHeight}
  ${borderRadius}
  ${display}
  ${textAlign}
  ${base}
`;

export default SectionStyle;
