import { envionmentGenerator } from "@utils/env";

export enum EnvMode {
  Production = "production",
  Development = "development"
}

export const swEnvVariables = {
  // app config
  env: "VITE_NODE_ENV",
  graphApiUrl: "VITE_GRAPH_API_URL",
  apiUrl: "VITE_API_URL",
  networkEnv: "VITE_NETWORK_ENV",
  defaultChainId: "VITE_DEFAULT_CHAIN_ID",

  // discord
  discordClientId: "VITE_DISCORD_CLIENT_ID",
  discordClientSecret: "VITE_DISCORD_CLIENT_SECRET",
  discordGrandType: "VITE_DISCORD_GRAND_TYPE",
  discordRedirectUri: "VITE_DISCORD_REDIRECT_URL",
  discordApiUrl: "VITE_DISCORD_API_URL",
  discordBotAddress: "VITE_DISCORD_BOT_ADDRESS",
  discordBotUrl: "VITE_DISCORD_BOT_API_URL",

  // IPFS storage
  ipfsApiKey: "VITE_IPFS_API_KEY",
  ipfsApiSecret: "VITE_IPFS_API_SECRET",
  ipfsGatewayUrl: "VITE_IPFS_GATEWAY_URL"
};

export const environment: typeof swEnvVariables =
  envionmentGenerator(swEnvVariables);

export const autUrls = () => {
  if (environment.env === EnvMode.Development) {
    return {
      myAut: "https://internal.os.aut.id/",
      hub: "https://internal.hub.sbs/",
      launchpad: "https://internal.launch.hub.sbs/",
      landingPage: "https://aut.gg/"
    };
  }

  return {
    myAut: "https://os.aut.id/",
    hub: "https://hub.sbs/",
    launchpad: "https://launch.hub.sbs/",
    landingPage: "https://aut.gg/"
  };
};
