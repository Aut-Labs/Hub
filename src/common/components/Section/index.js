import React from "react";
import SectionStyle from "./section.style";

const Section = (props) => {
  return <SectionStyle {...props}>{props.children}</SectionStyle>;
};

Section.defaultProps = {
  as: "section",
};

export default Section;
