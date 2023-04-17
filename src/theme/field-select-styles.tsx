import {
  Breakpoint,
  ComponentsOverrides,
  ComponentsProps,
  ComponentsVariants,
  PaletteColor,
  Select,
  SelectProps,
  Theme,
  darken,
  styled,
  useTheme
} from "@mui/material";
import clsx from "clsx";

const isNullEmptyOrUndefined = (v: any) =>
  v === null || v === "" || v === undefined;

const SelectWrapper = styled("div")({
  display: "flex",
  flexDirection: "column",
  position: "relative",
  ".auto-helper-info, .auto-helper-error": {
    bottom: "-20px"
  }
});

interface AutSelectProps extends Partial<SelectProps> {
  helperText?: JSX.Element;
}

const fontSize = {
  xs: "16px",
  sm: "16px",
  md: "16px",
  lg: "16px",
  xxl: "24px"
};

export const AutSelectField = ({
  helperText,
  sx,
  className,
  ...props
}: AutSelectProps) => {
  const theme = useTheme();
  return (
    <SelectWrapper sx={sx}>
      <Select
        className={clsx(className, {
          ["aut-selected"]: !isNullEmptyOrUndefined(props.value)
        })}
        MenuProps={{
          MenuListProps: {
            sx: {
              ".MuiButtonBase-root.Mui-selected": {
                backgroundColor: darken(theme.palette[props.color].dark, 0.1)
              },
              ".MuiButtonBase-root.Mui-selected:hover": {
                backgroundColor: theme.palette[props.color].dark
              }
            }
          },
          PaperProps: {
            sx: {
              borderColor: theme.palette[props.color].dark
            }
          }
        }}
        {...props}
      />
      {helperText}
    </SelectWrapper>
  );
};

const generateColors = (color: PaletteColor) => ({
  color: color.dark,
  ".MuiInput-input": {
    color: "#828282"
  },
  "&.aut-selected": {
    ".MuiInput-input": {
      color: color.light
    }
  },
  ".MuiSvgIcon-root": {
    color: color.light
  },
  "&.MuiInputBase-root:before": {
    borderColor: color.dark
  },
  "&.MuiInputBase-root:hover:not(.Mui-disabled):before": {
    borderColor: color.dark
  }
});

export default (theme: Theme) =>
  ({
    ...theme.components.MuiSelect,
    styleOverrides: {
      root: {
        color: theme.palette.offWhite.dark,
        ".MuiInput-input": {
          textAlign: "left"
        },
        fontWeight: "normal",
        letterSpacing: "-0.008em",
        fontFamily: "FractulRegular",
        "&.MuiInputBase-colorOffWhite": generateColors(theme.palette.offWhite),
        "&.MuiInputBase-colorPrimary": generateColors(theme.palette.primary),
        ...Object.keys(fontSize).reduce((prev, key: Breakpoint) => {
          prev[theme.breakpoints.up(key)] = {
            fontSize: fontSize[key]
          };
          return prev;
        }, {})
      }
    } as ComponentsOverrides<Theme>["MuiSelect"]
  } as {
    defaultProps?: ComponentsProps["MuiSelect"];
    styleOverrides?: ComponentsOverrides<Theme>["MuiSelect"];
    variants?: ComponentsVariants["MuiSelect"];
  });
