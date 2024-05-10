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
import { NovaArchetype } from "@aut-labs/sdk/dist/models/nova";
import { ReactComponent as Size } from "@assets/icons/size.svg";
import { ReactComponent as Growth } from "@assets/icons/growth.svg";
import { ReactComponent as Performance } from "@assets/icons/performance.svg";
import { ReactComponent as Reputation } from "@assets/icons/reputation.svg";
import { ReactComponent as Conviction } from "@assets/icons/conviction.svg";

export const ArchetypeTypes = {
  [NovaArchetype.SIZE]: {
    type: NovaArchetype.SIZE,
    title: "Size",
    description:
      "A relative value that represents how “big” a Nova compared to others in the ecosystem. This Archetype encourages the largest projects to verify & maintain a positive influence in the overall ecosystem.",
    logo: Size
  },
  [NovaArchetype.REPUTATION]: {
    type: NovaArchetype.REPUTATION,
    title: "Reputation",
    description:
      "The average Participation Score of a Nova’s Contributors. This Archetype gives more insights about the shared trust between members, and their constant effort towards a common goal.",
    logo: Reputation
  },
  [NovaArchetype.CONVICTION]: {
    type: NovaArchetype.CONVICTION,
    title: "Conviction",
    description:
      "The avg. Commitment of the contributors of your Nova. This archetype is for the true believers – reflecting Members’ level of trust and belief in your project’s vision.",
    logo: Conviction
  },
  [NovaArchetype.PERFORMANCE]: {
    type: NovaArchetype.PERFORMANCE,
    title: "Performance",
    description:
      "The ratio between tasks created and tasks completed during a given period. This Archetype is for ambitious, coordinated communities set to create real impact and thrive.",
    logo: Performance
  },
  [NovaArchetype.GROWTH]: {
    type: NovaArchetype.GROWTH,
    title: "Growth",
    description:
      "Everything starts with something. This Archetype is not for the largest Novae, it’s for the ones with a continuous, organic, slow and steady growth determined by their scale.",
    logo: Growth
  }
};

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
  connectedAddress?: string;
}
const getAllNovas = async (body: any, api: BaseQueryApi) => {
  try {
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
      let isAdmin = false;

      if (body?.connectedAddress) {
        const sdk = await AutSDK.getInstance();
        const nova: Nova = sdk.initService<Nova>(Nova, novaDAO.address);
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
    // enrichedNovae.sort((a, b) => {
    //   if (a.name === body?.novaName) {
    //     return -1;
    //   } else if (b.name === body?.novaName) {
    //     return 1;
    //   } else {
    //     return 0;
    //   }
    // });
    // enrichedNovae.sort((a, b) => {
    //   if (a.properties.deployer === body?.connectedAddress) {
    //     return -1;
    //   } else if (b.properties.deployer === body?.connectedAddress) {
    //     return 1;
    //   } else {
    //     return 0;
    //   }
    // });

    // let filteredNovae = enrichedNovae.filter((nova) => {
    //   return (
    //     nova.properties.members >= 1 ||
    //     nova.properties.deployer?.toLowerCase() ===
    //       body?.connectedAddress?.toLowerCase()
    //   );
    // });
    // if (body.archetypeFilter) {
    //   filteredNovae = filteredNovae.filter(
    //     (nova) =>
    //       nova?.properties?.archetype?.default === Number(body?.archetypeFilter)
    //   );
    // }

    // old sorting
    // enrichedNovae.sort((a, b) => {
    //   if (a.name === body?.novaName) {
    //     return -1;
    //   } else if (b.name === body?.novaName) {
    //     return 1;
    //   } else {
    //     return 0;
    //   }
    // });
    // // connected address novae first
    // enrichedNovae.sort((a, b) => {
    //   if (a.properties.deployer === body?.connectedAddress) {
    //     return -1;
    //   } else if (b.properties.deployer === body?.connectedAddress) {
    //     return 1;
    //   } else {
    //     return 0;
    //   }
    // });

    // let filteredNovae = enrichedNovae.filter((nova) => {
    //   return (
    //     nova.properties.members >= 1 ||
    //     nova.properties.deployer?.toLowerCase() ===
    //       body?.connectedAddress?.toLowerCase()
    //   );
    // });
    // if (body.archetypeFilter) {
    //   filteredNovae = filteredNovae.filter(
    //     (nova) =>
    //       nova?.properties?.archetype?.default === Number(body?.archetypeFilter)
    //   );
    // }
    // // 0 members first
    // filteredNovae.sort((a, b) => {
    //   if (a.properties.members === 0 && b.properties.members !== 0) {
    //     return -1;
    //   } else if (a.properties.members !== 0 && b.properties.members === 0) {
    //     return 1;
    //   } else {
    //     return 0;
    //   }
    // });
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
  const sdk = await AutSDK.getInstance();
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

interface CheckMintedParams {
  address: string;
  novaAddress: string;
}

const checkHasMintedForNova = async (
  body: CheckMintedParams,
  api: BaseQueryApi
) => {
  const sdk = AutSDK.getInstance();
  const state: RootState = api.getState() as RootState;
  const network: NetworkConfig = state.walletProvider.selectedNetwork;

  const query = gql`
  query GetAutID {
    autID(id: "${body?.address?.toLowerCase()}" novaAddress: "${body?.novaAddress?.toLowerCase()}") {
      id
      username
      tokenID
      novaAddress
      role
      commitment
      metadataUri
    }
  }
`;
  const response = await apolloClient.query<any>({
    query
  });

  const autID = response?.data?.autID;

  return {
    data: {
      hasMinted: !!autID,
      hasMintedForNova:
        autID?.novaAddress?.toLowerCase() === body?.novaAddress?.toLowerCase(),

      role: autID?.role
    }
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
    const sdk = await AutSDK.getInstance();
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
    const result = await nova.contract.metadata.setMetadataUri(uri);

    if (!result?.isSuccess) {
      return {
        error: result?.errorMessage
      };
    }
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
    const sdk = await AutSDK.getInstance();
    const updatedCommunity = Community.updateCommunity(body);
    const uri = await sdk.client.sendJSONToIPFS(updatedCommunity as any);
    const nova: Nova = sdk.initService<Nova>(Nova, body.properties.address);
    const result = await nova.contract.metadata.setMetadataUri(uri);

    if (!result?.isSuccess) {
      return {
        error: result?.errorMessage
      };
    }
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
    if (url === "checkHasMinted") {
      return checkHasMintedForNova(body, api);
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
  tagTypes: ["AllNovas", "hasMinted"],
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
    checkHasMintedForNova: builder.query<
      {
        hasMinted: boolean;
        role: string;
        hasMintedForNova: boolean;
      },
      CheckMintedParams
    >({
      query: (body) => {
        return {
          body,
          url: "checkHasMinted"
        };
      },
      providesTags: ["hasMinted"]
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
  useLazyCheckHasMintedForNovaQuery,
  useCheckHasMintedForNovaQuery,
  useGetAllMembersQuery,
  useGetCommunityQuery,
  useSetArchetypeMutation,
  useUpdateNovaMutation,
  useGetAllNovasQuery,
  useGetNovaTasksQuery,
  useLazyCheckOnboardingAllowlistQuery
} = communityApi;
