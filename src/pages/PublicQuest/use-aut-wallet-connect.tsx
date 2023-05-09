import { useEffect, useMemo, useRef, useState } from "react";
import { Connector, useConfig, useConnector, useEthers } from "@usedapp/core";
import { Web3Provider, JsonRpcProvider } from "@ethersproject/providers";
import { authoriseWithWeb3 } from "@api/auth.api";

type DeferredPromise<DeferType> = {
  resolve: (value: DeferType) => void;
  reject: (value: unknown) => void;
  promise: Promise<DeferType>;
};

export function useDeferredPromise<DeferType>() {
  const deferRef = useRef<DeferredPromise<DeferType>>(null);

  const defer = () => {
    const deferred = {} as DeferredPromise<DeferType>;

    const promise = new Promise<DeferType>((resolve, reject) => {
      deferred.resolve = resolve;
      deferred.reject = reject;
    });

    deferred.promise = promise;
    deferRef.current = deferred;
    return deferRef.current;
  };

  return { defer, deferRef: deferRef.current };
}

export const useAutWalletConnect = () => {
  const { defer, deferRef } = useDeferredPromise();
  const [isSigning, setIsSigning] = useState(false);
  const [connectError, setErrorMessage] = useState("");
  const [tryEagerConnect, setTryEagerConnect] = useState(false);
  const { connector, activate } = useConnector();
  const config = useConfig();
  const {
    activateBrowserWallet,
    deactivate,
    switchNetwork,
    isLoading,
    account,
    error
  } = useEthers();

  const activateNetwork = async (conn: Connector, deferredPromise) => {
    try {
      const network = config.networks[0];

      setIsSigning(true);
      await activate(conn);
      await switchNetwork(+network.chainId);

      if (!account) {
        setIsSigning(false);
        setTryEagerConnect(true);
        return;
      }

      const { provider } = conn;
      const signer = provider.getSigner();

      const isAuthorised = await authoriseWithWeb3(signer);

      deferredPromise.resolve({
        provider,
        connected: isAuthorised,
        account
      });
    } catch (error) {
      if (error?.code === "ACTION_REJECTED") {
        setErrorMessage("User denied message signature");
        deferredPromise.reject("User denied message signature");
      } else {
        setErrorMessage(error?.message || error);
        deferredPromise.reject(error?.message || error);
      }
    } finally {
      setTryEagerConnect(false);
      setIsSigning(false);
    }
  };

  const tryConnect = async (deferredPromise) => {
    if (connector?.connector) {
      setTryEagerConnect(false);
      await activateNetwork(connector.connector, deferredPromise);
    } else {
      setTryEagerConnect(false);
    }
  };

  const changeConnector = async (connectorType: string) => {
    activateBrowserWallet({ type: connectorType });
    const deferredPromise = defer();
    if (
      !connector?.connector ||
      connector?.connector?.name?.toLowerCase() !== connectorType?.toLowerCase()
    ) {
      setTryEagerConnect(true);
    } else {
      tryConnect(deferredPromise);
    }

    return deferredPromise.promise;
  };

  const disconnect = () => {
    setTryEagerConnect(false);
    setIsSigning(false);
    setErrorMessage("");
    deactivate();
  };

  const errorMessage = useMemo(
    () => connectError || error,
    [error, connectError]
  );

  const canConnectEagerly = useMemo(() => {
    return !!tryEagerConnect && !!connector?.connector && account;
  }, [connector, tryEagerConnect, account]);

  useEffect(() => {
    if (canConnectEagerly) {
      tryConnect(deferRef);
    }
  }, [canConnectEagerly]);

  return {
    errorMessage,
    disconnect,
    waitingUserConfirmation: isSigning,
    isLoading: isLoading || tryEagerConnect,
    connect: changeConnector
  } as unknown as {
    errorMessage: string;
    waitingUserConfirmation: boolean;
    isLoading: boolean;
    disconnect: () => void;
    connect: (connectorType: string) => Promise<{
      provider: Web3Provider | JsonRpcProvider;
      account: string;
      connected: boolean;
    }>;
  };
};
