import { toHex } from "common/utils/misc";

export const EnableAndChangeNetwork = async (provider, config) => {
    // console.info('Changing Network', config);
    const params = [
        {
            chainId: toHex(config.chainId),
            chainName: config.network,
            rpcUrls: config.rpcUrls,
            blockExplorerUrls: config.explorerUrls
        }
    ];
    const [{ chainId }] = params;
    try {
        await provider.request({ method: "eth_requestAccounts" });
        await provider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId }]
        });
    }
    catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
            try {
                await provider.request({
                    method: "wallet_addEthereumChain",
                    params
                });
            }
            catch (addError) {
                throw new Error(addError);
            }
        }
        else {
            throw new Error(switchError);
        }
    }
};