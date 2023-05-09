import { envionmentGenerator } from "@utils/env";

export enum EnvMode {
  Production = "production",
  Development = "development"
}

export const swEnvVariables = {
  // app config
  rpcUrls: "REACT_APP_MATIC_RPC_URLS",
  env: "REACT_APP_NODE_ENV",
  hideDashboard: "REACT_APP_HIDE_DASHBOARD",

  // Aut
  apiUrl: "REACT_APP_API_URL",
  registryAdress: "REACT_APP_COMMUNITY_REGISTRY_ADDRESS",
  autIDAddress: "REACT_APP_AUT_ID_ADDRESS",
  // Networks
  networkEnv: "REACT_APP_NETWORK_ENV",

  // NFT storage
  nftStorageKey: "REACT_APP_NFT_STORAGE_KEY",
  nftStorageUrl: "REACT_APP_IPFS_URL",

  // discord
  discordClientId: "REACT_APP_DISCORD_CLIENT_ID",
  discordClientSecret: "REACT_APP_DISCORD_CLIENT_SECRET",
  discordGrandType: "REACT_APP_DISCORD_GRAND_TYPE",
  discordRedirectUri: "REACT_APP_DISCORD_REDIRECT_URL",
  discordApiUrl: "REACT_APP_DISCORD_API_URL",
  discordBotAddress: "REACT_APP_DISCORD_BOT_ADDRESS",
  discordBotUrl: "REACT_APP_DISCORD_BOT_API_URL"
};

export const environment: typeof swEnvVariables =
  envionmentGenerator(swEnvVariables);
