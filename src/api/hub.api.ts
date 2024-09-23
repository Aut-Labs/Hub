 
import { HubOSHub } from "./hub.model";
import { HubOSAutID } from "./aut.model";
import AutSDK, {
  AutIDNFT,
  fetchMetadata,
  Hub,
  HubArchetype,
  HubArchetypeParameters,
  HubNFT
} from "@aut-labs/sdk";
import { BaseQueryApi, createApi } from "@reduxjs/toolkit/query/react";
import { environment } from "./environment";
import { gql } from "@apollo/client";
import { apolloClient } from "@store/graphql";
import Size from "@assets/icons/size.svg?react";
import Growth from "@assets/icons/growth.svg?react";
import Performance from "@assets/icons/performance.svg?react";
import Reputation from "@assets/icons/reputation.svg?react";
import Conviction from "@assets/icons/conviction.svg?react";
import { ContractTransactionReceipt } from "ethers";
import { AutIdJoinedHubState } from "@aut-labs/d-aut";

export const fetchHubsAndAutIDs = async (
  connectedAddress: string
): Promise<{
  hubs: HubOSHub[];
  autIDs: HubOSAutID[];
}> => {
  const query = gql`
    query GetHubsAndAutIDs {
      hubs(skip: 0, first: 10000) {
        address
        domain
        deployer
        minCommitment
        metadataUri
      }
      autIDs(skip: 0, first: 10000) {
        id
        metadataUri
        joinedHubs {
          id
          hubAddress
          commitment
          role
        }
      }
    }
  `;
  const response = await apolloClient.query<any>({
    query
  });

  const fetchHubsMetadata = () => {
    return response.data.hubs.map(
      async ({ address, domain, metadataUri, deployer, minCommitment }) => {
        let metadata = {} as HubNFT;
        try {
          metadata = await fetchMetadata<HubNFT>(
            metadataUri,
            environment.ipfsGatewayUrl
          );
        } catch (error) {
          console.error(error);
        }
        metadata = metadata ?? ({} as HubNFT);
        return new HubOSHub({
          ...metadata,
          properties: {
            ...metadata.properties,
            minCommitment,
            metadataUri,
            deployer,
            members: [],
            address,
            domain
          }
        } as HubOSHub);
      }
    );
  };

  const fetchAutIDsMetadata = () => {
    return response.data.autIDs.map(async ({ id, metadataUri, joinedHubs }) => {
      let metadata = {} as AutIDNFT;
      try {
        metadata = await fetchMetadata<AutIDNFT>(
          metadataUri,
          environment.ipfsGatewayUrl
        );
      } catch (error) {
        console.error(error);
      }
      metadata = metadata ?? ({} as AutIDNFT);
      return new HubOSAutID({
        ...metadata,
        properties: {
          ...metadata.properties,
          address: id,
          hubs: [],
          joinedHubs: joinedHubs.map(
            (hub: AutIdJoinedHubState & { id: string }) => ({
              id: hub.id,
              role: hub.role,
              commitment: hub.commitment,
              hubAddress: hub.hubAddress.toLowerCase(),
              isAdmin: false
            })
          ),
          network: null
        }
      });
    });
  };

  const hubsAndAutIds = await Promise.all([
    ...fetchHubsMetadata(),
    ...fetchAutIDsMetadata()
  ]);

  const {
    hubs,
    autIDs
  }: {
    hubs: HubOSHub[];
    autIDs: HubOSAutID[];
  } = hubsAndAutIds.reduce(
    (acc, curr) => {
      if (curr instanceof HubOSHub) {
        acc.hubs.push(curr);
      } else if (curr instanceof HubOSAutID) {
        acc.autIDs.push(curr);
      } else {
        console.log(curr);
        throw new Error("Invalid type");
      }
      return acc;
    },
    { hubs: [], autIDs: [] }
  );

  autIDs.forEach(async (autID: HubOSAutID) => {
    for (const joinedHub of autID.properties.joinedHubs) {
      const hub = hubs.find(
        (h: HubOSHub) =>
          h.properties.address.toLowerCase() ===
          joinedHub.hubAddress.toLowerCase()
      );
      if (hub) {
        hub.properties.members.push(autID);
        autID.properties.hubs.push(hub);
        if (
          hub.properties.deployer.toLowerCase() ===
          autID.properties.address.toLowerCase()
        ) {
          joinedHub.isAdmin = true;
        } else if (connectedAddress) {
          // it means a wallet is conneccted and we can query the blockchain
          const sdk = await AutSDK.getInstance(true);
          const isAdmin = await sdk
            .initService<Hub>(Hub, hub.properties.address)
            .contract.functions.isAdmin(autID.properties.address);
          joinedHub.isAdmin = isAdmin;
        }
      }
    }
  });

  return { hubs, autIDs };
};

export const ArchetypeTypes = {
  [HubArchetype.SIZE]: {
    type: HubArchetype.SIZE,
    title: "Size",
    description:
      "A relative value that represents how “big” a Hub compared to others in the ecosystem. This Archetype encourages the largest projects to verify & maintain a positive influence in the overall ecosystem.",
    logo: Size
  },
  [HubArchetype.REPUTATION]: {
    type: HubArchetype.REPUTATION,
    title: "Reputation",
    description:
      "The average Participation Score of a Hub’s Contributors. This Archetype gives more insights about the shared trust between members, and their constant effort towards a common goal.",
    logo: Reputation
  },
  [HubArchetype.CONVICTION]: {
    type: HubArchetype.CONVICTION,
    title: "Conviction",
    description:
      "The avg. Commitment of the contributors of your Hub. This archetype is for the true believers – reflecting Members’ level of trust and belief in your project’s vision.",
    logo: Conviction
  },
  [HubArchetype.PERFORMANCE]: {
    type: HubArchetype.PERFORMANCE,
    title: "Performance",
    description:
      "The ratio between tasks created and tasks completed during a given period. This Archetype is for ambitious, coordinated communities set to create real impact and thrive.",
    logo: Performance
  },
  [HubArchetype.GROWTH]: {
    type: HubArchetype.GROWTH,
    title: "Growth",
    description:
      "Everything starts with something. This Archetype is not for the largest Hub, it’s for the ones with a continuous, organic, slow and steady growth determined by their scale.",
    logo: Growth
  }
};

export enum Markets {
  "Open-Source & Infra" = 1,
  "Art, Events & NFTs" = 2,
  "Social, Gaming & DeFi" = 3,
  "ReFi & Public Goods" = 4
}

interface Filters {
  connectedAddress?: string;
}

export const registerDomain = async (body: any, api: BaseQueryApi) => {
  try {
    const sdk = await AutSDK.getInstance();
    const { domain, hubAddress, metadataUri } = body;

    const result = await sdk.hub.contract.functions.registerDomain(
      domain,
      hubAddress,
      metadataUri
    );

    const receipt: ContractTransactionReceipt = await result.wait();
    if (receipt.status === 1) {
      return {
        data: {
          success: true,
          transactionHash: receipt.hash,
          blockNumber: receipt.blockNumber,
          gasUsed: receipt.gasUsed.toString()
        }
      };
    } else {
      return {
        error: {
          success: false,
          message: "Transaction failed",
          transactionHash: receipt.hash
        }
      };
    }
  } catch (error) {
    return {
      error: {
        success: false,
        message:
          error instanceof Error ? error.message : "An unknown error occurred"
      }
    };
  }
};

const getAllHubs = async (
  body: {
    connectedAddress?: string;
  },
  api: BaseQueryApi
) => {
  try {
    return {
      data: await fetchHubsAndAutIDs(body.connectedAddress)
    };
  } catch (e) {
    console.log(e);
    return {
      error: e
    };
  }
};

const getHubTasks = async (address: any, api: BaseQueryApi) => {
  // await new Promise((resolve) => setTimeout(resolve, 2000));
  let tasks = null;
  if (address === "chosen hub address") {
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
  // const sdk = await AutSDK.getInstance();
  // const state: RootState = api.getState() as RootState;
  // const network: NetworkConfig = state.walletProvider.selectedNetwork;
  // const allowlistContract = sdk.initService<Allowlist>(
  //   Allowlist,
  //   network.contracts.allowListAddress
  // );
  // const isAllowed =
  //   await allowlistContract.contract.functions.isAllowListed(address);
  return {
    data: { isAllowed: true }
  };
};

interface CheckMintedParams {
  address: string;
  hubAddress: string;
}

const checkHasMintedForHub = async (
  body: CheckMintedParams,
  api: BaseQueryApi
) => {
  try {
    const query = gql`
    query GetAutIds {
        autIDs(
          where: {
            id: "${body?.address?.toLowerCase()}",
            joinedHubs_: {
              hubAddress: "${body?.hubAddress?.toLowerCase()}"
            }
          }
        ){
          id
          joinedHubs {
            role
          }
        }
    }
`;
    const response = await apolloClient.query<any>({
      query,
      fetchPolicy: "network-only"
    });
    const [autID] = response?.data?.autIDs ?? [];
    return {
      data: {
        hasMinted: !!autID,
        hasMintedForHub: !!autID,
        role: autID?.joinedHubs[0]?.role
      }
    };
  } catch (error) {
    return {
      error: error?.message
    };
  }
};

export const setArchetype = async (
  body: {
    archetype: {
      default: number;
      parameters: HubArchetypeParameters;
    };
    hub: HubOSHub;
  },
  api: BaseQueryApi
) => {
  try {
    const sdk = await AutSDK.getInstance();
    body.hub.properties.archetype = body.archetype;
    const updatedHub = HubOSHub.updateHubNFT(body.hub);
    const uri = await sdk.client.sendJSONToIPFS(updatedHub as any);
    const hubService = sdk.initService<Hub>(Hub, body.hub.properties.address);
    const result = await hubService.contract.metadata.setMetadataUri(uri);

    if (!result?.isSuccess) {
      return {
        error: result?.errorMessage
      };
    }
    return {
      data: body.hub
    };
  } catch (error) {
    return {
      error: error?.message
    };
  }
};

export const updateHub = async (body: HubOSHub, api: BaseQueryApi) => {
  try {
    const sdk = await AutSDK.getInstance();
    const updatedHub = HubOSHub.updateHubNFT(body);
    const uri = await sdk.client.sendJSONToIPFS(updatedHub as any);
    const hubService: Hub = sdk.initService<Hub>(Hub, body.properties.address);
    const result = await hubService.contract.metadata.setMetadataUri(uri);

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

export const hubApi = createApi({
  reducerPath: "hubApi",
  keepUnusedDataFor: KEEP_DATA_UNUSED,
  baseQuery: async (args, api, extraOptions) => {
    const { url, body } = args;

    if (url === "getAllHubs") {
      return getAllHubs(body, api);
    }

    if (url === "getHubTasks") {
      return getHubTasks(body, api);
    }
    if (url === "checkOnboardingAllowlist") {
      return checkOnboardingAllowlist(body, api);
    }
    if (url === "checkHasMinted") {
      return checkHasMintedForHub(body, api);
    }

    if (url === "updateHub") {
      return updateHub(body, api);
    }

    if (url === "setArchetype") {
      return setArchetype(body, api);
    }

    if (url === "registerDomain") {
      return registerDomain(body, api);
    }

    return {
      data: "Test"
    };
  },
  tagTypes: ["AllHubs", "hasMinted"],
  endpoints: (builder) => ({
    registerDomain: builder.mutation<
      void,
      { domain: string; hubAddress: string; metadataUri: string }
    >({
      query: (body) => ({
        body,
        url: "registerDomain"
      }),
      invalidatesTags: ["AllHubs"]
    }),
    getAllHubs: builder.query<
      {
        hubs: HubOSHub[];
        autIDs: HubOSAutID[];
      },
      Filters
    >({
      query: (body) => {
        return {
          body,
          url: "getAllHubs"
        };
      },
      providesTags: ["AllHubs"]
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
    checkHasMintedForHub: builder.query<
      {
        hasMinted: boolean;
        role: string;
        hasMintedForHub: boolean;
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
    getHubTasks: builder.query<
      {
        tasks: any[];
      },
      string
    >({
      query: (body) => {
        return {
          body,
          url: "getHubTasks"
        };
      }
    }),
    updateHub: builder.mutation<HubOSHub, HubOSHub>({
      query: (body) => {
        return {
          body,
          url: "updateHub"
        };
      },
      onQueryStarted: async (arg, { dispatch, queryFulfilled, getState }) => {
        try {
          await queryFulfilled;
          const allQueries = getState().hubApi.queries;
          Object.entries(allQueries).forEach(([queryKey, queryValue]) => {
            if (queryKey.includes("getAllHubs")) {
              dispatch(
                hubApi.util.updateQueryData(
                  "getAllHubs",
                  queryValue.originalArgs,
                  (draft) => {
                    const index = draft.hubs.findIndex(
                      (hub) =>
                        hub.properties.address.toLowerCase() ===
                        arg.properties.address.toLowerCase()
                    );
                    if (index !== -1) {
                      draft.hubs[index] = new HubOSHub({
                        ...draft.hubs[index],
                        ...arg
                      } as HubOSHub);
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
      HubOSHub,
      {
        archetype: {
          default: number;
          parameters: HubArchetypeParameters;
        };
        hub: HubOSHub;
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
          const updatedHub: HubOSHub = result.data;
          const allQueries = getState().hubApi.queries;
          Object.entries(allQueries).forEach(([queryKey, queryValue]) => {
            if (queryKey.includes("getAllHubs")) {
              dispatch(
                hubApi.util.updateQueryData(
                  "getAllHubs",
                  queryValue.originalArgs,
                  (draft) => {
                    const index = draft.hubs.findIndex(
                      (hub) =>
                        hub.properties.address.toLowerCase() ===
                        updatedHub.properties.address.toLowerCase()
                    );
                    if (index !== -1) {
                      draft.hubs[index] = new HubOSHub({
                        ...draft.hubs[index],
                        ...updatedHub
                      } as HubOSHub);
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
  useRegisterDomainMutation,
  useGetHubTasksQuery,
  useLazyCheckHasMintedForHubQuery,
  useCheckHasMintedForHubQuery,
  useSetArchetypeMutation,
  useUpdateHubMutation,
  useGetAllHubsQuery,
  useLazyCheckOnboardingAllowlistQuery
} = hubApi;
