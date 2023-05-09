import {
  Breakpoint,
  ComponentsOverrides,
  ComponentsProps,
  ComponentsVariants,
  PaletteColor,
  TextField,
  Theme
} from "@mui/material";

const fontSize = {
  xs: "16px",
  sm: "16px",
  md: "16px",
  lg: "16px",
  xxl: "24px"
};

const generateColors = (color: PaletteColor, white: PaletteColor) => ({
  "&::placeholder": {
    color: white.dark,
    fontWeight: "normal",
    letterSpacing: "-0.008em",
    fontFamily: "FractulRegular"
  },
  "&::-webkit-input-placeholder": {
    color: white.dark,
    fontWeight: "normal",
    letterSpacing: "-0.008em",
    fontFamily: "FractulRegular"
  },
  "&::-moz-placeholder": {
    color: white.dark,
    fontWeight: "normal",
    letterSpacing: "-0.008em",
    fontFamily: "FractulRegular"
  },
  input: {
    color: white.light,
    fontWeight: "normal",
    letterSpacing: "-0.008em",
    fontFamily: "FractulRegular"
  },
  textarea: {
    color: white.light,
    fontWeight: "normal",
    letterSpacing: "-0.008em",
    fontFamily: "FractulRegular"
  },
  ".MuiInputBase-multiline": {
    borderRadius: "8.5px"
  },

  ".MuiInputBase-input.Mui-disabled": {
    "-webkit-text-fill-color": white.dark
  },
  ".MuiInputBase-root:before, .MuiInputBase-root:not(.Mui-Focused) fieldset": {
    borderColor: color.dark
  },
  ".MuiInputBase-root:hover:not(.Mui-disabled):before, .MuiInputBase-root:hover:not(.Mui-disabled):not(.Mui-Focused) fieldset":
    {
      borderColor: color.dark,
      borderWidth: "2px"
    },
  ".MuiInputBase-root.MuiOutlinedInput-root.Mui-focused fieldset, .MuiInputBase-root.MuiOutlinedInput-root.Mui-focused:hover fieldset":
    {
      borderColor: color.light,
      borderWidth: "2px"
    }
});

export const AutTextField = TextField;

export default (theme: Theme) =>
  ({
    ...theme.components.MuiTextField,
    styleOverrides: {
      root: ({ ownerState: { color } }) => {
        const colorVariant = color || "primary";
        const styles = generateColors(
          theme.palette[colorVariant],
          theme.palette.offWhite
        );
        Object.keys(fontSize).forEach((key: Breakpoint) => {
          styles.input[theme.breakpoints.up(key)] = {
            fontSize: fontSize[key]
          };
          styles.textarea[theme.breakpoints.up(key)] = {
            fontSize: fontSize[key]
          };
        });
        return styles;
      }
    } as ComponentsOverrides<Theme>["MuiTextField"]
  } as {
    defaultProps?: ComponentsProps["MuiTextField"];
    styleOverrides?: ComponentsOverrides<Theme>["MuiTextField"];
    variants?: ComponentsVariants["MuiTextField"];
  });
