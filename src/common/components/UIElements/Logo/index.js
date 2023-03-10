import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import Link from "common/components/Link";
import Image from "common/components/Image";
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
  alignItems,
} from "styled-system";

const StyledImage = styled(Image)`
  ${space}
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
  ${alignItems}
`;

const Logo = forwardRef(
  (
    {
      logoWrapperStyle,
      logoStyle,
      withAnchor,
      anchorProps,
      logoSrc,
      alt,
      ...props
    },
    ref
  ) => {
    return (
      <Link ref={ref} {...props} {...logoWrapperStyle}>
        <StyledImage src={logoSrc.src} alt={alt} {...logoStyle} />
      </Link>
    );
  }
);

Logo.displayName = "Logo";

Logo.propTypes = {
  logoSrc: PropTypes.object,
  alt: PropTypes.string.isRequired,
  logoWrapperStyle: PropTypes.object,
  logoStyle: PropTypes.object,
  withAnchor: PropTypes.bool,
  anchorProps: PropTypes.object,
};

Logo.defaultProps = {
  logoWrapperStyle: {
    display: "inline-flex",
    alignItems: "center",
    mr: "1rem",
    "a:hover": {
      textDecoration: "none",
    },
    "a:focus": {
      textDecoration: "none",
    }
  },
};
export default Logo;
