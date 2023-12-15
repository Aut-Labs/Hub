import { Suspense, lazy, memo, useEffect, useMemo, useRef } from "react";
import AutLoading from "@components/AutLoading";
import { useMediaQuery, useTheme } from "@mui/material";
import PublicQuest from "./PublicQuest";
import { Route, Routes, useLocation } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useGetAllPluginDefinitionsByDAOQuery } from "@api/plugin-registry.api";
import { PluginDefinitionType } from "@aut-labs/sdk/dist/models/plugin";
import { TOOLBAR_HEIGHT } from "./ToolbarConnector";
import { useAccount } from "wagmi";
import { useSelector } from "react-redux";
import { IsAuthorised } from "@store/WalletProvider/WalletProvider";

const OpenTask = lazy(() => import("../Modules/Plugins/Task/Open/OpenTask"));

const QuizTask = lazy(() => import("../Modules/Plugins/Task/Quiz/QuizTask"));

const JoinDiscordTask = lazy(
  () => import("../Modules/Plugins/Task/JoinDiscord/JoinDiscordTask")
);
const TransactionTask = lazy(
  () => import("../Modules/Plugins/Task/Transaction/TransactionTask")
);

const QuestDetails = () => {
  const theme = useTheme();
  const ps = useRef<HTMLElement>();
  const { pathname } = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { data: plugins, isLoading } = useGetAllPluginDefinitionsByDAOQuery(
    null,
    {
      refetchOnMountOrArgChange: false,
      skip: false
    }
  );

  console.log("isLoading: ", isLoading);

  const taskPluginTypes = useMemo(() => {
    return (plugins || []).reduce((prev, curr) => {
      prev[curr.pluginDefinitionId] = curr;
      return prev;
    }, {});
  }, [plugins]);

  useEffect(() => {
    setTimeout(() => {
      if (ps?.current) {
        ps.current.scrollTop = 0;
      }
    }, 0);
  }, [pathname]);

  return (
    <PerfectScrollbar
      containerRef={(el) => (ps.current = el)}
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
      <>
        {isLoading ? (
          <AutLoading width="130px" height="130px" />
        ) : (
          <Suspense fallback={<AutLoading width="130px" height="130px" />}>
            <Routes>
              <Route index element={<PublicQuest />} />
              <Route
                path={`task/${
                  PluginDefinitionType[
                    PluginDefinitionType.OnboardingOpenTaskPlugin
                  ]
                }/:taskId`}
                element={
                  <OpenTask
                    plugin={
                      taskPluginTypes[
                        PluginDefinitionType.OnboardingOpenTaskPlugin
                      ]
                    }
                  />
                }
              />
              <Route
                path={`task/${
                  PluginDefinitionType[
                    PluginDefinitionType.OnboardingQuizTaskPlugin
                  ]
                }/:taskId`}
                element={
                  <QuizTask
                    plugin={
                      taskPluginTypes[
                        PluginDefinitionType.OnboardingQuizTaskPlugin
                      ]
                    }
                  />
                }
              />
              <Route
                path={`task/${
                  PluginDefinitionType[
                    PluginDefinitionType.OnboardingJoinDiscordTaskPlugin
                  ]
                }/:taskId`}
                element={
                  <JoinDiscordTask
                    plugin={
                      taskPluginTypes[
                        PluginDefinitionType.OnboardingJoinDiscordTaskPlugin
                      ]
                    }
                  />
                }
              />
              {/* //TODO : Check this}
              <Route
                path={`task/${
                  PluginDefinitionType[
                    PluginDefinitionType.OnboardingTransactionTaskPlugin
                  ]
                }/:taskId`}
                element={
                  <TransactionTask
                    plugin={
                      taskPluginTypes[
                        PluginDefinitionType.OnboardingTransactionTaskPlugin
                      ]
                    }
                  />
                }
              /> */}
            </Routes>
          </Suspense>
        )}
      </>
    </PerfectScrollbar>
  );
};

export default memo(QuestDetails);
