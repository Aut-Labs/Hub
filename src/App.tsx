/* eslint-disable max-len */
import { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { Link, Route, Routes } from "react-router-dom";
import { useAppDispatch } from "@store/store.model";
import SWSnackbar from "./components/snackbar";
import { environment } from "@api/environment";
import {
  IsAuthorised,
  setNetworks
} from "@store/WalletProvider/WalletProvider";
import { getAppConfig } from "@api/aut.api";
import AutSDK from "@aut-labs/sdk";
import ErrorPage from "@components/ErrorPage";
import { ToolbarConnector } from "./pages/PublicQuest/ToolbarConnector";
import QuestDetails from "./pages/PublicQuest/QuestDetails";
import { DaoList } from "./pages/PublicQuest/DaoList";
import Callback from "./pages/Oauth2Callback/Callback";
import { generateNetworkConfig } from "@api/ProviderFactory/setup.config";
import { WagmiConfig } from "wagmi";
import { useSelector } from "react-redux";
import { CommunityAddress } from "@store/Community/community.reducer";

const QuestProtected = () => {
  const isAuthorised = useSelector(IsAuthorised);
  const communityAddress = useSelector(CommunityAddress);

  if (!isAuthorised || !communityAddress) {
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
          variant="h2"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: "10px",
            color: "white"
          }}
        >
          Connect your wallet!
        </Typography>
        <Typography
          sx={{
            display: "flex",
            color: "white",
            justifyContent: "center",
            alignItems: "center",
            mb: "70px"
          }}
          variant="body"
        >
          Connect your walllet to view quest.
        </Typography>
        <Button
          color="offWhite"
          variant="outlined"
          size="large"
          to="/"
          component={Link}
        >
          Go to DAO's
        </Button>
      </Box>
    );
  }

  return <QuestDetails />;
};

function App() {
  const dispatch = useAppDispatch();
  const [config, setConfig] = useState<any>();
  const [error, setError] = useState(false);

  useEffect(() => {
    getAppConfig()
      .then(async (res) => {
        dispatch(setNetworks(res));
        const [network] = res.filter((d) => !d.disabled);
        setConfig(generateNetworkConfig(network));
        new AutSDK({
          nftStorageApiKey: environment.nftStorageKey
        });
      })
      .catch(() => {
        setError(true);
      });
  }, [dispatch]);

  return (
    <>
      <SWSnackbar />
      {error && <ErrorPage />}
      {!error && config && (
        <>
          <WagmiConfig config={config}>
            <Box
              sx={{
                height: "100%",
                backgroundColor: "transparent"
              }}
            >
              <ToolbarConnector />
              <Routes>
                <Route path="/" element={<DaoList />} />
                <Route path="callback" element={<Callback />} />
                <Route path="quest/*" element={<QuestProtected />} />
              </Routes>
            </Box>
          </WagmiConfig>
        </>
      )}
    </>
  );
}

export default App;
