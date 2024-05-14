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
    main: "#F0F5FF",
    light: "#ffffff",
    dark: "#A7B1C4",
    contrastText: "#000000"
  },
  nightBlack: {
    main: "#27292B",
    light: "#4e4e4e",
    dark: "#000000",
    contrastText: "#ffffff"
  }
} as Partial<Palette>;
