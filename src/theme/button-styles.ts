import {
  Breakpoint,
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
    ...theme.components.MuiButton,
    styleOverrides: {
      outlinedOffWhite: {
        borderColor: theme.palette.divider,
        "&:hover": {
          backgroundColor: theme.palette.offWhite.main,
          color: theme.palette.nightBlack.main
        },
        "&.Mui-disabled": {
          borderColor: theme.palette.divider,
          color: theme.palette.offWhite.main,
          opacity: "0.5"
        }
      },
      outlinedPrimary: {
        borderColor: theme.palette.primary.main,
        "&:hover": {
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.offWhite.main
        },
        "&.Mui-disabled": {
          borderColor: theme.palette.primary.main,
          color: theme.palette.primary.main,
          opacity: "0.5"
        }
      }
      // containedPrimary: {
      //   // borderColor: theme.palette.primary.main,
      //   // "&:hover": {
      //   //   backgroundColor: theme.palette.primary.main,
      //   //   color: theme.palette.offWhite.main
      //   // },
      //   // "&.Mui-disabled": {
      //   //   borderColor: theme.palette.primary.main,
      //   //   color: theme.palette.primary.main,
      //   //   opacity: "0.5"
      //   // }
      // }
    },
    variants: [
      {
        props: {
          variant: "outlined"
        },
        style: {
          "&.MuiButton-root": {
            borderWidth: "3px",
            borderStyle: "solid",
            borderRadius: "50px"
          }
        }
      },
      {
        props: {
          variant: "contained"
        },
        style: {
          "&.MuiButton-root": {
            borderRadius: "8.5px"
          }
        }
      },
      {
        props: {
          variant: "square"
        },
        style: {
          "&.MuiButton-root": {
            borderWidth: "3px",
            borderStyle: "solid"
          }
        }
      },
      ...Object.keys(buttonStyles).reduce((prev, curr) => {
        const {
          fontSize,
          paddingBottom,
          paddingLeft,
          paddingRight,
          paddingTop,
          ...restStyles
        } = buttonStyles[curr];
        const currStyle = restStyles;
        Object.keys(fontSize).forEach((key: Breakpoint) => {
          currStyle[theme.breakpoints.up(key)] = {
            fontSize: fontSize[key]
          };
        });
        Object.keys(paddingBottom).forEach((key: Breakpoint) => {
          currStyle[theme.breakpoints.up(key)] = {
            ...currStyle[theme.breakpoints.up(key)],
            paddingBottom: paddingBottom[key]
          };
        });
        Object.keys(paddingLeft).forEach((key: Breakpoint) => {
          currStyle[theme.breakpoints.up(key)] = {
            ...currStyle[theme.breakpoints.up(key)],
            paddingLeft: paddingLeft[key]
          };
        });
        Object.keys(paddingRight).forEach((key: Breakpoint) => {
          currStyle[theme.breakpoints.up(key)] = {
            ...currStyle[theme.breakpoints.up(key)],
            paddingRight: paddingRight[key]
          };
        });

        Object.keys(paddingTop).forEach((key: Breakpoint) => {
          currStyle[theme.breakpoints.up(key)] = {
            ...currStyle[theme.breakpoints.up(key)],
            paddingTop: paddingTop[key]
          };
        });

        prev = [
          ...prev,
          {
            props: {
              size: curr as any
            },
            style: currStyle
          }
        ];

        return prev;
      }, [] as ComponentsVariants["MuiButton"])
    ]
  } as {
    defaultProps?: ComponentsProps["MuiButton"];
    styleOverrides?: ComponentsOverrides<Theme>["MuiButton"];
    variants?: ComponentsVariants["MuiButton"];
  });
