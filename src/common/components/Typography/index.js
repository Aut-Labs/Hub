import React from "react";
import DynamicComponent from "./dynamic-component";
import { textStyles } from "./text-styles";

const { h1, h2, h3, subtitle1, subtitle2, body, caption, overline } =
  textStyles;

const Typography = (props) => {
  return (
    <>
      {(() => {
        switch (props?.as) {
          case "h1":
            return (
              <DynamicComponent {...h1} {...props}>
                {props.children}
              </DynamicComponent>
            );
          case "h2":
            return (
              <DynamicComponent {...h2} {...props}>
                {props.children}
              </DynamicComponent>
            );
          case "h3":
            return (
              <DynamicComponent {...h3} {...props}>
                {props.children}
              </DynamicComponent>
            );
          case "subtitle1":
            return (
              <DynamicComponent {...subtitle1} {...props} as="p">
                {props.children}
              </DynamicComponent>
            );
          case "subtitle2":
            return (
              <DynamicComponent {...subtitle2} {...props} as="p">
                {props.children}
              </DynamicComponent>
            );
          case "body":
            return (
              <DynamicComponent {...body} {...props} as="p">
                {props.children}
              </DynamicComponent>
            );
          case "body2":
            return (
              <DynamicComponent {...body} {...props} as="p">
                {props.children}
              </DynamicComponent>
            );
          case "caption":
            return (
              <DynamicComponent {...caption} {...props} as="p">
                {props.children}
              </DynamicComponent>
            );
          case "overline":
            return (
              <DynamicComponent
                {...overline}
                {...props}
                as="p"
                style={{
                  textTransform: "uppercase",
                }}
              >
                {props.children}
              </DynamicComponent>
            );
          default:
            return (
              <DynamicComponent {...body} {...props} as="p">
                {props.children}
              </DynamicComponent>
            );
        }
      })()}
    </>
  );
};

export default Typography;
