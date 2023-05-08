import {
  useGetAllTasksPerQuestQuery,
  useSubmitJoinDiscordTaskMutation
} from "@api/onboarding.api";
import { PluginDefinition } from "@aut-labs-private/sdk";
import AutLoading from "@components/AutLoading";
import { StepperButton } from "@components/Stepper";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  Typography
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { IsAdmin } from "@store/Community/community.reducer";
import { memo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useSelector } from "react-redux";
import {
  Link,
  useLocation,
  useParams,
  useSearchParams
} from "react-router-dom";
import TaskDetails from "../Shared/TaskDetails";
import { RequiredQueryParams } from "@api/RequiredQueryParams";
import { taskTypes } from "../Shared/Tasks";
import { PluginDefinitionType } from "@aut-labs-private/sdk/dist/models/plugin";
import { TaskStatus } from "@aut-labs-private/sdk/dist/models/task";
import { useEthers } from "@usedapp/core";
import { useOAuth } from "@components/Oauth2/oauth2";
import {
  getServerDetails,
  verifyDiscordServerOwnership
} from "@api/discord.api";
import { useAppDispatch } from "@store/store.model";
import ErrorDialog from "@components/Dialog/ErrorPopup";
import LoadingDialog from "@components/Dialog/LoadingPopup";

interface PluginParams {
  plugin: PluginDefinition;
}

const JoinDiscordTask = ({ plugin }: PluginParams) => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const params = useParams();
  const dispatch = useAppDispatch();
  const { account: userAddress } = useEthers();
  const isAdmin = useSelector(IsAdmin);
  const { getAuth, authenticating } = useOAuth();

  const { task } = useGetAllTasksPerQuestQuery(
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

  const { control, handleSubmit, getValues, setValue, formState } = useForm({
    mode: "onChange",
    defaultValues: {
      inviteClicked: false
    }
  });
  const values = useWatch({
    name: "inviteClicked",
    control
  });

  const [submitJoinDiscordTask, { error, isError, isLoading, reset }] =
    useSubmitJoinDiscordTaskMutation();

  const onSubmit = async (values) => {
    await getAuth(
      async (data) => {
        const { access_token } = data;

        submitJoinDiscordTask({
          task,
          bearerToken: access_token,
          onboardingPluginAddress: searchParams.get(
            RequiredQueryParams.OnboardingQuestAddress
          )
        });
      },
      () => {
        // setLoading(false);
      }
    );
  };

  const setButtonClicked = () => {
    setValue("inviteClicked", true);
  };

  if (task) {
    console.log("TASK DISCORD:", task);
  }

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
      <ErrorDialog handleClose={() => reset()} open={isError} message={error} />
      <LoadingDialog open={isLoading} message="Submitting task..." />

      {task ? (
        <>
          <TaskDetails task={task} />

          {isAdmin ? (
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
                      component={Link}
                      target="_blank"
                      to={(task as any)?.metadata?.properties?.inviteUrl}
                      p="5px"
                    >
                      {(task as any)?.metadata?.properties?.inviteUrl}
                    </Typography>
                    <Typography variant="caption" className="text-secondary">
                      Invite URL
                    </Typography>
                  </Stack>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center"
                    }}
                  ></Box>
                </CardContent>
              </Card>
            </Stack>
          ) : (
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
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center"
                    }}
                  >
                    <Button
                      startIcon={<OpenInNewIcon></OpenInNewIcon>}
                      sx={{
                        width: "200px",
                        height: "50px"
                      }}
                      type="button"
                      color="offWhite"
                      disabled={
                        task?.status === TaskStatus.Submitted ||
                        task?.status === TaskStatus.Finished
                      }
                      variant="outlined"
                      component={Link}
                      target="_blank"
                      to={(task as any)?.metadata?.properties?.inviteUrl}
                      onClick={setButtonClicked}
                    >
                      Join Discord
                    </Button>
                  </Box>
                </CardContent>
              </Card>
              {task?.status === TaskStatus.Created ||
              task?.status === TaskStatus.Taken ? (
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
                  <StepperButton
                    label="Submit"
                    onClick={handleSubmit(onSubmit)}
                    // disabled={!values}
                  />
                </Stack>
              ) : (
                <Box sx={{ mb: "20px" }}></Box>
              )}
            </Stack>
          )}
        </>
      ) : (
        <AutLoading></AutLoading>
      )}
    </Container>
  );
};

export default memo(JoinDiscordTask);
