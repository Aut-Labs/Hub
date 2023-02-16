import { rgba } from "polished";

const mainColors = {
  primary: "#14ECEC",
  secondary: "#112BB3",
  nightBlack: "#262626",
  offWhite: "#EBEBF2",
  error: "#FF0000",
}

const colors = {
  ...mainColors,
  textPrimary: mainColors.nightBlack,
  textSecondary: mainColors.secondary,
  textOffWhite: mainColors.offWhite,
  textDisabled: '#8B8B8E',
  borderDisabled: '#959595',
  black: "#000000",
  white: "#ffffff",
  transparent: "transparent",

  nightGradient: `linear-gradient(to right, #14c7ec, #192afc),
  url(https://grainy-gradients.vercel.app/noise.svg)`,

  // old stuff
  labelColor: "#767676",
  lightBorder: "#f1f4f6",
  inactiveField: "#F7F8FB",
  inactiveButton: "#b7dbdd",
  inactiveIcon: "#EBEBEB",
  primaryHover: "#3C74FF",
  secondaryHover: "#112045",
  yellow: "#FFA740",
  yellowHover: "#F6C416",
  borderColor: "#E8EBF1",
  light: "#FAFBFF",
  gray: "#E4E4E4",
  headingColor: "#FFF",
  quoteText: "#343D48",
  menu: "#0D233E",
  textColor: rgba("#fff", 0.7), // 4
  linkColor: "#2b9eff",
  shadow: "rgba(38, 78, 118, 0.1)",
};

export default colors;
