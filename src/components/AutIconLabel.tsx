import { Paper, SxProps, Typography, styled } from "@mui/material";
import { ReactNode } from "react";
import { ReactComponent as Social } from "@assets/icons/social.svg";
// import { MarketIcons } from "@api/community.api";

interface AutIconLabelProps {
  icon: ReactNode;
  label: string;
  sx?: SxProps;
  textColor?: string;
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

const AutIconLabel = ({
  textColor = "offwhite.main",
  icon,
  label,
  sx = null
}: AutIconLabelProps) => {
  return (
    <AutIconLabelContainer
      sx={{
        backgroundColor: "#27292B",
        ...sx
      }}
    >
      {icon}
      <Typography
        align="center"
        width="100%"
        marginLeft={1}
        color={textColor}
        lineHeight={1}
        variant="caption"
        sx={{
          fontSize: "10px !important"
        }}
      >
        {label}
      </Typography>
    </AutIconLabelContainer>
  );
};

export default AutIconLabel;
