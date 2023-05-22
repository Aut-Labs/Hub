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
import { CommunityData, IsAdmin } from "@store/Community/community.reducer";
import { memo, useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useSelector } from "react-redux";
import {
  useSearchParams,
  useParams,
  Link,
  useNavigate
} from "react-router-dom";
import TaskDetails from "../Shared/TaskDetails";
import { RequiredQueryParams } from "@api/RequiredQueryParams";
import { PluginDefinitionType } from "@aut-labs-private/sdk/dist/models/plugin";
import { taskTypes } from "../Shared/Tasks";
import { useEthers } from "@usedapp/core";
import { TaskStatus } from "@aut-labs-private/sdk/dist/models/task";
import ErrorDialog from "@components/Dialog/ErrorPopup";
import LoadingDialog from "@components/Dialog/LoadingPopup";
import { InteractionNetworks } from "@utils/transaction-networks";
import SuccessDialog from "@components/Dialog/SuccessPopup";

interface PluginParams {
  plugin: PluginDefinition;
}

const TransactionTask = ({ plugin }: PluginParams) => {
  const [searchParams] = useSearchParams();
  const isAdmin = useSelector(IsAdmin);
  const { account: userAddress } = useEthers();
  const navigate = useNavigate();
  const [openSubmitSuccess, setOpenSubmitSuccess] = useState(false);

  const params = useParams();
  const { task, isLoading: isLoadingTasks } = useGetAllTasksPerQuestQuery(
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

  const [submitTask, { isSuccess, error, isError, isLoading, reset }] =
    useSubmitTransactionTaskMutation();

  useEffect(() => {
    if (isSuccess) {
      setOpenSubmitSuccess(true);
    }
  }, [isSuccess]);

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
      <SuccessDialog
        open={openSubmitSuccess}
        message="Congrats!"
        titleVariant="h2"
        subtitle="You successfully submitted the task!"
        subtitleVariant="subtitle1"
        handleClose={() => {
          setOpenSubmitSuccess(false);
          navigate({
            pathname: "/quest",
            search: `?questId=${+searchParams.get(
              RequiredQueryParams.QuestId
            )}&onboardingQuestAddress=${searchParams.get(
              RequiredQueryParams.OnboardingQuestAddress
            )}&daoAddress=${searchParams.get(RequiredQueryParams.DaoAddress)}`
          });
        }}
      ></SuccessDialog>
      {task ? (
        <>
          <TaskDetails task={task} />

          <Stack
            direction="column"
            gap={4}
            sx={{
              flex: 1,
              justifyContent: "space-between",
              alignItems: "center",
              margin: "0 auto",
              width: {
                xs: "100%",
                sm: "650px",
                xxl: "800px"
              }
            }}
          >
            <Stack
              direction="row"
              gap={4}
              sx={{
                display: "flex",
                justifyContent: "center",
                width: {
                  xs: "100%",
                  sm: "400px",
                  xxl: "500px"
                }
              }}
            >
              {(task as any)?.metadata?.properties?.functionName && (
                <Button
                  sx={{
                    height: "50px",
                    width: "100%"
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
                  to={(task as any)?.metadata?.properties?.linkToInteractUrl}
                >
                  {`Go to ${
                    (task as any)?.metadata?.properties?.functionName
                  } `}
                </Button>
              )}
              <Button
                sx={{
                  height: "50px",
                  width: "100%"
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
                to={(task as any)?.metadata?.properties?.linkToInteractUrl}
              >
                See Contract
              </Button>
            </Stack>

            <Box
              sx={{
                width: "100%",
                display: "flex",
                mb: 4,
                justifyContent: {
                  xs: "center",
                  sm: "flex-end"
                }
              }}
            >
              <StepperButton
                label="Confirm"
                disabled={task?.status !== TaskStatus.Created || isLoadingTasks}
                onClick={handleSubmit(onSubmit)}
                sx={{ width: "250px" }}
              />
            </Box>
          </Stack>
        </>
      ) : (
        <AutLoading width="130px" height="130px"></AutLoading>
      )}
    </Container>
  );
};

export default memo(TransactionTask);
