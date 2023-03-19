/* eslint-disable jsx-a11y/alt-text */
import WalletConnectLogo from "common/assets/image/wallet-connect.svg";
import MetamaskLogo from "common/assets/image/metamask.svg";
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
    icon: <Image src={WalletConnectLogo.src} alt="Wallet Connect Logo" />,
  },
};

const ConnectButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  grid-gap: 10px;
`;

export default function ConnectorBtn({ connectorType, setConnector }) {
  return (
    <ConnectButton
      colors="primary"
      onClick={async () => {
        setConnector(connectorType);
      }}
      iconPosition="left"
      icon={
        <span
          style={{
            display: "flex",
            height: "30px",
            width: "30px"
          }}
        >
          {btnConfig[connectorType].icon}
        </span>
      }
      variant="roundOutlined"
      title={btnConfig[connectorType].label}
      size="normal"
      minWidth={{
        _: "185px",
        lg: "200px",
        xxl: "440px",
      }}
    />
  );
}
