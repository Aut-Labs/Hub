import { memo, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useAppDispatch } from "@store/store.model";
import { resetAuthState, setAuthenticated } from "@auth/auth.reducer";
import { AutID } from "@api/aut.model";
import { Init } from "@aut-labs/d-aut";
import { communityUpdateState } from "@store/Community/community.reducer";
import {
  NetworksConfig,
  updateWalletProviderState
} from "@store/WalletProvider/WalletProvider";
import { useSelector } from "react-redux";
import AutSDK from "@aut-labs-private/sdk";
import { ethers } from "ethers";
import { NetworkConfig } from "./network.config";
import { Config, Connector, useConnector, useEthers } from "@usedapp/core";
import { debounce } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { AUTH_TOKEN_KEY } from "@api/auth.api";
import { RequiredQueryParams } from "@api/RequiredQueryParams";
import { IAutButtonConfig } from "@aut-labs/d-aut/build/components/AutButtonMenu/AutMenuUtils";
import { resetState } from "@store/store";

function Web3DautConnect({
  setLoading,
  config
}: {
  setLoading: (loading: boolean) => void;
  config: Config;
}) {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const [daoAddress] = useState(localStorage.getItem("temp_dao_address"));
  const abort = useRef<AbortController>();
  const networks = useSelector(NetworksConfig);
  const { activate } = useConnector();
  const { activateBrowserWallet, switchNetwork, chainId } = useEthers();

  const onAutInit = async () => {
    const connetectedAlready = sessionStorage.getItem("aut-data");
    if (!connetectedAlready) {
      setLoading(false);
    }
  };

  const initialiseSDK = async (
    network: NetworkConfig,
    signer: ethers.providers.JsonRpcSigner
  ) => {
    const sdk = AutSDK.getInstance();
    return sdk.init(signer, {
      daoTypesAddress: network.contracts.daoTypesAddress,
      autDaoRegistryAddress: network.contracts.autDaoRegistryAddress,
      autIDAddress: network.contracts.autIDAddress,
      daoExpanderRegistryAddress: network.contracts.daoExpanderRegistryAddress,
      pluginRegistryAddress: network.contracts.pluginRegistryAddress
    });
  };

  const activateNetwork = async (
    network: NetworkConfig,
    conn: Connector,
    wallet?: string
  ) => {
    try {
      await activate(conn);
      await switchNetwork(+network.chainId);
    } catch (error) {
      console.error(error, "error");
    }
    const signer = conn?.provider?.getSigner();
    const itemsToUpdate = {
      sdkInitialized: true,
      selectedWalletType: wallet,
      selectedNetwork: network.network,
      signer
    };
    if (!wallet) {
      delete itemsToUpdate.selectedWalletType;
    }
    await dispatch(updateWalletProviderState(itemsToUpdate));
    await initialiseSDK(network, signer as ethers.providers.JsonRpcSigner);
  };

  const onAutLogin = async ({ detail }: any) => {
    const profile = JSON.parse(JSON.stringify(detail));
    const autID = new AutID(profile);
    autID.properties.communities = autID.properties.communities.filter((c) => {
      return c.properties.userData?.isActive;
    });
    autID.properties.address = profile.address;
    autID.properties.network = profile.network?.toLowerCase();

    const [network] = networks.filter((n) => !n.disabled);

    if (network) {
      const connector = config.connectors[profile.provider];
      activateBrowserWallet({ type: profile.provider });
      await activateNetwork(network, connector, profile.provider);
    }

    if (searchParams.get(RequiredQueryParams.DaoAddress)) {
      localStorage.setItem(
        "temp_dao_address",
        searchParams.get(RequiredQueryParams.DaoAddress)
      );
    }

    await dispatch(
      communityUpdateState({
        communities: autID.properties.communities,
        selectedCommunityAddress:
          autID.properties.communities[0].properties?.address
      })
    );

    await dispatch(
      setAuthenticated({
        isAuthenticated: true,
        userInfo: autID
      })
    );

    setLoading(false);
  };

  const onDisconnected = () => {
    // dispatch(resetState);
    localStorage.removeItem(AUTH_TOKEN_KEY);
  };

  const onAutMenuProfile = () => {
    const profile = JSON.parse(sessionStorage.getItem("aut-data"));
    window.open(`https://my.aut.id/${profile.name}`, "_blank");
  };

  useEffect(() => {
    window.addEventListener("aut_profile", onAutMenuProfile);
    window.addEventListener("aut-Init", onAutInit);
    window.addEventListener("aut-onConnected", onAutLogin);
    window.addEventListener("aut-onDisconnected", onDisconnected);

    const config: IAutButtonConfig = {
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

    return () => {
      window.removeEventListener("aut_profile", onAutMenuProfile);
      window.removeEventListener("aut-Init", onAutInit);
      window.removeEventListener("aut-onConnected", onAutLogin);
      window.removeEventListener("aut-onDisconnected", onAutLogin);
      if (abort.current) {
        abort.current.abort();
      }
    };
  }, []);

  return (
    <>
      <d-aut
        style={{
          display: "none",
          position: "absolute",
          zIndex: 99999
        }}
        id="d-aut"
        menu-items='[{"name":"Profile","actionType":"event_emit","eventName":"aut_profile"}]'
        flow-config='{"mode" : "dashboard", "customCongratsMessage": ""}'
        ipfs-gateway="https://ipfs.nftstorage.link/ipfs"
        button-type="simple"
      />
    </>
  );
}

export const DautPlaceholder = memo(() => {
  const ref = useRef<HTMLDivElement>();
  useLayoutEffect(() => {
    let dautEl: HTMLElement = document.querySelector("#d-aut");
    dautEl.style.display = "none";
    const updateDautPosition = () => {
      if (!dautEl) {
        dautEl = document.querySelector("#d-aut");
      }
      if (!dautEl || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      dautEl.style.left = `${rect.left}px`;
      dautEl.style.top = `${rect.top}px`;
      dautEl.style.display = "inherit";
    };
    const debounceFn = debounce(updateDautPosition, 10);
    window.addEventListener("resize", debounceFn);
    debounceFn();
    return () => {
      window.removeEventListener("resize", debounceFn);
      dautEl.style.display = "none";
    };
  }, [ref.current]);

  return (
    <div
      ref={ref}
      style={{
        width: "270px",
        height: "55px",
        position: "relative",
        zIndex: -1
      }}
      className="web-component-placeholder"
    />
  );
});

export default memo(Web3DautConnect);
