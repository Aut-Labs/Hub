/* eslint-disable max-len */
import { Community } from "./community.model";
import { DAOMember } from "./aut.model";
import AutSDK, { Allowlist, fetchMetadata, Nova } from "@aut-labs/sdk";
import { BaseQueryApi, createApi } from "@reduxjs/toolkit/query/react";
import { environment } from "./environment";
import { gql } from "@apollo/client";
import { apolloClient } from "@store/graphql";
import { RootState } from "@store/store.model";
import { NetworkConfig } from "./ProviderFactory/network.config";
import { NovaArchetypeParameters } from "@aut-labs/sdk/dist/models/nova";

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

    if (body?.marketFilter) {
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
      const nova: Nova = sdk.initService<Nova>(Nova, novaDAO.address);
      let isAdmin = false;

      if (body?.connectedAddress) {
        isAdmin = await nova.contract.functions.isAdmin(
          body?.connectedAddress.toLowerCase()
        );
      }
      const enrichedNova = new Community({
        ...novaDAO,
        ...novaMetadata,
        properties: {
          ...novaMetadata.properties,
          market: +novaDAO.market - 1,
          roles: novaMetadata.properties.rolesSets[0].roles,
          absoluteValue: Math.floor(Math.random() * 100) + 1,
          prestige: 100,
          isAdmin,
          members: autIdsResponse.data.autIDs.filter(
            (a) => a.novaAddress === novaDAO.address
          ).length,
          address: novaDAO.address,
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

    let filteredNovae = enrichedNovae.filter((nova) => {
      return (
        nova.properties.members >= 1 ||
        nova.properties.deployer?.toLowerCase() ===
          body?.connectedAddress?.toLowerCase()
      );
    });
    if (body.archetypeFilter) {
      filteredNovae = filteredNovae.filter(
        (nova) =>
          nova?.properties?.archetype?.default === Number(body?.archetypeFilter)
      );
    }
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
  if (address === "chosen nova address") {
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

export const setArchetype = async (
  body: {
    archetype: {
      default: number;
      parameters: NovaArchetypeParameters;
    };
    nova: Community;
  },
  api: BaseQueryApi
) => {
  try {
    const sdk = AutSDK.getInstance();
    const newNova = {
      ...body.nova,
      properties: {
        ...body.nova.properties,
        archetype: body.archetype
      }
    };
    const updatedCommunity = Community.updateCommunity(newNova);
    const uri = await sdk.client.sendJSONToIPFS(updatedCommunity as any);
    const nova: Nova = sdk.initService<Nova>(
      Nova,
      body.nova.properties.address
    );
    await nova.contract.metadata.setMetadataUri(uri);
    // api.dispatch(communityApi.util.invalidateTags(["AllNovas"]));
    return {
      data: newNova
    };
  } catch (error) {
    return {
      error: error?.message
    };
  }
};

export const updateNova = async (body: Community, api: BaseQueryApi) => {
  try {
    const sdk = AutSDK.getInstance();
    const updatedCommunity = Community.updateCommunity(body);
    const uri = await sdk.client.sendJSONToIPFS(updatedCommunity as any);
    const nova: Nova = sdk.initService<Nova>(Nova, body.properties.address);
    await nova.contract.metadata.setMetadataUri(uri);
    // api.dispatch(communityApi.util.invalidateTags(["AllNovas"]));
    return {
      data: body
    };
  } catch (error) {
    return {
      error: error?.message
    };
  }
};

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

    if (url === "updateNova") {
      return updateNova(body, api);
    }

    if (url === "setArchetype") {
      return setArchetype(body, api);
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
        daos: Community[];
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
    }),
    updateNova: builder.mutation<Community, Community>({
      query: (body) => {
        return {
          body,
          url: "updateNova"
        };
      },
      onQueryStarted: async (arg, { dispatch, queryFulfilled, getState }) => {
        try {
          await queryFulfilled;
          const allQueries = getState().communityApi.queries;
          Object.entries(allQueries).forEach(([queryKey, queryValue]) => {
            if (queryKey.includes("getAllNovas")) {
              dispatch(
                communityApi.util.updateQueryData(
                  "getAllNovas",
                  queryValue.originalArgs,
                  (draft) => {
                    debugger;
                    const index = draft.daos.findIndex(
                      (dao) => dao.id === arg.id
                    );
                    if (index !== -1) {
                      draft.daos[index] = { ...draft.daos[index], ...arg };
                    }
                  }
                )
              );
            }
          });
        } catch (error) {
          // Handle error, possibly undo optimistic updates
        }
      }
    }),
    setArchetype: builder.mutation<
      Community,
      {
        archetype: {
          default: number;
          parameters: NovaArchetypeParameters;
        };
        nova: Community;
      }
    >({
      query: (body) => {
        return {
          body,
          url: "setArchetype"
        };
      },
      onQueryStarted: async (arg, { dispatch, queryFulfilled, getState }) => {
        try {
          const result = await queryFulfilled;
          const updatedNova: Community = result.data;
          const allQueries = getState().communityApi.queries;
          Object.entries(allQueries).forEach(([queryKey, queryValue]) => {
            if (queryKey.includes("getAllNovas")) {
              dispatch(
                communityApi.util.updateQueryData(
                  "getAllNovas",
                  queryValue.originalArgs,
                  (draft) => {
                    const index = draft.daos.findIndex(
                      (dao) => dao.id === updatedNova.id
                    );
                    if (index !== -1) {
                      draft.daos[index] = {
                        ...draft.daos[index],
                        ...updatedNova
                      };
                    }

                    debugger;
                  }
                )
              );
            }
          });
        } catch (error) {
          // Handle error, possibly undo optimistic updates
        }
      }
    })
  })
});

export const {
  useGetAllMembersQuery,
  useGetCommunityQuery,
  useSetArchetypeMutation,
  useUpdateNovaMutation,
  useGetAllNovasQuery,
  useGetNovaTasksQuery,
  useLazyCheckOnboardingAllowlistQuery
} = communityApi;
