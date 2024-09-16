/* eslint-disable max-len */
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import { useAppDispatch } from "@store/store.model";
import SWSnackbar from "./components/snackbar";
import { environment } from "@api/environment";
import { setNetworks } from "@store/WalletProvider/WalletProvider";
import { getAppConfig } from "@api/aut.api";
import AutSDK from "@aut-labs/sdk";
import ErrorPage from "@components/ErrorPage";
import { ToolbarConnector } from "./pages/Nova/ToolbarConnector";
import { NovaList } from "./pages/Nova/NovaList";
import NovaDetails from "./pages/Nova/NovaDetails";
import backgroundImage from "@assets/autos/background.svg";
import background1 from "@assets/autos/background1.png";
import AutLoading from "@components/AutLoading";
import AutWallet from "./AutWallet";
import Callback from "./pages/Oauth2Callback/Callback";
import SimulationChart from "./pages/Nova/Chart";

function App() {
  const dispatch = useAppDispatch();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAppConfig()
      .then(async (res) => {
        dispatch(setNetworks(res));
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
  }, []);

  return (
    <>
      <SWSnackbar />
      {error ? (
        <ErrorPage />
      ) : (
        <>
          {loading ? (
            <AutLoading width="130px" height="130px" />
          ) : (
            <>
              <AutWallet />
              <Box
                sx={{
                  backgroundImage: `url(${backgroundImage}), url(${background1})`,
                  backgroundAttachment: "fixed",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  height: {
                    xs: window.innerHeight,
                    sm: "100%"
                  },
                  width: "100vw",
                  position: "fixed",
                  top: 0,
                  left: 0
                }}
              >
                <ToolbarConnector />
                <Routes>
                  <Route path="/:hubName?" element={<NovaList />} />
                  <Route path="callback" element={<Callback />} />
                  <Route path="project/:hubName" element={<NovaDetails />} />
                  <Route path="chart" element={<SimulationChart />} />
                </Routes>
              </Box>
            </>
          )}
        </>
      )}
    </>
  );
}

export default App;
