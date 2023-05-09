import { Typography } from "@mui/material";
import { pxToRem } from "@utils/text-size";

export const AutHeader = ({
  title,
  subtitle = null,
  titleStyles = {},
  subtitleStyles = {}
}) => {
  return (
    <>
      <Typography
        sx={{
          mb: pxToRem(50),
          ...titleStyles
        }}
        fontSize={pxToRem(40)}
        letterSpacing="6px"
        color="white"
        component="div"
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography
          marginBottom={pxToRem(50)}
          fontSize={pxToRem(20)}
          letterSpacing="1.25px"
          color="white"
          sx={subtitleStyles}
          component="div"
        >
          {subtitle}
        </Typography>
      )}
    </>
  );
};
