import { Stack, Typography, TypographyProps } from "@mui/material";
import { ReactComponent as AutIcon } from "@assets/aut_logo_offwhite.svg";
const AppTitle = (props: TypographyProps) => {
  return (
    <Stack direction="row" alignItems="center" justifyContent="center">
      <AutIcon style={{ marginRight: "22px" }} width={72} height={72} />
      <Typography
        fontFamily="FractulAltLight"
        fontWeight={700}
        variant="h3"
        color="white"
        whiteSpace="nowrap"
        marginLeft="14px"
        {...(props as any)}
      >
        Showcase
        {/* <Typography variant="body">(beta)</Typography> */}
      </Typography>
    </Stack>
  );
};

export default AppTitle;
