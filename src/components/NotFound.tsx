import { Box, Button, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function NotFound() {
  const { previousRoute } = useSelector((state: any) => state.ui);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        transform: "translate(-50%, -50%)",
        left: "50%",
        top: "50%"
      }}
    >
      <Typography
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: "10px",
          fontSize: "70px"
        }}
      >
        404.
      </Typography>
      <Typography
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: "70px"
        }}
        variant="h2"
      >
        This page could not be found
      </Typography>
      {/* <Button
        sx={{
          width: "140px",
          height: "50px"
        }}
        type="button"
        component={Link}
        to={previousRoute}
        label="Go back"
      /> */}
    </Box>
  );
}

export default NotFound;
