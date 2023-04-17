import {
  ComponentsOverrides,
  ComponentsProps,
  ComponentsVariants,
  Theme
} from "@mui/material";

export default (theme: Theme) =>
  ({
    ...theme.components.MuiMenu,
    styleOverrides: {
      paper: {}
    } as ComponentsOverrides<Theme>["MuiMenu"]
  } as {
    defaultProps?: ComponentsProps["MuiMenu"];
    styleOverrides?: ComponentsOverrides<Theme>["MuiMenu"];
    variants?: ComponentsVariants["MuiMenu"];
  });
