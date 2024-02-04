/* eslint-disable max-len */
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import { useAppDispatch } from "@store/store.model";
import SWSnackbar from "./components/snackbar";
import { EnvMode, environment } from "@api/environment";
import { setNetworks } from "@store/WalletProvider/WalletProvider";
import { getAppConfig } from "@api/aut.api";
import AutSDK from "@aut-labs/sdk";
import ErrorPage from "@components/ErrorPage";
import { ToolbarConnector } from "./pages/PublicQuest/ToolbarConnector";
import { DaoList } from "./pages/PublicQuest/DaoList";
import Callback from "./pages/Oauth2Callback/Callback";
import NovaDetails from "./pages/PublicQuest/NovaDetails";
import backgroundImage from "@assets/autos/background.svg";
import background1 from "@assets/autos/background1.png";
import { Init } from "@aut-labs/d-aut";

function App() {
  const dispatch = useAppDispatch();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const config = {
      defaultText: "Connect Wallet",
      textAlignment: "right",
      menuTextAlignment: "left",
      theme: {
        color: "offWhite",
        // color: 'nightBlack',
        // color: colors.amber['500'],
        // color: '#7b1fa2',
        type: "main"
      },
      // size: "default" // large & extraLarge or see below
      size: {
        width: 240,
        height: 50,
        padding: 3
      }
    };

    Init({
      config
    });
  }, []);

  useEffect(() => {
    getAppConfig()
      .then(async (res) => {
        dispatch(setNetworks(res));
        const [network] = res.filter((d) => !d.disabled);
        const sdk = new AutSDK({
          ipfs: {
            apiKey: environment.ipfsApiKey,
            secretApiKey: environment.ipfsApiSecret,
            gatewayUrl: environment.ipfsGatewayUrl
          }
        });
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  }, [dispatch]);

  return (
    <>
      <SWSnackbar />
      {error && <ErrorPage />}
      {!error && !loading && (
        <>
          <Box
            sx={{
              // height: "100%",
              // backgroundColor: "transparent"
              backgroundImage: `url(${backgroundImage}), url(${background1})`,
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
        </>
      )}
    </>
  );
}

export default App;
