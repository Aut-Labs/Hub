import { LoadingButton } from "@mui/lab";
import {
  Box,
  Stack,
  Typography,
  Tooltip,
  Chip,
  Badge,
  CircularProgress,
  Button,
  ButtonProps,
  styled,
  IconButton
} from "@mui/material";
import { isAfter, addMilliseconds, addDays } from "date-fns";
import { memo, useEffect, useMemo } from "react";
import {
  useApplyForQuestMutation,
  useDeletePhasesCacheMutation,
  useGetOnboardingQuestByIdQuery,
  useGetPhasesCacheQuery,
  useUpdatePhasesCacheMutation,
  useWithdrawFromAQuestMutation
} from "@api/onboarding.api";
import ErrorDialog from "@components/Dialog/ErrorPopup";
import { useSearchParams } from "react-router-dom";
import InfoIcon from "@mui/icons-material/Info";
import { useConfirmDialog } from "react-mui-confirm";
import { CacheTypes } from "@api/cache.api";
import BetaCountdown from "@components/BetaCountdown";
import { RequiredQueryParams } from "../../api/RequiredQueryParams";
import { useGetAllNovasQuery } from "@api/community.api";
import { getMemberPhases } from "@utils/beta-phases";
import RefreshIcon from "@mui/icons-material/Refresh";
import { autUrls } from "@api/environment";
import { useAccount } from "wagmi";

const ButtonWithPulse = styled<ButtonProps<any, any>>(Button)`
  &:not(.Mui-disabled) {
    box-shadow: 0 0 0 0 rgba(37, 107, 176, 1);
    animation: pulse 1.5s infinite;
    @keyframes pulse {
      0% {
        box-shadow: 0 0 0 0 rgba(37, 107, 176, 0.7);
      }

      70% {
        box-shadow: 0 0 0 15px rgba(37, 107, 176, 0);
      }

      100% {
        box-shadow: 0 0 0 0 rgba(37, 107, 176, 0);
      }
    }
  }
`;

export const fractionToMilliseconds = (fraction: number) => {
  const millisecondsInDay = 24 * 60 * 60 * 1000;
  return fraction * millisecondsInDay;
};

const QuestInfo = ({ tasksCompleted }: { tasksCompleted: boolean }) => {
  const [searchParams] = useSearchParams();
  const { address: account } = useAccount();
  const confirm = useConfirmDialog();

  const { cache } = useGetPhasesCacheQuery(
    { cacheKey: CacheTypes.UserPhases, account },
    {
      selectFromResult: ({ data }) => ({
        cache: data
      })
    }
  );

  const [apply, { isLoading: isApplying, isError, error, reset, isSuccess }] =
    useApplyForQuestMutation();

  const [deletePhasesCache] = useDeletePhasesCacheMutation();
  const [updatePhasesCache] = useUpdatePhasesCacheMutation();

  const {
    data: quest,
    refetch,
    isLoading
  } = useGetOnboardingQuestByIdQuery(
    {
      questId: +searchParams.get(RequiredQueryParams.QuestId),
      onboardingQuestAddress: searchParams.get(
        RequiredQueryParams.OnboardingQuestAddress
      ),
      daoAddress: searchParams.get(RequiredQueryParams.DaoAddress)
    },
    {
      selectFromResult: ({ data, isLoading, isFetching }) => ({
        isLoading: isLoading || isFetching,
        data
      })
    }
  );

  const { data: communityData } = useGetAllNovasQuery(null, {
    selectFromResult: ({ data }) => ({
      data: (data?.daos || []).find(
        (d) => d.daoAddress === searchParams.get(RequiredQueryParams.DaoAddress)
      )
    })
  });

  const isOwner = useMemo(() => {
    return communityData?.admin === account;
  }, [account, communityData]);

  // const hasMemberPhaseOneStarted = useMemo(() => {
  //   if (!cache?.createdAt) return false;
  //   return isAfter(
  //     new Date(),
  //     new Date(getMemberPhases(new Date(cache?.createdAt)).phaseOneStartDate)
  //   );
  // }, [quest, cache]);
  // const hasMemberPhaseOneStarted = true;

  const hasQuestStarted = useMemo(() => {
    if (!quest?.startDate) return false;
    return isAfter(new Date(), new Date(quest.startDate));
  }, [quest]);

  const hasQuestEnded = useMemo(() => {
    if (!quest?.startDate) return false;
    return isAfter(
      new Date(),
      addMilliseconds(
        new Date(quest.startDate),
        fractionToMilliseconds(quest?.durationInDays)
      )
    );
  }, [quest]);

  const canApplyForAQuest = useMemo(() => {
    const currentDate = new Date();
    const questStartDate = new Date(quest?.startDate); // assuming quest.startDate is in a format recognized by Date
    const twoDaysBeforeQuestStart = new Date(
      questStartDate.setDate(questStartDate.getDate() - 2)
    );
    return (
      quest?.active &&
      !isOwner &&
      !cache &&
      !hasQuestEnded &&
      currentDate >= twoDaysBeforeQuestStart
    );
  }, [cache, quest, hasQuestEnded, isOwner]);

  const hasAppliedForQuest = useMemo(() => {
    return (
      !!cache &&
      cache?.onboardingQuestAddress ==
        searchParams.get(RequiredQueryParams.OnboardingQuestAddress) &&
      cache?.questId === +searchParams.get(RequiredQueryParams.QuestId)
    );
  }, [cache]);

  const [
    withdraw,
    {
      isLoading: isWithdrawing,
      isError: isWithdrawError,
      error: withdrawError,
      reset: withdrawReset,
      isSuccess: withdrawIsSuccess
    }
  ] = useWithdrawFromAQuestMutation();

  const confimWithdrawal = () =>
    confirm({
      title: "Are you sure you want to withdraw from quest?",
      confirmButtonText: "Withdraw",
      onConfirm: async () => {
        withdraw({
          onboardingQuestAddress: searchParams.get(
            RequiredQueryParams.OnboardingQuestAddress
          ),
          questId: +searchParams.get(RequiredQueryParams.QuestId)
        });
      }
    });
  const urls = autUrls();

  useEffect(() => {
    if (withdrawIsSuccess) {
      const start = async () => {
        try {
          deletePhasesCache({
            cacheKey: CacheTypes.UserPhases,
            userAddress: account
          });
          withdrawReset();
        } catch (error) {
          console.log(error);
        }
      };
      start();
    }
  }, [withdrawIsSuccess]);

  useEffect(() => {
    if (isSuccess) {
      const start = async () => {
        try {
          updatePhasesCache({
            ...(cache || {}),
            cacheKey: CacheTypes.UserPhases,
            address: account,
            questId: +searchParams.get(RequiredQueryParams.QuestId),
            onboardingQuestAddress: searchParams.get(
              RequiredQueryParams.OnboardingQuestAddress
            ),
            startDate: quest.startDate,
            endDate: `${addDays(
              quest.startDate,
              quest.durationInDays
            ).getTime()}`,
            daoAddress: searchParams.get(RequiredQueryParams.DaoAddress),
            list: [
              {
                phase: 1,
                status: 1
              },
              {
                phase: 2,
                status: 0
              },
              {
                phase: 3,
                status: 0
              }
            ]
          });
          reset();
        } catch (error) {
          console.log(error);
        }
      };
      start();
    }
  }, [isSuccess]);

  useEffect(() => {
    const toDate = new Date(
      hasQuestStarted
        ? addMilliseconds(
            new Date(quest?.startDate),
            fractionToMilliseconds(quest?.durationInDays)
          )
        : quest?.startDate
    );
    const timeDifference = toDate.getTime() - new Date().getTime();

    const refetchTimeout = setTimeout(() => {
      refetch();
    }, timeDifference);

    return () => {
      clearTimeout(refetchTimeout);
    };
  }, []);

  return (
    <>
      <ErrorDialog
        handleClose={() => {
          reset();
          withdrawReset();
        }}
        open={isError || isWithdrawError}
        message={error || withdrawError}
      />
      <Box
        sx={{
          flex: 1,
          boxShadow: 1,
          border: "2px solid",
          borderColor: "divider",
          borderRadius: "16px",
          height: "100%",
          p: 3,
          width: "100%",
          backgroundColor: "nightBlack.main"
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between"
          }}
        >
          <Stack direction="column">
            <Typography color="white" variant="subtitle1">
              <Stack direction="row" alignItems="center">
                {quest?.metadata?.name}
                <Tooltip title="Refresh quest">
                  <span>
                    <IconButton
                      size="medium"
                      color="offWhite"
                      sx={{
                        ml: 1
                      }}
                      disabled={isLoading}
                      onClick={() => refetch()}
                    >
                      <RefreshIcon />
                    </IconButton>
                  </span>
                </Tooltip>
                <Chip
                  sx={{
                    ml: 1
                  }}
                  label={quest?.active ? "Active" : "Inactive"}
                  color={quest?.active ? "success" : "error"}
                  size="small"
                />
              </Stack>
            </Typography>
            <Typography variant="caption" className="text-secondary">
              Quest
            </Typography>
          </Stack>
          <>
            {canApplyForAQuest && (
              <Badge
                badgeContent={
                  <Tooltip title="You can only apply to one quest.">
                    <InfoIcon
                      sx={{
                        fontSize: "16px",
                        color: "white"
                      }}
                    />
                  </Tooltip>
                }
              >
                <LoadingButton
                  onClick={async () => {
                    apply({
                      onboardingQuestAddress: searchParams.get(
                        RequiredQueryParams.OnboardingQuestAddress
                      ),
                      questId: +searchParams.get(RequiredQueryParams.QuestId)
                    });
                  }}
                  disabled={isApplying}
                  loadingIndicator={
                    <Stack direction="row" gap={1} alignItems="center">
                      <CircularProgress size="20px" color="offWhite" />
                    </Stack>
                  }
                  loading={isApplying}
                  size="small"
                  color="primary"
                  variant="contained"
                >
                  Apply for quest
                </LoadingButton>
              </Badge>
            )}
            {hasAppliedForQuest && (
              <LoadingButton
                onClick={confimWithdrawal}
                disabled={isWithdrawing}
                loadingIndicator={
                  <Stack direction="row" gap={1} alignItems="center">
                    <CircularProgress size="20px" color="offWhite" />
                  </Stack>
                }
                loading={isWithdrawing}
                size="small"
                color="error"
                variant="contained"
              >
                Withdraw
              </LoadingButton>
            )}
          </>
        </Box>

        <Box
          sx={{
            mt: 2,
            display: "grid",
            gridTemplateColumns: "1fr 2fr"
          }}
        >
          {tasksCompleted ? (
            <ButtonWithPulse
              sx={{
                mt: 6,
                mx: "auto",
                minWidth: "230px"
              }}
              onClick={() => {
                window.open(urls.tryAut, "_blank");
              }}
              size="large"
              variant="outlined"
              color="offWhite"
            >
              Go back to Try Āut
            </ButtonWithPulse>
          ) : (
            <BetaCountdown
              textAlign="left"
              hasStarted={hasQuestStarted}
              to={
                new Date(
                  hasQuestStarted
                    ? addMilliseconds(
                        new Date(quest?.startDate),
                        fractionToMilliseconds(quest?.durationInDays)
                      )
                    : quest?.startDate
                )
              }
            />
          )}
        </Box>
      </Box>
    </>
  );
};

export default memo(QuestInfo);
