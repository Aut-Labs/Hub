import WalletConnectLogo from "common/assets/image/wallet-connect.svg";
import MetamaskLogo from "common/assets/image/metamask.svg";
import Text from "common/components/Text";
import Button from "common/components/Button";
import Image from "common/components/Image";
import styled from "styled-components";

export const ConnectorTypes = {
  WalletConnect: "walletConnect",
  Metamask: "metamask",
};

const btnConfig = {
  [ConnectorTypes.Metamask]: {
    label: "Metamask",
    icon: <Image src={MetamaskLogo.src} alt="Aut Logo" />,
  },
  [ConnectorTypes.WalletConnect]: {
    label: "WalletConnect",
    icon: <Image src={WalletConnectLogo.src} />,
  },
};

const AutButton = styled(Button)({
  fontSize: "1.56rem",
  width: "16.25rem",
  height: "3.438rem",
  marginBottom: "10px",
  display: "flex",
  alignItems: "center",
  paddingLeft: "15px",
  ".btn-text": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    margin: 0,
  },
});

const AutButtonTxt = styled(Text)({
  flex: 1,
  margin: 0,
});

export default function ConnectorBtn({ connectorType, setConnector }) {
  // const [connector] = getConnector(connectorType);
  const dispatch = useAppDispatch();
  const [connector] = useSelector(NetworkConnector(connectorType));

  return (
    <AutButton
      onClick={async () => {
        await connector.connectEagerly();
        dispatch(setWallet(connectorType));
        setConnector(connector);
      }}
      title={
        <>
          {btnConfig[connectorType].icon}
          <AutButtonTxt content={btnConfig[connectorType].label} />
        </>
      }
    />
  );
}
