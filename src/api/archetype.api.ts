import AutSDK, { LocalReputation, Nova } from "@aut-labs/sdk";
import { BaseQueryApi, createApi } from "@reduxjs/toolkit/query/react";
import {
  NovaArchetypeParameters,
  NovaGroupState
} from "@aut-labs/sdk/dist/models/nova";
import { communityApi } from "./community.api";
import { Community } from "./community.model";

export const getArchetypeAndStats = async (body, api: BaseQueryApi) => {
  const sdk = AutSDK.getInstance();
  // const address = (api.getState() as any)?.community?.selectedCommunityAddress;
  // const nova: Nova = sdk.initService<Nova>(Nova, address);
  // const localReputation: LocalReputation = sdk.localReputation;

  try {
    // const response = await nova.contract.getArchetype();
    // const stats = await localReputation.contract.getNovaLocalReputationStats(
    //   address
    // );
    return {
      data: {
        archetype: {
          default: 1,
          size: 60,
          reputation: 10,
          conviction: 10,
          performance: 10,
          growth: 10
        },
        stats: {
          lastPeriod: 0,
          TCL: 0,
          TCP: 0,
          k: 0,
          penalty: 0,
          c: 0,
          p: "",
          commitHash: "",
          lrUpdatesPerPeriod: 0,
          periodNovaParameters: {
            aDiffMembersLP: 0,
            bMembersLastLP: 0,
            cAverageRepLP: 0,
            dAverageCommitmentLP: 0,
            ePerformanceLP: 0
          }
        }
      }
    };
  } catch (error) {
    return {
      error
    };
  }
};

export const setArchetype = async (
  body: {
    params: {
      default: number;
      parameters: NovaArchetypeParameters;
    };
    nova: Community;
  },
  api: BaseQueryApi
) => {
  try {
    const sdk = AutSDK.getInstance();
    body.nova.properties.archetype = body.params;
    const updatedCommunity = Community.updateCommunity(body.nova);
    const uri = await sdk.client.sendJSONToIPFS(updatedCommunity as any);
    const nova: Nova = sdk.initService<Nova>(
      Nova,
      body.nova.properties.address
    );
    const response = await nova.contract.metadata.setMetadataUri(uri);
    api.dispatch(communityApi.util.invalidateTags(["AllNovas"]));
    return {
      data: body.nova.properties.archetype
    };
  } catch (error) {
    debugger;
    return {
      error: error?.message
    };
  }
};

export const archetypeApi = createApi({
  reducerPath: "archetypeApi",
  baseQuery: async (args, api, extraOptions) => {
    const { url, body } = args;

    if (url === "getArchetypeAndStats") {
      return getArchetypeAndStats(body, api);
    }

    if (url === "setArchetype") {
      return setArchetype(body, api);
    }
    return {
      data: "Test"
    };
  },
  tagTypes: ["Archetype"],
  endpoints: (builder) => ({
    getArchetypeAndStats: builder.query<
      {
        archetype: NovaArchetypeParameters;
        stats: NovaGroupState;
      },
      void
    >({
      providesTags: ["Archetype"],
      query: (body) => {
        return {
          body,
          url: "getArchetypeAndStats"
        };
      }
    }),
    setArchetype: builder.mutation<
      {
        default: number;
        parameters: NovaArchetypeParameters;
      },
      {
        archetype: {
          default: number;
          parameters: NovaArchetypeParameters;
        };
        nova: Community;
      }
    >({
      invalidatesTags: ["Archetype"],
      query: (body) => {
        return {
          body,
          url: "setArchetype"
        };
      }
    })
  })
});

export const { useGetArchetypeAndStatsQuery, useSetArchetypeMutation } =
  archetypeApi;