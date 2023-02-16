import { useEffect } from "react";
import { Init } from "@aut-labs/d-aut";
import { EnableAndChangeNetwork } from "../web3.network";

function Web3DautConnect({ setLoading, connectors, networks, onConnected }) {
  const onAutInit = async () => {
    setLoading(false);
  };

  const onAutLogin = async ({ detail }) => {
    const profile = JSON.parse(JSON.stringify(detail));

    // const autID = new AutID(profile);
    // autID.properties.communities = autID.properties.communities.filter((c) => {
    //   return c.properties.userData?.isActive;
    // });
    // autID.properties.address = profile.address;
    // autID.properties.network = profile.network?.toLowerCase();
    // const ethDomain = await fetchHolderEthEns(autID.properties.address);
    // autID.properties.ethDomain = ethDomain;

    // await dispatch(
    //   setConnectedUserInfo({
    //     connectedAddress: autID.properties.address,
    //     connectedNetwork: autID.properties.network?.toLowerCase(),
    //   })
    // );
    // await dispatch(
    //   updateHolderState({
    //     profiles: [autID],
    //     selectedProfileAddress: autID.properties.address,
    //     selectedProfileNetwork: autID.properties.network?.toLowerCase(),
    //     fetchStatus: ResultState.Success,
    //     status: ResultState.Idle,
    //   })
    // );

    const [connector] = connectors[profile.provider];
    if (connector) {
      const config = networks.find(
        (n) => n.network?.toLowerCase() === profile?.network?.toLowerCase()
      );
      await connector.activate(config.chainId);
      try {
        await EnableAndChangeNetwork(connector.provider, config);
        // await dispatch(setNetwork(config.network));
      } catch (error) {
        console.log(error);
      }
    }
  };

  const onDisconnected = () => {
    // dispatch(resetAuthState());
  };

  useEffect(() => {
    window.addEventListener("aut-Init", onAutInit);
    window.addEventListener("aut-onConnected", onAutLogin);
    window.addEventListener("aut-onDisconnected", onDisconnected);

    Init();

    return () => {
      window.removeEventListener("aut-Init", onAutInit);
      window.removeEventListener("aut-onConnected", onAutLogin);
      window.removeEventListener("aut-onDisconnected", onAutLogin);
    };
  }, []);

  return (
    <d-aut
      style={{
        display: "flex",
        justifyContent: "center",
      }}
      id="d-aut"
      dao-expander="0xD99665dCADEC54b23c7927d338A4E5b91030e166"
      button-type="simple"
    />
  );
}

export default Web3DautConnect;
