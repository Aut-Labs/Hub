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
  landingPageUrl: "REACT_APP_LANDING_PAGE_URL",
  launchpadUrl: "REACT_APP_LAUNCHPAD_URL",

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
      tryAut: "https://try-internal.aut.id/",
      novaDashboard: "https://nova-internal.aut.id/",
      myAut: "https://my-internal.aut.id/",
      showcase: "https://showcase-internal.aut.id/",
      leaderboard: "https://leaderboard-internal.aut.id/",
      expander: "https://expander-internal.aut.id/"
    };
  }

  return {
    tryAut: "https://try.aut.id/",
    novaDashboard: "https://nova.aut.id/",
    myAut: "https://my.aut.id/",
    showcase: "https://showcase.aut.id/",
    leaderboard: "https://leaderboard.aut.id/",
    expander: "https://expander.aut.id/"
  };
};
