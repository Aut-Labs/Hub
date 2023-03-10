import Button from "common/components/Button";
import styled from "styled-components";

const ConnectButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  grid-gap: 10px;
`;

export const NetworkSelectors = ({ onSelect, networks }) => {
  return (
    <>
      {networks.map((network, index) => {
        return (
          <ConnectButton
            key={`key-${index}`}
            colors="primary"
            disabled={network.disabled}
            onClick={() => {
              onSelect(network);
            }}
            variant="roundOutlined"
            title={<>Switch to {network.name}</>}
            size="normal"
            minWidth={{
              _: "185px",
              lg: "200px",
              xxl: "440px",
            }}
          />
        );
      })}
    </>
  );
};
