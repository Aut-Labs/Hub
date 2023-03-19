import ConnectorBtn, { ConnectorTypes } from "./ConnectorBtn";
import styled from "styled-components";
import ModalPopupWrapper from "common/components/ModalPopupWrapper";
import AutLoading from "common/components/AutLoading";
import AppTitle from "common/components/AppTitle";
import Typography from "common/components/Typography";
import { closeModal } from "@redq/reuse-modal";
import Box from "common/components/Box";
import { useAutWalletConnect } from "./use-aut-wallet-connect";

const DialogInnerContent = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  flex: 1,
  gridGap: "30px",
});

const ErrorWrapper = styled(Box)({
  backgroundColor: "rgba(254, 202, 202, 0.16)",
  padding: "20px",
  width: "80%",
  marginBottom: "12px",
  borderRadius: "16px",
});

const Web3NetworkProvider = ({ onClose }) => {
  const { isLoading, waitingUserConfirmation, errorMessage, connect } =
    useAutWalletConnect();

  const changeConnector = async (connectorType) => {
    try {
      const response = await connect(connectorType);
      closeDialog(response);
    } catch (error) {}
  };

  const closeDialog = (connected, errorMessage = null) => {
    closeModal();
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

        {(isLoading || waitingUserConfirmation) && (
          <div style={{ position: "relative", flex: 1 }}>
            {waitingUserConfirmation && (
              <Typography
                m="0"
                fontFamily="var(--fractul-regular)"
                color="white"
                as="subtitle1"
              >
                Waiting confirmation...
              </Typography>
            )}
            <AutLoading width="130px" height="130px" />
          </div>
        )}

        {!isLoading && !waitingUserConfirmation && (
          <>
            <Typography
              m="0"
              fontFamily="var(--fractul-regular)"
              color="white"
              as="subtitle1"
            >
              Connect your wallet
            </Typography>
            <DialogInnerContent>
              <ConnectorBtn
                setConnector={changeConnector}
                connectorType={ConnectorTypes.Metamask}
              />
              <ConnectorBtn
                setConnector={changeConnector}
                connectorType={ConnectorTypes.WalletConnect}
              />
            </DialogInnerContent>
            {errorMessage && (
              <ErrorWrapper>
                <Typography
                  m="0"
                  textAlign="center"
                  fontFamily="var(--fractul-regular)"
                  color="error"
                  as="body"
                >
                  {errorMessage}
                </Typography>
              </ErrorWrapper>
            )}
          </>
        )}
      </>
    </ModalPopupWrapper>
  );
};

export default Web3NetworkProvider;
