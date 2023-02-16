import React, { useState } from "react";
// import TryAut from "containers/TryAut";
// import Footer from "containers/Footer";
import NovaShowcase from "containers/Showcase";
import "react-perfect-scrollbar/dist/css/styles.css";
import PerfectScrollbar from "react-perfect-scrollbar";
import AutSDK from "@aut-labs-private/sdk";
import { getAppConfig } from "api/index.api";
import Web3AutProvider from "common/ProviderFactory/components/Web3Provider";
import { useEffect } from "react";
import { initializeConnectors } from "common/ProviderFactory/web3.connectors";
import { Loading } from "common/components/ModalPopupWrapper";

const Main = () => {
  const [connectState, setConnectState] = useState({});
  const [appReady, setAppReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [connectors, setConnectors] = useState([]);
  const [networks, setNetworks] = useState([]);

  useEffect(() => {
    getAppConfig().then(async (result) => {
      const sdk = new AutSDK({
        nftStorageApiKey:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDIwQkEyNDNhNTU1YmY4YzI0MzViNzVmMTk0NmFDNWQ2QTY4QUQzMjgiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY0MzkwMjIzNDA2NywibmFtZSI6IlBhcnRuZXJzQXBwIn0.sG-6S0mNp0FQ_4SIimMChrMj4250ymEH58V09eXNY4o",
      });
      const { metaMaskConnector, walletConnectConnector } =
        initializeConnectors(result);
      const [metamask, metaMaskHooks] = metaMaskConnector;
      const [walletConnect, walletConnectHooks] = walletConnectConnector;

      const connectors = [
        [metamask, metaMaskHooks],
        [walletConnect, walletConnectHooks],
      ];
      setNetworks(result);
      setConnectors(connectors);
      setAppReady(true);
    });
  }, []);

  return (
    <PerfectScrollbar
      options={{
        suppressScrollX: true,
        useBothWheelAxes: false,
        swipeEasing: true,
      }}
      style={{
        height: "100vh",
      }}
    >
      {loading || !appReady || !connectors?.length ? (
        <Loading />
      ) : (
        <Web3AutProvider connectors={connectors}>
          <NovaShowcase
            networks={networks}
            connectors={connectors}
            setLoading={setLoading}
            onConnected={(state) => setConnectState(state)}
          />
        </Web3AutProvider>
      )}
    </PerfectScrollbar>
  );
};
export default Main;
