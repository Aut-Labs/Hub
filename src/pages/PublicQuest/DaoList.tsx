import AutLoading from "@components/AutLoading";
import {
  Container,
  Box,
  Typography,
  Tooltip,
  IconButton,
  Button,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { GridBox } from "../Modules/Plugins/Task/Quiz/QuestionsAndAnswers";
import RefreshIcon from "@mui/icons-material/Refresh";
import PerfectScrollbar from "react-perfect-scrollbar";
import { PluginDefinitionCard } from "../Modules/Shared/PluginCard";
import { useEffect, useState } from "react";
import { useGetAllNovasQuery } from "@api/community.api";
import NovaCard from "@components/NovaCard";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ConnectStatus,
  changeConnectStatus,
  isAuthenticated
} from "@auth/auth.reducer";
import { CacheModel, CacheTypes, getCache, updateCache } from "@api/cache.api";
import { communityUpdateState } from "@store/Community/community.reducer";
import { useAppDispatch } from "@store/store.model";

const TOOLBAR_HEIGHT = 84;

export const DaoList = () => {
  //
  const connectStatus = useSelector(ConnectStatus);
  const dispatch = useAppDispatch();
  const [selectedQuest, setSelectedQuest] = useState(null);
  const [questToApply, setQuestToApply] = useState(null);
  const navigate = useNavigate();
  //apply

  const [
    apply,
    { data, isLoading: isApplying, isError, error, reset, isSuccess }
  ] = useApplyForQuestMutation();
  //
  const [searchParams, setSearchParams] = useSearchParams();
  const authenticated = useSelector(isAuthenticated);
  const theme = useTheme();
  const account = useEthers().account;
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { data, isLoading, isFetching, refetch } = useGetAllNovasQuery(null, {
    refetchOnMountOrArgChange: true,
    skip: false
  });
  const [cache, setCache] = useState<CacheModel>(null);

  useEffect(() => {
    console.log(data);
  }, [data]);

  useEffect(() => {
    const fetchCache = async () => {
      const cache = await getCache(CacheTypes.UserPhases);
      setCache(cache);
    };
    if (authenticated) {
      fetchCache();
    }
  }, [authenticated]);

  // const checkIsHighlighted = (daoAddress) => {
  //   let highlightedDaoCache;
  //   if (highlightedDaoCache?.daoAddress) {
  //     return {
  //       highlighted: highlightedDaoCache?.daoAddress === daoAddress,
  //       questId: highlightedDaoCache.questId
  //     };
  //   }
  //   return {
  //     highlighted: searchParams.get("dao") === daoAddress,
  //     questId: null
  //   };
  // };

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
        highlighted: false,
        questId: null
      };
    }
  };

  //show quest details
  const questDetails = async (quest) => {
    setSelectedQuest(quest);
  };

  useEffect(() => {
    if (selectedQuest && connectStatus === "disconnected") {
      setSelectedQuest(null);
    }
    if (connectStatus === "disconnected" && !selectedQuest) {
      dispatch(changeConnectStatus("initial"));
    }
  }, [connectStatus, selectedQuest]);

  useEffect(() => {
    const navigateToQuest = async () => {
      await dispatch(
        communityUpdateState({
          selectedCommunityAddress: selectedQuest.daoAddress
        })
      );
      navigate({
        pathname: "/quest",
        search: `?questId=${selectedQuest.questId}&onboardingQuestAddress=${selectedQuest.onboardingQuestAddress}&daoAddress=${selectedQuest.daoAddress}`
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
  //apply
  const applyForQuest = async (quest) => {
    setSelectedQuest(quest);
  };

  useEffect(() => {
    if (selectedQuest && connectStatus === "disconnected") {
      setQuestToApply(null);
    }
    if (connectStatus === "disconnected" && !questToApply) {
      dispatch(changeConnectStatus("initial"));
    }
  }, [connectStatus, questToApply]);

  useEffect(() => {
    const navigateToQuest = async () => {
      await dispatch(
        communityUpdateState({
          selectedCommunityAddress: questToApply.daoAddress
        })
      );
      navigate({
        pathname: "/quest",
        search: `?questId=${questToApply.questId}&onboardingQuestAddress=${questToApply.onboardingQuestAddress}&daoAddress=${questToApply.daoAddress}`
      });
      setQuestToApply(null);
    };
    const start = async () => {
      if (questToApply && connectStatus === "connected") {
        navigateToQuest();
      } else if (questToApply && connectStatus === "initial") {
        dispatch(changeConnectStatus("start"));
      }
    };
    start();
  }, [connectStatus, questToApply]);

  useEffect(() => {
    if (isSuccess) {
      const start = async () => {
        try {
          const updatedCache = await updateCache({
            ...(cache || {}),
            cacheKey: CacheTypes.UserPhases,
            address: account,
            questId: questToApply.questId,
            onboardingQuestAddress: questToApply.onboardingQuestAddress,
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
          });
          setCache(updatedCache);
          // onUpdateCache(updatedCache);
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            position: "relative"
          }}
        >
          <Typography textAlign="center" color="white" variant="h1">
            Nova Showcase
          </Typography>
          <Typography textAlign="center" color="white" variant="h4">
            Pick a Nova, complete their onboarding quest and join their
            community to help them rise up the Nova leaderboard
          </Typography>
        </Box>

        {!isLoading && !data.daos?.length && (
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
              No modules were found...
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
              onClick={refetch}
            >
              Refresh
            </Button>
          </Box>
        )}

        {isLoading ? (
          <AutLoading width="130px" height="130px" />
        ) : (
          <>
            <GridBox sx={{ flexGrow: 1, mt: 4 }}>
              {data.daos.map((dao, index) => (
                <NovaCard
                  key={`nova-card-${index}`}
                  onUpdateCache={setCache}
                  daoData={dao}
                  cache={cache}
                  highlightData={highlightData(dao.daoAddress)}
                  onQuestSelected={questDetails}
                  onApplyForQuest={applyForQuest}
                />
              ))}
            </GridBox>
          </>
        )}
      </Container>
    </PerfectScrollbar>
  );
};
