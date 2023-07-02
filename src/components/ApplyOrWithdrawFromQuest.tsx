import { CacheTypes } from "@api/cache.api";
import { NovaDAO } from "@api/community.model";
import {
  useDeletePhasesCacheMutation,
  useGetPhasesCacheQuery,
  useWithdrawFromAQuestMutation
} from "@api/onboarding.api";
import { Quest } from "@aut-labs-private/sdk";
import { LoadingButton } from "@mui/lab";
import { Stack, CircularProgress, Tooltip, Button } from "@mui/material";
import { useEthers } from "@usedapp/core";
import { isAfter, addMilliseconds } from "date-fns";
import { useMemo, useEffect } from "react";
import { useConfirmDialog } from "react-mui-confirm";

const fractionToMiliseconds = (fraction: number) => {
  const millisecondsInDay = 24 * 60 * 60 * 1000;
  return fraction * millisecondsInDay;
};

export const ApplyOrWithdrawFromQuest = ({
  daoData,
  quest,
  onApplyForQuest,
  questToApplyFor,
  isApplying
}: {
  daoData: NovaDAO;
  quest: Quest;
  onApplyForQuest;
  questToApplyFor;
  isApplying: boolean;
}) => {
  // const [cache, setCache] = useState<CacheModel>(null);
  const confirm = useConfirmDialog();
  const { account } = useEthers();
  const isOwner = useMemo(() => {
    return !!account && daoData?.admin === account;
  }, [account, daoData]);

  const [deletePhasesCache] = useDeletePhasesCacheMutation();

  const { cache } = useGetPhasesCacheQuery(
    { cacheKey: CacheTypes.UserPhases, account },
    {
      selectFromResult: ({ data }) => ({
        cache: data
      })
    }
  );

  const hasQuestStarted = useMemo(() => {
    if (!quest?.startDate) return false;
    return isAfter(new Date(), new Date(quest.startDate));
  }, [quest]);

  const hasAppliedForQuest = useMemo(() => {
    return (
      !!cache &&
      cache?.onboardingQuestAddress == daoData.onboardingQuestAddress &&
      cache?.questId === quest.questId
    );
  }, [cache]);

  // const hasMemberPhaseOneStarted = useMemo(() => {
  //   if (!daoData?.properties?.timestamp || !hasAppliedForQuest) return false;
  //   return isAfter(
  //     new Date(),
  //     new Date(
  //       getMemberPhases(
  //         new Date(daoData?.properties.timestamp)
  //       ).phaseOneStartDate
  //     )
  //   );
  // }, [quest, daoData, hasAppliedForQuest]);
  // const hasMemberPhaseOneStarted = true;

  const isQuestActive = useMemo(() => {
    return quest.active;
  }, [quest]);

  const hasQuestEnded = useMemo(() => {
    if (!quest?.startDate) return false;
    return isAfter(
      new Date(),
      addMilliseconds(
        new Date(quest.startDate),
        fractionToMiliseconds(quest?.durationInDays)
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

  const [
    withdraw,
    {
      isLoading: isWithdrawing,
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
          onboardingQuestAddress: daoData.onboardingQuestAddress,
          questId: +quest.questId
        });
      }
    });

  useEffect(() => {
    if (withdrawIsSuccess) {
      const start = async () => {
        try {
          onApplyForQuest(null);
          deletePhasesCache(CacheTypes.UserPhases);
          withdrawReset();
        } catch (error) {
          console.log(error);
        }
      };
      start();
    }
  }, [withdrawIsSuccess]);

  return (
    <>
      {hasAppliedForQuest && (
        <LoadingButton
          sx={{ minWidth: "105px" }}
          onClick={(e) => {
            e.stopPropagation();
            confimWithdrawal();
          }}
          disabled={isWithdrawing}
          loadingIndicator={
            <Stack direction="row" gap={1} alignItems="center">
              <CircularProgress size="20px" color="offWhite" />
            </Stack>
          }
          loading={isWithdrawing}
          size="medium"
          color="error"
          variant="outlined"
        >
          Withdraw
        </LoadingButton>
      )}
      {canApplyForAQuest && (
        <LoadingButton
          sx={{ minWidth: "105px" }}
          onClick={(e) => {
            e.stopPropagation();
            onApplyForQuest({
              ...quest,
              onboardingQuestAddress: daoData.onboardingQuestAddress,
              daoAddress: daoData.daoAddress
            });
          }}
          //get those
          disabled={isApplying}
          loadingIndicator={
            <Stack direction="row" gap={1} alignItems="center">
              <CircularProgress size="20px" color="offWhite" />
            </Stack>
          }
          loading={
            isApplying &&
            questToApplyFor.questId === quest.questId &&
            questToApplyFor.daoAddress === daoData.daoAddress
          }
          size="medium"
          color="primary"
          variant="outlined"
        >
          Apply
        </LoadingButton>
      )}
      {!canApplyForAQuest && !hasAppliedForQuest && (
        <Tooltip
          title={
            !isQuestActive
              ? "Quest is inactive"
              : hasQuestEnded
              ? "Quest has ended"
              : !hasQuestStarted
              ? "Quest hasn't started yet"
              : "Already applied to another quest"
          }
        >
          <div>
            <Button
              sx={{ minWidth: "105px" }}
              onClick={(e) => {
                e.stopPropagation();
              }}
              disabled={true}
              size="medium"
              color="primary"
              variant="outlined"
            >
              Apply
            </Button>
          </div>
        </Tooltip>
      )}
    </>
  );
};
