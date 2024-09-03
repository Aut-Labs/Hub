import { memo, useEffect, useRef } from "react";
import { Init } from "@aut-labs/d-aut";
import { AutWalletConnector, useAutConnector } from "@aut-labs/connector";
import { useSelector } from "react-redux";
import { Connector, useConnect } from "wagmi";
import { NetworkConfig } from "@api/ProviderFactory/network.config";
import { RequiredQueryParams } from "@api/RequiredQueryParams";
import { MultiSigner } from "@aut-labs/sdk/dist/models/models";
import { hubUpdateState } from "@store/Hub/hub.reducer";
import AutLoading from "@components/AutLoading";
import AppTitle from "@components/AppTitle";
import { useSearchParams } from "react-router-dom";
import { environment, EnvMode } from "@api/environment";
import AutSDK from "@aut-labs/sdk";
import {
  HubAddress,
  NetworksConfig,
  SelectedRoleId,
  updateWalletProviderState
} from "@store/WalletProvider/WalletProvider";
import { useAppDispatch } from "@store/store.model";
import { IAutButtonConfig } from "@aut-labs/d-aut/build/components/AutButtonMenu/AutMenuUtils";

const AutWallet = () => {
  const dispatch = useAppDispatch();
  const networks = useSelector(NetworksConfig);
  const { connectors } = useConnect();
  const [searchParams] = useSearchParams();
  const dAutInitialized = useRef<boolean>(false);
  const {
    isConnected,
    isConnecting,
    connect,
    setStateChangeCallback,
    disconnect,
    multiSigner,
    multiSignerId,
    status,
    address,
    chainId
  } = useAutConnector({
    defaultChainId: +environment.defaultChainId
  });

  const hubAddress = useSelector(HubAddress);
  const selectedRoleId = useSelector(SelectedRoleId);

  const initialiseSDK = async (
    network: NetworkConfig,
    multiSigner: MultiSigner
  ) => {
    const sdk = await AutSDK.getInstance(false);
    return sdk.init(multiSigner, {
      hubAddress,
      daoTypesAddress: network.contracts.daoTypesAddress,
      hubRegistryAddress: network.contracts.novaRegistryAddress,
      autIDAddress: network.contracts.autIDAddress,
      daoExpanderRegistryAddress: network.contracts.daoExpanderRegistryAddress,
      pluginRegistryAddress: network.contracts.pluginRegistryAddress
    });
  };

  useEffect(() => {
    const start = async () => {
      let network = networks.find((d) => d.chainId === chainId);
      if (!network) {
        network = networks.filter((d) => !d.disabled)[0];
      }
      await initialiseSDK(network, multiSigner);
      await dispatch(
        updateWalletProviderState({
          selectedNetwork: network
        })
      );
      if (searchParams?.get(RequiredQueryParams.HubAddress)) {
        await dispatch(
          hubUpdateState({
            selectedHubAddress: searchParams?.get(
              RequiredQueryParams.HubAddress
            )
          })
        );
      }
    };
    if (multiSignerId) {
      start();
    }
  }, [multiSignerId, hubAddress]); // re-initialiseSDK only when id changes

  useEffect(() => {
    if (!dAutInitialized.current && multiSignerId) {
      dAutInitialized.current = true;
      const config = {
        defaultText: "Connect Wallet",
        textAlignment: "right",
        menuTextAlignment: "left",
        theme: {
          color: "offWhite",
          type: "main"
        },
        size: {
          width: 240,
          height: 50,
          padding: 3
        }
      } as IAutButtonConfig;

      const btnConfig = {
        metaMask: true,
        walletConnect: true,
        coinbaseWalletSDK: true,
        web3auth: true
      };

      const allowedConnectors: Connector[] = Object.keys(btnConfig)
        .filter((connector) => btnConfig[connector])
        .map((connector) => connectors.find((c) => c.id === connector));

      Init({
        config,
        envConfig: {
          REACT_APP_API_URL: environment.apiUrl,
          REACT_APP_GRAPH_API_URL: environment.graphApiUrl,
          REACT_APP_IPFS_API_KEY: environment.ipfsApiKey,
          REACT_APP_IPFS_API_SECRET: environment.ipfsApiSecret,
          REACT_APP_IPFS_GATEWAY_URL: environment.ipfsGatewayUrl,
          REACT_APP_ENV: environment.env as EnvMode
        },
        connector: {
          connect,
          disconnect,
          setStateChangeCallback,
          connectors: allowedConnectors,
          networks,
          state: {
            multiSignerId,
            chainId,
            multiSigner,
            isConnected,
            isConnecting,
            status,
            address
          }
        }
      });
    }
  }, [dAutInitialized, multiSignerId]);

  return (
    <>
      <d-aut
        style={{
          // display: "none",
          position: "absolute",
          zIndex: 99999,
          left: "-9999px",
          top: "-9999px"
        }}
        use-dev={environment.env == EnvMode.Development}
        id="d-aut"
        menu-items='[{"name":"Profile","actionType":"event_emit","eventName":"aut_profile"}]'
        flow-config='{"mode" : "signup", "customCongratsMessage": ""}'
        allowed-role-id={selectedRoleId}
        hub-address={hubAddress}
        ipfs-gateway={environment.ipfsGatewayUrl}
      />
      <AutWalletConnector
        connect={connect}
        titleContent={
          <AppTitle
            mb={{
              xs: "16px",
              lg: "24px",
              xxl: "32px"
            }}
            variant="h2"
          />
        }
        loadingContent={<AutLoading width="130px" height="130px" />}
      />
    </>
  );
};

export default memo(AutWallet);
