import { useEffect, useMemo, useRef, useState } from "react";
import { useConfig, useConnector, useEthers } from "@usedapp/core";
import { authoriseWithWeb3, isAllowListed } from "api/auth.api";

const useDeferredPromise = () => {
  const deferRef = useRef(null);

  const defer = () => {
    deferRef.current = null;
    const deferred = {};

    const promise = new Promise((resolve, reject) => {
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
  const { activateBrowserWallet, switchNetwork, isLoading, account, error } =
    useEthers();

  const activateNetwork = async (conn, deferredPromise) => {
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

      const provider = conn.provider;
      const signer = provider.getSigner();

      const isAuthorised = await authoriseWithWeb3(signer);
      deferredPromise.resolve({
        provider,
        connected: isAuthorised,
        account,
      });
    } catch (error) {
      if (error?.code === "ACTION_REJECTED") {
        setErrorMessage("User denied message signature");
        deferredPromise.reject("User denied message signature");
      } else {
        setErrorMessage(error?.message);
        deferredPromise.reject(error?.message);
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

  const changeConnector = async (connectorType) => {
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
    waitingUserConfirmation: isSigning,
    isLoading: isLoading || tryEagerConnect,
    connect: changeConnector,
  };
};
