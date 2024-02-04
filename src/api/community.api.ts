/* eslint-disable max-len */
import axios from "axios";
import { CommitmentMessages } from "@utils/misc";
import { Community, NovaDAO, findRoleName } from "./community.model";
import { Web3ThunkProviderFactory } from "./ProviderFactory/web3-thunk.provider";
import { ipfsCIDToHttpUrl, isValidUrl } from "./storage.api";
import { AutID, DAOMember } from "./aut.model";
import AutSDK, { LocalReputation, Nova, fetchMetadata } from "@aut-labs/sdk";
import { BaseQueryApi, createApi } from "@reduxjs/toolkit/query/react";
import { base64toFile } from "@utils/to-base-64";
import { environment } from "./environment";
import { createAsyncThunk } from "@reduxjs/toolkit";
import Size from "@assets/archetypes/people.png";
import Growth from "@assets/archetypes/seed.png";
import Performance from "@assets/archetypes/growth.png";
import Reputation from "@assets/archetypes/reputation-management.png";
import Conviction from "@assets/archetypes/deal.png";
import { gql } from "@apollo/client";
import { apolloClient } from "@store/graphql";
import { BaseNFTModel } from "@aut-labs/sdk/dist/models/baseNFTModel";

export enum NovaArchetype {
  "Size" = 1,
  "Reputation" = 2,
  "Conviction" = 3,
  "Performance" = 4,
  "Growth" = 5
}

export const ArchetypeIcons = {
  [NovaArchetype.Size]: Size,
  [NovaArchetype.Growth]: Growth,
  [NovaArchetype.Performance]: Performance,
  [NovaArchetype.Reputation]: Reputation,
  [NovaArchetype.Conviction]: Conviction
};

export enum Markets {
  "Open-Source & DeFi" = 1,
  "Art, Events & NFTs" = 2,
  "Local Projects & DAOs" = 3
}

const getAllNovas = async (body: any, api: BaseQueryApi) => {
  try {
    const sdk = AutSDK.getInstance();
    const fetchNovas = gql`
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

    const novaeResponse = await apolloClient.query<any>({
      query: fetchNovas
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
          prestige: Math.floor(Math.random() * 100) + 1,
          members: Math.floor(Math.random() * 100) + 1,
          address: novaDAO.address,
          marketId: novaDAO.market
        }
      } as unknown as Community);
      enrichedNovae.push(enrichedNova);
    }

    return {
      data: { daos: enrichedNovae }
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

const getNovaTasks = async (body: any, api: BaseQueryApi) => {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const tasks = [
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

  return {
    data: { tasks }
  };
};

const checkOnboardingAllowlist = async (body: any, api: BaseQueryApi) => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return {
    data: { isAllowed: true }
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
      void
    >({
      query: (body) => {
        return {
          body,
          url: "getAllNovas"
        };
      }
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
