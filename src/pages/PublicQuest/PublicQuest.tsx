import {
  useGetAllTasksPerQuestQuery,
  useGetOnboardingQuestByIdQuery,
  useGetPhasesCacheQuery
} from "@api/onboarding.api";
import {
  Container,
  Box,
  Typography,
  LinearProgress,
  linearProgressClasses,
  styled,
  Tooltip,
  IconButton,
  useTheme,
  useMediaQuery
} from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { memo, useEffect, useMemo } from "react";
import LoadingProgressBar from "@components/LoadingProgressBar";
import { useGetAllPluginDefinitionsByDAOQuery } from "@api/plugin-registry.api";
import { TaskStatus } from "@aut-labs-private/sdk/dist/models/task";
import { addMilliseconds, isAfter } from "date-fns";
import Tasks from "./Tasks";
import CommunityInfo from "./CommunityInfo";
import QuestInfo, { fractionToMilliseconds } from "./QuestInfo";
import AutLoading from "@components/AutLoading";
import { RequiredQueryParams } from "../../api/RequiredQueryParams";
import { useEthers } from "@usedapp/core";
import { useGetAllNovasQuery } from "@api/community.api";
import { CacheTypes } from "@api/cache.api";
import RefreshIcon from "@mui/icons-material/Refresh";
import { TOOLBAR_HEIGHT } from "./ToolbarConnector";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 30,
  borderRadius: "30px",
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 800]
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: "30px"
  }
}));

const PublicQuest = () => {
  const { account: userAddress } = useEthers();
  const [searchParams] = useSearchParams();
  const { account } = useEthers();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    data: quest,
    isLoading: isLoadingQuest,
    isFetching: isFetchingQuest
  } = useGetOnboardingQuestByIdQuery(
    {
      questId: +searchParams.get(RequiredQueryParams.QuestId),
      onboardingQuestAddress: searchParams.get(
        RequiredQueryParams.OnboardingQuestAddress
      ),
      daoAddress: searchParams.get(RequiredQueryParams.DaoAddress)
    },
    {
      refetchOnMountOrArgChange: true,
      skip: false
    }
  );

  const { data: communityData } = useGetAllNovasQuery(null, {
    selectFromResult: ({ data }) => ({
      data: (data?.daos || []).find(
        (d) => d.daoAddress === searchParams.get(RequiredQueryParams.DaoAddress)
      )
    })
  });

  const { cache } = useGetPhasesCacheQuery(
    { cacheKey: CacheTypes.UserPhases, account },
    {
      selectFromResult: ({ data }) => ({
        cache: data
      })
    }
  );

  const isOwner = useMemo(() => {
    return communityData?.admin === userAddress;
  }, [userAddress, communityData]);

  const hasQuestStarted = useMemo(() => {
    if (!quest?.startDate) return false;
    return isAfter(new Date(), new Date(quest.startDate));
  }, [quest]);

  const hasAppliedForQuest = useMemo(() => {
    return (
      !isOwner &&
      !!cache &&
      cache?.onboardingQuestAddress ==
        searchParams.get(RequiredQueryParams.OnboardingQuestAddress) &&
      cache?.questId === +searchParams.get(RequiredQueryParams.QuestId)
    );
  }, [cache, isOwner]);

  const {
    data: tasksAndSubmissions,
    isLoading: isLoadingTasks,
    isFetching: isFetchingTasks,
    refetch
  } = useGetAllTasksPerQuestQuery(
    {
      userAddress,
      isAdmin: false,
      questId: +searchParams.get(RequiredQueryParams.QuestId),
      pluginAddress: searchParams.get(
        RequiredQueryParams.OnboardingQuestAddress
      )
    },
    {
      refetchOnMountOrArgChange: true,
      skip: false
    }
  );

  // useEffect(() => {
  //   const toDate = new Date(
  //     hasQuestStarted
  //       ? addMilliseconds(
  //           new Date(quest?.startDate),
  //           fractionToMilliseconds(quest?.durationInDays)
  //         )
  //       : quest?.startDate
  //   );
  //   const timeDifference = toDate.getTime() - new Date().getTime();

  //   const refetchTimeout = setTimeout(() => {
  //     refetch();
  //   }, timeDifference);

  //   debugger;

  //   return () => {
  //     clearTimeout(refetchTimeout);
  //   };
  // }, []);

  const { isSuccess, isLoading: isLoadingPlugins } =
    useGetAllPluginDefinitionsByDAOQuery(null, {
      selectFromResult: ({ isLoading, isSuccess }) => ({
        isLoading,
        isSuccess
      })
    });

  const tasks = useMemo(
    () => tasksAndSubmissions?.tasks || [],
    [tasksAndSubmissions]
  );

  const completedTasks = useMemo(() => {
    return tasks.reduce((prev, curr) => {
      if (curr.status === TaskStatus.Finished) {
        return (prev += 1);
      }
      return prev;
    }, 0);
  }, [tasks]);

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 4,
        flex: 1,
        display: "flex",
        flexDirection: "column",
        position: "relative"
      }}
    >
      <LoadingProgressBar
        sx={{
          zIndex: 99,
          ...(isMobile && {
            top: `${TOOLBAR_HEIGHT + 33 + "px"}`
          }),
          ...(!isMobile && {
            top: `${TOOLBAR_HEIGHT + "px"}`
          })
        }}
        isLoading={isFetchingQuest || isFetchingTasks}
      />
      {isLoadingQuest || isLoadingTasks || isLoadingPlugins ? (
        <AutLoading width="130px" height="130px" />
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              sm: "row"
            },
            alignItems: "center",
            gap: 4,
            width: "100%",
            position: "relative"
          }}
        >
          <QuestInfo tasksCompleted={completedTasks / tasks.length === 1} />
          <CommunityInfo />
        </Box>
      )}

      {isSuccess && !isLoadingTasks && (
        <>
          {hasAppliedForQuest && hasQuestStarted && (
            <Box
              sx={{
                mt: 4,
                boxShadow: 1,
                border: "2px solid",
                borderColor: "divider",
                borderRadius: "16px",
                p: 3,
                backgroundColor: "#ffffff0a"
              }}
            >
              <Typography
                sx={{
                  mb: 2,
                  display: {
                    xs: "flex",
                    sm: "inherit"
                  },
                  flexDirection: "column"
                }}
                color="white"
                variant="subtitle1"
              >
                Your progress{" "}
                <Typography className="text-secondary" variant="caption">
                  (You have completed {completedTasks}/{tasks.length} tasks)
                </Typography>
              </Typography>
              <BorderLinearProgress
                variant="determinate"
                color={completedTasks === tasks?.length ? "success" : "primary"}
                value={(completedTasks / tasks.length) * 100}
              />
              <Box
                sx={{
                  mt: 1,
                  display: "flex",
                  justifyContent: "flex-end"
                }}
              >
                <Typography
                  textAlign="end"
                  variant="caption"
                  className="text-secondary"
                >
                  Complete all the tasks to claim your ĀutID
                </Typography>
              </Box>
            </Box>
          )}

          <Typography
            sx={{
              mt: 8
            }}
            color="white"
            variant="subtitle1"
          >
            Quest tasks
            <Tooltip title="Refresh tasks">
              <span>
                <IconButton
                  size="medium"
                  color="offWhite"
                  sx={{
                    ml: 1
                  }}
                  disabled={isLoadingTasks || isFetchingTasks}
                  onClick={() => refetch()}
                >
                  <RefreshIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Typography>
          <Tasks
            questId={quest?.questId}
            canSubmitTask={hasQuestStarted && hasAppliedForQuest}
            onboardingQuestAddress={searchParams.get(
              RequiredQueryParams.OnboardingQuestAddress
            )}
            isAdmin={false}
            isLoading={isLoadingTasks}
            tasks={tasks}
          />
        </>
      )}
    </Container>
  );
};

export default memo(PublicQuest);
