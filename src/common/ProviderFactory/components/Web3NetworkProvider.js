import { useEffect, useMemo, useState } from "react";
import ConnectorBtn, { ConnectorTypes } from "./ConnectorBtn";
import styled from "styled-components";
import ModalPopupWrapper from "common/components/ModalPopupWrapper";
import { NetworkSelectors } from "./NetworkSelectors";
import { EnableAndChangeNetwork } from "../web3.network";
import AutLoading from "common/components/AutLoading";
import AppTitle from "common/components/AppTitle";
import Typography from "common/components/Typography";
import { closeModal } from "@redq/reuse-modal";
import { Web3AllowListProvider } from "@aut-labs-private/abi-types";
import { useConnector, useEthers } from "@usedapp/core";
import { authoriseWithWeb3 } from "api/auth.api";

const DialogInnerContent = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  flex: 1,
  gridGap: "30px",
});

const Web3NetworkProvider = ({
  shouldBeAllowListed = false,
  networks,
  onClose,
}) => {
  const [wallet, setWallet] = useState();
  const [isSigning, setIsSigning] = useState(false);
  const [tryEagerConnect, setTryEagerConnect] = useState(false);
  const { connector, activate } = useConnector();
  const {
    activateBrowserWallet,
    deactivate,
    switchNetwork,
    isLoading,
    account,
    chainId,
  } = useEthers();

  const changeConnector = async (connectorType) => {
    setWallet(connectorType);
    activateBrowserWallet({ type: connectorType });
    if (!connector?.connector) {
      setTryEagerConnect(true);
    } else {
      await tryConnect();
    }
  };

  const canConnectEagerly = useMemo(() => {
    return !!tryEagerConnect && !!connector?.connector && account;
  }, [connector, tryEagerConnect, account]);

  // useEffect(() => {
  //   deactivate();
  // }, []);

  const tryConnect = async () => {
    const [config] = networks.filter((n) => !n.disabled);
    // .find(
    //   // (n) => n.chainId?.toString() === chainId?.toString()
    //   (n) => n.chainId?.toString() === chainId?.toString()
    // );
    if (config && connector?.connector) {
      await activateNetwork(config, connector.connector);
    } else {
      setTryEagerConnect(false);
    }
  };

  useEffect(() => {
    if (canConnectEagerly) {
      tryConnect();
    }
  }, [canConnectEagerly]);

  const activateNetwork = async (network, conn) => {
    try {
      setIsSigning(true);
      await activate(conn);
      await switchNetwork(+network.chainId);

      if (conn.name === "metamask") {
        const provider = conn.provider.provider;
        await EnableAndChangeNetwork(provider, network);
      }

      const signer = conn.provider.getSigner();
      const contract = Web3AllowListProvider(
        "0x3Aa3c3cd9361a39C651314261156bc7cdB52B618",
        {
          signer: () => signer,
        }
      );

      if (shouldBeAllowListed) {
        const isAllowed = await contract.isAllowed(account);
        if (isAllowed) {
          const isAuthorised = await authoriseWithWeb3(signer);
          closeDialog({
            connected: isAuthorised,
            account,
          });
        } else {
          closeDialog(
            {
              connected: false,
              account: null,
            },
            "Aw shucks, it looks like you’re not on the Allowlist for this round."
          );
        }
      } else {
        const isAuthorised = await authoriseWithWeb3(signer);
        closeDialog({
          connected: isAuthorised,
          account,
        });
      }
    } catch (error) {
      if (error?.code === 4001) {
        closeDialog(
          {
            connected: false,
            account: null,
          },
          error.message
        );
      } else {
        closeDialog(
          {
            connected: false,
            account: null,
          },
          "Aw shucks, it looks like you’re not on the Allowlist for this round."
        );
      }
    } finally {
      setTryEagerConnect(false);
      setIsSigning(false);
    }
  };

  const closeDialog = (connected, errorMessage = null) => {
    closeModal();
    setTryEagerConnect(false);
    onClose(connected, errorMessage);
  };

  return (
    <ModalPopupWrapper>
      <>
        <AppTitle
          mb={{
            xs: "16px",
            lg: "24px",
            xxl: "32px",
          }}
          variant="h2"
        />

        {(isLoading || isSigning || tryEagerConnect) && (
          <div style={{ position: "relative", flex: 1 }}>
            <AutLoading />
          </div>
        )}

        {!isLoading && !isSigning && !tryEagerConnect && (
          <>
            {!wallet && (
              <Typography
                m="0"
                fontFamily="var(--fractul-regular)"
                color="white"
                as="subtitle1"
              >
                Connect your wallet
              </Typography>
            )}
            {wallet && (
              <>
                <Typography
                  mb={{
                    xs: "8px",
                  }}
                  color="white"
                  as="subtitle1"
                >
                  Change Network
                </Typography>

                <Typography color="white" as="body">
                  You will need to switch your wallet’s network.
                </Typography>
              </>
            )}
            <DialogInnerContent>
              {!wallet && (
                <>
                  <ConnectorBtn
                    setConnector={changeConnector}
                    connectorType={ConnectorTypes.Metamask}
                  />
                  <ConnectorBtn
                    setConnector={changeConnector}
                    connectorType={ConnectorTypes.WalletConnect}
                  />
                </>
              )}
              {/* {wallet && !isLoading && (
                <NetworkSelectors
                  networks={networks}
                  onSelect={async (selectedNetwork) => {
                    if (selectedNetwork) {
                      try {
                        await activateNetwork(
                          selectedNetwork,
                          connector.connector
                        );
                      } catch (error) {
                        console.log(error, "error");
                      }
                    }
                  }}
                />
              )} */}
            </DialogInnerContent>
          </>
        )}
      </>
    </ModalPopupWrapper>
  );
};

export default Web3NetworkProvider;
