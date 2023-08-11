import axios from "axios";
import { environment } from "./environment";
import { AUTH_TOKEN_KEY } from "./auth.api";

export const saveQestions = async (
  userAddress: string,
  taskAddress: string,
  taskId: number,
  questions: any[]
): Promise<void> => {
  // const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const res = await axios.post(
    `${environment.apiUrl}/autID/quiz`,
    {
      address: userAddress,
      taskAddress,
      taskId,
      questions
    }
    // {
    //   headers: {
    //     Authorization: token
    //   }
    // }
  );
  return res?.data || null;
};

export const getQestions = async (
  address: string,
  taskAddress: string
): Promise<void> => {
  // const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const res = await axios.get(
    `${environment.apiUrl}/autID/quizAnswers/${taskAddress}?=address=${address}`

    // {
    //   headers: {
    //     Authorization: token
    //   }
    // }
  );
  return res?.data || null;
};

export const finaliseQuizTask = async (
  userAdress: string,
  taskAddress: string,
  onboardingPluginAddress: string,
  taskId: number,
  uuid: string,
  questionsAndAnswers: any[]
): Promise<{
  isFinalized: boolean;
  txHash: string;
  error: string;
}> => {
  // const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const res = await axios.post(
    `${environment.apiUrl}/taskVerifier/quiz`,
    {
      address: userAdress,
      onboardingPluginAddress,
      questionsAndAnswers,
      taskAddress,
      uuid,
      taskId
    }
    // {
    //   headers: {
    //     Authorization: token
    //   }
    // }
  );
  return res?.data || null;
};

export const finaliseTransactionTask = async (
  userAddress: string,
  taskAddress: string,
  onboardingPluginAddress: string,
  taskId: number
): Promise<{
  isFinalized: boolean;
  txHash: string;
  error: string;
}> => {
  // const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const res = await axios.post(
    `${environment.apiUrl}/taskVerifier/transaction`,
    {
      address: userAddress,
      onboardingPluginAddress,
      taskAddress,
      taskId
    }
    // {
    //   headers: {
    //     Authorization: token
    //   }
    // }
  );
  return res?.data || null;
};

export const finaliseJoinDiscordTask = async (
  userAddress: string,
  taskAddress: string,
  onboardingPluginAddress: string,
  taskId: number,
  discordAccessToken: string
): Promise<{
  isFinalized: boolean;
  txHash: string;
  error: string;
}> => {
  // const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const res = await axios.post(
    `${environment.apiUrl}/taskVerifier/discordJoin`,
    {
      address: userAddress,
      onboardingPluginAddress,
      bearerToken: `Bearer ${discordAccessToken}`,
      taskAddress,
      taskId
    }
    // {
    //   headers: {
    //     Authorization: token
    //   }
    // }
  );
  return res?.data || null;
};
