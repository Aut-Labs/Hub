import { Stack, Typography, TypographyProps } from "@mui/material";

const AppTitle = (props: TypographyProps) => {
  return (
    <Typography
      fontWeight="300"
      fontFamily="FractulAltLight"
      component="h1"
      variant="h1"
      color="white"
      whiteSpace="nowrap"
      {...(props as any)}
    >
      <strong
        style={{
          fontFamily: "FractulAltBold"
        }}
      >
        Nova
      </strong>{" "}
      Showcase <Typography variant="body">(beta)</Typography>
    </Typography>
  );
};

export default AppTitle;
