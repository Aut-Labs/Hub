import AutSDK, { PluginDefinition, fetchMetadata } from "@aut-labs/sdk";
import { BaseQueryApi, createApi } from "@reduxjs/toolkit/query/react";
import { REHYDRATE } from "redux-persist";
import { environment } from "./environment";
import { PluginDefinitionType } from "@aut-labs/sdk/dist/models/plugin";

const fetch = async (body: any, api: BaseQueryApi) => {
  const sdk = AutSDK.getInstance();
  const state = api.getState() as any;
  const { selectedCommunityAddress } = state.community;

  const response = await sdk.pluginRegistry.getAllPluginDefinitionsByDAO(
    selectedCommunityAddress
  );

  if (response?.isSuccess) {
    const definitionsWithMetadata: PluginDefinition[] = [];
    for (let i = 0; i < response.data.length; i++) {
      const def = response.data[i];

      const pluginData = {
        ...def,
        metadata: await fetchMetadata<typeof def.metadata>(
          def.metadataURI,
          environment.nftStorageUrl
        )
      };

      if (
        pluginData.metadata.properties.module.title === "Onboarding Strategy"
      ) {
        pluginData.metadata.properties.module.type = "OnboardingStrategy";
        pluginData.metadata.properties.type = "OnboardingStrategy";
      }

      if (pluginData.metadata.properties.module.title === "Task Type") {
        pluginData.metadata.properties.module.type = "Task";
        pluginData.metadata.properties.type = "Task";
      }

      definitionsWithMetadata.push(pluginData);
    }
    return {
      data: definitionsWithMetadata
    };
  }
  return {
    error: response.errorMessage
  };
};

const add = async (body: PluginDefinition, api: BaseQueryApi) => {
  const sdk = AutSDK.getInstance();
  const state = api.getState() as any;
  const { selectedCommunityAddress } = state.community;

  // temporary
  const { data } =
    state.pluginRegistryApi.queries["getAllPluginDefinitionsByDAO(null)"];
  const questPlugin: PluginDefinition = data.find(
    (d: PluginDefinition) =>
      //TODO: fix this
      // d.pluginDefinitionId === PluginDefinitionType.QuestOnboardingPlugin
      true
  );

  const { pluginDefinitionId } = body;

  const response = await sdk.pluginRegistry.addPluginToDAO(
    pluginDefinitionId,
    selectedCommunityAddress,
    questPlugin.pluginAddress,
    ""
  );

  if (!response.isSuccess) {
    return {
      error: response.errorMessage
    };
  }
  return {
    data: {
      ...body,
      ...response.data
    }
  };
};

const KEEP_DATA_UNUSED = 5 * 60;

export const pluginRegistryApi = createApi({
  reducerPath: "pluginRegistryApi",
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.payload && action.type === REHYDRATE) {
      return action.payload[reducerPath];
    }
  },
  keepUnusedDataFor: KEEP_DATA_UNUSED,
  baseQuery: async (args, api) => {
    const { url, body } = args;
    if (url === "getAllPluginDefinitionsByDAO") {
      return fetch(body, api);
    }

    if (url === "addPluginToDAO") {
      return add(body, api);
    }
    return {
      data: "Test"
    };
  },
  tagTypes: ["Plugins"],
  endpoints: (builder) => ({
    getAllPluginDefinitionsByDAO: builder.query<PluginDefinition[], void>({
      query: (body) => {
        return {
          body,
          url: "getAllPluginDefinitionsByDAO"
        };
      },
      providesTags: ["Plugins"]
    }),
    addPluginToDAO: builder.mutation<
      PluginDefinition,
      Partial<PluginDefinition>
    >({
      query: (body) => {
        return {
          body,
          url: "addPluginToDAO"
        };
      },
      async onQueryStarted({ ...args }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            pluginRegistryApi.util.updateQueryData(
              "getAllPluginDefinitionsByDAO",
              null,
              (draft) => {
                return draft.map((d) => {
                  if (d.pluginDefinitionId === data.pluginDefinitionId) {
                    return {
                      ...d,
                      ...data
                    };
                  }
                  return d;
                });
              }
            )
          );
        } catch (err) {
          console.error(err);
        }
      }
      // invalidatesTags: ["Plugins"]
    })
  })
});

export const {
  useAddPluginToDAOMutation,
  useLazyGetAllPluginDefinitionsByDAOQuery,
  useGetAllPluginDefinitionsByDAOQuery
} = pluginRegistryApi;
