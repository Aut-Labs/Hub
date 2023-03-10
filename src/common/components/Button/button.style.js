import styled from "styled-components";
import { variant, alignItems, boxShadow, fontWeight, minWidth } from "styled-system";
import { buttonStyle, colorStyle, sizeStyle } from "../customVariant";
import { themeGet } from "@styled-system/theme-get";
import { base } from "../base";

export const buttonStyles = {
  normal: {
    fontFamily: 'var(--fractul-alt-light)',
    letterSpacing: "0.01em",
    fontSize: {
      _: "14px",
      xs: "16px",
      sm: "16px",
      md: "16px",
      xxl: "20px",
    },
    paddingTop: {
      _: "8px",
      xs: "10px",
      sm: "12px",
      md: "12px",
      xxl: "18px",
    },
    paddingBottom: {
      _: "8px",
      xs: "10px",
      sm: "12px",
      md: "12px",
      xxl: "18px",
    },
    paddingLeft: {
      _: "16px",
      xs: "32px",
      sm: "40px",
      md: "48px",
      xxl: "90px",
    },
    paddingRight: {
      _: "16px",
      xs: "32px",
      sm: "40px",
      md: "48px",
      xxl: "90px",
    },
  },
  chunky: {
    fontFamily: 'var(--fractul-alt-light)',
    letterSpacing: "0.01em",
    fontSize: {
      _: "14px",
      xs: "16px",
      sm: "16px",
      md: "20px",
      xxl: "24px",
    },
    paddingTop: {
      _: "16px",
      xs: "16px",
      sm: "24px",
      md: "24px",
      xxl: "40px",
    },
    paddingBottom: {
      _: "16px",
      xs: "16px",
      sm: "24px",
      md: "24px",
      xxl: "40px",
    },
    paddingLeft: {
      _: "16px",
      xs: "32px",
      sm: "40px",
      md: "48px",
      xxl: "90px",
    },
    paddingRight: {
      _: "16px",
      xs: "32px",
      sm: "40px",
      md: "48px",
      xxl: "90px",
    },
  },
  square: {
    fontFamily: 'var(--fractul-alt-light)',
    letterSpacing: "0.01em",
    borderRadius: 0,
    fontSize: {
      _: "14px",
      xs: "16px",
      sm: "16px",
      md: "16px",
      xxl: "20px",
    },
    paddingTop: {
      _: "8px",
      xs: "12px",
      sm: "14px",
      md: "14px",
      xxl: "22px",
    },
    paddingBottom: {
      _: "8px",
      xs: "12px",
      sm: "14px",
      md: "14px",
      xxl: "22px",
    },
    paddingLeft: {
      _: "17px",
      xs: "18px",
      sm: "22px",
      md: "24px",
      xxl: "30px",
    },
    paddingBottom: {
      _: "17px",
      xs: "18px",
      sm: "22px",
      md: "24px",
      xxl: "30px",
    },
  },
};

const ButtonStyle = styled("button")`
  cursor: pointer;
  outline: none;
  text-decoration: none;
  transition: all 0.3s ease;
  text-transform: uppercase;
  background-color: ${themeGet("colors.transparent")};

  &[disabled],
  &[disabled]:hover {
    cursor: unset;
    background-color: ${themeGet("colors.transparent")};
    color: ${themeGet("colors.textDisabled")};
    border-color: ${themeGet("colors.borderDisabled")};
  }

  &.is-material {
    box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.2),
      0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12);
  }

  /* When button on loading stage */
  &.is-loading {
    .btn-text {
      padding-left: ${themeGet("space.2", "8")}px;
      padding-right: ${themeGet("space.2", "8")}px;
    }

    .reusecore__loader {
      margin-left: 4px;
    }
  }

  ${alignItems}
  ${minWidth}
  ${boxShadow}
  ${buttonStyle}
  ${colorStyle}
  ${sizeStyle}
  ${fontWeight}
  ${base}
`;

// prop types can also be added from the style functions
ButtonStyle.propTypes = {
  ...alignItems.propTypes,
  ...boxShadow.propTypes,
  ...variant.propTypes,
};

ButtonStyle.displayName = "ButtonStyle";

export default ButtonStyle;
