import themeGet from "@styled-system/theme-get";
import { base } from "common/components/base";
import styled, { css } from "styled-components";

const ContainerWrapper = styled("div")`
  margin-left: auto;
  margin-right: auto;
  ${(props) =>
    props.fullWidth &&
    css`
      width: 100%;
      max-width: none !important;
    `};
  ${(props) =>
    (props.noGutter &&
      css`
        padding-left: 0;
        padding-right: 0;
      `) ||
    css`
      padding-left: 30px;
      padding-right: 30px;
    `};
  ${themeGet("mediaQueries.sm")} {
    max-width: 750px;
    width: 100%;
  }
  ${themeGet("mediaQueries.md")} {
    max-width: 970px;
    width: 100%;
  }
  ${themeGet("mediaQueries.lg")} {
    max-width: ${(props) => props.width || "1170px"};
    width: 100%;
  }
  ${base}
`;

export default ContainerWrapper;
