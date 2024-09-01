import { Box, Button, Link, Toolbar, Typography } from "@mui/material";
import AppTitle from "@components/AppTitle";
import { useAutConnector, useWalletConnector } from "@aut-labs/connector";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@store/store.model";
import { hubApi } from "@api/hub.api";
import { autUrls, environment } from "@api/environment";
import { memo } from "react";

export const TOOLBAR_HEIGHT = 70;

const ToolbarConnector = () => {
  const { isConnected, disconnect } = useAutConnector({
    defaultChainId: +environment.defaultChainId
  });
  const { open } = useWalletConnector();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const connectDisconnectToggle = async () => {
    if (isConnected) {
      disconnect();
      await dispatch(hubApi.util.invalidateTags(["hasMinted"]));
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
          opacity: 0.9,
          position: "fixed",
          top: 0,
          backgroundColor: "nightBlack.main",
          boxShadow: 2,
          "&.MuiToolbar-root": {
            paddingLeft: {
              xs: 2,
              md: 6
            },
            paddingRight: {
              xs: 2,
              md: 6
            },
            minHeight: `${TOOLBAR_HEIGHT}px`,
            justifyContent: "space-between",
            alignItems: "center",
            gap: {
              xs: "8px",
              sm: "5px"
            },
            flexDirection: {
              xs: "row",
              sm: "row"
            }
            // py: {
            //   xs: "8px",
            //   sm: 0
            // }
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
        <div style={{ cursor: "pointer" }}>
          <AppTitle
            onClick={() => {
              navigate("/");
            }}
            // mb={{
            //   xs: "16px",
            //   lg: "24px",
            //   xxl: "32px"
            // }}
            // variant="h2"
          />
        </div>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            height: "64px"
          }}
        >
          <Link
            color="#FFF"
            href={autUrls().landingPage}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              textDecoration: "none",
              cursor: "pointer",
              display: {
                xs: "none",
                md: "flex"
              }
            }}
          >
            <Typography variant="subtitle2">Āut Labs</Typography>
          </Link>
          <Link
            color="#FFF"
            href={autUrls().launchpad}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              textDecoration: "none",
              cursor: "pointer",
              display: {
                xs: "none",
                md: "flex"
              },
              ml: {
                xs: "12px",
                md: "33px"
              }
            }}
          >
            <Typography variant="subtitle2">Launchpad</Typography>
          </Link>
          <Link
            color="#FFF"
            href="https://docs.aut.id/v2/intro/what-is-aut"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              textDecoration: "none",
              cursor: "pointer",
              ml: {
                xs: "12px",
                md: "33px"
              },
              mr: {
                xs: "12px",
                md: "33px"
              },
              display: {
                xs: "none",
                md: "flex"
              }
            }}
          >
            <Typography variant="subtitle2">Docs</Typography>
          </Link>
          <Button
            onClick={connectDisconnectToggle}
            sx={{
              width: "200px",
              height: "50px"
            }}
            color="offWhite"
            variant="outlined"
          >
            {isConnected ? "Disconnect" : "Connect"}
          </Button>
        </Box>
      </Toolbar>
    </Box>
  );
};

export default memo(ToolbarConnector);
