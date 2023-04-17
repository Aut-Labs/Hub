import { NetworkConfig } from "../network.config";
import { Button } from "@mui/material";

export const NetworkSelectors = ({ onSelect, networks }) => {
  return (
    <>
      {networks.map((network: NetworkConfig, index: number) => {
        return (
          <Button
            key={`key-${index}`}
            onClick={() => {
              onSelect(network);
            }}
            variant="outlined"
            size="normal"
            color="offWhite"
            disabled={network.disabled}
            sx={{
              minWidth: {
                xs: "360px",
                md: "360px",
                lg: "360px",
                xxl: "440px"
              }
            }}
          >
            Switch to {network.name}
          </Button>
        );
      })}
    </>
  );
};
