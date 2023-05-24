import axios from "axios";
import { environment } from "./environment";
import { AUTH_TOKEN_KEY } from "./auth.api";

export const saveQestions = async (
  taskAddress: string,
  taskId: number,
  questions: any[]
): Promise<void> => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const res = await axios.post(
    `${environment.apiUrl}/autID/quiz`,
    {
      taskAddress,
      taskId,
      questions
    },
    {
      headers: {
        Authorization: token
      }
    }
  );
  return res?.data || null;
};

export const getQestions = async (taskAddress: string): Promise<void> => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const res = await axios.get(
    `${environment.apiUrl}/autID/quizAnswers/${taskAddress}`,

    {
      headers: {
        Authorization: token
      }
    }
  );
  return res?.data || null;
};

export const finaliseQuizTask = async (
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
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const res = await axios.post(
    `${environment.apiUrl}/taskVerifier/quiz`,
    {
      onboardingPluginAddress,
      questionsAndAnswers,
      taskAddress,
      uuid,
      taskId
    },
    {
      headers: {
        Authorization: token
      }
    }
  );
  return res?.data || null;
};

export const finaliseTransactionTask = async (
  taskAddress: string,
  onboardingPluginAddress: string,
  taskId: number
): Promise<{
  isFinalized: boolean;
  txHash: string;
  error: string;
}> => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const res = await axios.post(
    `${environment.apiUrl}/taskVerifier/transaction`,
    {
      onboardingPluginAddress,
      taskAddress,
      taskId
    },
    {
      headers: {
        Authorization: token
      }
    }
  );
  return res?.data || null;
};

export const finaliseJoinDiscordTask = async (
  taskAddress: string,
  onboardingPluginAddress: string,
  taskId: number,
  discordAccessToken: string
): Promise<{
  isFinalized: boolean;
  txHash: string;
  error: string;
}> => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const res = await axios.post(
    `${environment.apiUrl}/taskVerifier/discordJoin`,
    {
      onboardingPluginAddress,
      bearerToken: `Bearer ${discordAccessToken}`,
      taskAddress,
      taskId
    },
    {
      headers: {
        Authorization: token
      }
    }
  );
  return res?.data || null;
};
