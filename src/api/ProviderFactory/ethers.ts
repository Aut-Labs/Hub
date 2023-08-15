import * as React from "react";
import { type WalletClient, useWalletClient } from "wagmi";
import { providers } from "ethers";
import { MultiSigner } from "@aut-labs/sdk/dist/models/models";

export function walletClientToSigner(walletClient: WalletClient): MultiSigner {
  const { account, chain, transport } = walletClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address
  };

  const provider = new providers.Web3Provider(transport as any, network);
  const signer = provider.getSigner(account.address);
  const readOnlyProvider = new providers.JsonRpcProvider(
    "https://polygon-mumbai.g.alchemy.com/v2/G742dEaaWF0gE-SL0IlEFAJdlA_l7ezJ",
    network
  );
  const readOnlySigner = readOnlyProvider.getSigner(account.address);
  return { signer, readOnlySigner };
}

export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: walletClient } = useWalletClient({ chainId });
  return React.useMemo(
    () => (walletClient ? walletClientToSigner(walletClient) : undefined),
    [walletClient]
  );
}
