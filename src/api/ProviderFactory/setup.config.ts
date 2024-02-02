import { injected, walletConnect } from "wagmi/connectors";
import { createConfig, http } from "wagmi";
import { polygonMumbai, polygon } from "wagmi/chains";

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}

// @ts-ignore
export const config = createConfig({
  chains: [polygonMumbai, polygon],
  connectors: [
    injected({
      shimDisconnect: false,
      target: "metaMask"
    }),
    walletConnect({ projectId: "938429658f5e53a8eaf88dc70e4a8367" })
  ],
  transports: {
    [polygonMumbai.id]: http(),
    [polygon.id]: http()
  }
});

// export const generateNetworkConfig = (network: NetworkConfig) => {
//   // const networkDefinition = {
//   //   id: network.chainId,
//   //   name: network.name,
//   //   network: network.network,
//   //   rpcUrls: {
//   //     default: {
//   //       http: network.rpcUrls
//   //     },
//   //     public: {
//   //       http: network.rpcUrls
//   //     }
//   //   },
//   //   blockExplorers: {
//   //     etherscan: {
//   //       name: network.name,
//   //       url: network.explorerUrls[0]
//   //     },
//   //     default: {
//   //       name: network.name,
//   //       url: network.explorerUrls[0]
//   //     }
//   //   },
//   //   testnet: true
//   // };

//   // const ankrRPCUrls = {
//   //   [networkDefinition.id]: network.rpcUrls
//   // };
//   // function publicProviderANKR<
//   //   TChain extends Chain = Chain
//   // >(): ChainProviderFn<TChain> {
//   //   return function (chain) {
//   //     if (!ankrRPCUrls[chain.id]) return null;
//   //     return {
//   //       chain: chain as TChain,
//   //       rpcUrls: { http: ankrRPCUrls[chain.id] }
//   //     };
//   //   };
//   // }

//   // const { chains, publicClient, webSocketPublicClient } = configureChains(
//   //   [networkDefinition as any],
//   //   [
//   //     alchemyProvider({ apiKey: "G742dEaaWF0gE-SL0IlEFAJdlA_l7ezJ" }),
//   //     publicProviderANKR()
//   //   ]
//   // );

//   const config = createConfig({
//     chains: [polygonMumbai, polygon],
//     transports: {
//       [polygonMumbai.id]: http(),
//       [polygon.id]: http()
//     }
//   });

//   const wagmiConfig = createConfig({
//     autoConnect: true,
//     logger: {
//       warn: console.warn
//     },
//     connectors: [
//       new InjectedConnector({
//         chains,
//         options: {
//           shimDisconnect: true
//         }
//       }),
//       new MetaMaskConnector({
//         chains,
//         options: {
//           shimDisconnect: true
//         }
//       }),
//       new WalletConnectConnector({
//         chains,
//         options: {
//           shimDisconnect: true,
//           projectId: "938429658f5e53a8eaf88dc70e4a8367",
//           qrModalOptions: {
//             themeVariables: {
//               // @ts-ignore
//               "--wcm-z-index": 9999
//             }
//           }
//         }
//       })
//     ],
//     publicClient,
//     webSocketPublicClient
//   });

//   return wagmiConfig;
// };
