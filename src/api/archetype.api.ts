/* eslint-disable max-len */
import AutSDK, { LocalReputation, Nova } from "@aut-labs/sdk";
import { BaseQueryApi, createApi } from "@reduxjs/toolkit/query/react";
import {
  NovaArchetype,
  NovaArchetypeParameters,
  NovaGroupState
} from "@aut-labs/sdk/dist/models/nova";
import { communityApi } from "./community.api";
import { Community } from "./community.model";
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
    archetype: {
      default: number;
      parameters: NovaArchetypeParameters;
    };
    nova: Community;
  },
  api: BaseQueryApi
) => {
  try {
    debugger;
    const sdk = AutSDK.getInstance();
    body.nova.properties.archetype = body.archetype;
    const updatedCommunity = Community.updateCommunity(body.nova);
    const uri = await sdk.client.sendJSONToIPFS(updatedCommunity as any);
    const nova: Nova = sdk.initService<Nova>(
      Nova,
      body.nova.properties.address
    );
    await nova.contract.metadata.setMetadataUri(uri);
    api.dispatch(communityApi.util.invalidateTags(["AllNovas"]));
    return {
      data: body.nova.properties.archetype
    };
  } catch (error) {
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
