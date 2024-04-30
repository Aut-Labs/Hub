/* eslint-disable max-len */
import { Community } from "./community.model";
import { DAOMember } from "./aut.model";
import AutSDK, { Allowlist, fetchMetadata } from "@aut-labs/sdk";
import { BaseQueryApi, createApi } from "@reduxjs/toolkit/query/react";
import { environment } from "./environment";
import { gql } from "@apollo/client";
import { apolloClient } from "@store/graphql";
import { RootState } from "@store/store.model";
import { NetworkConfig } from "./ProviderFactory/network.config";

// export enum NovaArchetype {
//   "Size" = 1,
//   "Reputation" = 2,
//   "Conviction" = 3,
//   "Performance" = 4,
//   "Growth" = 5
// }

export enum Markets {
  "Open-Source & Infra" = 1,
  "Art, Events & NFTs" = 2,
  "Social, Gaming & DeFi" = 3,
  "ReFi & Public Goods" = 4
}

// export const MarketIcons = {
//   1: OpenSource,
//   2: ArtEvents,
//   3: Social,
//   4: Refi
// };

interface Filters {
  marketFilter?: string;
  archetypeFilter?: string;
  connectedAddress?: string;
  novaName?: string;
}
const getAllNovas = async (body: any, api: BaseQueryApi) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  try {
    const sdk = AutSDK.getInstance();
    let fetchNovas;

    if (body?.marketFilter && body?.archetypeFilter) {
      fetchNovas = gql`
        query GetNovas {
          novaDAOs(skip: 0, first: 100, where: { market: ${body.marketFilter}, archetype: ${body.archetypeFilter} }) {
            id
            deployer
            address
            market
            metadataUri
            minCommitment
          }
        }
      `;
    } else if (body?.marketFilter) {
      fetchNovas = gql`
        query GetNovas {
          novaDAOs(skip: 0, first: 100, where: { market: ${body.marketFilter} }) {
            id
            deployer
            address
            market
            metadataUri
            minCommitment
          }
        }
      `;
    } else if (body?.archetypeFilter) {
      fetchNovas = gql`
        query GetNovas {
          novaDAOs(skip: 0, first: 100, where: { archetype: ${body.archetypeFilter} }) {
            id
            deployer
            address
            market
            metadataUri
            minCommitment
          }
        }
      `;
    } else {
      fetchNovas = gql`
        query GetNovas {
          novaDAOs(skip: 0, first: 100) {
            id
            deployer
            address
            market
            metadataUri
            minCommitment
          }
        }
      `;
    }

    const fetchAutIds = gql`
      query GetAutIds {
        autIDs(skip: 0, first: 100) {
          novaAddress
        }
      }
    `;

    const novaeResponse = await apolloClient.query<any>({ query: fetchNovas });
    const autIdsResponse = await apolloClient.query<any>({
      query: fetchAutIds,
      variables: {}
    });

    const { novaDAOs } = novaeResponse.data;

    const enrichedNovae = [];

    for (let i = 0; i < novaDAOs.length; i++) {
      const novaDAO = novaDAOs[i];
      const novaMetadata = await fetchMetadata<any>(
        novaDAO.metadataUri,
        environment.ipfsGatewayUrl
      );
      //TODO: Fix archetypes and find AV
      // const nova: Nova = sdk.initService<Nova>(Nova, novaDAO.address);
      // const localReputation: LocalReputation = sdk.localReputation;

      // const archetypeResponse = await nova.contract.getArchetype();
      // const stats = await localReputation.contract.getNovaLocalReputationStats(
      //   novaDAO.address
      // );
      // debugger;
      const enrichedNova = new Community({
        ...novaDAO,
        ...novaMetadata,
        properties: {
          ...novaMetadata.properties,
          archetype: Math.floor(Math.random() * 5) + 1,
          roles: novaMetadata.properties.rolesSets[0].roles,
          absoluteValue: Math.floor(Math.random() * 100) + 1,
          prestige: 100,
          members: autIdsResponse.data.autIDs.filter(
            (a) => a.novaAddress === novaDAO.address
          ).length,
          address: novaDAO.address,
          marketId: novaDAO.market,
          deployer: novaDAO.deployer
        }
      } as unknown as Community);
      enrichedNovae.push(enrichedNova);
    }

    enrichedNovae.sort((a, b) => {
      if (a.name === body?.novaName) {
        return -1;
      } else if (b.name === body?.novaName) {
        return 1;
      } else {
        return 0;
      }
    });
    enrichedNovae.sort((a, b) => {
      if (a.properties.deployer === body?.connectedAddress) {
        return -1;
      } else if (b.properties.deployer === body?.connectedAddress) {
        return 1;
      } else {
        return 0;
      }
    });

    const filteredNovae = enrichedNovae.filter((nova) => {
      return (
        nova.properties.members >= 1 ||
        nova.properties.deployer === body?.connectedAddress
      );
    });
    return {
      data: { daos: filteredNovae }
    };
  } catch (e) {
    return {
      error: e
    };
  }

  // await new Promise((resolve) => setTimeout(resolve, 2000));
  // const mockDaos = [
  //   {
  //     address: "0x09Ed23BB6F9Ccc3Fd9b3BC4C859D049bf4AB4D43",
  //     name: "DAO1",
  //     onboardingQuestAddress: "0x456",
  //     properties: {
  //       market: 1,
  //       archetype: 1,
  //       absoluteValue: "18",
  //       prestige: 66,
  //       members: 14,
  //       description:
  //         "Sphinx of black quartz, judge my vow. Sphinx of black quartz, judge my vow. Sphinx of black quartz, judge my vow. Sphinx of black quartz, judge my vow. ",
  //       image:
  //         "ipfs://bafkreihrhccb2qvrnb2zcgyjnl4z6asv7qtgzshzuj6hk7tpm4lywxb7fi",
  //       roles: [
  //         { name: "Role1", id: "1" },
  //         { name: "Role2", id: "2" },
  //         { name: "Role3", id: "3" }
  //       ],
  //       socials: [
  //         { type: "discord", link: "", metadata: {} },
  //         { type: "ens", link: "", metadata: {} },
  //         { type: "twitter", link: "", metadata: {} },
  //         { type: "github", link: "", metadata: {} }
  //       ]
  //     }
  //   },
  //   {
  //     address: "0x09Ed23BB6F9Ccc3Fd9b3BC4C859D049bf4AB4D43",
  //     name: "DAO2",
  //     onboardingQuestAddress: "0xabc",
  //     properties: {
  //       market: 2,
  //       archetype: 2,
  //       absoluteValue: "44",
  //       prestige: 76,
  //       members: 45,
  //       description:
  //         "Sphinx of black quartz, judge my vow. Sphinx of black quartz, judge my vow. Sphinx of black quartz, judge my vow. Sphinx of black quartz, judge my vow. ",
  //       image:
  //         "https://ipfs.nftstorage.link/ipfs/bafkreiddqyd46fvb5ffpbi3lgv7lea2s3mtpyjoh2ti4mj7r56nu4zydwe",
  //       roles: [
  //         { name: "Role3", id: "3" },
  //         { name: "Role4", id: "4" },
  //         { name: "Role3", id: "3" }
  //       ],
  //       socials: [
  //         { type: "discord", link: "", metadata: {} },
  //         { type: "ens", link: "", metadata: {} },
  //         { type: "twitter", link: "", metadata: {} },
  //         { type: "github", link: "", metadata: {} }
  //       ]
  //     }
  //   }
  //   // Add more DAOs as needed
  // ];
};

const getNovaTasks = async (address: any, api: BaseQueryApi) => {
  // await new Promise((resolve) => setTimeout(resolve, 2000));
  let tasks = null;
  if (address === "0xdaffe6640b4c5d8086a31536b2c694bdd3e675d7") {
    tasks = [
      {
        name: "Opt Out Writing",
        description:
          "Participate and get published in our Opt Out writing program in partnership with Hackernoon",
        startDate: new Date("2022-01-01"),
        endDate: new Date("2022-01-05"),
        role: "Creative"
      },
      {
        name: "Bounty Program",
        description:
          "Complete a bounty from our Dework page, and get it approved.",
        startDate: new Date("2022-02-01"),
        endDate: new Date("2022-02-10"),
        role: "Tech"
      },
      {
        name: "Connectors Program",
        description:
          "Join our Connectors program, let’s have an interesting conversation - and you’re in!",
        startDate: new Date("2022-03-01"),
        endDate: new Date("2022-03-10"),
        role: "Community"
      }
    ];
  }
  return {
    data: { tasks }
  };
};

const checkOnboardingAllowlist = async (address: string, api: BaseQueryApi) => {
  const sdk = AutSDK.getInstance();
  const state: RootState = api.getState() as RootState;
  const network: NetworkConfig = state.walletProvider.selectedNetwork;
  const allowlistContract = sdk.initService<Allowlist>(
    Allowlist,
    network.contracts.allowListAddress
  );
  const isAllowed =
    await allowlistContract.contract.functions.isAllowListed(address);
  return {
    data: { isAllowed }
  };
};

interface DaoModel {
  daoAddress: string;
  onboardingQuestAddress: string;
  properties: any;
}

const KEEP_DATA_UNUSED = 10 * 60;

export const communityApi = createApi({
  reducerPath: "communityApi",
  keepUnusedDataFor: KEEP_DATA_UNUSED,
  baseQuery: async (args, api, extraOptions) => {
    const { url, body } = args;

    if (url === "getAllNovas") {
      return getAllNovas(body, api);
    }

    if (url === "getNovaTasks") {
      return getNovaTasks(body, api);
    }
    if (url === "checkOnboardingAllowlist") {
      return checkOnboardingAllowlist(body, api);
    }
    return {
      data: "Test"
    };
  },
  tagTypes: ["AllNovas"],
  endpoints: (builder) => ({
    getAllMembers: builder.query<DAOMember[], void>({
      query: (body) => {
        return {
          body,
          url: "getAllMembers"
        };
      }
    }),
    getCommunity: builder.query<
      {
        community: Community;
        admin: string;
      },
      string
    >({
      query: (body) => {
        return {
          body,
          url: "getCommunity"
        };
      }
    }),
    getAllNovas: builder.query<
      // {
      //   daos: NovaDAO[];
      // },
      {
        daos: any[];
      },
      Filters
    >({
      query: (body) => {
        return {
          body,
          url: "getAllNovas"
        };
      },
      providesTags: ["AllNovas"]
    }),
    checkOnboardingAllowlist: builder.query<
      {
        isAllowed: boolean;
      },
      string
    >({
      query: (body) => {
        return {
          body,
          url: "checkOnboardingAllowlist"
        };
      }
    }),
    getNovaTasks: builder.query<
      {
        tasks: any[];
      },
      string
    >({
      query: (body) => {
        return {
          body,
          url: "getNovaTasks"
        };
      }
    })
  })
});

export const {
  useGetAllMembersQuery,
  useGetCommunityQuery,
  useGetAllNovasQuery,
  useGetNovaTasksQuery,
  useLazyCheckOnboardingAllowlistQuery
} = communityApi;
