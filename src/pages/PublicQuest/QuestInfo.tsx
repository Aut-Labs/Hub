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
  styled
} from "@mui/material";
import { addDays, isAfter, addMilliseconds } from "date-fns";
import { memo, useEffect, useMemo } from "react";
import DescriptionIcon from "@mui/icons-material/Description";
import {
  useApplyForQuestMutation,
  useDeletePhasesCacheMutation,
  useGetOnboardingQuestByIdQuery,
  useGetPhasesCacheQuery,
  useUpdatePhasesCacheMutation,
  useWithdrawFromAQuestMutation
} from "@api/onboarding.api";
import { useEthers } from "@usedapp/core";
import ErrorDialog from "@components/Dialog/ErrorPopup";
import { useSearchParams } from "react-router-dom";
import InfoIcon from "@mui/icons-material/Info";
import { useConfirmDialog } from "react-mui-confirm";
import { CacheTypes } from "@api/cache.api";
import BetaCountdown from "@components/BetaCountdown";
import { RequiredQueryParams } from "../../api/RequiredQueryParams";
import { useGetAllNovasQuery } from "@api/community.api";
import { getMemberPhases } from "@utils/beta-phases";

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

const fractionToMilliseconds = (fraction: number) => {
  const millisecondsInDay = 24 * 60 * 60 * 1000;
  return fraction * millisecondsInDay;
};

const QuestInfo = ({ tasksCompleted }: { tasksCompleted: boolean }) => {
  const [searchParams] = useSearchParams();
  const { account } = useEthers();
  const confirm = useConfirmDialog();

  const { cache } = useGetPhasesCacheQuery(CacheTypes.UserPhases, {
    selectFromResult: ({ data }) => ({
      cache: data
    })
  });

  const [apply, { isLoading: isApplying, isError, error, reset, isSuccess }] =
    useApplyForQuestMutation();

  const [deletePhasesCache] = useDeletePhasesCacheMutation({
    fixedCacheKey: "PhasesCache"
  });
  const [updatePhasesCache] = useUpdatePhasesCacheMutation({
    fixedCacheKey: "PhasesCache"
  });

  const { data: quest } = useGetOnboardingQuestByIdQuery(
    {
      questId: +searchParams.get(RequiredQueryParams.QuestId),
      onboardingQuestAddress: searchParams.get(
        RequiredQueryParams.OnboardingQuestAddress
      ),
      daoAddress: searchParams.get(RequiredQueryParams.DaoAddress)
    },
    {
      selectFromResult: ({ data }) => ({
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

  const hasMemberPhaseOneStarted = useMemo(() => {
    return isAfter(new Date(), new Date(getMemberPhases().phaseOneStartDate));
  }, [quest]);

  const hasQuestStarted = useMemo(() => {
    if (!quest?.startDate) return false;
    return isAfter(new Date(), new Date(quest.startDate));
  }, [quest]);

  const hasQuestEnded = useMemo(() => {
    if (!quest?.startDate) return false;
    return isAfter(
      addMilliseconds(
        new Date(quest.startDate),
        fractionToMilliseconds(quest?.durationInDays)
      ),
      new Date()
    );
  }, [quest]);

  const canApplyForAQuest = useMemo(() => {
    return !isOwner && !cache && !!hasMemberPhaseOneStarted && !hasQuestEnded;
  }, [cache, hasMemberPhaseOneStarted, hasQuestEnded, isOwner]);

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

  useEffect(() => {
    if (withdrawIsSuccess) {
      const start = async () => {
        try {
          deletePhasesCache(CacheTypes.UserPhases);
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
                <Tooltip title={quest?.metadata?.description}>
                  <DescriptionIcon
                    sx={{
                      color: "offWhite.main",
                      ml: 1
                    }}
                  />
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

          {/* {!hasQuestStarted && (
            
          )} */}
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
          {
            // Also rip that off
          }
          {tasksCompleted ? (
            <ButtonWithPulse
              sx={{
                mt: 6,
                mb: 4,
                mx: "auto"
              }}
              onClick={() => {
                window.open(`https://try-aut-internal-test.aut.id/`, "_blank");
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
