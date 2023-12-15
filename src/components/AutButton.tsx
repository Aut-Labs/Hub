import { Button, ButtonProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import { pxToRem } from "@utils/text-size";

export const AutButton = styled<ButtonProps<any, any>>(Button)(({ theme }) => ({
  "&.MuiButton-root": {
    border: `${pxToRem(5)} solid ${theme.palette.primary.main}`,
    borderRadius: "50px",
    textDecoration: "uppercase",
    color: "white",
    letterSpacing: "3px",
    fontSize: "20px",
    "&.Mui-disabled": {
      color: "white",
      opacity: ".3"
    },
    "&:hover": {
      backgroundColor: "#009ADE",
      color: "white"
    }
  }
}));

export const AutButtonVariant = styled<ButtonProps<any, any>>(Button)(
  ({ theme }) => ({
    "&.MuiButton-root": {
      border: `2px solid white`,
      textDecoration: "uppercase",
      color: "white",
      letterSpacing: "3px",
      fontSize: "12px",
      "&.Mui-disabled": {
        color: "white",
        opacity: ".3"
      },
      "&:hover": {
        backgroundColor: "#009ADE",
        color: "white"
      }
    }
  })
);

export const AutOsButton = styled<ButtonProps<any, any>>(Button)(
  ({ theme }) => ({
    "&.MuiButton-root": {
      background: "#576176",
      borderRadius: "8px",
      border: "none",
      textTransform: "none",
      fontWeight: "700",
      color: "white",
      display: "flex",
      height: "40px",
      minWidth: "128px",
      justifyContent: "center",
      alignItems: "center",
      gap: "8px",
      flexShrink: 0,
      letterSpacing: "3px",
      fontSize: "20px",
      "&.Mui-disabled": {
        color: "#818CA2",
        opacity: "1"
      },
      "&:hover": {
        backgroundColor: "#818CA2",
        color: "white"
      }
    }
  })
);
