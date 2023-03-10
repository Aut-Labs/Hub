import axios from "axios";
import { AUTH_TOKEN_KEY } from "./auth.api";


export const getCache = async (cacheKey) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const res = await axios.get(
    `https://api.skillwallet.id/api/autID/cache/getCache/${cacheKey}`,
    {
      headers: {
        Authorization: token
      }
    }
  );
  return res?.data || null;
};

export const updateCache = async (cache) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const res = await axios.post(
    `https://api.skillwallet.id/api/autID/cache/addOrUpdateCache/${cache.cacheKey}`,
    cache,
    {
      headers: {
        Authorization: token
      }
    }
  );
  return res?.data || null;
};

export const deleteCache = async (cacheKey) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const res = await axios.delete(
    `https://api.skillwallet.id/api/autID/cache/deleteCache/${cacheKey}`,
    {
      headers: {
        Authorization: token
      }
    }
  );
  return res?.data || null;
};
