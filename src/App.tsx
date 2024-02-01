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
import { DaoList } from "./pages/PublicQuest/DaoList";
import Callback from "./pages/Oauth2Callback/Callback";
import { generateNetworkConfig } from "@api/ProviderFactory/setup.config";
import { WagmiConfig } from "wagmi";
import { useSelector } from "react-redux";
import { CommunityAddress } from "@store/Community/community.reducer";
import CommunityInfo from "./pages/PublicQuest/CommunityInfo";
import NovaDetails from "./pages/PublicQuest/NovaDetails";
import backgroundImage from "@assets/autos/background.png";

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
        const sdk = new AutSDK({
          ipfs: {
            apiKey: environment.ipfsApiKey,
            secretApiKey: environment.ipfsApiSecret,
            gatewayUrl: environment.ipfsGatewayUrl
          }
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
                // height: "100%",
                // backgroundColor: "transparent"
                backgroundImage: `url(${backgroundImage})`,
                backgroundAttachment: "fixed",
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "100vh",
                width: "100vw"
              }}
            >
              <ToolbarConnector />
              <Routes>
                <Route path="/" element={<DaoList />} />
                <Route path="callback" element={<Callback />} />
                <Route path="dao/*" element={<NovaDetails />} />
              </Routes>
            </Box>
          </WagmiConfig>
        </>
      )}
    </>
  );
}

export default App;
