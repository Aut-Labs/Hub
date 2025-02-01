import { lazy, Suspense, useEffect, useState } from "react";
import { Box } from "@mui/material";
import { Route, Routes, useLocation } from "react-router-dom";
import { useAppDispatch } from "@store/store.model";
import SWSnackbar from "./components/snackbar";
import { environment, EnvMode } from "@api/environment";
import { setNetworks } from "@store/WalletProvider/WalletProvider";
import { getAppConfig } from "@api/aut.api";
import AutSDK from "@aut-labs/sdk";
import ErrorPage from "@components/ErrorPage";
import backgroundImage from "@assets/autos/background.svg";
import background1 from "@assets/autos/background1.png";
import AutLoading from "@components/AutLoading";

const HubList = lazy(() => import("./pages/Hub/HubList"));
const ParticipationScore = lazy(() => import("./pages/Playground/PS"));
const Callback = lazy(() => import("./pages/Oauth2Callback/Callback"));
const AutWallet = lazy(() => import("./AutWallet"));
const HubDetails = lazy(() => import("./pages/Hub/HubDetails"));
const ToolbarConnector = lazy(() => import("./pages/Hub/ToolbarConnector"));

function App() {
  const dispatch = useAppDispatch();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const isParticipationScorePage = location.pathname === "/ps";

  useEffect(() => {
    if (!isParticipationScorePage) {
      getAppConfig()
        .then(async (res) => {
          dispatch(setNetworks(res));
          const sdk = new AutSDK({
            enableDebug: environment.env === EnvMode.Development,
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
    } else {
      setLoading(false);
    }
  }, [isParticipationScorePage]);

  const backgroundStyle = {
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
  };

  if (error) {
    return <ErrorPage />;
  }

  if (loading) {
    return <AutLoading width="130px" height="130px" />;
  }

  return (
    <>
      <SWSnackbar />
      {isParticipationScorePage ? (
        <Box sx={backgroundStyle}>
          <Suspense fallback={<AutLoading />}>
            <Routes>
              <Route path="/ps" element={<ParticipationScore />} />
            </Routes>
          </Suspense>
        </Box>
      ) : (
        <>
          <AutWallet />
          <Box sx={backgroundStyle}>
            <ToolbarConnector />
            <Suspense fallback={<AutLoading />}>
              <Routes>
                <Route path="/:hubName?" element={<HubList />} />
                <Route path="callback" element={<Callback />} />
                <Route path="project/:hubName" element={<HubDetails />} />
              </Routes>
            </Suspense>
          </Box>
        </>
      )}
    </>
  );
}

export default App;
