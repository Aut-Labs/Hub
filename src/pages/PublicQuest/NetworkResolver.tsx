import { Suspense, lazy, memo, useEffect, useMemo, useState } from "react";
import {
  ConnectorTypes,
  NetworksConfig,
  setWallet
} from "@store/WalletProvider/WalletProvider";
import { useSelector } from "react-redux";
import AutSDK from "@aut-labs-private/sdk";
import { ethers } from "ethers";
import { useEthers } from "@usedapp/core";
import AutLoading from "@components/AutLoading";
import DialogWrapper from "@components/Dialog/DialogWrapper";
import {
  Box,
  Button,
  Container,
  Link,
  Stack,
  Toolbar,
  Typography,
  styled,
  useMediaQuery,
  useTheme
} from "@mui/material";
import AppTitle from "@components/AppTitle";
import { NetworkConfig } from "@api/ProviderFactory/network.config";
import ConnectorBtn from "@api/ProviderFactory/components/ConnectorBtn";
import PublicQuest from "./PublicQuest";
import { Route, Routes, useNavigate, useSearchParams } from "react-router-dom";
import { communityUpdateState } from "@store/Community/community.reducer";
import { useAppDispatch } from "@store/store.model";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useLazyGetAllPluginDefinitionsByDAOQuery } from "@api/plugin-registry.api";
import { PluginDefinitionType } from "@aut-labs-private/sdk/dist/models/plugin";
import BubbleTopRight from "@assets/bubble.svg";
import BubbleBottomLeft from "@assets/bubble2.svg";
import { RequiredQueryParams } from "../../api/RequiredQueryParams";
import { useAutWalletConnect } from "./use-aut-wallet-connect";
import ErrorDialog from "@components/Dialog/ErrorPopup";
import { resetState } from "@store/store";
import { AUTH_TOKEN_KEY } from "@api/auth.api";

const TOOLBAR_HEIGHT = 84;

const BottomLeftBubble = styled("img")(({ theme }) => ({
  position: "fixed",
  width: "400px",
  height: "400px",
  left: "-200px",
  bottom: "-200px",
  filter: "blur(50px)",
  transform: "rotate(-50deg)",
  [theme.breakpoints.up("md")]: {
    width: "700px",
    height: "700px",
    left: "-350px",
    bottom: "-350px"
  }
}));

const TopRightBubble = styled("img")(({ theme }) => ({
  position: "fixed",
  width: "400px",
  height: "400px",
  top: "-200px",
  right: "-200px",
  filter: "blur(50px)",
  [theme.breakpoints.up("md")]: {
    width: "700px",
    height: "700px",
    top: "-350px",
    right: "-350px"
  }
}));

const OpenTask = lazy(() => import("../Modules/Plugins/Task/Open/OpenTask"));

const QuizTask = lazy(() => import("../Modules/Plugins/Task/Quiz/QuizTask"));

const JoinDiscordTask = lazy(
  () => import("../Modules/Plugins/Task/JoinDiscord/JoinDiscordTask")
);
const TransactionTask = lazy(
  () => import("../Modules/Plugins/Task/Transaction/TransactionTask")
);

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

const NetworkResolver = () => {
  const theme = useTheme();
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
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const areAnyQueryParamsMissing = useMemo(() => {
    try {
      const daoAddress = searchParams.get(RequiredQueryParams.DaoAddress);
      const isDaoAddressValid = ethers.utils.isAddress(daoAddress);

      if (!isDaoAddressValid) {
        return "Dao address not provided or not valid. Please check url!";
      }

      const onboardingQuestAddress = searchParams.get(
        RequiredQueryParams.OnboardingQuestAddress
      );

      const isOnboardingQuestAddress = ethers.utils.isAddress(
        onboardingQuestAddress
      );

      if (!isOnboardingQuestAddress) {
        return "Onboarding Quest address not provided or not valid. Please check url!";
      }

      const questId = searchParams.get(RequiredQueryParams.QuestId);

      if (!questId) {
        return "Quest Id not provided or not valid. Please check url!";
      }
    } catch (error) {
      console.log(error);
      return "Missing query params";
    }
  }, []);

  const hasAccountChanged = useMemo(() => {
    return (
      connected && !!initialAccount && !!account && initialAccount !== account
    );
  }, [connected, initialAccount, account]);

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

  const [loadPlugins, { data: plugins, isError, error }] =
    useLazyGetAllPluginDefinitionsByDAOQuery();

  const taskPluginTypes = useMemo(() => {
    return (plugins || []).reduce((prev, curr) => {
      prev[curr.pluginDefinitionId] = curr;
      return prev;
    }, {});
  }, [plugins]);

  const changeConnector = async (connectorType: string) => {
    try {
      setIsLoading(true);
      const [network] = networks.filter((d) => !d.disabled);
      const { provider, connected, account } = await connect(connectorType);

      if (!connected) throw new Error("not connected");
      const signer = provider.getSigner();
      await initialiseSDK(network, signer as ethers.providers.JsonRpcSigner);
      await dispatch(
        communityUpdateState({
          selectedCommunityAddress: searchParams.get(
            RequiredQueryParams.DaoAddress
          )
        })
      );

      loadPlugins(null);
      setTimeout(() => {
        setInitialAccount(account);
        setIsLoading(false);
        setIsOpen(false);
        setIsConnected(true);
        navigate({
          pathname: "/quest",
          search: searchParams.toString()
        });
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
    dispatch(resetState);
    localStorage.removeItem(AUTH_TOKEN_KEY);
  };

  useEffect(() => {
    if (hasAccountChanged) {
      closeAndDisconnect();
    }
  }, [hasAccountChanged]);

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw"
      }}
    >
      <ErrorDialog
        handleClose={() => {
          // handle error
        }}
        open={isError}
        message={error}
      />
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
      <BottomLeftBubble src={BubbleBottomLeft} />
      <TopRightBubble src={BubbleTopRight} />
      {!!connected && (
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
          <AppTitle
            sx={{
              cursor: "pointer"
            }}
            onClick={() => navigate("/")}
            variant="h3"
          />
          <Stack
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
          </Stack>
          <Button
            onClick={closeAndDisconnect}
            sx={{
              width: "220px",
              height: "55px"
            }}
            color="offWhite"
            variant="outlined"
          >
            Disconnect
          </Button>
        </Toolbar>
      )}
      <PerfectScrollbar
        style={{
          ...(isMobile && {
            marginTop: `${TOOLBAR_HEIGHT + 70}px`,
            height: `calc(100% - ${TOOLBAR_HEIGHT + 70 + "px"})`
          }),
          ...(!isMobile && {
            marginTop: `${TOOLBAR_HEIGHT}px`,
            height: `calc(100% - ${TOOLBAR_HEIGHT + "px"})`
          }),
          display: "flex",
          flexDirection: "column"
        }}
      >
        {!connected && (
          <Container
            maxWidth="lg"
            sx={{
              py: "20px",
              height: "100%",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              position: "relative"
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row"
              }}
              mb={{
                xs: "25px",
                md: "50px"
              }}
            >
              <AppTitle
                sx={{
                  display: {
                    xs: "flex",
                    sm: "unset"
                  },
                  flexDirection: "column",
                  ".MuiTypography-root": {
                    textAlign: {
                      xs: "end",
                      sm: "unset"
                    }
                  }
                }}
              />
            </Box>
            <Typography
              mb={{
                xs: "10px",
                md: "30px"
              }}
              color="white"
              variant="subtitle2"
              fontWeight="bold"
            >
              To see the quest please connect your wallet.
            </Typography>
            <Button
              disabled={!!areAnyQueryParamsMissing}
              onClick={() => setIsOpen(true)}
              sx={{
                width: "220px",
                height: "55px"
              }}
              color="offWhite"
              variant="outlined"
            >
              Connect wallet
            </Button>

            {!!areAnyQueryParamsMissing && (
              <Typography
                mt={{
                  xs: "10px",
                  md: "30px"
                }}
                color="error"
                variant="body"
                fontWeight="bold"
              >
                {areAnyQueryParamsMissing}
              </Typography>
            )}

            <Stack mt={8} direction="row" gap={2}>
              <Link
                color="offWhite.main"
                variant="body"
                target="_blank"
                href={`https://my.aut.id/`}
              >
                Leaderboard
              </Link>
              <Link
                color="offWhite.main"
                variant="body"
                target="_blank"
                href={`https://my.aut.id/`}
              >
                Nova showcase
              </Link>
            </Stack>
          </Container>
        )}
        {connected && (
          <>
            {!plugins?.length ? (
              <AutLoading width="130px" height="130px" />
            ) : (
              <Suspense fallback={<AutLoading width="130px" height="130px" />}>
                <Routes>
                  <Route index element={<PublicQuest />} />
                  <Route
                    path={`task/${
                      PluginDefinitionType[
                        PluginDefinitionType.OnboardingOpenTaskPlugin
                      ]
                    }/:taskId`}
                    element={
                      <OpenTask
                        plugin={
                          taskPluginTypes[
                            PluginDefinitionType.OnboardingOpenTaskPlugin
                          ]
                        }
                      />
                    }
                  />
                  <Route
                    path={`task/${
                      PluginDefinitionType[
                        PluginDefinitionType.OnboardingQuizTaskPlugin
                      ]
                    }/:taskId`}
                    element={
                      <QuizTask
                        plugin={
                          taskPluginTypes[
                            PluginDefinitionType.OnboardingQuizTaskPlugin
                          ]
                        }
                      />
                    }
                  />
                  <Route
                    path={`task/${
                      PluginDefinitionType[
                        PluginDefinitionType.OnboardingJoinDiscordTaskPlugin
                      ]
                    }/:taskId`}
                    element={
                      <JoinDiscordTask
                        plugin={
                          taskPluginTypes[
                            PluginDefinitionType.OnboardingJoinDiscordTaskPlugin
                          ]
                        }
                      />
                    }
                  />
                  <Route
                    path={`task/${
                      PluginDefinitionType[
                        PluginDefinitionType.OnboardingTransactionTaskPlugin
                      ]
                    }/:taskId`}
                    element={
                      <TransactionTask
                        plugin={
                          taskPluginTypes[
                            PluginDefinitionType.OnboardingTransactionTaskPlugin
                          ]
                        }
                      />
                    }
                  />
                </Routes>
              </Suspense>
            )}
          </>
        )}
      </PerfectScrollbar>
    </Box>
  );
};

export default memo(NetworkResolver);
