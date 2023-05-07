import {
  Box,
  Button,
  CircularProgress,
  Link,
  Stack,
  Tooltip,
  Typography,
  styled
} from "@mui/material";
import { memo, useEffect, useMemo, useState } from "react";
import { ipfsCIDToHttpUrl } from "@api/storage.api";
import Flipcard from "@components/Flipcard";
import FlipIcon from "@assets/flip.svg";
import {
  useApplyForQuestMutation,
  useLazyHasUserCompletedQuestQuery,
  useWithdrawFromAQuestMutation
} from "@api/onboarding.api";
import {
  isAuthenticated,
  setAuthenticated,
  changeConnectStatus,
  ConnectStatus
} from "@auth/auth.reducer";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@store/store.model";
import {
  CacheModel,
  CacheTypes,
  deleteCache,
  getCache,
  updateCache
} from "@api/cache.api";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import { useNavigate } from "react-router-dom";
import { communityUpdateState } from "@store/Community/community.reducer";
import { RequiredQueryParams } from "@api/RequiredQueryParams";
import { LoadingButton } from "@mui/lab";
import { useConfirmDialog } from "react-mui-confirm";
import { useEthers } from "@usedapp/core";
import { isAfter, addDays, set } from "date-fns";

const getRoleName = (daoData, quest) => {
  const role = daoData.properties.rolesSets[0].roles.find(
    (r) => r.id === quest.role
  );
  if (role) {
    return role.roleName;
  }
  return "N/A";
};

const AutCardFront = styled("div")({
  width: "100%",
  height: "100%",
  border: "1px"
});

const AutCardContainer = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {
    width: "300px",
    height: "350px"
  },
  [theme.breakpoints.up("sm")]: {
    width: "300px",
    height: "350px"
  },
  [theme.breakpoints.up("md")]: {
    width: "300px",
    height: "350px"
  },
  [theme.breakpoints.up("xl")]: {
    width: "330px",
    height: "380px"
  },
  [theme.breakpoints.up("xxl")]: {
    width: "380px",
    height: "430px"
  },
  boxShadow: "10px 10px 10px black",
  backgroundColor: "#262626",
  borderColor: "#3f3f40",
  borderStyle: "solid",
  borderWidth: "3px",
  padding: "0px 5px",
  overflow: "hidden",
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  flexDirection: "column",
  "&.highlighted": {
    boxShadow: "20px 20px 20px #0063a2"
  },
  transition: theme.transitions.create(["transform"]),
  "&:hover": {
    transform: "scale(1.019)"
  }
}));

const AutCardBack = styled("div")({
  height: "100%",
  width: "100%"
});

const Countdown = styled("div")({
  display: "flex",
  flexDirection: "column",
  marginTop: "45px",
  justifyContent: "center",
  alignItems: "center",
  "& > DIV > DIV:nth-of-type(even)": {
    marginLeft: "4px",
    marginRight: "4px"
  },
  "& > DIV > DIV:nth-of-type(odd) > DIV:nth-of-type(2)": {
    marginRight: "2px"
  }
});

const ApplyOrWithdrawFromQuest = ({ daoData, quest, onUpdateCache, cache }) => {
  const [hasUserCompletedQuest, { data: isQuestComplete }] =
    useLazyHasUserCompletedQuestQuery();
  // const [cache, setCache] = useState<CacheModel>(null);
  const confirm = useConfirmDialog();
  const { account } = useEthers();
  const isOwner = useMemo(() => {
    return !!account && daoData?.admin === account;
  }, [account, daoData]);

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
  // Use this stuff
  const canApplyForAQuest = useMemo(() => {
    console.log("isOwner", isOwner);
    console.log("cache", cache);
    console.log("hasQuestStarted", hasQuestStarted);
    console.log("hasQuestEnded", hasQuestEnded);
    return !isOwner && !cache && !!hasQuestStarted && !hasQuestEnded;
  }, [cache, hasQuestStarted, hasQuestEnded, isOwner]);

  const hasAppliedForQuest = useMemo(() => {
    return (
      !!cache &&
      cache?.onboardingQuestAddress == daoData.onboardingQuestAddress &&
      cache?.questId === quest.questId
    );
  }, [cache, hasQuestStarted, hasQuestEnded]);

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
          onboardingQuestAddress: daoData.onboardingQuestAddress,
          questId: +quest.questId
        });
      }
    });

  useEffect(() => {
    if (isQuestComplete) {
      const start = async () => {
        try {
          const cacheResult = await getCache(CacheTypes.UserPhases);
          cacheResult.list[1].status = 1;
          await updateCache(cacheResult);
          onUpdateCache(cacheResult);
          // setCache(cacheResult);
        } catch (error) {
          console.log(error);
        }
      };
      start();
    }
  }, [isQuestComplete]);

  useEffect(() => {
    if (withdrawIsSuccess) {
      const start = async () => {
        try {
          await deleteCache(CacheTypes.UserPhases);
          onUpdateCache(null);
          // setCache(null);
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
          const updatedCache = await updateCache({
            ...(cache || {}),
            cacheKey: CacheTypes.UserPhases,
            address: account,
            questId: quest.questId,
            onboardingQuestAddress: daoData.onboardingQuestAddress,
            daoAddress: daoData.daoAddress,
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
          // setCache(updatedCache);
          onUpdateCache(updatedCache);
          reset();
        } catch (error) {
          console.log(error);
        }
      };
      start();
    }
  }, [isSuccess]);

  useEffect(() => {
    const start = async () => {
      try {
        const cacheResult = await getCache(CacheTypes.UserPhases);
        // setCache(cacheResult);
        onUpdateCache(cacheResult);
        if (
          !!cache &&
          cache?.onboardingQuestAddress &&
          daoData.onboardingQuestAddress &&
          cache?.questId === +quest.questId
        ) {
          hasUserCompletedQuest({
            questId: +quest.questId,
            userAddress: account,
            onboardingQuestAddress: daoData.onboardingQuestAddress,
            daoAddress: daoData.daoAddress
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
    start();
  }, []);
  return (
    <>
      {hasAppliedForQuest && (
        <LoadingButton
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
          size="small"
          color="error"
          variant="outlined"
        >
          Withdraw
        </LoadingButton>
      )}
      {canApplyForAQuest && (
        <LoadingButton
          onClick={(e) => {
            e.stopPropagation();
            apply({
              onboardingQuestAddress: daoData.onboardingQuestAddress,
              questId: +quest.questId
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
          variant="outlined"
        >
          Apply
        </LoadingButton>
      )}
      {!canApplyForAQuest && !hasAppliedForQuest && (
        <Tooltip
          title={
            !hasQuestStarted
              ? "Quest hasn't started yet"
              : "Already applied to another quest"
          }
        >
          <Button
            onClick={(e) => {
              e.stopPropagation();
            }}
            disabled={false}
            size="small"
            color="primary"
            variant="outlined"
          >
            Apply
          </Button>
        </Tooltip>
      )}
    </>
  );
};

export const NovaCard = ({
  daoData,
  highlightData,
  onUpdateCache,
  cache,
  onQuestSelected,
  onApplyForQuest
}: {
  daoData: any;
  highlightData: any;
  onUpdateCache: any;
  cache: any;
  onQuestSelected: any;
  onApplyForQuest: any;
}) => {
  const [
    apply,
    { data, isLoading: isApplying, isError, error, reset, isSuccess }
  ] = useApplyForQuestMutation();
  const [isFlipped, setFlipped] = useState(false);
  const confirm = useConfirmDialog();

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

  useEffect(() => {
    if (withdrawIsSuccess) {
      const start = async () => {
        try {
          await deleteCache(CacheTypes.UserPhases);
          onUpdateCache(null);
          // setCache(null);
          withdrawReset();
        } catch (error) {
          console.log(error);
        }
      };
      start();
    }
  }, [withdrawIsSuccess]);

  const questDetails = async (e, quest) => {
    e.stopPropagation();
    onQuestSelected({
      ...quest,
      onboardingQuestAddress: daoData.onboardingQuestAddress,
      daoAddress: daoData.daoAddress
    });
  };

  const flipCard = () => {
    if (isFlipped) {
      setFlipped(false);
    } else {
      setFlipped(true);
    }
  };

  return (
    <div
      style={{
        marginBottom: "65px"
      }}
    >
      <Flipcard
        isFlipped={isFlipped}
        onClick={flipCard}
        containerClassName={`${isFlipped ? "flipped" : ""}`}
      >
        <AutCardFront
          className={`aut-card-front ${isFlipped ? "flipped" : ""}`}
        >
          <AutCardContainer
            className={`aut-card-container front ${
              highlightData.highlighted && "highlighted"
            }`}
          >
            <Typography
              fontWeight="bold"
              fontFamily="FractulAltBold"
              variant="subtitle1"
              sx={{
                mt: "25px",
                mb: "0px",
                color: "white"
              }}
            >
              {daoData.name}
            </Typography>
            <img
              src={ipfsCIDToHttpUrl(daoData?.image)}
              alt="Dao image"
              style={{
                marginTop: "15px",
                width: "100px",
                height: "100px"
              }}
            />
            <Typography
              fontWeight="normal"
              textAlign="center"
              fontFamily="FractulRegular"
              variant="body"
              sx={{
                mt: "25px",
                mb: "0px",
                color: "white"
              }}
            >
              {daoData.description}
            </Typography>
            <div
              style={{
                marginTop: "auto",
                marginBottom: "10px",
                width: "100%",
                display: "flex",
                justifyContent: "flex-end"
              }}
            >
              <img
                style={{
                  width: "22px",
                  height: "22px",
                  marginRight: "10px"
                }}
                src={FlipIcon}
                alt="Flip icon"
              />
            </div>
          </AutCardContainer>
        </AutCardFront>
        <AutCardBack className="aut-card-back">
          <AutCardContainer
            className={`aut-card-container back ${
              highlightData.highlighted && "highlighted"
            }`}
          >
            <Typography
              fontWeight="bold"
              textAlign="center"
              fontFamily="FractulAltBold"
              variant="subtitle1"
              sx={{
                mt: "25px",
                mb: "0px",
                color: "white"
              }}
            >
              Pick your Role
            </Typography>
            <Typography
              fontWeight="normal"
              textAlign="center"
              fontFamily="FractulRegular"
              variant="subtitle2"
              sx={{
                mt: "5px",
                mb: "0px",
                color: "white"
              }}
            >
              {daoData.name}
            </Typography>
            <Box
              marginTop={{ _: "20px", md: "10px", lg: "13px", xl: "20px" }}
              width="100%"
            >
              {daoData.properties.quests.map((quest, i) => {
                return (
                  <div
                    key={i}
                    style={{
                      marginTop: "22px",
                      padding: "0px 17px",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between"
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "start"
                      }}
                    >
                      <Typography
                        fontWeight="normal"
                        textAlign="center"
                        fontFamily="FractulRegular"
                        variant="body"
                        sx={{
                          textAlign: "start",
                          mt: "5px",
                          mb: "0px",
                          color: "white"
                        }}
                      >
                        {getRoleName(daoData, quest)}
                      </Typography>
                      <Link
                        sx={{
                          textAlign: "start"
                        }}
                        component="button"
                        color="offWhite.main"
                        variant="caption"
                        onClick={(e) => questDetails(e, quest)}
                      >
                        Details
                      </Link>
                    </div>

                    <ApplyOrWithdrawFromQuest
                      daoData={daoData}
                      quest={quest}
                      cache={cache}
                      onUpdateCache={onUpdateCache}
                    ></ApplyOrWithdrawFromQuest>

                    {/* <Button
                      onClick={(e) => applyForQuest(e, quest)}
                      disabled={isApplying || isQuestDisabled(quest.questId)}
                      sx={{
                        color: "white",
                        padding: "0px",
                        fontSize: "12px",
                        height: "38px",
                        width: "94px",
                        borderWidth: "2px",
                        whiteSpace: "nowrap",
                        textAlign: "center"
                      }}
                      color="offWhite"
                      variant="square"
                    >
                      {isActiveQuest(quest.questId) ? "Withdraw" : "Apply"}
                    </Button> */}
                  </div>
                );
              })}
            </Box>
            <div
              style={{
                marginTop: "auto",
                marginBottom: "10px",
                width: "100%",
                display: "flex",
                justifyContent: "flex-end"
              }}
            >
              <img
                style={{
                  width: "22px",
                  height: "22px",
                  marginRight: "10px"
                }}
                src={FlipIcon}
                alt="Flip icon"
              />
            </div>
          </AutCardContainer>
        </AutCardBack>
      </Flipcard>
      {(daoData as boolean) ? (
        <Countdown>
          <Typography
            width="100%"
            textAlign="center"
            variant="subtitle2"
            mb={1}
            className="text-secondary"
          >
            Quest starts in...
          </Typography>
          <FlipClockCountdown
            digitBlockStyle={{
              fontFamily: "FractulRegular",
              width: "26px",
              height: "40px",
              fontSize: "38px"
            }}
            labelStyle={{
              fontSize: "12px",
              fontFamily: "FractulRegular"
            }}
            separatorStyle={{
              size: "4px"
            }}
            // next line should have a date thats 10 minutes from now
            to={new Date(Date.now() + 600000)}
          />
        </Countdown>
      ) : (
        <Button
          sx={{ width: "100%", mt: "45px" }}
          variant="outlined"
          size="normal"
          color="offWhite"
          onClick={flipCard}
        >
          SEE QUESTS
        </Button>
      )}
    </div>
  );
};

export default memo(NovaCard);
