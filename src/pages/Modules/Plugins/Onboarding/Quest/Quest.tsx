import {
  useGetAllOnboardingQuestsQuery,
  useGetAllTasksPerQuestQuery
} from "@api/onboarding.api";
import { PluginDefinition } from "@aut-labs-private/sdk";
import {
  Container,
  Box,
  Typography,
  Button,
  Stack,
  CircularProgress,
  IconButton,
  Tooltip,
  Chip,
  Badge
} from "@mui/material";
import { Link, useLocation, useParams } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { memo, useEffect, useMemo } from "react";
import { IsAdmin } from "@store/Community/community.reducer";
import { useSelector } from "react-redux";
import LinkWithQuery from "@components/LinkWithQuery";
import AutTabs from "@components/AutTabs/AutTabs";
import { TaskStatus } from "@aut-labs-private/sdk/dist/models/task";
import { QuestTasks } from "./QuestShared";
import OverflowTooltip from "@components/OverflowTooltip";
import Tasks from "../../Task/Shared/Tasks";
import RefreshIcon from "@mui/icons-material/Refresh";
import LoadingProgressBar from "@components/LoadingProgressBar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { setTitle } from "@store/ui-reducer";
import { useAppDispatch } from "@store/store.model";
import AutLoading from "@components/AutLoading";
import { addDays, isAfter } from "date-fns";
import BetaCountdown from "@components/BetaCountdown";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useEthers } from "@usedapp/core";

interface PluginParams {
  plugin: PluginDefinition;
}

const Quest = ({ plugin }: PluginParams) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const isAdmin = useSelector(IsAdmin);
  const { account: userAddress } = useEthers();
  const params = useParams<{ questId: string }>();

  const {
    data: tasksAndSubmissions,
    isLoading: isLoadingTasks,
    isFetching,
    refetch
  } = useGetAllTasksPerQuestQuery(
    {
      userAddress,
      isAdmin,
      questId: +params.questId,
      pluginAddress: plugin.pluginAddress
    },
    {
      refetchOnMountOrArgChange: false,
      skip: false
    }
  );

  const { tasks, submissions } = useMemo(
    () => tasksAndSubmissions || ({} as unknown as any),
    [tasksAndSubmissions]
  );

  const { quest, isLoading: isLoadingPlugins } = useGetAllOnboardingQuestsQuery(
    plugin.pluginAddress,
    {
      selectFromResult: ({ data, isLoading, isFetching }) => ({
        isLoading: isLoading || isFetching,
        quest: (data || []).find((q) => q.questId === +params?.questId)
      })
    }
  );

  useEffect(() => {
    dispatch(setTitle(`Quest - ${quest?.metadata?.name || ""}`));
  }, [dispatch, quest]);

  const isLoading = useMemo(() => {
    return isLoadingPlugins || isLoadingTasks;
  }, [isLoadingTasks, isLoadingPlugins]);

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: "20px",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        position: "relative"
      }}
    >
      <LoadingProgressBar isLoading={isFetching} />
      {isLoading ? (
        <AutLoading width="130px" height="130px" />
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow: 1,
            border: "2px solid",
            borderColor: "divider",
            borderRadius: "16px",
            p: 3,
            backgroundColor: "nightBlack.main"
          }}
        >
          <Stack alignItems="center" justifyContent="center">
            <Button
              startIcon={<ArrowBackIcon />}
              color="offWhite"
              sx={{
                position: {
                  sm: "absolute"
                },
                left: {
                  sm: "42px"
                }
              }}
              to="/aut-dashboard/modules/Onboarding/QuestOnboardingPlugin"
              component={Link}
            >
              Back
            </Button>
            <Typography textAlign="center" color="white" variant="h3">
              {quest?.metadata?.name}
              <Tooltip title="Refresh quests">
                <IconButton
                  size="medium"
                  component="span"
                  color="offWhite"
                  sx={{
                    ml: 1
                  }}
                  disabled={isLoading || isFetching}
                  onClick={refetch}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              <Chip
                sx={{
                  ml: 1
                }}
                label={quest?.active ? "Active" : "Inactive"}
                color={quest?.active ? "success" : "error"}
                // label={hasQuestStarted ? "Ongoing" : "Active"}
                // color={hasQuestStarted ? "info" : "success"}
                size="small"
              />
            </Typography>
          </Stack>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center"
            }}
          >
            <OverflowTooltip
              typography={{
                maxWidth: "400px"
              }}
              text={quest?.metadata?.description}
            />
          </Box>

          {isAdmin && !quest?.active && quest?.tasksCount > 0 && (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                mt: 2,
                alignItems: "center",
                justifyContent: "flex-end"
              }}
            >
              <Badge
                invisible={tasks?.length < 5}
                badgeContent={
                  <Tooltip title="During beta there is a maximum of 5 tasks per quest">
                    <ErrorOutlineIcon color="error" />
                  </Tooltip>
                }
              >
                <Button
                  startIcon={<AddIcon />}
                  variant="outlined"
                  disabled={tasks?.length >= 5}
                  size="medium"
                  color="primary"
                  to="/aut-dashboard/modules/Task"
                  preserveParams
                  queryParams={{
                    onboardingQuestAddress: plugin?.pluginAddress,
                    returnUrlLinkName: "Back to quest",
                    returnUrl: location.pathname,
                    questId: params?.questId.toString()
                  }}
                  component={LinkWithQuery}
                >
                  Add task
                </Button>
              </Badge>
            </Box>
          )}
        </Box>
      )}

      {!isLoading && !tasks?.length && (
        <Box
          sx={{
            display: "flex",
            gap: "20px",
            mt: 12,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Typography className="text-secondary" variant="subtitle2">
            No tasks have been added to this quest yet...
          </Typography>
          <Button
            startIcon={<AddIcon />}
            variant="outlined"
            size="medium"
            color="offWhite"
            to="/aut-dashboard/modules/Task"
            preserveParams
            queryParams={{
              onboardingQuestAddress: plugin.pluginAddress,
              returnUrlLinkName: "Back to quest",
              returnUrl: location.pathname,
              questId: params.questId
            }}
            component={LinkWithQuery}
          >
            Add first task
          </Button>
        </Box>
      )}

      {!isLoading && !!tasks.length && (
        <>
          {isAdmin && (
            <AutTabs
              tabStyles={{
                mt: 4,
                flex: 1,
                ".tab-content": {
                  padding: 0,
                  border: 0,
                  ".MuiTableContainer-root": {
                    marginTop: 0,
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: {
                      xs: "0",
                      sm: "16px"
                    }
                  }
                }
              }}
              tabs={[
                {
                  label: "Tasks",
                  props: {
                    isLoading,
                    tasks: tasks,
                    isAdmin,
                    onboardingQuestAddress: plugin.pluginAddress,
                    questId: params.questId
                  },
                  component: QuestTasks
                },
                {
                  label: "Submissions",
                  props: {
                    isLoading,
                    isAdmin,
                    tasks: submissions,
                    onboardingQuestAddress: plugin.pluginAddress,
                    questId: params.questId
                  },
                  component: QuestTasks
                }
              ]}
            />
          )}

          {/* {!isAdmin && (
            <Tasks isAdmin={isAdmin} isLoading={isLoading} tasks={tasks} />
          )} */}
        </>
      )}
    </Container>
  );
};

export default memo(Quest);
