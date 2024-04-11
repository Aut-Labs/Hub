import { Stack, SvgIcon, Typography, TypographyProps } from "@mui/material";
import { ReactComponent as AutIcon } from "@assets/aut_logo_offwhite.svg";
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
    >
      <SvgIcon
        sx={{
          height: {
            xs: "40px",
            md: "64px"
          },
          width: {
            xs: "40px",
            md: "64px"
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
        {...(props as any)}
      >
        Showcase
        {/* <Typography variant="body">(beta)</Typography> */}
      </Typography>
    </Stack>
  );
};

export default AppTitle;
