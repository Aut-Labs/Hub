import { useAppDispatch } from "@store/store.model";
import {
  ConnectorTypes,
  setWallet
} from "@store/WalletProvider/WalletProvider";
import { ReactComponent as WalletConnectLogo } from "@assets/aut/wallet-connect.svg";
import { ReactComponent as MetamaskLogo } from "@assets/aut/metamask.svg";
import { Button } from "@mui/material";

const btnConfig = {
  [ConnectorTypes.Metamask]: {
    label: "Metamask",
    icon: <MetamaskLogo />
  },
  [ConnectorTypes.WalletConnect]: {
    label: "WalletConnect",
    icon: <WalletConnectLogo />
  }
};

export default function ConnectorBtn({
  connectorType,
  setConnector
}: {
  connectorType: ConnectorTypes;
  setConnector: any;
}) {
  const dispatch = useAppDispatch();

  return (
    <Button
      onClick={async () => {
        dispatch(setWallet(connectorType));
        setConnector(connectorType);
      }}
      startIcon={btnConfig[connectorType].icon}
      variant="outlined"
      size="normal"
      color="offWhite"
      sx={{
        minWidth: {
          xs: "260px",
          md: "280px",
          lg: "300px",
          xxl: "440px"
        }
      }}
    >
      {btnConfig[connectorType].label}
    </Button>
  );
}
