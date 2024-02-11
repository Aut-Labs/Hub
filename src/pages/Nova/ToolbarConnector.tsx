import { Box, Button, Link, Toolbar } from "@mui/material";
import AppTitle from "@components/AppTitle";
import { useAutConnector, useWalletConnector } from "@aut-labs/connector";

export const TOOLBAR_HEIGHT = 88;

export const ToolbarConnector = () => {
  const { isConnected, disconnect } = useAutConnector();
  const { open } = useWalletConnector();

  console.log("isConnected: ", isConnected);
  const connectDisconnectToggle = async () => {
    if (isConnected) {
      disconnect();
    } else {
      open();
    }
  };

  return (
    <Box>
      <Toolbar
        sx={{
          width: "100%",
          zIndex: 99,
          position: "fixed",
          top: 0,
          backgroundColor: "nightBlack.main",
          boxShadow: 2,
          "&.MuiToolbar-root": {
            paddingLeft: 6,
            paddingRight: 6,
            minHeight: `${TOOLBAR_HEIGHT}px`,
            justifyContent: "space-between",
            alignItems: "center",
            gap: {
              xs: "8px",
              sm: 0
            },
            flexDirection: {
              xs: "column",
              sm: "row"
            },
            py: {
              xs: "8px",
              sm: 0
            }
          }
        }}
      >
        {/* <img
          src={Logo}
          onClick={() => {
            navigate("/");
          }}
          alt="Āut Logo"
        /> */}
        <AppTitle
        // mb={{
        //   xs: "16px",
        //   lg: "24px",
        //   xxl: "32px"
        // }}
        // variant="h2"
        />
        <div>
          <Link
            fontSize={24}
            color="#FFF"
            href="https://aut.id/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ textDecoration: "none", cursor: "pointer" }}
          >
            Āut Labs
          </Link>
          <Link
            fontSize={24}
            color="#FFF"
            href="https://docs.aut.id/v2/intro/what-is-aut"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              textDecoration: "none",
              cursor: "pointer",
              ml: "33px",
              mr: "33px"
            }}
          >
            Docs
          </Link>
          <Button
            onClick={connectDisconnectToggle}
            sx={{
              width: "220px",
              height: "55px"
            }}
            color="offWhite"
            variant="outlined"
          >
            {isConnected ? "Disconnect" : "Connect"}
          </Button>
        </div>
      </Toolbar>
    </Box>
  );
};
