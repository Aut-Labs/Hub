import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { Route, Routes, useLocation } from "react-router-dom";
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
import ParticipationScore from "./pages/Playground/PS";

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
          <Routes>
            <Route path="/ps" element={<ParticipationScore />} />
          </Routes>
        </Box>
      ) : (
        <>
          <AutWallet />
          <Box sx={backgroundStyle}>
            <ToolbarConnector />
            <Routes>
              <Route path="/:novaName?" element={<NovaList />} />
              <Route path="callback" element={<Callback />} />
              <Route path="project/:novaName" element={<NovaDetails />} />
            </Routes>
          </Box>
        </>
      )}
    </>
  );
}

export default App;
