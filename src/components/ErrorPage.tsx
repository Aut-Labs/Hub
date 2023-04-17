import { Box, Typography } from "@mui/material";

function ErrorPage() {
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
        textAlign: "center",
        top: "50%"
      }}
    >
      <Typography
        variant="h1"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: "10px",
          color: "white"
        }}
      >
        500.
      </Typography>
      <Typography
        sx={{
          display: "flex",
          color: "white",
          justifyContent: "center",
          alignItems: "center",
          mb: "70px"
        }}
        variant="h2"
      >
        Something went wrong. <br /> Please refresh the page.
      </Typography>
    </Box>
  );
}

export default ErrorPage;
