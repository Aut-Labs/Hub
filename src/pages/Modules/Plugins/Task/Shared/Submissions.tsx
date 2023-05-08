import { Task } from "@aut-labs-private/sdk";
import {
  Box,
  Stack,
  Typography,
  styled,
  IconButton,
  CardHeader,
  CardContent,
  Card,
  Button,
  Container
} from "@mui/material";
import { memo, useMemo } from "react";
import {
  Link,
  useLocation,
  useParams,
  useSearchParams
} from "react-router-dom";

import { TaskStatus } from "@store/model";
import { useGetAllPluginDefinitionsByDAOQuery } from "@api/plugin-registry.api";
import {
  PluginDefinition,
  PluginDefinitionType
} from "@aut-labs-private/sdk/dist/models/plugin";
import { TaskType } from "@aut-labs-private/sdk/dist/models/task";
import { useConfirmDialog } from "react-mui-confirm";
import OverflowTooltip from "@components/OverflowTooltip";
import AutLoading from "@components/AutLoading";
import {
  useGetAllTasksPerQuestQuery,
  useRemoveTaskFromQuestMutation
} from "@api/onboarding.api";
import ErrorDialog from "@components/Dialog/ErrorPopup";
import EditIcon from "@mui/icons-material/Edit";
import { differenceInDays } from "date-fns";
import { useEthers } from "@usedapp/core";
import { RequiredQueryParams } from "@api/RequiredQueryParams";
import { useSelector } from "react-redux";
import { IsAdmin } from "@store/Community/community.reducer";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export const taskStatuses: any = {
  [TaskStatus.Created]: {
    label: "To Do",
    color: "info"
  },
  [TaskStatus.Finished]: {
    label: "Complete",
    color: "success"
  },
  [TaskStatus.Submitted]: {
    label: "Submitted",
    color: "warning"
  },
  [TaskStatus.Taken]: {
    label: "Taken",
    color: "info"
  }
};

export const taskTypes = {
  [TaskType.Open]: {
    pluginType: PluginDefinitionType.OnboardingOpenTaskPlugin,
    label: "Open Task"
  },
  [TaskType.ContractInteraction]: {
    pluginType: PluginDefinitionType.OnboardingTransactionTaskPlugin,
    label: "Contract Interaction"
  },
  [TaskType.Quiz]: {
    pluginType: PluginDefinitionType.OnboardingQuizTaskPlugin,
    label: "Multiple-Choice Quiz"
  },
  [TaskType.JoinDiscord]: {
    pluginType: PluginDefinitionType.OnboardingJoinDiscordTaskPlugin,
    label: "Join Discord"
  }
};

const TaskCard = ({
  row,
  isAdmin,
  canDelete
}: {
  row: Task;
  isAdmin: boolean;
  canDelete: boolean;
}) => {
  const location = useLocation();
  const params = useParams<{ questId: string }>();
  const confirm = useConfirmDialog();
  const [removeTask, { error, isError, isLoading, reset }] =
    useRemoveTaskFromQuestMutation();

  const { plugin, questOnboarding } = useGetAllPluginDefinitionsByDAOQuery(
    null,
    {
      selectFromResult: ({ data }) => ({
        questOnboarding: (data || []).find(
          (p) =>
            PluginDefinitionType.QuestOnboardingPlugin === p.pluginDefinitionId
        ),
        plugin: (data || []).find(
          (p) => taskTypes[row.taskType].pluginType === p.pluginDefinitionId
        )
      })
    }
  );

  const confimDelete = () =>
    confirm({
      title: "Are you sure you want to delete this task?",
      onConfirm: () => {
        removeTask({
          task: row,
          questId: +params.questId,
          pluginTokenId: plugin.tokenId,
          pluginAddress: plugin.pluginAddress,
          onboardingQuestAddress: questOnboarding?.pluginAddress
        });
      }
    });

  const path = useMemo(() => {
    if (!plugin) return;
    const stackType = plugin.metadata.properties.module.type;
    const stack = `modules/${stackType}`;
    return `${stack}/${PluginDefinitionType[plugin.pluginDefinitionId]}`;
  }, [plugin]);

  return (
    <>
      <ErrorDialog handleClose={() => reset()} open={isError} message={error} />
      <GridCard
        sx={{
          bgcolor: "nightBlack.main",
          borderColor: "divider",
          borderRadius: "16px",
          minHeight: "385px",
          boxShadow: 7,
          display: "flex",
          flexDirection: "column"
        }}
        variant="outlined"
      >
        <CardHeader
          sx={{
            alignItems: "flex-start",
            ".MuiCardHeader-action": {
              mt: "3px"
            }
          }}
          titleTypographyProps={{
            fontFamily: "FractulAltBold",
            mb: 2,
            fontWeight: 900,
            color: "white",
            variant: "subtitle1"
          }}
          subheaderTypographyProps={{
            color: "white"
          }}
          action={
            <IconButton color="offWhite">
              <EditIcon />
            </IconButton>
          }
          title={plugin?.metadata?.properties?.title}
        />
        <CardContent
          sx={{
            pt: 0,
            flex: 1,
            display: "flex",
            flexDirection: "column"
          }}
        >
          <Stack flex={1} direction="column" gap={2}>
            <Typography variant="body" color="white">
              Task type: {taskTypes[row.taskType]?.label}
            </Typography>
            <Typography variant="body" color="white">
              Duration:{" "}
              {differenceInDays(new Date(row.endDate), new Date(row.startDate))}{" "}
              days
            </Typography>

            <OverflowTooltip maxLine={4} text={row.metadata?.description} />
          </Stack>

          <Box
            sx={{
              width: "100%",
              display: "flex"
            }}
          >
            {plugin.pluginDefinitionId ===
              PluginDefinitionType.OnboardingOpenTaskPlugin && (
              <Button
                sx={{
                  width: "80%",
                  mt: 6,
                  mb: 4,
                  mx: "auto"
                }}
                size="large"
                variant="outlined"
                color="offWhite"
              >
                Submissions
              </Button>
            )}
          </Box>
        </CardContent>
      </GridCard>
    </>
  );
};

const GridCard = styled(Card)(({ theme }) => {
  return {
    minHeight: "365px",
    width: "100%",
    transition: theme.transitions.create(["transform"]),
    "&:hover": {
      transform: "scale(1.019)"
    }
  };
});

const GridBox = styled(Box)(({ theme }) => {
  return {
    boxSizing: "border-box",
    display: "grid",
    gridTemplateColumns: "1fr",
    gridGap: "30px",
    [theme.breakpoints.up("sm")]: {
      gridTemplateColumns: "repeat(2,minmax(0,1fr))"
    },
    [theme.breakpoints.up("lg")]: {
      gridTemplateColumns: "repeat(3,minmax(0,1fr))"
    }
  };
});

interface TasksParams {
  isLoading: boolean;
  tasks: Task[];
  canDelete?: boolean;
  isAdmin: boolean;
  onboardingQuestAddress: string;
  questId: number;
}

interface PluginParams {
  plugin: PluginDefinition;
}

const Submissions = ({ plugin }: PluginParams) => {
  const [searchParams] = useSearchParams();
  const { account: userAddress } = useEthers();
  const params = useParams<{ taskId: string }>();
  const isAdmin = useSelector(IsAdmin);
  const { data: tasksAndSubmissions, isLoading: isLoadingTasks } =
    useGetAllTasksPerQuestQuery(
      {
        userAddress,
        isAdmin,
        questId: +searchParams.get(RequiredQueryParams.QuestId),
        pluginAddress: searchParams.get(
          RequiredQueryParams.OnboardingQuestAddress
        )
      },
      {
        refetchOnMountOrArgChange: false,
        skip: false
      }
    );

  const { submissions } = useMemo(
    () => tasksAndSubmissions || ({} as unknown as any),
    [tasksAndSubmissions]
  );

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
          return (
            t.taskId === +params?.taskId &&
            PluginDefinitionType.OnboardingOpenTaskPlugin ===
              taskTypes[t.taskType].pluginType
          );
        })
      })
    }
  );

  console.log(task);

  return (
    <Container
      sx={{
        py: "20px",
        display: "flex",
        flexDirection: "column",
        height: "100%"
      }}
      maxWidth="lg"
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          mb: 4,
          mx: "auto",
          position: "relative",
          width: "100%"
        }}
      >
        {isLoadingTasks ? (
          <AutLoading width="130px" height="130px" />
        ) : (
          <>
            <Stack alignItems="center" justifyContent="center">
              <Button
                startIcon={<ArrowBackIcon />}
                color="offWhite"
                sx={{
                  position: {
                    sm: "absolute"
                  },
                  left: {
                    sm: "0"
                  }
                }}
                to={searchParams.get("returnUrl")}
                component={Link}
              >
                {searchParams.get("returnUrlLinkName") || "Back"}
              </Button>
              <Typography textAlign="center" color="white" variant="h3">
                {task?.metadata?.name}
              </Typography>
            </Stack>
            {!!submissions?.length && (
              <GridBox sx={{ flexGrow: 1, mt: 4 }}>
                {submissions.map((row, index) => (
                  <TaskCard
                    isAdmin={isAdmin}
                    canDelete={false}
                    key={`table-row-${index}`}
                    row={row}
                  />
                ))}
              </GridBox>
            )}

            {!isLoadingTasks && !submissions?.length && (
              <Box
                sx={{
                  display: "flex",
                  gap: "20px",
                  pt: 12,
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Typography className="text-secondary" variant="subtitle2">
                  No submissions yet...
                </Typography>
              </Box>
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default memo(Submissions);
