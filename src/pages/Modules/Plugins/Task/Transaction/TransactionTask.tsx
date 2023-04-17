import {
  useGetAllTasksPerQuestQuery,
  useSubmitTransactionTaskMutation
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
import { IsAdmin } from "@store/Community/community.reducer";
import { memo, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useSelector } from "react-redux";
import { useSearchParams, useParams, Link } from "react-router-dom";
import TaskDetails from "../Shared/TaskDetails";
import { RequiredQueryParams } from "@api/RequiredQueryParams";
import { PluginDefinitionType } from "@aut-labs-private/sdk/dist/models/plugin";
import { taskTypes } from "../Shared/Tasks";
import { useEthers } from "@usedapp/core";
import { TaskStatus } from "@aut-labs-private/sdk/dist/models/task";
import ErrorDialog from "@components/Dialog/ErrorPopup";
import LoadingDialog from "@components/Dialog/LoadingPopup";
import { InteractionNetworks } from "@utils/transaction-networks";

interface PluginParams {
  plugin: PluginDefinition;
}

const TransactionTask = ({ plugin }: PluginParams) => {
  const [searchParams] = useSearchParams();
  const isAdmin = useSelector(IsAdmin);
  const { account: userAddress } = useEthers();

  const params = useParams();
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

  const { control, handleSubmit } = useForm({
    mode: "onChange",
    defaultValues: {
      transactionCompleted: false
    }
  });
  const values = useWatch({
    name: "transactionCompleted",
    control
  });

  const [submitTask, { error, isError, isLoading, reset }] =
    useSubmitTransactionTaskMutation();

  const onSubmit = async () => {
    submitTask({
      task,
      onboardingQuestAddress: searchParams.get(
        RequiredQueryParams.OnboardingQuestAddress
      ),
      pluginAddress: plugin.pluginAddress,
      pluginDefinitionId: plugin.pluginDefinitionId
    });
  };

  const transactionNetwork = useMemo(() => {
    if (!task) return;
    const net = InteractionNetworks.find(
      // @ts-ignore
      (n) => n.network === task.metadata.properties.network
    );
    return net?.name;
  }, [task]);

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
                  <Stack direction="column" alignItems="center" mb="15px">
                    <Typography
                      color="white"
                      variant="body"
                      textAlign="center"
                      p="5px"
                    >
                      {transactionNetwork}
                    </Typography>
                    <Typography variant="caption" className="text-secondary">
                      Network
                    </Typography>
                  </Stack>
                  <Stack direction="column" alignItems="center" mb="15px">
                    <Typography
                      color="white"
                      variant="body"
                      textAlign="center"
                      p="5px"
                    >
                      {
                        (task as any)?.metadata?.properties
                          ?.smartContractAddress
                      }
                    </Typography>
                    <Typography variant="caption" className="text-secondary">
                      Smart Contract Address
                    </Typography>
                  </Stack>
                  <Stack direction="column" alignItems="center" mb="15px">
                    <Typography
                      color="white"
                      variant="body"
                      textAlign="center"
                      p="5px"
                    >
                      {(task as any)?.metadata?.properties?.linkToInteractUrl}
                    </Typography>
                    <Typography variant="caption" className="text-secondary">
                      Link To Interact
                    </Typography>
                  </Stack>
                  <Stack direction="column" alignItems="center">
                    <Typography
                      color="white"
                      variant="body"
                      textAlign="center"
                      p="5px"
                    >
                      {(task as any)?.metadata?.properties?.functionName}
                    </Typography>
                    <Typography variant="caption" className="text-secondary">
                      Function Name
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

              {/* button */}
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
                      sx={{
                        width: "200px",
                        height: "50px"
                      }}
                      type="button"
                      color="offWhite"
                      variant="outlined"
                      disabled={
                        task?.status === TaskStatus.Submitted ||
                        task?.status === TaskStatus.Finished
                      }
                      component={Link}
                      target="_blank"
                      to={
                        (task as any)?.metadata?.properties?.linkToInteractUrl
                      }
                    >
                      Sign Transaction
                    </Button>
                  </Box>
                </CardContent>
              </Card>

              {/* button */}
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

export default memo(TransactionTask);
