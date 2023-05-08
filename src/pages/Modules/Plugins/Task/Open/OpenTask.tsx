/* eslint-disable max-len */
import {
  useFinaliseOpenTaskMutation,
  useGetAllTasksPerQuestQuery,
  useSubmitOpenTaskMutation
} from "@api/onboarding.api";
import { PluginDefinition, Task } from "@aut-labs-private/sdk";
import AutLoading from "@components/AutLoading";
import { StepperButton } from "@components/Stepper";
import {
  Card,
  CardContent,
  Chip,
  Container,
  Stack,
  Typography
} from "@mui/material";
import { IsAdmin } from "@store/Community/community.reducer";
import { AutTextField } from "@theme/field-text-styles";
import { memo, useEffect, useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useSelector } from "react-redux";
import { useSearchParams, useParams } from "react-router-dom";
import TaskDetails from "../Shared/TaskDetails";
import { RequiredQueryParams } from "@api/RequiredQueryParams";
import { PluginDefinitionType } from "@aut-labs-private/sdk/dist/models/plugin";
import { taskTypes } from "../Shared/Tasks";
import ErrorDialog from "@components/Dialog/ErrorPopup";
import LoadingDialog from "@components/Dialog/LoadingPopup";
import { useEthers } from "@usedapp/core";
import { TaskStatus } from "@aut-labs-private/sdk/dist/models/task";

interface PluginParams {
  plugin: PluginDefinition;
}

interface UserSubmitContentProps {
  task: Task;
  userAddress: string;
  submission?: Task;
  plugin: PluginDefinition;
}

const UserSubmitContent = ({
  task,
  userAddress,
  plugin
}: UserSubmitContentProps) => {
  const [searchParams] = useSearchParams();
  const [initialized, setInitialized] = useState(false);
  const { control, handleSubmit, formState, setValue } = useForm({
    mode: "onChange",
    defaultValues: {
      openTask: null
    }
  });

  useEffect(() => {
    if (!initialized && task) {
      setValue("openTask", task.submission?.description);
      setInitialized(true);
    }
  }, [initialized, task]);

  const [submitTask, { error, isError, isLoading, reset }] =
    useSubmitOpenTaskMutation();

  const onSubmit = async (values) => {
    submitTask({
      task: {
        ...task,
        submission: {
          name: "Open task submission",
          description: values.openTask,
          properties: {
            submitter: userAddress
          }
        }
      },
      onboardingQuestAddress: searchParams.get(
        RequiredQueryParams.OnboardingQuestAddress
      ),
      pluginAddress: plugin.pluginAddress,
      pluginDefinitionId: plugin.pluginDefinitionId
    });
  };

  return (
    <Stack
      direction="column"
      gap={4}
      sx={{
        flex: 1,
        justifyContent: "space-between",
        margin: "0 auto",
        width: {
          xs: "100%",
          sm: "400px",
          xxl: "800px"
        }
      }}
    >
      <ErrorDialog handleClose={() => reset()} open={isError} message={error} />
      <LoadingDialog open={isLoading} message="Submitting task..." />

      {task?.status === TaskStatus.Created ||
      task?.status === TaskStatus.Taken ? (
        <Card
          sx={{
            bgcolor: "nightBlack.main",
            borderColor: "divider",
            borderRadius: "16px",
            boxShadow: 3
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column"
            }}
          >
            <Typography
              color="white"
              variant="body"
              textAlign="center"
              p="20px"
            >
              {task?.metadata?.description}
            </Typography>
            <Controller
              name="openTask"
              control={control}
              rules={{
                required: true,
                maxLength: 257
              }}
              render={({ field: { name, value, onChange } }) => {
                return (
                  <AutTextField
                    name={name}
                    disabled={
                      task.status === TaskStatus.Submitted ||
                      task.status === TaskStatus.Finished
                    }
                    value={value || ""}
                    onChange={onChange}
                    variant="outlined"
                    color="offWhite"
                    required
                    multiline
                    rows={5}
                    placeholder="Enter your answer here..."
                  />
                );
              }}
            />
          </CardContent>
        </Card>
      ) : (
        <Card
          sx={{
            bgcolor: "nightBlack.main",
            borderColor: "divider",
            borderRadius: "16px",
            boxShadow: 3
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column"
            }}
          >
            {(task as any)?.status === TaskStatus.Finished && (
              <Stack direction="column" alignItems="flex-end" mb="15px">
                <Chip label="Approved" color="success" size="small" />
              </Stack>
            )}

            <Stack direction="column" alignItems="center" mb="15px">
              <Typography
                color="white"
                variant="body"
                textAlign="center"
                p="5px"
              >
                {task?.metadata?.description}
              </Typography>
              <Typography variant="caption" className="text-secondary">
                Task Description
              </Typography>
            </Stack>

            <Stack direction="column" alignItems="center">
              <Typography
                color="white"
                variant="body"
                textAlign="center"
                p="5px"
              >
                {task?.submission?.description}
              </Typography>
              <Typography variant="caption" className="text-secondary">
                My Submission
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      )}

      <Stack
        sx={{
          margin: "0 auto",
          width: {
            xs: "100%",
            sm: "400px",
            xxl: "800px"
          }
        }}
      >
        {(task?.status === TaskStatus.Created ||
          task?.status === TaskStatus.Taken) && (
          <StepperButton
            label="Submit"
            onClick={handleSubmit(onSubmit)}
            disabled={!formState.isValid}
          />
        )}
      </Stack>
    </Stack>
  );
};

const OwnerFinalizeContent = ({
  task,
  submission,
  userAddress,
  plugin
}: UserSubmitContentProps) => {
  const [searchParams] = useSearchParams();

  const [finalizeTask, { error, isError, isLoading, reset }] =
    useFinaliseOpenTaskMutation();

  const onSubmit = async () => {
    finalizeTask({
      task: submission,
      onboardingQuestAddress: searchParams.get(
        RequiredQueryParams.OnboardingQuestAddress
      ),
      pluginAddress: plugin.pluginAddress,
      pluginDefinitionId: plugin.pluginDefinitionId
    });
  };

  return (
    <Stack
      direction="column"
      gap={4}
      sx={{
        flex: 1,
        justifyContent: "space-between",
        margin: "0 auto",
        width: {
          xs: "100%",
          sm: "400px",
          xxl: "800px"
        }
      }}
    >
      <ErrorDialog handleClose={() => reset()} open={isError} message={error} />
      <LoadingDialog open={isLoading} message="Finalizing task..." />
      <Card
        sx={{
          bgcolor: "nightBlack.main",
          borderColor: "divider",
          borderRadius: "16px",
          boxShadow: 3
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column"
          }}
        >
          {(task as any)?.status === TaskStatus.Finished && (
            <Stack direction="column" alignItems="flex-end" mb="15px">
              <Chip label="Approved" color="success" size="small" />
            </Stack>
          )}

          <Stack direction="column" alignItems="center" mb="15px">
            <Typography color="white" variant="body" textAlign="center" p="5px">
              {task?.metadata?.description}
            </Typography>
            <Typography variant="caption" className="text-secondary">
              Task Description
            </Typography>
          </Stack>

          <Stack direction="column" alignItems="center">
            <Typography color="white" variant="body" textAlign="center" p="5px">
              {submission?.submission?.description}
            </Typography>
            <Typography variant="caption" className="text-secondary">
              User Submission
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      <Stack
        sx={{
          margin: "0 auto",
          width: {
            xs: "100%",
            sm: "400px",
            xxl: "800px"
          }
        }}
      >
        {submission?.status === TaskStatus.Submitted && (
          <StepperButton label="Finalize" onClick={onSubmit} />
        )}
      </Stack>
    </Stack>
  );
};

const OpenTask = ({ plugin }: PluginParams) => {
  const [searchParams] = useSearchParams();
  const { account: userAddress } = useEthers();
  const isAdmin = useSelector(IsAdmin);

  const params = useParams();

  const { task, submission } = useGetAllTasksPerQuestQuery(
    {
      userAddress,
      isAdmin,
      pluginAddress: searchParams.get(
        RequiredQueryParams.OnboardingQuestAddress
      ),
      questId: +searchParams.get(RequiredQueryParams.QuestId)
    },
    {
      selectFromResult: ({ data, isLoading, isFetching }) => ({
        isLoading: isLoading || isFetching,
        submission: (data?.submissions || []).find((t) => {
          const [pluginType] = location.pathname.split("/").splice(-2);
          return (
            t.submitter === searchParams.get("submitter") &&
            t.taskId === +params?.taskId &&
            PluginDefinitionType[pluginType] ===
              taskTypes[t.taskType].pluginType
          );
        }),
        task: (data?.tasks || []).find((t) => {
          const [pluginType] = location.pathname.split("/").splice(-2);
          return (
            t.taskId === +params?.taskId &&
            PluginDefinitionType[pluginType] ===
              taskTypes[t.taskType].pluginType
          );
        })
      })
    }
  );

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 4,
        height: "100%",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        position: "relative"
      }}
    >
      {task ? (
        <>
          <TaskDetails task={submission || task} />

          {!isAdmin && (
            <UserSubmitContent
              task={submission || task}
              plugin={plugin}
              userAddress={userAddress}
            />
          )}

          {isAdmin && (
            <OwnerFinalizeContent
              task={task}
              submission={submission}
              plugin={plugin}
              userAddress={userAddress}
            />
          )}
        </>
      ) : (
        <AutLoading></AutLoading>
      )}
    </Container>
  );
};

export default memo(OpenTask);
