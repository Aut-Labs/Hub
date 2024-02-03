import * as React from "react";
import { useWalletClient } from "wagmi";
import {
  BrowserProvider,
  JsonRpcProvider,
  JsonRpcSigner,
  Signer
} from "ethers";

export type EtherSigner = JsonRpcSigner | BrowserProvider | Signer;
export interface MultiSigner {
  signer: EtherSigner;
  readOnlySigner: EtherSigner;
}

export async function walletClientToSigner(walletClient): Promise<MultiSigner> {
  const { account, chain, transport } = walletClient;
  const network = {
    chainId: chain?.id,
    name: chain?.name,
    ensAddress: chain?.contracts?.ensRegistry?.address
  };

  const provider = new BrowserProvider(transport as any, network);
  const signer = await provider.getSigner(account.address);
  return { signer, readOnlySigner: signer };
}

export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: walletClient } = useWalletClient({ chainId });
  return React.useMemo(
    () => (walletClient ? walletClientToSigner(walletClient) : undefined),
    [walletClient]
  );
}
