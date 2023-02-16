import React from "react";
import styled from "styled-components";
import {
  space,
  lineHeight,
  fontSize,
  fontStyle,
  size,
  color,
  colorStyle,
  textStyle,
  fontFamily,
  fontWeight,
  letterSpacing,
  borderRadius,
  display,
  textAlign,
  maxWidth,
  zIndex,
} from "styled-system";

const StyledDynamicComponent = styled("p")`
  ${space}
  ${maxWidth}
  ${fontSize}
  ${fontStyle}
  ${color}
  ${size}
  ${colorStyle}
  ${textStyle}
  ${lineHeight}
  ${letterSpacing}
  ${fontFamily}
  ${fontWeight}
  ${borderRadius}
  ${display}
  ${textAlign}
  ${zIndex}
`;

const DynamicComponent = ({ children, ...props }) => {
  return <StyledDynamicComponent {...props}>{children}</StyledDynamicComponent>;
};

DynamicComponent.defaultProps = {
  as: "p",
};

export default DynamicComponent;
