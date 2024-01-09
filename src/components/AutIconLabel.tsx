import { Paper, SxProps, Typography, styled } from "@mui/material";
import { ReactNode } from "react";

interface AutIconLabelProps {
  icon: ReactNode;
  label: string;
  sx?: SxProps;
}

const AutIconLabelContainer = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.divider,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.offWhite.main,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: "8px",
  display: "flex",
  alignItems: "center"
}));

const AutIconLabel = ({ icon, label, sx = null }: AutIconLabelProps) => {
  return (
    <AutIconLabelContainer sx={sx}>
      {icon}
      <Typography
        align="center"
        marginLeft={1}
        color="offWhite.main"
        lineHeight={1}
        variant="body"
      >
        {label}
      </Typography>
    </AutIconLabelContainer>
  );
};

export default AutIconLabel;
