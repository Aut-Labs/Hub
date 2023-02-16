import { environment } from "api/environment";
import Button from "common/components/Button";
import styled from "styled-components";


const AutButton = styled(Button)({
  fontSize: "1.56rem",
  width: "22rem",
  height: "3.438rem",
  marginBottom: "10px",
  display: 'flex',
  alignItems: 'center',
  paddingLeft: '15px',
  '.btn-text': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    margin: 0,
  }
});

export const NetworkSelectors = ({ onSelect }) => {
  return (
    <>
      {environment.networks.split(",").map((networkName, index) => {
        const label = environment.networkNames.split(",")[index];
        const foundChainId = Number(environment.chainIds.split(",")[index]);
        return (
          <AutButton
            key={`key-${index}`}
            onClick={() => {
              onSelect(foundChainId, networkName.trim());
            }}
            title={<>Switch to {label}</>}
          />
        );
      })}
    </>
  );
};
