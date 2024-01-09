import { Box, Paper, SxProps, Typography, styled } from "@mui/material";
import { ReactNode } from "react";

interface AutValueLabelProps {
  value: string;
  label: string;
  sx?: SxProps;
}

const AutValueLabelContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.offWhite.main,
  display: "flex",
  alignItems: "center"
}));

const AutValueLabel = ({ value, label, sx = null }: AutValueLabelProps) => {
  return (
    <AutValueLabelContainer sx={sx}>
      <Typography
        align="center"
        marginLeft={1}
        color="offWhite"
        lineHeight={1}
        fontWeight={600}
        variant="body"
      >
        {value}
      </Typography>
      <Typography
        align="center"
        marginLeft={1}
        whiteSpace={"nowrap"}
        color="offWhite"
        lineHeight={1}
        variant="body"
      >
        {label}
      </Typography>
    </AutValueLabelContainer>
  );
};

export default AutValueLabel;
