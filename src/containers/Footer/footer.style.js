import { themeGet } from "@styled-system/theme-get";
import { base } from "common/components/base";
import Section from "common/components/Section";
import styled from "styled-components";
import {
  alignItems,
  display,
  flexDirection,
  gridGap,
  gridTemplateColumns,
  justifyContent,
} from "styled-system";

export const FooterSection = styled(Section)`
  overflow: hidden;
  position: relative;
  margin-top: 160px;
  width: 100%;
`;

export const Grid = styled("div")`
  display: grid;
  width: 100%;
  border-top: 2px solid ${themeGet("color.offWhite")};
  ${base}
  ${gridTemplateColumns}
`;

export const AboutUs = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  ${alignItems}
`;

export const FooterWidgetItem = styled("li")`
  &:last-child {
    margin-bottom: 0;
  }
  a {
    text-transform: inherit;
    color: ${themeGet("colors.textColor")};
    &:hover {
      color: ${themeGet("colors.white")};
    }
  }
  ${base};
`;

export const FooterWidget = styled.div`
  display: flex;
  flex-direction: column;
  &:last-child {
    margin-right: 0;
  }
  ${display}
`;

export const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  ${alignItems}
`;

export const ColumnWrapper = styled.div`
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  align-content: center;
  display: flex;
`;

export const Social = styled("div")`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: flex-start;
  flex: 30%;

  ${base}
  ${alignItems}
  ${justifyContent}
`;

export const SocialLinks = styled("div")`
  display: flex;
  align-items: center;

  ${base}
  ${gridGap}
  ${flexDirection}
`;
