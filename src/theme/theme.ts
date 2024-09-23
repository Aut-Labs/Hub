 
import { createTheme } from "@mui/material/styles";
import { Fade } from "@mui/material";
import AutButtonStyles from "./button-styles";
import AutTextFieldStyles from "./field-text-styles";
import AutSelectFieldStyles from "./field-select-styles";
import AutCommitmentSliderStyles from "./commitment-slider-styles";
import AutTextStyles from "./text-styles";
import AutMenuStyles from "./menu-styles";
import AutPalette from "./palette";
import AutDialogStyles from "./dialog-styles";
import "./theme.overrides";

import FractulRegular2 from "@assets/fonts/Fractul/FractulRegular/font.woff";
import FractulRegular from "@assets/fonts/Fractul/FractulRegular/font.woff2";
import FractulAltLight from "@assets/fonts/Fractul/FractulAltLight/font.woff";
import FractulAltLight2 from "@assets/fonts/Fractul/FractulAltLight/font.woff2";
import FractulAltBold from "@assets/fonts/Fractul/FractulAltBold/font.woff";
import FractulAltBold2 from "@assets/fonts/Fractul/FractulAltBold/font.woff2";

const AutTheme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'FractulRegular';
          src: local('FractulRegular'), url(${FractulRegular}) format('woff') , url(${FractulRegular2}) format('woff2');
          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        }
        @font-face {
          font-family: 'FractulAltLight';
          src: local('FractulAltLight'), url(${FractulAltLight}) format('woff'), url(${FractulAltLight2}) format('woff2');
          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        }
        @font-face {
          font-family: 'FractulAltBold';
          src: local('FractulAltBold'), url(${FractulAltBold}) format('woff'), url(${FractulAltBold2}) format('woff2');
          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        }
      `
    },
    MuiTooltip: {
      defaultProps: {
        TransitionComponent: Fade
      },
      styleOverrides: {
        tooltip: {
          padding: "8px 10px",
          borderRadius: "8px"
        }
      }
    },
    MuiUseMediaQuery: {
      defaultProps: {
        noSsr: true
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderStyle: "solid",
          borderWidth: "2px",
          // borderRadius: "16px",
          borderColor: AutPalette.divider
        }
      }
    }
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 768,
      md: 990,
      lg: 1220,
      xl: 1366,
      xxl: 1920
    }
  },
  palette: AutPalette,
  shape: {
    borderRadius: 0
  }
});

AutTheme.typography = AutTextStyles(AutTheme);
AutTheme.components.MuiButton = AutButtonStyles(AutTheme);
AutTheme.components.MuiDialog = AutDialogStyles(AutTheme);
AutTheme.components.MuiTextField = AutTextFieldStyles(AutTheme);
AutTheme.components.MuiSelect = AutSelectFieldStyles(AutTheme);
AutTheme.components.MuiSlider = AutCommitmentSliderStyles(AutTheme);
AutTheme.components.MuiMenu = AutMenuStyles(AutTheme);

export default AutTheme;
