/* eslint-disable max-len */
import AutLoading from "@components/AutLoading";
import {
  Container,
  Box,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
  styled,
  FormControlLabel,
  Switch
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useEffect, useMemo, useState } from "react";
import NovaCard from "@components/NovaCard";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ConnectStatus,
  IsAuthenticated,
  changeConnectStatus
} from "@auth/auth.reducer";
import { CacheTypes } from "@api/cache.api";
import { communityUpdateState } from "@store/Community/community.reducer";
import { useAppDispatch } from "@store/store.model";
import {
  useApplyForQuestMutation,
  useGetPhasesCacheQuery,
  useUpdatePhasesCacheMutation
} from "@api/onboarding.api";
import { useEthers } from "@usedapp/core";
import ErrorDialog from "@components/Dialog/ErrorPopup";
import SuccessDialog from "@components/Dialog/SuccessPopup";
import { useGetAllNovasQuery } from "@api/community.api";
import { TOOLBAR_HEIGHT } from "./ToolbarConnector";
import { addDays } from "date-fns";
import { Quest } from "@aut-labs-private/sdk";

export const GridBox = styled(Box)(({ theme }) => ({
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  gridGap: "20px",
  marginTop: "20px",
  [theme.breakpoints.up("sm")]: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr"
  },
  [theme.breakpoints.up("md")]: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr"
  }
}));

export const DaoList = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [selectedQuest, setSelectedQuest] = useState(null);
  const [questToApply, setQuestToApply] = useState<
    Quest & { onboardingQuestAddress: string; daoAddress: string }
  >(null);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [openApplySuccess, setOpenApplySuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const connectStatus = useSelector(ConnectStatus);
  const isAuthenticated = useSelector(IsAuthenticated);
  const [showExpired, setShowExpired] = useState(false);
  const theme = useTheme();
  const { account } = useEthers();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { data, isLoading, isFetching } = useGetAllNovasQuery(null, {
    refetchOnMountOrArgChange: true,
    skip: false
  });

  const { data: cache, refetch: refetchCache } = useGetPhasesCacheQuery(
    { cacheKey: CacheTypes.UserPhases, account },
    {
      refetchOnMountOrArgChange: true,
      skip: false
    }
  );

  const daoListArranged = useMemo(() => {
    let result = [];
    if (cache && cache.daoAddress && data) {
      let filteredExpiredDaos = [...data.daos];
      if (!showExpired) {
        filteredExpiredDaos = filteredExpiredDaos.filter((d) =>
          d.properties.quests.every((q) => q.isExpired === false)
        );
      }
      const dao = filteredExpiredDaos.find(
        (dao) => dao.daoAddress === cache.daoAddress
      );
      const dataWithoutDao = filteredExpiredDaos.filter(
        (dao) => dao.daoAddress !== cache.daoAddress
      );
      result = [dao, ...dataWithoutDao];
    } else {
      if (data?.daos) {
        result = data?.daos;
      } else {
        result = [];
      }
    }
    let filteredExpiredDaos = [...result];
    if (!showExpired) {
      filteredExpiredDaos = filteredExpiredDaos.filter((d) =>
        d.properties.quests.every((q) => q.isExpired === false)
      );
    }
    return { daos: [...filteredExpiredDaos] };
  }, [showExpired, cache, data, isAuthenticated]);

  const [apply, { isLoading: isApplying, isError, error, reset, isSuccess }] =
    useApplyForQuestMutation();

  const [updatePhasesCache] = useUpdatePhasesCacheMutation();

  useEffect(() => {
    if (isAuthenticated) {
      refetchCache();
    }
  }, [isAuthenticated]);

  const highlightData = (daoAddress) => {
    if (cache && cache.daoAddress && cache.questId) {
      if (cache.daoAddress === daoAddress) {
        return {
          daoAddress: cache.daoAddress,
          highlighted: true,
          questId: cache.questId
        };
      } else {
        return {
          daoAddress: cache.daoAddress,
          highlighted: false,
          questId: cache.questId
        };
      }
    } else {
      return {
        daoAddress: null,
        highlighted: searchParams.get("daoAddress") === daoAddress,
        questId: null
      };
    }
  };

  //show quest details
  const questDetails = async (quest) => {
    setSelectedQuest(quest);
  };

  useEffect(() => {
    if ((questToApply || selectedQuest) && connectStatus === "disconnected") {
      setSelectedQuest(null);
      setQuestToApply(null);
    }
    if (connectStatus === "disconnected" && !questToApply && !selectedQuest) {
      dispatch(changeConnectStatus("initial"));
    }
  }, [connectStatus, selectedQuest, questToApply]);

  useEffect(() => {
    const navigateToQuest = async () => {
      await dispatch(
        communityUpdateState({
          selectedCommunityAddress: selectedQuest.daoAddress
        })
      );
      navigate({
        pathname: "/quest",
        search: new URLSearchParams({
          questId: selectedQuest.questId,
          onboardingQuestAddress: selectedQuest.onboardingQuestAddress,
          daoAddress: selectedQuest.daoAddress
        }).toString()
      });
      setSelectedQuest(null);
    };
    const start = async () => {
      if (selectedQuest && connectStatus === "connected") {
        navigateToQuest();
      } else if (selectedQuest && connectStatus === "initial") {
        dispatch(changeConnectStatus("start"));
      }
    };
    start();
  }, [connectStatus, selectedQuest]);

  const applyForQuest = async (
    quest: Quest & { onboardingQuestAddress: string; daoAddress: string }
  ) => {
    setQuestToApply(quest);
  };

  // useEffect(() => {
  //   dispatch(resetState);
  // }, []);

  // useEffect(() => {
  //   if (questToApply && connectStatus === "disconnected") {
  //     setQuestToApply(null);
  //   }
  //   if (connectStatus === "disconnected" && !questToApply) {
  //     dispatch(changeConnectStatus("initial"));
  //   }
  // }, [connectStatus, questToApply]);

  useEffect(() => {
    const applyToQuest = async () => {
      await dispatch(
        communityUpdateState({
          selectedCommunityAddress: questToApply.daoAddress
        })
      );
      apply({
        onboardingQuestAddress: questToApply.onboardingQuestAddress,
        questId: +questToApply.questId
      });
    };
    const start = async () => {
      if (questToApply && connectStatus === "connected") {
        applyToQuest();
      } else if (questToApply && connectStatus === "initial") {
        dispatch(changeConnectStatus("start"));
      }
    };
    start();
  }, [connectStatus, questToApply]);

  useEffect(() => {
    if (isSuccess) {
      setOpenApplySuccess(true);
      const start = async () => {
        try {
          const communityData = data.daos.find(
            (d) => d.daoAddress === questToApply.daoAddress
          );
          const updatedCache = {
            ...(cache || {}),
            cacheKey: CacheTypes.UserPhases,
            address: account,
            questId: questToApply.questId,
            onboardingQuestAddress: questToApply.onboardingQuestAddress,
            startDate: questToApply.startDate,
            endDate: `${addDays(
              questToApply.startDate,
              questToApply.durationInDays
            ).getTime()}`,
            daoAddress: questToApply.daoAddress,
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
          };
          updatePhasesCache(updatedCache);
          reset();
        } catch (error) {
          console.log(error);
        }
      };
      start();
    }
  }, [isSuccess]);

  return (
    <PerfectScrollbar
      style={{
        ...(isMobile && {
          marginTop: `${TOOLBAR_HEIGHT + 70}px`,
          height: `calc(100% - ${TOOLBAR_HEIGHT + 70 + "px"})`
        }),
        ...(!isMobile && {
          marginTop: `${TOOLBAR_HEIGHT}px`,
          height: `calc(100% - ${TOOLBAR_HEIGHT + "px"})`
        }),
        display: "flex",
        flexDirection: "column"
      }}
    >
      <Container maxWidth="lg" sx={{ py: "20px" }}>
        <ErrorDialog
          handleClose={() => reset()}
          open={isError}
          message={error}
        />
        <SuccessDialog
          open={openApplySuccess}
          message="Congrats!"
          titleVariant="h2"
          subtitle="Whoop! You successfully applied for the quest!"
          subtitleVariant="subtitle1"
          handleClose={() => {
            setOpenApplySuccess(false);
          }}
        ></SuccessDialog>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            position: "relative"
          }}
        >
          <Typography
            fontFamily="FractulAltLight"
            textAlign="center"
            color="white"
            variant="h1"
          >
            Nova Showcase
          </Typography>
          <Typography
            fontFamily="FractulAltLight"
            textAlign="center"
            color="white"
            variant="h4"
          >
            Pick a Nova, complete their onboarding quest and join their
            community to help them rise up the Nova leaderboard
          </Typography>
        </Box>

        {!isLoading && !(data?.daos || [])?.length && (
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
            <Typography color="rgb(107, 114, 128)" variant="subtitle2">
              No Novas were found...
            </Typography>
            <Button
              size="medium"
              component="span"
              color="offWhite"
              startIcon={<RefreshIcon />}
              sx={{
                ml: 1
              }}
              disabled={isLoading || isFetching}
              // onClick={refetch}
            >
              Refresh
            </Button>
          </Box>
        )}

        {isLoading ? (
          <AutLoading width="130px" height="130px" />
        ) : (
          <>
            {(data?.daos || [])?.length && (
              <Box
                sx={{
                  display: "flex",
                  mt: 4,
                  alignItems: "center",
                  justifyContent: "flex-end"
                }}
              >
                <FormControlLabel
                  sx={{
                    color: "white"
                  }}
                  onChange={(_, checked) => setShowExpired(checked)}
                  control={<Switch checked={showExpired} color="primary" />}
                  label="Show expired Novas"
                />
              </Box>
            )}
            <GridBox sx={{ flexGrow: 1, mt: 4 }}>
              {(daoListArranged?.daos || []).map((dao, index) => (
                <NovaCard
                  key={`nova-card-${index}`}
                  daoData={dao}
                  highlightData={highlightData(dao.daoAddress)}
                  onQuestSelected={questDetails}
                  onApplyForQuest={applyForQuest}
                  questToApplyFor={questToApply}
                  isApplying={isApplying}
                />
              ))}
            </GridBox>
          </>
        )}
      </Container>
    </PerfectScrollbar>
  );
};
