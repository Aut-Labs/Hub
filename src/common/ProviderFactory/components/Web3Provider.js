import { Web3ReactProvider } from "@web3-react/core";

export default function Web3AutProvider({ children, connectors }) {
  // const connectors = useSelector(NetworkConnectors);
  return (
    <Web3ReactProvider connectors={connectors}>{children}</Web3ReactProvider>
  );
}
