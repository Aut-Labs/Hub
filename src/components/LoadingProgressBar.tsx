import { Fade, LinearProgress, SxProps, Theme } from "@mui/material";
import { memo } from "react";

const LoadingProgressBar = ({
  isLoading,
  sx = {}
}: {
  isLoading: boolean;
  sx?: SxProps<Theme>;
}) => {
  return (
    <Fade in={isLoading} unmountOnExit>
      <LinearProgress
        sx={{
          position: "fixed",
          top: "72px",
          width: "100%",
          left: 0,
          ...sx
        }}
      />
    </Fade>
  );
};

export default memo(LoadingProgressBar);
