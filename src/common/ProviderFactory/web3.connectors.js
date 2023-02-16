import { initializeConnector } from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";
import { WalletConnect } from "@web3-react/walletconnect";
export const initializeConnectors = (networks) => {
    const { supportedChainIds, rpcUrls } = networks.reduce((prev, curr) => {
        prev.supportedChainIds = [
            ...prev.supportedChainIds,
            Number(curr.chainId)
        ];
        prev.rpcUrls = Object.assign(Object.assign({}, prev.rpcUrls), { [curr.chainId]: curr.rpcUrls.join("|") });
        return prev;
    }, {
        supportedChainIds: [],
        rpcUrls: {}
    });
    const metaMaskConnector = initializeConnector((actions) => new MetaMask({ actions }));
    const walletConnectConnector = initializeConnector((actions) => new WalletConnect({
        actions,
        options: {
            qrcode: true,
            bridge: "https://bridge.walletconnect.org",
            rpc: rpcUrls
        }
    }));
    return {
        metaMaskConnector,
        walletConnectConnector
    };
};