import AutSDK, {
  Quest,
  QuestOnboarding,
  Task,
  fetchMetadata
} from "@aut-labs/sdk";
import { BaseQueryApi, createApi } from "@reduxjs/toolkit/query/react";
import { REHYDRATE } from "redux-persist";
import { environment } from "./environment";
import {
  CacheModel,
  CacheTypes,
  deleteCache,
  getCache,
  updateCache
} from "./cache.api";
import { PluginDefinitionType } from "@aut-labs/sdk/dist/models/plugin";
import {
  finaliseJoinDiscordTask,
  finaliseQuizTask,
  finaliseTransactionTask
} from "./tasks.api";
import { toBase64 } from "@utils/to-base-64";

const getAllOnboardingQuests = async (
  pluginAddress: any,
  api: BaseQueryApi
) => {
  const sdk = AutSDK.getInstance();
  const questOnboarding = sdk.initService<QuestOnboarding>(
    QuestOnboarding,
    pluginAddress
  );

  const response = await questOnboarding.getAllQuests();
  if (response?.isSuccess) {
    const questsWithMetadata: Quest[] = [];
    for (let i = 0; i < response.data.length; i++) {
      const def = response.data[i];
      questsWithMetadata.push({
        ...def,
        metadata: await fetchMetadata<typeof def.metadata>(
          def.metadataUri,
          environment.nftStorageUrl
        )
      });
    }
    return {
      data: questsWithMetadata
    };
  }
  return {
    error: response.errorMessage
  };
};

const fetchQuestById = async (
  body: {
    questId: number;
    onboardingQuestAddress: string;
    daoAddress: string;
  },
  api: BaseQueryApi
) => {
  const sdk = AutSDK.getInstance();
  const { questId, onboardingQuestAddress } = body;
  const questOnboarding = sdk.initService<QuestOnboarding>(
    QuestOnboarding,
    onboardingQuestAddress
  );

  const response = await questOnboarding.getQuestById(+questId);

  if (response?.isSuccess) {
    response.data.metadata = await fetchMetadata<typeof response.data.metadata>(
      response.data.metadataUri,
      environment.nftStorageUrl
    );
    return {
      data: response.data
    };
  }
  return {
    error: response.errorMessage
  };
};

const hasUserCompletedQuest = async (
  body: {
    userAddress: string;
    questId: number;
    onboardingQuestAddress: string;
    daoAddress: string;
  },
  api: BaseQueryApi
) => {
  const sdk = AutSDK.getInstance();
  const { questId, onboardingQuestAddress, userAddress } = body;
  const questOnboarding = sdk.initService<QuestOnboarding>(
    QuestOnboarding,
    onboardingQuestAddress
  );

  try {
    const hasCompletedAQuest =
      await questOnboarding.questPlugin.functions.hasCompletedAQuest(
        userAddress,
        +questId
      );
    //update cache straight away here
    return {
      data: hasCompletedAQuest
    };
  } catch (error) {
    return {
      data: false
    };
  }
};

const activateOnboarding = async (
  { quests, pluginAddress, userAddress },
  api: BaseQueryApi
) => {
  // const sdk = AutSDK.getInstance();
  // let questOnboarding: QuestOnboarding = sdk.questOnboarding;

  // if (!questOnboarding) {
  //   questOnboarding = sdk.initService<QuestOnboarding>(
  //     QuestOnboarding,
  //     pluginAddress
  //   );
  //   sdk.questOnboarding = questOnboarding;
  // }

  // // const response = await questOnboarding.activateOnboarding(quests);

  // if (!response.isSuccess) {
  //   return {
  //     error: response.errorMessage
  //   };
  // }

  // try {
  //   const cache = await getCache(CacheTypes.UserPhases);
  //   cache.list[2].status = 1; // complete phase 3
  //   await updateCache(cache);
  // } catch (error) {
  //   console.log(error);
  // }
  return {
    data: null
  };
};

const deactivateOnboarding = async (
  { quests, pluginAddress, userAddress },
  api: BaseQueryApi
) => {
  const sdk = AutSDK.getInstance();
  const questOnboarding = sdk.initService<QuestOnboarding>(
    QuestOnboarding,
    pluginAddress
  );

  const response = await questOnboarding.deactivateOnboarding(quests);

  if (!response.isSuccess) {
    return {
      error: response.errorMessage
    };
  }

  try {
    const cache = await getCache(CacheTypes.UserPhases, userAddress);
    cache.list[2].status = 0; // reset phase 3
    await updateCache(cache);
  } catch (error) {
    console.log(error);
  }
  return {
    data: response.data
  };
};

const getPhasesCache = async ({ account }, api: BaseQueryApi) => {
  const cache = await getCache(CacheTypes.UserPhases, account);
  return {
    data: cache
  };
};

const updatePhasesCache = async (body, api: BaseQueryApi) => {
  return {
    data: await updateCache(body)
  };
};

const deletePhasesCache = async ({ userAddress }, api: BaseQueryApi) => {
  return {
    data: await deleteCache(CacheTypes.UserPhases, userAddress)
  };
};

const applyForQuest = async (
  body: {
    questId: number;
    onboardingQuestAddress: string;
  },
  api: BaseQueryApi
) => {
  const sdk = AutSDK.getInstance();
  const questOnboarding = sdk.initService<QuestOnboarding>(
    QuestOnboarding,
    body.onboardingQuestAddress
  );

  const address = await questOnboarding.contract.signerAddress;

  const cache = await getCache(CacheTypes.UserPhases, address);
  if (cache && cache.questId) {
    return {
      error: "You have already applied for a quest."
    };
  }

  const response = await questOnboarding.applyForAQuest(body.questId);

  if (!response.isSuccess) {
    return {
      error: response.errorMessage
    };
  }
  return {
    data: body.questId
  };
};

const withdrawFromAQuest = async (
  body: {
    questId: number;
    onboardingQuestAddress: string;
  },
  api: BaseQueryApi
) => {
  const sdk = AutSDK.getInstance();
  const questOnboarding = sdk.initService<QuestOnboarding>(
    QuestOnboarding,
    body.onboardingQuestAddress
  );

  const response = await questOnboarding.withdrawFromAQuest(body.questId);

  if (!response.isSuccess) {
    return {
      error: response.errorMessage
    };
  }
  return {
    data: response.data
  };
};

const getAllTasksPerQuest = async (
  { pluginAddress, questId, isAdmin, userAddress },
  api: BaseQueryApi
) => {
  const sdk = AutSDK.getInstance();
  const questOnboarding = sdk.initService<QuestOnboarding>(
    QuestOnboarding,
    pluginAddress
  );

  let tasks: Task[] = [];
  let submissions: Task[] = [];

  if (isAdmin) {
    const response = await questOnboarding.getAllTasksAndSubmissionsByQuest(
      questId
    );

    tasks = response.data.tasks;
    submissions = response.data.submissions;
  } else {
    const response = await questOnboarding.getAllTasksByQuest(
      questId,
      userAddress
    );
    tasks = response.data;
  }

  const tasksWithMetadata: Task[] = [];
  const submissionsWithMetadata: Task[] = [];

  for (let i = 0; i < tasks.length; i++) {
    const def = tasks[i];
    tasksWithMetadata.push({
      ...def,
      metadata: await fetchMetadata(def.metadataUri, environment.nftStorageUrl),
      submission: await fetchMetadata(
        def.submitionUrl,
        environment.nftStorageUrl
      )
    });
  }
  for (let i = 0; i < submissions.length; i++) {
    const def = submissions[i];
    submissionsWithMetadata.push({
      ...def,
      metadata: await fetchMetadata(def.metadataUri, environment.nftStorageUrl),
      submission: await fetchMetadata(
        def.submitionUrl,
        environment.nftStorageUrl
      )
    });
  }
  try {
    const hasCompletedAQuest =
      await questOnboarding.questPlugin.functions.hasCompletedAQuest(
        userAddress,
        +questId
      );
    if (hasCompletedAQuest) {
      const cacheResult = await getCache(CacheTypes.UserPhases, userAddress);
      if (cacheResult.list[1].status !== 1) {
        cacheResult.list[1].status = 1;
        await updateCache(cacheResult);
      }
    }
  } catch (error) {
    console.log(error);
  }
  return {
    data: {
      tasks: tasksWithMetadata,
      submissions: submissionsWithMetadata
    }
  };
};

const createQuest = async (
  body: Quest & { pluginAddress: string },
  api: BaseQueryApi
) => {
  const sdk = AutSDK.getInstance();
  const questOnboarding = sdk.initService<QuestOnboarding>(
    QuestOnboarding,
    body.pluginAddress
  );

  const response = await questOnboarding.createQuest(body);

  if (!response.isSuccess) {
    return {
      error: response.errorMessage
    };
  }
  return {
    data: response.data
  };
};

const updateQuest = async (
  body: Quest & { pluginAddress: string },
  api: BaseQueryApi
) => {
  const sdk = AutSDK.getInstance();
  const questOnboarding = sdk.initService<QuestOnboarding>(
    QuestOnboarding,
    body.pluginAddress
  );

  const response = await questOnboarding.updateQuest(body);

  if (!response.isSuccess) {
    return {
      error: response.errorMessage
    };
  }
  return {
    data: response.data
  };
};

const createTaskPerQuest = async (
  body: {
    task: Task;
    questId: number;
    pluginAddress: string;
    onboardingQuestAddress: string;
    pluginTokenId: number;
  },
  api: BaseQueryApi
) => {
  const sdk = AutSDK.getInstance();
  const questOnboarding = sdk.initService<QuestOnboarding>(
    QuestOnboarding,
    body.onboardingQuestAddress
  );

  const response = await questOnboarding.createTask(
    body.task,
    body.questId,
    body.pluginTokenId
  );

  if (!response.isSuccess) {
    return {
      error: response.errorMessage
    };
  }
  return {
    data: response.data
  };
};

const removeTaskFromQuest = async (
  body: {
    task: Task;
    questId: number;
    pluginAddress: string;
    onboardingQuestAddress: string;
    pluginTokenId: number;
  },
  api: BaseQueryApi
) => {
  const sdk = AutSDK.getInstance();
  const questOnboarding = sdk.initService<QuestOnboarding>(
    QuestOnboarding,
    body.onboardingQuestAddress
  );

  const response = await questOnboarding.removeTasks(
    [body.task],
    body.questId,
    body.pluginTokenId
  );

  if (!response.isSuccess) {
    return {
      error: response.errorMessage
    };
  }
  return {
    data: response.data
  };
};

const submitOpenTask = async (
  body: {
    file: any;
    task: Task;
    pluginAddress: string;
    onboardingQuestAddress: string;
    pluginDefinitionId: PluginDefinitionType;
  },
  api: BaseQueryApi
) => {
  const sdk = AutSDK.getInstance();
  // @ts-ignore
  if (body?.task?.metadata?.properties?.attachmentRequired) {
    // @ts-ignore
    if (body.task.metadata.properties.attachmentType === "url") {
      body.task.submission.properties["externalUrl"] = body.file;
    } else if (body.task.metadata.properties.attachmentType === "image") {
      const fileUri = await sdk.client.storeImageAsBlob(body.file);
      body.task.submission.properties["fileUri"] = fileUri;
    } else {
      const file = await toBase64(body.file);
      const fileUri = await sdk.client.storeAsBlob(file);
      body.task.submission.properties["fileUri"] = fileUri;
    }
  }

  const questOnboarding = sdk.initService<QuestOnboarding>(
    QuestOnboarding,
    body.onboardingQuestAddress
  );

  const response = await questOnboarding.submitTask(
    body.task,
    body.pluginAddress,
    body.pluginDefinitionId
  );

  if (!response.isSuccess) {
    return {
      error: response.errorMessage
    };
  }
  return {
    data: response.data
  };
};

const submitQuizTask = async (
  body: {
    userAddress: string;
    task: Task;
    questionsAndAnswers: any[];
    pluginAddress: string;
    onboardingQuestAddress: string;
    pluginDefinitionId: PluginDefinitionType;
  },
  api: BaseQueryApi
) => {
  try {
    await finaliseQuizTask(
      body.userAddress,
      body.pluginAddress,
      body.onboardingQuestAddress,
      body.task.taskId,
      body.task.metadata.properties["uuid"],
      body.questionsAndAnswers
    );

    return {
      data: true
    };
  } catch (error) {
    return {
      error: error?.response?.data?.error || "Task could not be finalised!"
    };
  }
};

const submitTransactionTask = async (
  body: {
    userAddress: string;
    task: Task;
    pluginAddress: string;
    onboardingQuestAddress: string;
    pluginDefinitionId: PluginDefinitionType;
  },
  api: BaseQueryApi
) => {
  try {
    await finaliseTransactionTask(
      body.userAddress,
      body.pluginAddress,
      body.onboardingQuestAddress,
      body.task.taskId
    );
    return {
      data: true
    };
  } catch (error) {
    return {
      error: error?.response?.data?.error || "Task could not be finalised!"
    };
  }
};

const submitJoinDiscordTask = async (
  body: {
    userAddress: string;
    task: Task;
    bearerToken: string;
    onboardingPluginAddress: string;
  },
  api: BaseQueryApi
) => {
  try {
    await finaliseJoinDiscordTask(
      body.userAddress,
      body.task.pluginAddress,
      body.onboardingPluginAddress,
      body.task.taskId,
      body.bearerToken
    );
    return {
      data: true
    };
  } catch (e) {
    return {
      error: e.response?.data?.error || "Task could not be finalised!"
    };
  }
};

const finaliseOpenTask = async (
  body: {
    task: Task;
    pluginAddress: string;
    onboardingQuestAddress: string;
    pluginDefinitionId: PluginDefinitionType;
  },
  api: BaseQueryApi
) => {
  const sdk = AutSDK.getInstance();
  const questOnboarding = sdk.initService<QuestOnboarding>(
    QuestOnboarding,
    body.onboardingQuestAddress
  );

  const response = await questOnboarding.finalizeFor(
    body.task,
    body.pluginAddress,
    body.pluginDefinitionId
  );

  if (!response.isSuccess) {
    return {
      error: response.errorMessage
    };
  }
  return {
    data: response.data
  };
};

const KEEP_DATA_UNUSED = 5 * 60;

export const onboardingApi = createApi({
  reducerPath: "onboardingApi",
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.payload && action.type === REHYDRATE) {
      return action.payload[reducerPath] || {};
    }
  },
  keepUnusedDataFor: KEEP_DATA_UNUSED,
  baseQuery: async (args, api) => {
    const { url, body } = args;
    if (url === "getAllOnboardingQuests") {
      return getAllOnboardingQuests(body, api);
    }

    if (url === "applyForQuest") {
      return applyForQuest(body, api);
    }

    if (url === "withdrawFromAQuest") {
      return withdrawFromAQuest(body, api);
    }

    if (url === "getOnboardingQuestById") {
      return fetchQuestById(body, api);
    }

    if (url === "hasUserCompletedQuest") {
      return hasUserCompletedQuest(body, api);
    }

    if (url === "createQuest") {
      return createQuest(body, api);
    }

    if (url === "updateQuest") {
      return updateQuest(body, api);
    }

    if (url === "getAllTasksPerQuest") {
      return getAllTasksPerQuest(body, api);
    }

    if (url === "activateOnboarding") {
      return activateOnboarding(body, api);
    }

    if (url === "deactivateOnboarding") {
      return deactivateOnboarding(body, api);
    }

    if (url === "createTaskPerQuest") {
      return createTaskPerQuest(body, api);
    }

    if (url === "removeTaskFromQuest") {
      return removeTaskFromQuest(body, api);
    }

    if (url === "submitOpenTask") {
      return submitOpenTask(body, api);
    }

    if (url === "getPhasesCache") {
      return getPhasesCache(body, api);
    }

    if (url === "updatePhasesCache") {
      return updatePhasesCache(body, api);
    }

    if (url === "deletePhasesCache") {
      return deletePhasesCache(body, api);
    }

    if (url === "submitJoinDiscordTask") {
      return submitJoinDiscordTask(body, api);
    }

    if (url === "finaliseOpenTask") {
      return finaliseOpenTask(body, api);
    }

    if (url === "submitQuizTask") {
      return submitQuizTask(body, api);
    }

    if (url === "submitTransactionTask") {
      return submitTransactionTask(body, api);
    }
    return {
      data: "Test"
    };
  },
  tagTypes: ["Quests", "Tasks", "Quest", "PhasesCache"],
  endpoints: (builder) => ({
    getAllOnboardingQuests: builder.query<Quest[], string>({
      query: (body) => {
        return {
          body,
          url: "getAllOnboardingQuests"
        };
      },
      providesTags: ["Quests"]
    }),
    getOnboardingQuestById: builder.query<
      Quest,
      {
        questId: number;
        onboardingQuestAddress: string;
        daoAddress: string;
      }
    >({
      query: (body) => {
        return {
          body,
          url: "getOnboardingQuestById"
        };
      },
      providesTags: ["Quest"]
    }),
    getAllTasksPerQuest: builder.query<
      {
        tasks: Task[];
        submissions: Task[];
      },
      {
        questId: number;
        userAddress: string;
        isAdmin: boolean;
        pluginAddress: string;
      }
    >({
      query: (body) => {
        return {
          body,
          url: "getAllTasksPerQuest"
        };
      },
      providesTags: ["Tasks"]
    }),
    hasUserCompletedQuest: builder.query<
      Quest,
      {
        userAddress: string;
        questId: number;
        onboardingQuestAddress: string;
        daoAddress: string;
      }
    >({
      query: (body) => {
        return {
          body,
          url: "hasUserCompletedQuest"
        };
      },
      providesTags: []
    }),
    activateOnboarding: builder.mutation<
      boolean,
      {
        quests: Quest[];
        pluginAddress: string;
        userAddress: string;
      }
    >({
      query: (body) => {
        return {
          body,
          url: "activateOnboarding"
        };
      },
      invalidatesTags: ["Quests", "Tasks"]
    }),
    deactivateOnboarding: builder.mutation<
      boolean,
      {
        quests: Quest[];
        pluginAddress: string;
        userAddress: string;
      }
    >({
      query: (body) => {
        return {
          body,
          url: "deactivateOnboarding"
        };
      },
      invalidatesTags: ["Quests", "Tasks"]
    }),
    getPhasesCache: builder.query<CacheModel, any>({
      query: (body) => {
        return {
          body,
          url: "getPhasesCache"
        };
      },
      providesTags: ["PhasesCache"]
      // providesTags: (result, error, arg) => {
      //   return result
      //     ? [{ type: "PhasesCache" as const, id: result["_id"] }, "PhasesCache"]
      //     : ["PhasesCache"];
      // }
    }),
    updatePhasesCache: builder.mutation<CacheModel, CacheModel>({
      query: (body) => {
        return {
          body,
          url: "updatePhasesCache"
        };
      },
      invalidatesTags: ["PhasesCache"]
    }),
    deletePhasesCache: builder.mutation<any, any>({
      query: (body) => {
        return {
          body,
          url: "deletePhasesCache"
        };
      },
      invalidatesTags: ["PhasesCache"]
    }),
    applyForQuest: builder.mutation<
      number,
      {
        questId: number;
        onboardingQuestAddress: string;
      }
    >({
      query: (body) => {
        return {
          body,
          url: "applyForQuest"
        };
      },
      invalidatesTags: ["Quest", "Tasks", "PhasesCache"]
    }),
    withdrawFromAQuest: builder.mutation<
      boolean,
      {
        questId: number;
        onboardingQuestAddress: string;
      }
    >({
      query: (body) => {
        return {
          body,
          url: "withdrawFromAQuest"
        };
      },
      invalidatesTags: ["Quest", "PhasesCache"]
    }),
    createQuest: builder.mutation<
      Quest,
      Partial<Quest & { pluginAddress: string }>
    >({
      query: (body) => {
        return {
          body,
          url: "createQuest"
        };
      },
      async onQueryStarted({ ...args }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            onboardingApi.util.updateQueryData(
              "getAllOnboardingQuests",
              args.pluginAddress,
              (draft) => {
                draft.push(data);
                return draft;
              }
            )
          );
        } catch (err) {
          console.error(err);
        }
      }
    }),
    updateQuest: builder.mutation<
      Quest,
      Partial<Quest & { pluginAddress: string }>
    >({
      query: (body) => {
        return {
          body,
          url: "updateQuest"
        };
      },
      async onQueryStarted({ ...args }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            onboardingApi.util.updateQueryData(
              "getAllOnboardingQuests",
              args.pluginAddress,
              (draft) => {
                const index = draft.findIndex(
                  (q) => q.questId === data.questId
                );
                draft.splice(index, 1, data);
                return draft;
              }
            )
          );
        } catch (err) {
          console.error(err);
        }
      }
    }),
    createTaskPerQuest: builder.mutation<
      Task,
      {
        task: Task;
        questId: number;
        pluginAddress: string;
        onboardingQuestAddress: string;
        pluginTokenId: number;
      }
    >({
      query: (body) => {
        return {
          body,
          url: "createTaskPerQuest"
        };
      },
      invalidatesTags: ["Tasks", "Quests"]
    }),
    removeTaskFromQuest: builder.mutation<
      Task,
      {
        userAddress: string;
        task: Task;
        questId: number;
        pluginAddress: string;
        onboardingQuestAddress: string;
        pluginTokenId: number;
      }
    >({
      query: (body) => {
        return {
          body,
          url: "removeTaskFromQuest"
        };
      },
      invalidatesTags: ["Tasks", "Quests"]
    }),
    submitOpenTask: builder.mutation<
      Task,
      {
        userAddress: string;
        file: any;
        task: Task;
        pluginAddress: string;
        onboardingQuestAddress: string;
        pluginDefinitionId: PluginDefinitionType;
      }
    >({
      query: (body) => {
        return {
          body,
          url: "submitOpenTask"
        };
      },
      invalidatesTags: ["Tasks", "Quest", "PhasesCache"]
    }),
    submitJoinDiscordTask: builder.mutation<
      Task,
      {
        userAddress: string;
        task: Task;
        bearerToken: string;
        onboardingPluginAddress: string;
      }
    >({
      query: (body) => {
        return {
          body,
          url: "submitJoinDiscordTask"
        };
      },
      invalidatesTags: ["Tasks", "Quest", "PhasesCache"]
    }),
    submitQuizTask: builder.mutation<
      Task,
      {
        userAddress: string;
        task: Task;
        questionsAndAnswers: any[];
        pluginAddress: string;
        onboardingQuestAddress: string;
        pluginDefinitionId: PluginDefinitionType;
      }
    >({
      query: (body) => {
        return {
          body,
          url: "submitQuizTask"
        };
      },
      invalidatesTags: ["Tasks", "Quest", "PhasesCache"]
    }),
    submitTransactionTask: builder.mutation<
      Task,
      {
        userAddress: string;
        task: Task;
        pluginAddress: string;
        onboardingQuestAddress: string;
        pluginDefinitionId: PluginDefinitionType;
      }
    >({
      query: (body) => {
        return {
          body,
          url: "submitTransactionTask"
        };
      },
      invalidatesTags: ["Tasks", "Quest", "PhasesCache"]
    }),
    finaliseOpenTask: builder.mutation<
      Task,
      {
        userAddress: string;
        task: Task;
        pluginAddress: string;
        onboardingQuestAddress: string;
        pluginDefinitionId: PluginDefinitionType;
      }
    >({
      query: (body) => {
        return {
          body,
          url: "finaliseOpenTask"
        };
      },
      invalidatesTags: ["Tasks"]
    })
  })
});

export const {
  useUpdateQuestMutation,
  useCreateQuestMutation,
  useApplyForQuestMutation,
  useSubmitQuizTaskMutation,
  useSubmitTransactionTaskMutation,
  useFinaliseOpenTaskMutation,
  useSubmitOpenTaskMutation,
  useWithdrawFromAQuestMutation,
  useGetPhasesCacheQuery,
  useUpdatePhasesCacheMutation,
  useDeletePhasesCacheMutation,
  useRemoveTaskFromQuestMutation,
  useLazyHasUserCompletedQuestQuery,
  useGetOnboardingQuestByIdQuery,
  useCreateTaskPerQuestMutation,
  useGetAllTasksPerQuestQuery,
  useLazyGetAllTasksPerQuestQuery,
  useGetAllOnboardingQuestsQuery,
  useActivateOnboardingMutation,
  useDeactivateOnboardingMutation,
  useSubmitJoinDiscordTaskMutation
} = onboardingApi;
