import AutSDK, {
  Quest,
  QuestOnboarding,
  Task,
  fetchMetadata
} from "@aut-labs-private/sdk";
import { BaseQueryApi, createApi } from "@reduxjs/toolkit/query/react";
import { REHYDRATE } from "redux-persist";
import { environment } from "./environment";
import { CacheTypes, getCache, updateCache } from "./cache.api";
import { PluginDefinitionType } from "@aut-labs-private/sdk/dist/models/plugin";
import {
  finaliseJoinDiscordTask,
  finaliseQuizTask,
  finaliseTransactionTask
} from "./tasks.api";

const getAllOnboardingQuests = async (
  pluginAddress: any,
  api: BaseQueryApi
) => {
  const sdk = AutSDK.getInstance();
  let questOnboarding: QuestOnboarding = sdk.questOnboarding;

  if (!questOnboarding) {
    questOnboarding = sdk.initService<QuestOnboarding>(
      QuestOnboarding,
      pluginAddress
    );
    sdk.questOnboarding = questOnboarding;
  }

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
  let questOnboarding: QuestOnboarding = sdk.questOnboarding;
  const { questId, onboardingQuestAddress } = body;

  if (!questOnboarding) {
    questOnboarding = sdk.initService<QuestOnboarding>(
      QuestOnboarding,
      onboardingQuestAddress
    );
    sdk.questOnboarding = questOnboarding;
  }

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
  let questOnboarding: QuestOnboarding = sdk.questOnboarding;
  const { questId, onboardingQuestAddress, userAddress } = body;

  if (!questOnboarding) {
    questOnboarding = sdk.initService<QuestOnboarding>(
      QuestOnboarding,
      onboardingQuestAddress
    );
    sdk.questOnboarding = questOnboarding;
  }

  try {
    const hasCompletedAQuest =
      await questOnboarding.questPlugin.functions.hasCompletedAQuest(
        userAddress,
        +questId
      );
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
  let questOnboarding: QuestOnboarding = sdk.questOnboarding;

  if (!questOnboarding) {
    questOnboarding = sdk.initService<QuestOnboarding>(
      QuestOnboarding,
      pluginAddress
    );
    sdk.questOnboarding = questOnboarding;
  }

  const response = await questOnboarding.deactivateOnboarding(quests);

  if (!response.isSuccess) {
    return {
      error: response.errorMessage
    };
  }

  try {
    const cache = await getCache(CacheTypes.UserPhases);
    cache.list[2].status = 0; // reset phase 3
    await updateCache(cache);
  } catch (error) {
    console.log(error);
  }
  return {
    data: response.data
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
  let questOnboarding: QuestOnboarding = sdk.questOnboarding;

  if (!questOnboarding) {
    questOnboarding = sdk.initService<QuestOnboarding>(
      QuestOnboarding,
      body.onboardingQuestAddress
    );
    sdk.questOnboarding = questOnboarding;
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
  let questOnboarding: QuestOnboarding = sdk.questOnboarding;

  if (!questOnboarding) {
    questOnboarding = sdk.initService<QuestOnboarding>(
      QuestOnboarding,
      body.onboardingQuestAddress
    );
    sdk.questOnboarding = questOnboarding;
  }

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
  let questOnboarding: QuestOnboarding = sdk.questOnboarding;

  if (!questOnboarding) {
    questOnboarding = sdk.initService<QuestOnboarding>(
      QuestOnboarding,
      pluginAddress
    );
    sdk.questOnboarding = questOnboarding;
  }

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
  let questOnboarding: QuestOnboarding = sdk.questOnboarding;

  if (!questOnboarding) {
    questOnboarding = sdk.initService<QuestOnboarding>(
      QuestOnboarding,
      body.pluginAddress
    );
    sdk.questOnboarding = questOnboarding;
  }

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
  let questOnboarding: QuestOnboarding = sdk.questOnboarding;

  if (!questOnboarding) {
    questOnboarding = sdk.initService<QuestOnboarding>(
      QuestOnboarding,
      body.pluginAddress
    );
    sdk.questOnboarding = questOnboarding;
  }

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
  let questOnboarding: QuestOnboarding = sdk.questOnboarding;

  if (!questOnboarding) {
    questOnboarding = sdk.initService<QuestOnboarding>(
      QuestOnboarding,
      body.onboardingQuestAddress
    );
    sdk.questOnboarding = questOnboarding;
  }

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
  let questOnboarding: QuestOnboarding = sdk.questOnboarding;

  if (!questOnboarding) {
    questOnboarding = sdk.initService<QuestOnboarding>(
      QuestOnboarding,
      body.onboardingQuestAddress
    );
    sdk.questOnboarding = questOnboarding;
  }

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
  let questOnboarding: QuestOnboarding = sdk.questOnboarding;

  const fileUri = await sdk.client.storeAsBlob(body.file);
  body.task.submission.properties["fileUri"] = fileUri;

  if (!questOnboarding) {
    questOnboarding = sdk.initService<QuestOnboarding>(
      QuestOnboarding,
      body.onboardingQuestAddress
    );
    sdk.questOnboarding = questOnboarding;
  }

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
      body.pluginAddress,
      body.onboardingQuestAddress,
      body.task.taskId,
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
    task: Task;
    pluginAddress: string;
    onboardingQuestAddress: string;
    pluginDefinitionId: PluginDefinitionType;
  },
  api: BaseQueryApi
) => {
  try {
    await finaliseTransactionTask(
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
    task: Task;
    bearerToken: string;
    onboardingPluginAddress: string;
  },
  api: BaseQueryApi
) => {
  try {
    await finaliseJoinDiscordTask(
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
  let questOnboarding: QuestOnboarding = sdk.questOnboarding;

  if (!questOnboarding) {
    questOnboarding = sdk.initService<QuestOnboarding>(
      QuestOnboarding,
      body.onboardingQuestAddress
    );
    sdk.questOnboarding = questOnboarding;
  }

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
  tagTypes: ["Quests", "Tasks", "Quest"],
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
      invalidatesTags: ["Quest"]
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
      invalidatesTags: ["Quest"]
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
      invalidatesTags: ["Tasks", "Quest"]
    }),
    submitJoinDiscordTask: builder.mutation<
      Task,
      {
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
      invalidatesTags: ["Tasks", "Quest"]
    }),
    submitQuizTask: builder.mutation<
      Task,
      {
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
      invalidatesTags: ["Tasks", "Quest"]
    }),
    submitTransactionTask: builder.mutation<
      Task,
      {
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
      invalidatesTags: ["Tasks", "Quest"]
    }),
    finaliseOpenTask: builder.mutation<
      Task,
      {
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
