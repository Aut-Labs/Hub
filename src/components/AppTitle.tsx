import { Stack, SvgIcon, Typography, TypographyProps } from "@mui/material";
import AutIcon from "@assets/aut_logo_offwhite.svg?react";

const AppTitle = (props: TypographyProps) => {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{
        flexDirection: {
          xs: "column",
          md: "row"
        }
      }}
      {...(props as any)}
    >
      <SvgIcon
        sx={{
          height: {
            xs: "40px",
            md: "55px"
          },
          width: {
            xs: "40px",
            md: "55px"
          }
        }}
        inheritViewBox
        component={AutIcon}
      ></SvgIcon>
      <Typography
        fontFamily="FractulAltLight"
        fontWeight={700}
        variant="h3"
        color="white"
        whiteSpace="nowrap"
        sx={{
          marginLeft: {
            xs: "8px",
            md: "14px"
          },
          fontSize: {
            xs: "24px",
            md: "32px"
          }
        }}
      >
        The Hub
      </Typography>
    </Stack>
  );
};

export default AppTitle;
