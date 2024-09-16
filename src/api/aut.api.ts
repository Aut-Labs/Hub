/* eslint-disable max-len */
import axios from "axios";
import { environment } from "./environment";
import { NetworkConfig } from "./ProviderFactory/network.config";

export const getAppConfig = async (): Promise<NetworkConfig[]> => {
  return axios
    .get(`${environment.apiUrl}/autId/config/network/${environment.networkEnv}`)
    .then((r) => r.data);
};

const sigilCache: Record<string, string> = {};

export const getHubSigil = async (hubAddress: string): Promise<string> => {
  if (sigilCache[hubAddress]) {
    return sigilCache[hubAddress];
  }
  return axios
    .get(`${environment.apiUrl}/user/generateSigil/${hubAddress}`)
    .then(({ data }) => {
      sigilCache[hubAddress] = data.sigil;
      return data.sigil;
    });
};
