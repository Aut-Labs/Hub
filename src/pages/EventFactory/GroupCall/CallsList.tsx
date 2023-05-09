/* eslint-disable react/no-unstable-nested-components */
import { Box, Typography } from "@mui/material";
import { pxToRem } from "@utils/text-size";

const CallsList = () => {
  return (
    <div className="sw-tasks-list-base-container">
      <Box
        sx={{
          pt: pxToRem(100),
          m: 0,
          gridGap: "0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column"
        }}
        className="sw-box"
      >
        <Typography
          sx={{
            color: "white",
            mb: pxToRem(30),
            fontSize: pxToRem(30)
          }}
        >
          No Community Gatherings yet!
        </Typography>
      </Box>
    </div>
  );
};

export default CallsList;
