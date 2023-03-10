import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { base, themed } from '../base';
import NextLink from "next/link";

const LinkWrapper = styled(NextLink)(
  { textDecoration: 'none', alignItems: 'center', cursor: 'pointer' },
  base,
  themed('Link')
);

const Link = ({ children, alignItems, ...props }) => (
  <LinkWrapper {...props}>{children}</LinkWrapper>
);

export default Link;

Link.propTypes = {
  children: PropTypes.any.isRequired,
  ...base.propTypes,
};

Link.defaultProps = {
  m: 0,
  display: 'inline-flex',
};
