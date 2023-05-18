import axios from "axios";
import { environment } from "./environment";
import { AUTH_TOKEN_KEY } from "./auth.api";

export enum CacheTypes {
  UserPhases = "UserPhases",
  AnswerStore = "AnswerStore"
}

export interface CacheModel {
  cacheKey: string;
  address: string;
  daoAddress: string;
  onboardingQuestAddress: string;
  questId: number;
  list: any[];
}

export const getCache = async (cacheKey: string): Promise<CacheModel> => {
  if (!AUTH_TOKEN_KEY) return;
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const res = await axios.get(
    `${environment.apiUrl}/autID/cache/getCache/${cacheKey}`,
    {
      headers: {
        Authorization: token
      }
    }
  );
  return res?.data || null;
};

export const updateCache = async (
  cache: Partial<CacheModel>
): Promise<CacheModel> => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const res = await axios.post(
    `${environment.apiUrl}/autID/cache/addOrUpdateCache/${cache.cacheKey}`,
    cache,
    {
      headers: {
        Authorization: token
      }
    }
  );
  return res?.data || null;
};

export const deleteCache = async (cacheKey: string): Promise<void> => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const res = await axios.delete(
    `${environment.apiUrl}/autID/cache/deleteCache/${cacheKey}`,
    {
      headers: {
        Authorization: token
      }
    }
  );
  return res?.data || null;
};
