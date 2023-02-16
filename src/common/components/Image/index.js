import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { base, themed } from "../base";
import NextImage from "../NextImage";

const ImageWrapper = styled("figure")`
  display: flex;

  & > DIV {
    width: 100%;
    height: 100%;
  }
  ${base}
  ${themed('Image')}
`;

const Image = ({ src, alt, ...props }) => (
  <ImageWrapper {...props}>
    <NextImage src={src} alt={alt} />
  </ImageWrapper>
);

export default Image;

Image.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
};

Image.defaultProps = {
  m: 0,
};
