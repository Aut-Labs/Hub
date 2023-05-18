import { Suspense, lazy, memo, useMemo } from "react";
import AutLoading from "@components/AutLoading";
import { useMediaQuery, useTheme } from "@mui/material";
import PublicQuest from "./PublicQuest";
import { Route, Routes } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useGetAllPluginDefinitionsByDAOQuery } from "@api/plugin-registry.api";
import { PluginDefinitionType } from "@aut-labs-private/sdk/dist/models/plugin";

const TOOLBAR_HEIGHT = 84;

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
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const {
    data: plugins,
    isLoading,
    isFetching,
    refetch
  } = useGetAllPluginDefinitionsByDAOQuery(null, {
    refetchOnMountOrArgChange: false,
    skip: false
  });

  const taskPluginTypes = useMemo(() => {
    return (plugins || []).reduce((prev, curr) => {
      prev[curr.pluginDefinitionId] = curr;
      return prev;
    }, {});
  }, [plugins]);

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
      <>
        {!plugins?.length ? (
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
              />
            </Routes>
          </Suspense>
        )}
      </>
    </PerfectScrollbar>
  );
};

export default memo(QuestDetails);
