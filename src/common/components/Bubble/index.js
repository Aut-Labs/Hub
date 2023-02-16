import React from "react";
import BubbleStyle from "./bubble.style";

const Bubble = ({ position, className, ...props }) => {
  return (
    <BubbleStyle
      className={`${position} ${className || ""}`}
      alt="bubble"
      {...props}
    >
      {props.children}
    </BubbleStyle>
  );
};

Bubble.defaultProps = {
  position: "bottom center",
};

export default Bubble;
