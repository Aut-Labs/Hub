/* eslint-disable max-len */
import axios from "axios";
import { environment } from "./environment";
import { NetworkConfig } from "./ProviderFactory/network.config";

export const getAppConfig = (): Promise<NetworkConfig[]> => {
  return axios
    .get(`${environment.apiUrl}/autid/config/network/${environment.networkEnv}`)
    .then((r) => r.data);
};
