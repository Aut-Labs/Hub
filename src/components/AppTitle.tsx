import { Stack, Typography, TypographyProps } from "@mui/material";
import { ReactComponent as AutIcon } from "@assets/aut_logo_offwhite.svg";
const AppTitle = (props: TypographyProps) => {
  return (
    <Stack direction="row" alignItems="center" justifyContent="center">
      <AutIcon
        style={{ marginBottom: "14px", marginRight: "22px" }}
        width={50}
        height={50}
      />
      <Typography
        marginTop="14px"
        fontWeight="300"
        fontFamily="FractulAltLight"
        component="h1"
        variant="h1"
        color="white"
        whiteSpace="nowrap"
        marginStart="14px"
        {...(props as any)}
      >
        Showcase
        {/* <Typography variant="body">(beta)</Typography> */}
      </Typography>
    </Stack>
  );
};

export default AppTitle;
