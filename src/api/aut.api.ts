import axios from "axios";
import { environment } from "./environment";
import { Web3ThunkProviderFactory } from "./ProviderFactory/web3-thunk.provider";
import { NetworkConfig } from "./ProviderFactory/network.config";
import { Web3AutIDProvider } from "@aut-labs/abi-types";

export const getUsersData = () => {
  const params = {
    startDate: "1622592571001",
    perMonth: true
  };
  const headers = {
    key: "193485710394857"
  };
  return axios
    .get(`${environment.apiUrl}/analytics/activeUsers`, {
      params,
      headers
    })
    .then((res) => res.data);
};

export const addDiscordUrl = async (
  communityAddress: string,
  discordWebhook: string
) => {
  return axios
    .post(
      `${environment.apiUrl}/community/key/${communityAddress}/discordWebhook`,
      {
        discordWebhook
      }
    )
    .then(() => discordWebhook);
};

export const getAutAddress = (): Promise<string> => {
  return axios
    .get(`${environment.apiUrl}/Aut/config`, {})
    .then((res) => res.data.AutAddress);
};

// @OTOD: Milena to implement method for fetching logs
export const getLogs = (): Promise<any[]> => {
  return new Promise((resolve) => {
    resolve([
      {
        img: "",
        title: "SW 1",
        sign: "@",
        source: "",
        role: "Role",
        timestamp: new Date()
      },
      {
        img: "",
        title: "SW 1",
        sign: "@",
        source: "",
        role: "Role",
        timestamp: new Date()
      },
      {
        img: "",
        title: "SW 1",
        sign: "@",
        role: "Role",
        source: "",
        timestamp: new Date()
      },
      {
        img: "",
        title: "SW 1",
        sign: "@",
        source: "",
        role: "Role",
        timestamp: new Date()
      },
      {
        img: "",
        title: "SW 1",
        sign: "@",
        source: "",
        role: "Role",
        timestamp: new Date()
      },
      {
        img: "",
        title: "SW 1",
        sign: "@",
        source: "",
        role: "Role",
        timestamp: new Date()
      }
    ]);
  });
};

export const AutExists = async () => {
  try {
    const AutAddress = await getAutAddress();

    const contract = await Web3AutIDProvider(AutAddress, {
      // beforeRequest: () => EnableAndChangeNetwork()
    });

    if (window.ethereum.selectedAddress) {
      const { selectedAddress } = window.ethereum;
      const tokenId = await contract.getAutIDByOwner(selectedAddress);
      if (tokenId) {
        return true;
      }
    }
    return false;
  } catch (e) {
    return false;
  }
};

const autIDThunkProvider = Web3ThunkProviderFactory("AutID", {
  provider: null
});

export const getAppConfig = (): Promise<NetworkConfig[]> => {
  return axios
    .get(`${environment.apiUrl}/autid/config/network/${environment.networkEnv}`)
    .then((r) => r.data);
};
