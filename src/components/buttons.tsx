import { Button, ButtonProps } from "@mui/material";
import { styled } from "@mui/material/styles";

export const AutButton = styled<ButtonProps<any, any>>(Button)(({ theme }) => ({
  // "&.MuiButton-root": {
  //   border: `3px solid ${theme.palette.primary.main}`,
  //   borderRadius: "50px",
  //   textDecoration: "uppercase",
  //   color: "white",
  //   letterSpacing: "3px",
  //   fontSize: pxToRem(20),
  //   "&.Mui-disabled": {
  //     color: "white",
  //     opacity: ".3"
  //   },
  //   "&:hover": {
  //     backgroundColor: "#009ADE",
  //     color: "white"
  //   }
  // }
}));
