import { Palette } from "@mui/material";

export default {
  background: {
    default: "#262626",
    paper: "#EBEBF2"
  },
  primary: {
    main: "#256bb0",
    light: "#6199e2",
    dark: "#004180",
    contrastText: "#ffffff"
  },
  secondary: {
    main: "#112BB3",
    light: "#5d55e6",
    dark: "#000582",
    contrastText: "#ffffff"
  },
  divider: "rgba(241,245,249,.12)",
  offWhite: {
    main: "#EBEBF2",
    light: "#ffffff",
    dark: "#b9b9bf",
    contrastText: "#000000"
  },
  autGrey: {
    main: "rgb(107, 114, 128)",
    light: "rgb(136, 142, 153)",
    dark: "rgb(74, 79, 89)",
    contrastText: "#fff"
  },
  nightBlack: {
    main: "#262626",
    light: "#4e4e4e",
    dark: "#000000",
    contrastText: "#ffffff"
  }
} as Partial<Palette>;
