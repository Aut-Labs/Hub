import { memo, useEffect, useRef } from "react";
import { Init } from "@aut-labs/d-aut";
import { AutWalletConnector, useAutConnector } from "@aut-labs/connector";
import { useSelector } from "react-redux";
import { NetworkConfig } from "@api/network.config";
import { RequiredQueryParams } from "@api/RequiredQueryParams";
import { MultiSigner } from "@aut-labs/sdk/dist/models/models";
import { hubUpdateState } from "@store/Hub/hub.reducer";
import AutLoading from "@components/AutLoading";
import AppTitle from "@components/AppTitle";
import { useSearchParams } from "react-router-dom";
import { environment, EnvMode } from "@api/environment";
import AutSDK, { getOverrides, Hub } from "@aut-labs/sdk";
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
  const [searchParams] = useSearchParams();
  const dAutInitialized = useRef<boolean>(false);
  const {
    isConnected,
    isConnecting,
    connect,
    setStateChangeCallback,
    disconnect,
    multiSigner,
    connectors,
    multiSignerId,
    status,
    address,
    chainId
  } = useAutConnector();
  console.log(connectors, "connectors");

  const hubAddress = useSelector(HubAddress);
  const selectedRoleId = useSelector(SelectedRoleId);

  const initialiseSDK = async (
    network: NetworkConfig,
    multiSigner: MultiSigner
  ) => {
    const sdk = await AutSDK.getInstance(false);
    await sdk.init(multiSigner, {
      hubRegistryAddress: network.contracts.hubRegistryAddress,
      autIDAddress: network.contracts.autIDAddress
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
        const sdk = await AutSDK.getInstance(false);
        sdk.hub = sdk.initService<Hub>(Hub, hubAddress);
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

      Init({
        config,
        envConfig: {
          API_URL: environment.apiUrl,
          GRAPH_API_URL: environment.graphApiUrl,
          IPFS_API_KEY: environment.ipfsApiKey,
          IPFS_API_SECRET: environment.ipfsApiSecret,
          IPFS_GATEWAY_URL: environment.ipfsGatewayUrl,
          ENV: environment.env as EnvMode
        },
        connector: {
          connect,
          disconnect,
          setStateChangeCallback,
          connectors,
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
      {/* @ts-ignore */}
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
