import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { environment } from "./environment";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

export interface TaskData {
  role: string;
  description: string;
  name: string;
}

export interface GuildVerificationData {
  accessToken: string;
  guildId: string;
}

export const oauthGetToken = (code: string) => {
  const params = new URLSearchParams();
  params.append("client_id", environment.discordClientId);
  params.append("client_secret", environment.discordClientSecret);
  params.append("grant_type", "authorization_code");
  params.append("redirect_uri", environment.discordRedirectUri);
  params.append("scope", "identify guilds");
  params.append("code", code);
  return fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    body: params
  })
    .then((response) => response.json())
    .then((data) => data.access_token);
};

export const getUser = (accessToken: string) => {
  return axios
    .get(`${environment.discordApiUrl}/users/@me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    .then((res) => res.data);
};

export const getServerDetails = (inviteLink: string) => {
  const serverCode = inviteLink.match(/discord\.gg\/(.+)/i)[1];
  return axios
    .get(`https://discord.com/api/invites/${serverCode}`)
    .then((res) => res.data);
};

export const getUserGuilds = (accessToken: string) => {
  return axios
    .get(`${environment.discordApiUrl}/users/@me/guilds`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    .then((res) => res.data);
};

// export const verifyDiscordServerOwnership = createAsyncThunk(
//   "discord/verify",
//   async (
//     guildVerificationData: GuildVerificationData,
//     { rejectWithValue, getState }
//   ) => {
//     const guilds = await axios
//       .get(`${environment.discordApiUrl}/users/@me/guilds`, {
//         headers: {
//           Authorization: `Bearer ${accessToken}`
//         }
//       })
//       .then((res) => res.data);
//     const guild = guilds.find((g) => g.id === guildVerificationData.guildId);
//     if (!guild.owner) {
//       return false;
//     }
//     return true;
//   }
// );

const verifyGuildOwnership = async (
  guildVerificationData: GuildVerificationData
): Promise<VerificationResult> => {
  const { accessToken, guildId } = guildVerificationData;

  const guilds: any[] = await axios
    .get(`${environment.discordApiUrl}/users/@me/guilds`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    .then((res) => res.data);

  const guild = guilds.find((g) => g.id === guildId);

  if (!guild || !guild.owner) {
    return { isAdmin: false };
  }

  return { isAdmin: true, guild };
};

interface VerificationResult {
  isAdmin: boolean;
  guild?: any;
}

export const useVerifyGuildOwnershipMutation = (
  options?: UseMutationOptions<VerificationResult, Error, GuildVerificationData>
) => {
  return useMutation({
    ...options,
    mutationFn: verifyGuildOwnership
  });
};
export interface DiscordMessageInputField {
  name: string;
  value: string;
  inline?: boolean;
}

export interface DiscordPollMessage {
  input: MessageEmbed;
  emojis: string[];
  activitiesContractAddress: string;
  activitiesId: number;
}

export interface DiscordPollInput {
  message: DiscordMessage;
  emojis: string[];
  activitiesContractAddress: string;
  activitiesId: number;
}

export interface DiscordMessage {
  title: string;
  url?: string;
  description: string;
  color?: string;
  fields?: DiscordMessageInputField[];
  image?: string;
}

export enum DiscordMessageType {
  Notification,
  Poll
}
export class MessageEmbed {
  author: {
    name: string;
    image: string;
  };

  message: DiscordMessage;

  footer: {
    text: string;
    image: string;
  };

  constructor(data: MessageEmbed) {
    this.author = data.author;
    this.footer = data.footer;
    this.message = data.message;
  }
}

export const postDiscordNotification = (
  webhookUrl: string,
  input: MessageEmbed
) => {
  const { footer, author, message } = input;
  return axios
    .post(webhookUrl, {
      embeds: [
        {
          ...message,
          author: {
            name: author.name,
            icon_url: author.image
          },
          footer: {
            text: footer.text,
            icon_url: footer.image
          }
        }
      ]
    })
    .then((res) => res.data);
};

export const postDiscordPoll = (
  webhookUrl: string,
  { input, emojis, activitiesContractAddress, activitiesId }: DiscordPollMessage
) => {
  const { footer, author, message } = input;
  return axios
    .post(webhookUrl, {
      message: {
        ...message,
        author: {
          name: author.name,
          icon_url: author.image
        },
        footer: {
          text: footer.text,
          icon_url: footer.image
        }
      },
      emojis,
      activitiesContractAddress,
      activitiesId
    })
    .then((res) => res.data);
};
