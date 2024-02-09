import { NetworkConfig } from "@api/ProviderFactory/network.config";
import { RequiredQueryParams } from "@api/RequiredQueryParams";
import AutSDK from "@aut-labs/sdk";
import AutLoading from "@components/AutLoading";
import DialogWrapper from "@components/Dialog/DialogWrapper";
import { Box, Button, Link, Toolbar, Typography, styled } from "@mui/material";
import {
  NetworkSelectorIsOpen,
  NetworksConfig,
  updateWalletProviderState
} from "@store/WalletProvider/WalletProvider";
import { useAppDispatch } from "@store/store.model";
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppTitle from "@components/AppTitle";
import { changeConnectStatus } from "@auth/auth.reducer";
import { useEthersSigner } from "@api/ProviderFactory/ethers";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { ReactComponent as WalletConnectLogo } from "@assets/aut/wallet-connect.svg";
import { ReactComponent as MetamaskLogo } from "@assets/aut/metamask.svg";
import { communityUpdateState } from "@store/Community/community.reducer";
import { MultiSigner } from "@aut-labs/sdk/dist/models/models";

export const TOOLBAR_HEIGHT = 88;

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

const btnConfig = {
  metaMask: {
    label: "metaMask",
    icon: <MetamaskLogo />
  },
  walletConnect: {
    label: "WalletConnect",
    icon: <WalletConnectLogo />
  }
};

export const ToolbarConnector = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const networks = useSelector(NetworksConfig);
  const { connector, isReconnecting, isConnecting, isConnected } = useAccount();
  const { connectAsync, connectors, error, isPending } = useConnect();
  // const chainId = useChainId();
  const multiSigner = useEthersSigner();
  const { disconnectAsync } = useDisconnect();
  const isOpen = useSelector(NetworkSelectorIsOpen);

  const filteredConnectors = useMemo(() => {
    if (connectors?.length) {
      return connectors.filter((c) => !!btnConfig[c.id]);
    }
    return [];
  }, [connectors]);

  const closeAndDisconnect = async () => {
    const itemsToUpdate = {
      isAuthorised: false,
      sdkInitialized: false,
      isOpen: false
    };
    await disconnectAsync();
    await dispatch(updateWalletProviderState(itemsToUpdate));
    await dispatch(changeConnectStatus("disconnected"));
  };

  const handleButtonClick = async () => {
    if (isConnected) {
      closeAndDisconnect();
    } else {
      await dispatch(
        updateWalletProviderState({
          isOpen: true
        })
      );
    }
  };

  const initialiseSDK = async (
    network: NetworkConfig,
    multiSigner: MultiSigner
  ) => {
    const sdk = AutSDK.getInstance();
    return sdk.init(multiSigner, {
      novaAddress: searchParams.get(RequiredQueryParams.DaoAddress),
      daoTypesAddress: network.contracts.daoTypesAddress,
      novaRegistryAddress: network.contracts.novaRegistryAddress,
      autIDAddress: network.contracts.autIDAddress,
      daoExpanderRegistryAddress: network.contracts.daoExpanderRegistryAddress,
      pluginRegistryAddress: network.contracts.pluginRegistryAddress
    });
  };

  useEffect(() => {
    if (isConnected && multiSigner) {
      const start = async () => {
        const [network] = networks.filter((d) => !d.disabled);
        const itemsToUpdate = {
          isAuthorised: true,
          sdkInitialized: true,
          isOpen: false,
          selectedNetwork: network
        };

        const signers = await multiSigner;
        await initialiseSDK(network, signers);
        if (searchParams?.get(RequiredQueryParams.DaoAddress)) {
          await dispatch(
            communityUpdateState({
              selectedCommunityAddress: searchParams?.get(
                RequiredQueryParams.DaoAddress
              )
            })
          );
        }
        await dispatch(changeConnectStatus("connected"));
        setTimeout(async () => {
          await dispatch(updateWalletProviderState(itemsToUpdate));
        }, 20);
      };
      start();
    }
  }, [dispatch, isConnected, multiSigner, networks, searchParams]);

  return (
    <Box>
      <DialogWrapper
        open={isOpen}
        onClose={() =>
          dispatch(
            updateWalletProviderState({
              isOpen: false
            })
          )
        }
      >
        <>
          <AppTitle
            mb={{
              xs: "16px",
              lg: "24px",
              xxl: "32px"
            }}
            variant="h2"
          />
          {(isPending || isConnecting) && (
            <div style={{ position: "relative", flex: 1 }}>
              <AutLoading width="130px" height="130px" />
            </div>
          )}

          {!isPending && (
            <>
              <Typography color="white" variant="subtitle1">
                Connect your wallet
              </Typography>
              <DialogInnerContent>
                {filteredConnectors.map((c) => (
                  <Button
                    disabled={isReconnecting || c.id === connector?.id}
                    key={c.id}
                    onClick={async () => {
                      await dispatch(changeConnectStatus("connecting"));
                      await connectAsync({
                        connector: c
                      });
                    }}
                    startIcon={btnConfig[c.id]?.icon}
                    variant="outlined"
                    size="normal"
                    color="offWhite"
                    sx={{
                      minWidth: {
                        xs: "260px",
                        md: "280px",
                        lg: "300px",
                        xxl: "440px"
                      }
                    }}
                  >
                    {c.name}
                  </Button>
                ))}
              </DialogInnerContent>

              {error?.message && (
                <ErrorWrapper>
                  <Typography textAlign="center" color="error" variant="body">
                    {error?.message}
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
            onClick={handleButtonClick}
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
