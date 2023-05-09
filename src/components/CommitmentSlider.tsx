import { Typography, Slider, SliderProps, styled } from "@mui/material";
import { pxToRem } from "@utils/text-size";
import { FieldErrors } from "react-hook-form";
import { CommitmentMessages } from "@utils/misc";
import { FormHelperText } from "./Fields";

/* eslint-disable max-len */
export function CommitmentMessage({ value, children = null }) {
  const message = CommitmentMessages(value);
  return (
    <Typography
      color="white"
      whiteSpace="nowrap"
      align="left"
      component="span"
      variant="h4"
      sx={{ display: "flex", mb: "4px", height: "15px" }}
    >
      {message}
    </Typography>
  );
}

const StyledSlider = styled(Slider)({
  width: pxToRem(600),
  height: pxToRem(65),
  borderRadius: "0",
  borderWidth: "2px",
  borderStyle: "solid",
  padding: "0",

  'span[data-index="10"].MuiSlider-mark': {
    display: "none"
  },
  'span[data-index="0"].MuiSlider-mark': {
    display: "none"
  },

  ".MuiSlider-mark": {
    background: "transparent",
    width: "5px",
    height: "5px",
    borderRadius: "50%",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "#009FE3",

    "&.MuiSlider-markActive": {
      border: "none"
    }
  },
  ".MuiSlider-track": {
    borderRight: "0",
    background:
      "transparent linear-gradient(45.57deg, #009fe3 0%, #0399de 8%, #0e8bd3 19%, #2072bf 30%, #3a50a4 41%, #5a2583 53%, #453f94 71%, #38519f 88%, #3458a4 100%) 0% 0%"
  },

  ".MuiSlider-rail": {
    opacity: "0"
  }
});

interface AutSliderProps {
  sliderProps: SliderProps;
  value: any;
  name: string;
  errors: FieldErrors<any>;
}

const errorTypes = {
  min: "Min 1 commitment level!"
};

export const AutSlider = (props: AutSliderProps) => {
  return (
    <div
      style={{
        position: "relative"
      }}
    >
      <CommitmentMessage value={props.value} />
      <div style={{ position: "relative" }}>
        <StyledSlider {...props.sliderProps} />
      </div>
      <div
        style={{
          marginTop: "-3px",
          display: "flex",
          justifyContent: "flex-end"
        }}
      >
        <FormHelperText
          errorTypes={errorTypes}
          value={props.value}
          name={props.name}
          errors={props.errors}
        >
          <Typography color="white" variant="body1">
            You can change your commitment at any time
          </Typography>
        </FormHelperText>
      </div>
    </div>
  );
};
