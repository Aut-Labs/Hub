import {
  useGetAllTasksPerQuestQuery,
  useGetOnboardingQuestByIdQuery
} from "@api/onboarding.api";
import {
  Container,
  Box,
  Typography,
  LinearProgress,
  linearProgressClasses,
  styled
} from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { memo, useMemo, useState } from "react";
import LoadingProgressBar from "@components/LoadingProgressBar";
import { useGetAllPluginDefinitionsByDAOQuery } from "@api/plugin-registry.api";
import { TaskStatus } from "@aut-labs-private/sdk/dist/models/task";
import { addDays, isAfter } from "date-fns";
import Tasks from "./Tasks";
import CommunityInfo from "./CommunityInfo";
import QuestInfo from "./QuestInfo";
import AutLoading from "@components/AutLoading";
import { RequiredQueryParams } from "../../api/RequiredQueryParams";
import { useEthers } from "@usedapp/core";
import { useGetCommunityQuery } from "@api/community.api";
import { CacheModel } from "@api/cache.api";

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
  const [cache, setCache] = useState<CacheModel>();

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
      refetchOnMountOrArgChange: false,
      skip: false
    }
  );

  const { data: communityData } = useGetCommunityQuery(null, {
    refetchOnMountOrArgChange: false,
    skip: false
  });

  const isOwner = useMemo(() => {
    return communityData?.admin === userAddress;
  }, [userAddress, communityData]);

  const hasQuestStarted = useMemo(() => {
    if (!quest?.startDate) return false;
    return isAfter(new Date(), new Date(quest.startDate));
  }, [quest]);

  const hasQuestEnded = useMemo(() => {
    if (!quest?.startDate) return false;
    return isAfter(
      new Date(),
      addDays(new Date(quest.startDate), quest.durationInDays)
    );
  }, [quest]);

  const hasAppliedForQuest = useMemo(() => {
    return (
      !isOwner &&
      !!cache &&
      cache?.onboardingQuestAddress ==
        searchParams.get(RequiredQueryParams.OnboardingQuestAddress) &&
      cache?.questId === +searchParams.get(RequiredQueryParams.QuestId)
    );
  }, [cache, hasQuestStarted, hasQuestEnded, isOwner]);

  const {
    data: tasksAndSubmissions,
    isLoading: isLoadingTasks,
    isFetching: isFetchingTasks
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
      refetchOnMountOrArgChange: false,
      skip: false
    }
  );

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
        height: "100%",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        position: "relative"
      }}
    >
      <LoadingProgressBar
        sx={{
          top: "84px"
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
          <QuestInfo onUpdateCache={setCache} />
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
          </Typography>

          <Tasks
            hasAppliedForQuest={hasAppliedForQuest}
            quest={quest}
            hasQuestStarted={hasQuestStarted}
            isLoading={isLoadingTasks}
            tasks={tasks}
          />
        </>
      )}
    </Container>
  );
};

export default memo(PublicQuest);
