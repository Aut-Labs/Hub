import ConnectorBtn from "@api/ProviderFactory/components/ConnectorBtn";
import { NetworkConfig } from "@api/ProviderFactory/network.config";
import { RequiredQueryParams } from "@api/RequiredQueryParams";
import { AUTH_TOKEN_KEY } from "@api/auth.api";
import { useLazyGetAllPluginDefinitionsByDAOQuery } from "@api/plugin-registry.api";
import AutSDK from "@aut-labs-private/sdk";
import AutLoading from "@components/AutLoading";
import DialogWrapper from "@components/Dialog/DialogWrapper";
import ErrorDialog from "@components/Dialog/ErrorPopup";
import {
  Box,
  Button,
  Link,
  Stack,
  Toolbar,
  Typography,
  styled
} from "@mui/material";
import { communityUpdateState } from "@store/Community/community.reducer";
import {
  ConnectorTypes,
  NetworksConfig,
  setWallet
} from "@store/WalletProvider/WalletProvider";
import { resetState } from "@store/store";
import { useAppDispatch } from "@store/store.model";
import { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAutWalletConnect } from "./use-aut-wallet-connect";
import { useEthers } from "@usedapp/core";
import { ethers } from "ethers";
import AppTitle from "@components/AppTitle";
import {
  ConnectStatus,
  isAuthenticated,
  setAuthenticated,
  changeConnectStatus
} from "@auth/auth.reducer";
import Logo from "@assets/logo.svg";

const TOOLBAR_HEIGHT = 84;

const DialogInnerContent = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  flex: 1,
  gridGap: "30px"
});

const ErrorWrapper = styled(Box)({
  backgroundColor: "rgba(254, 202, 202, 0.16)",
  padding: "20px",
  width: "80%",
  marginBottom: "12px",
  borderRadius: "16px",
  textAlign: "center"
});

export const ToolbarConnector = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const networks = useSelector(NetworksConfig);
  const [isOpen, setIsOpen] = useState(false);
  const {
    connect,
    disconnect,
    isLoading: isConnecting,
    waitingUserConfirmation,
    errorMessage
  } = useAutWalletConnect();
  const { account } = useEthers();
  const [isLoading, setIsLoading] = useState(false);
  const [connected, setIsConnected] = useState(false);
  const [initialAccount, setInitialAccount] = useState("");
  const hasAccountChanged = useMemo(() => {
    return (
      connected && !!initialAccount && !!account && initialAccount !== account
    );
  }, [connected, initialAccount, account]);
  const connectStatus = useSelector(ConnectStatus);

  const initialiseSDK = async (
    network: NetworkConfig,
    signer: ethers.providers.JsonRpcSigner
  ) => {
    const sdk = AutSDK.getInstance();
    return sdk.init(signer, {
      daoExpanderAddress: searchParams.get(RequiredQueryParams.DaoAddress),
      daoTypesAddress: network.contracts.daoTypesAddress,
      autDaoRegistryAddress: network.contracts.autDaoRegistryAddress,
      autIDAddress: network.contracts.autIDAddress,
      daoExpanderRegistryAddress: network.contracts.daoExpanderRegistryAddress,
      pluginRegistryAddress: network.contracts.pluginRegistryAddress
    });
  };

  useEffect(() => {
    if (connectStatus === "start") {
      setIsOpen(true);
    }
  }, [connectStatus]);

  const changeConnector = async (connectorType: string) => {
    try {
      dispatch(changeConnectStatus("connecting"));
      setIsLoading(true);
      const [network] = networks.filter((d) => !d.disabled);
      const { provider, connected, account } = await connect(connectorType);

      if (!connected) {
        dispatch(changeConnectStatus("failed"));
        throw new Error("not connected");
      }
      const signer = provider.getSigner();
      await initialiseSDK(network, signer as ethers.providers.JsonRpcSigner);
      setTimeout(() => {
        setInitialAccount(account);
        setIsLoading(false);
        setIsOpen(false);
        dispatch(
          setAuthenticated({
            isAuthenticated: true,
            userInfo: {}
          })
        );
        setIsConnected(true);
        dispatch(changeConnectStatus("connected"));
      }, 500);
      return account;
    } catch (error) {
      dispatch(setWallet(null));
      setIsLoading(false);
    }
  };

  const closeAndDisconnect = async () => {
    disconnect();
    setIsConnected(false);
    dispatch(setWallet(null));
    setIsLoading(false);
    setIsOpen(false);
    dispatch(changeConnectStatus("disconnected"));
    // exclude the rest of the app data (main page)
    // dispatch(resetState);
    localStorage.removeItem(AUTH_TOKEN_KEY);
  };

  const handleButtonClick = async () => {
    if (connected) {
      closeAndDisconnect();
    } else {
      dispatch(changeConnectStatus("start"));
    }
  };

  useEffect(() => {
    if (hasAccountChanged) {
      closeAndDisconnect();
    }
  }, [hasAccountChanged]);

  return (
    <Box>
      {/* <ErrorDialog
        handleClose={() => {
          // handle error
        }}
        open={isError}
        message={error}
      /> */}
      {/* USE THIS TO FORCE AUTHERNTICATION WHEN SLECTING NOVA QUESTS */}
      <DialogWrapper open={isOpen} onClose={closeAndDisconnect}>
        <>
          <AppTitle
            mb={{
              xs: "16px",
              lg: "24px",
              xxl: "32px"
            }}
            variant="h2"
          />
          {(isLoading || waitingUserConfirmation || isConnecting) && (
            <div style={{ position: "relative", flex: 1 }}>
              {waitingUserConfirmation && (
                <Typography m="0" color="white" variant="subtitle1">
                  Waiting confirmation...
                </Typography>
              )}
              <AutLoading width="130px" height="130px" />
            </div>
          )}

          {!isLoading && !waitingUserConfirmation && (
            <>
              <Typography color="white" variant="subtitle1">
                Connect your wallet
              </Typography>
              <DialogInnerContent>
                <ConnectorBtn
                  setConnector={changeConnector}
                  connectorType={ConnectorTypes.Metamask}
                />
                <ConnectorBtn
                  setConnector={changeConnector}
                  connectorType={ConnectorTypes.WalletConnect}
                />
              </DialogInnerContent>

              {errorMessage && (
                <ErrorWrapper>
                  <Typography textAlign="center" color="error" variant="body">
                    {errorMessage}
                  </Typography>
                </ErrorWrapper>
              )}
            </>
          )}
        </>
      </DialogWrapper>
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
        <img
          src={Logo}
          onClick={() => {
            navigate("/");
          }}
          alt="Aut Logo"
        />
        {/* <AppTitle
          sx={{
            cursor: "pointer"
          }}
          onClick={() => navigate("/")}
          variant="h3"
        /> */}
        {/* <Stack
          flex={1}
          alignItems="center"
          justifyContent="center"
          direction="row"
          gap={2}
        >
          <Link
            color="offWhite.main"
            variant="body"
            target="_blank"
            href="http://176.34.149.248:4001"
          >
            Leaderboard
          </Link>
          <Link
            color="offWhite.main"
            variant="body"
            target="_blank"
            href="http://176.34.149.248:4002"
          >
            Nova showcase
          </Link>
        </Stack> */}
        <div>
          <Button
            onClick={handleButtonClick}
            sx={{
              width: "220px",
              height: "55px"
            }}
            color="offWhite"
            variant="outlined"
          >
            {connected ? "Disconnect" : "Connect"}
          </Button>
          {/* <Button
            onClick={() => {
              setIsOpen(true);
            }}
            sx={{
              width: "220px",
              height: "55px"
            }}
            color="offWhite"
            variant="outlined"
          >
            Cnnct
          </Button> */}
        </div>
        {/* Switch this */}
      </Toolbar>
    </Box>
  );
};
