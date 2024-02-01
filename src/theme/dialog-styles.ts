import {
  ComponentsOverrides,
  ComponentsProps,
  ComponentsVariants,
  Theme
} from "@mui/material";

export const buttonStyles = {
  normal: {
    fontFamily: "FractulAltLight",
    letterSpacing: "0.01em",
    fontSize: {
      xs: "16px",
      sm: "16px",
      md: "16px",
      xxl: "20px"
    },
    paddingTop: {
      xs: "10px",
      sm: "12px",
      md: "12px",
      xxl: "18px"
    },
    paddingBottom: {
      xs: "10px",
      sm: "12px",
      md: "12px",
      xxl: "18px"
    },
    paddingLeft: {
      xs: "32px",
      sm: "40px",
      md: "48px",
      xxl: "90px"
    },
    paddingRight: {
      xs: "32px",
      sm: "40px",
      md: "48px",
      xxl: "90px"
    }
  },
  chunky: {
    fontFamily: "FractulAltLight",
    letterSpacing: "0.01em",
    fontSize: {
      xs: "16px",
      sm: "16px",
      md: "20px",
      xxl: "24px"
    },
    paddingTop: {
      xs: "16px",
      sm: "24px",
      md: "24px",
      xxl: "40px"
    },
    paddingBottom: {
      xs: "16px",
      sm: "24px",
      md: "24px",
      xxl: "40px"
    },
    paddingLeft: {
      xs: "32px",
      sm: "40px",
      md: "48px",
      xxl: "90px"
    },
    paddingRight: {
      xs: "32px",
      sm: "40px",
      md: "48px",
      xxl: "90px"
    }
  },
  square: {
    fontFamily: "FractulAltLight",
    letterSpacing: "0.01em",
    borderRadius: 0,
    fontSize: {
      xs: "16px",
      sm: "16px",
      md: "16px",
      xxl: "20px"
    },
    paddingTop: {
      xs: "12px",
      sm: "14px",
      md: "14px",
      xxl: "22px"
    },
    paddingBottom: {
      xs: "12px",
      sm: "14px",
      md: "14px",
      xxl: "22px"
    },
    paddingLeft: {
      xs: "18px",
      sm: "22px",
      md: "24px",
      xxl: "30px"
    },
    paddingRight: {
      xs: "18px",
      sm: "22px",
      md: "24px",
      xxl: "30px"
    }
  }
};

export default (theme: Theme) =>
  ({
    ...theme.components.MuiDialog,
    styleOverrides: {
      container: {
        backdropFilter: "blur(30px)"
      },
      paper: {
        backgroundColor: theme.palette.nightBlack.main,
        borderColor: theme.palette.offWhite.main
      }
      //   outlinedOffWhite: {
      //     borderColor: theme.palette.offWhite.main,
      //     "&:hover": {
      //       backgroundColor: theme.palette.offWhite.main,
      //       color: theme.palette.nightBlack.main
      //     },
      //     "&.Mui-disabled": {
      //       borderColor: theme.palette.offWhite.main,
      //       color: theme.palette.offWhite.main,
      //       opacity: "0.5"
      //     }
      //   }
    }
  }) as {
    defaultProps?: ComponentsProps["MuiDialog"];
    styleOverrides?: ComponentsOverrides<Theme>["MuiDialog"];
    variants?: ComponentsVariants["MuiDialog"];
  };
