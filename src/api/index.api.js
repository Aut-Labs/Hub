import axios from "axios";

export const getAppConfig = () => {
  return axios
    .get(`https://api.skillwallet.id/api/autid/config/network/testing`)
    .then((r) => r.data);
};