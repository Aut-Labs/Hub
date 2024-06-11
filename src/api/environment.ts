import { envionmentGenerator } from "@utils/env";

export enum EnvMode {
  Production = "production",
  Development = "development"
}

export const swEnvVariables = {
  // app config
  env: "REACT_APP_NODE_ENV",
  graphApiUrl: "REACT_APP_GRAPH_API_URL",
  apiUrl: "REACT_APP_API_URL",
  networkEnv: "REACT_APP_NETWORK_ENV",
  defaultChainId: "REACT_APP_DEFAULT_CHAIN_ID",

  // discord
  discordClientId: "REACT_APP_DISCORD_CLIENT_ID",
  discordClientSecret: "REACT_APP_DISCORD_CLIENT_SECRET",
  discordGrandType: "REACT_APP_DISCORD_GRAND_TYPE",
  discordRedirectUri: "REACT_APP_DISCORD_REDIRECT_URL",
  discordApiUrl: "REACT_APP_DISCORD_API_URL",
  discordBotAddress: "REACT_APP_DISCORD_BOT_ADDRESS",
  discordBotUrl: "REACT_APP_DISCORD_BOT_API_URL",

  // IPFS storage
  ipfsApiKey: "REACT_APP_IPFS_API_KEY",
  ipfsApiSecret: "REACT_APP_IPFS_API_SECRET",
  ipfsGatewayUrl: "REACT_APP_IPFS_GATEWAY_URL"
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
