import { PaletteColor } from "@mui/material";

declare module "@mui/material/styles/createTypography" {
  interface Typography {
    // @ts-ignore
    xl?: React.CSSProperties;
    // @ts-ignore
    xxl?: React.CSSProperties;
    subtitle1?: React.CSSProperties;
    body?: React.CSSProperties;
    subtitle2?: React.CSSProperties;
    emphasis?: React.CSSProperties;
  }

  interface TypographyOptions {
    xl?: React.CSSProperties;
    // @ts-ignore
    xxl?: React.CSSProperties;
    subtitle1?: React.CSSProperties;
    body?: React.CSSProperties;
    subtitle2?: React.CSSProperties;
    emphasis?: React.CSSProperties;
  }
}

declare module "@mui/material/Button" {
  interface ButtonClasses {
    outlinedOffWhite?: true;
  }
  interface ButtonPropsSizeOverrides {
    normal: true;
    chunky: true;
    square: true;
  }

  interface ButtonPropsVariantOverrides {
    square: true;
  }

  interface ButtonPropsColorOverrides {
    offWhite?: true;
    nightBlack?: true;
  }
}

declare module "@mui/material/Link" {
  interface LinkPropsColorOverrides {
    offWhite?: true;
    nightBlack?: true;
  }
}

declare module "@mui/material/IconButton" {
  interface IconButtonPropsColorOverrides {
    offWhite?: true;
    nightBlack?: true;
  }
}

declare module "@mui/material/CircularProgress" {
  interface CircularProgressPropsColorOverrides {
    offWhite?: true;
    nightBlack?: true;
  }
}

declare module "@mui/material/Slider" {
  interface SliderPropsColorOverrides {
    offWhite?: true;
    nightBlack?: true;
  }
}

declare module "@mui/material/TextField" {
  interface TextFieldClasses {
    outlinedOffWhite?: true;
  }
  interface TextFieldPropsColorOverrides {
    offWhite?: true;
    nightBlack?: true;
  }
}

declare module "@mui/material/Select" {
  interface SelectClasses {
    standardOffWhite?: true;
  }

  interface SelectPropsColorOverrides {
    offWhite?: true;
    nightBlack?: true;
  }

  interface SelectPropsColorOverrides {
    offWhite?: true;
    nightBlack?: true;
  }
}

declare module "@mui/material/InputBase" {
  interface InputBaseClasses {
    offWhite?: true;
  }

  interface InputBasePropsColorOverrides {
    offWhite?: true;
    nightBlack?: true;
  }
}

declare module "@mui/material/styles" {
  interface BreakpointOverrides {
    xxl?: true;
  }

  interface OverridableStringUnion {
    offWhite?: true;
    nightBlack?: true;
  }

  interface Palette {
    offWhite?: PaletteColor;
    nightBlack?: PaletteColor;
    // white?: PaletteColor;
  }
}

declare module "@mui/material/Typography/Typography" {
  interface TypographyPropsVariantOverrides {
    // @ts-ignore
    xl?: true;
    // @ts-ignore
    xxl?: true;
    body?: true;
    subtitle1?: true;
    subtitle2?: true;
    emphasis?: true;
  }
}
