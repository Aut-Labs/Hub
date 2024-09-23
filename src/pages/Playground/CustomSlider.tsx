import { Box, Slider, Typography } from "@mui/material";

export const CustomSlider = ({ value, onChange, min, max, step }) => (
  <Box sx={{ width: "100%" }}>
    <Slider
      value={value}
      onChange={onChange}
      min={min}
      max={max}
      step={step}
      sx={{
        width: "100%",
        height: "40px",
        "& .MuiSlider-markLabel": {
          color: "white",
          fontFamily: "FractulRegular"
        },
        "& .MuiSlider-mark": { color: "transparent" },
        "& .MuiSlider-thumb": {
          width: "16px",
          height: "16px"
        },
        "& .MuiSlider-valueLabel": {
          fontFamily: "FractulRegular"
        }
      }}
      color="offWhite"
      valueLabelDisplay="auto"
    />
    <Box sx={{ display: "flex", justifyContent: "space-between", mt: "1px" }}>
      <Typography fontFamily="FractulRegular" color="white" variant="caption">
        {min}
      </Typography>
      <Typography fontFamily="FractulRegular" color="white" variant="caption">
        {max}
      </Typography>
    </Box>
  </Box>
);
