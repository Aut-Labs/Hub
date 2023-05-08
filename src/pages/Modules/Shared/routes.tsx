import { PluginDefinition } from "@aut-labs-private/sdk";
import React, { lazy } from "react";
import { Route } from "react-router-dom";
import { SidebarMenuItem } from "@components/Sidebar/MenuItems";
import ExtensionIcon from "@mui/icons-material/Extension";
import {
  ModuleDefinition,
  PluginDefinitionType
} from "@aut-labs-private/sdk/dist/models/plugin";
import { ReactComponent as SubStackIcon } from "@assets/aut/sub-stack.svg";
import Submissions from "../Plugins/Task/Shared/Submissions";

const Plugins = lazy(() => import("./Plugins"));

/* Quest */
const Quests = lazy(() => import("../Plugins/Onboarding/Quest/Quests"));
const CreateQuest = lazy(
  () => import("../Plugins/Onboarding/Quest/CreateQuest")
);
const Quest = lazy(() => import("../Plugins/Onboarding/Quest/Quest"));

/* Task Types */
const OpenTasks = lazy(() => import(`../Plugins/Task/Open/OpenTasks`));
const OpenTask = lazy(() => import("../Plugins/Task/Open/OpenTask"));
const CreateOpenTask = lazy(
  () => import("../Plugins/Task/Open/CreateOpenTask")
);

const QuizTasks = lazy(() => import("../Plugins/Task/Quiz/QuizTasks"));
const QuizTask = lazy(() => import("../Plugins/Task/Quiz/QuizTask"));
const CreateQuizTask = lazy(
  () => import("../Plugins/Task/Quiz/CreateQuizTask")
);

const JoinDiscordTasks = lazy(
  () => import("../Plugins/Task/JoinDiscord/JoinDiscordTasks")
);
const JoinDiscordTask = lazy(
  () => import("../Plugins/Task/JoinDiscord/JoinDiscordTask")
);
const CreateJoinDiscordTask = lazy(
  () => import("../Plugins/Task/JoinDiscord/CreateJoinDiscordTask")
);

const TransactionTasks = lazy(
  () => import("../Plugins/Task/Transaction/TransactionTasks")
);
const TransactionTask = lazy(
  () => import("../Plugins/Task/Transaction/TransactionTask")
);
const CreateTransactionTask = lazy(
  () => import("../Plugins/Task/Transaction/CreateTransactionTask")
);

export const pluginRoutes = (
  plugins: PluginDefinition[],
  modules: ModuleDefinition[],
  isAdmin: boolean
): {
  menuItems: SidebarMenuItem[];
  allRoutes: React.ReactElement[];
} => {
  if (!modules.length || !plugins.length) {
    return {
      menuItems: [],
      allRoutes: []
    };
  }

  return plugins.reduce(
    (prev, plugin) => {
      if (!plugin?.metadata?.properties) return prev;
      const moduleType = plugin.metadata.properties.module.type;
      const modulePath = `modules/${moduleType}`;
      const moduleDefinition = modules.find(
        (m) => m.metadata.properties.type === moduleType
      );

      if (!moduleDefinition.isActivated) return prev;

      if (!prev.taskTypesMainMenu[moduleType]) {
        prev.allRoutes.push(
          <Route
            key={modulePath}
            path={modulePath}
            element={<Plugins definition={plugin.metadata} />}
          />
        );

        if (moduleDefinition.id === 1) {
          // for now we will ignore Task module menu
          const mainMenu = {
            title: plugin.metadata.properties.module.title,
            route: modulePath,
            icon: SubStackIcon,
            exact: true,
            children: []
          };
          prev.menuItems.push(mainMenu);
          prev.taskTypesMainMenu[moduleType] = mainMenu;
        }
      }
      if (!plugin.pluginAddress) return prev;

      if (plugin.pluginAddress) {
        const mainMenu = prev.taskTypesMainMenu[moduleType];
        const path = `${modulePath}/${
          PluginDefinitionType[plugin.pluginDefinitionId]
        }`;

        if (mainMenu) {
          const childMenuItem: SidebarMenuItem = {
            icon: ExtensionIcon,
            title: plugin.metadata.properties.title,
            route: path,
            children: []
          };
          mainMenu.children.push(childMenuItem);
        }
        switch (plugin.pluginDefinitionId) {
          case PluginDefinitionType.QuestOnboardingPlugin:
            if (isAdmin) {
              prev.allRoutes.push(
                <Route
                  key={`${path}/create`}
                  path={`${path}/create`}
                  element={<CreateQuest plugin={plugin} />}
                />
              );
            }
            prev.allRoutes.push(
              <Route
                key={path}
                path={path}
                element={<Quests plugin={plugin} />}
              />,
              <Route
                key={`${path}/:questId`}
                path={`${path}/:questId`}
                element={<Quest plugin={plugin} />}
              />
            );

            break;
          case PluginDefinitionType.OnboardingOpenTaskPlugin:
            if (isAdmin) {
              prev.allRoutes.push(
                <Route
                  key={path}
                  path={path}
                  element={<OpenTasks plugin={plugin} />}
                />,
                <Route
                  key={`${path}/create`}
                  path={`${path}/create`}
                  element={<CreateOpenTask plugin={plugin} />}
                />
              );
            }
            prev.allRoutes.push(
              <Route
                key={`${path}/:taskId`}
                path={`${path}/:taskId`}
                element={<OpenTask plugin={plugin} />}
              />,
              <Route
                key={`${path}/:taskId/submissions`}
                path={`${path}/:taskId/submissions`}
                element={<Submissions plugin={plugin} />}
              />
            );

            break;
          case PluginDefinitionType.OnboardingTransactionTaskPlugin:
            if (isAdmin) {
              prev.allRoutes.push(
                <Route
                  key={path}
                  path={path}
                  element={<TransactionTasks plugin={plugin} />}
                />,
                <Route
                  key={`${path}/create`}
                  path={`${path}/create`}
                  element={<CreateTransactionTask plugin={plugin} />}
                />
              );
            }
            prev.allRoutes.push(
              <Route
                key={`${path}/:taskId`}
                path={`${path}/:taskId`}
                element={<TransactionTask plugin={plugin} />}
              />
            );
            break;
          case PluginDefinitionType.OnboardingJoinDiscordTaskPlugin:
            if (isAdmin) {
              prev.allRoutes.push(
                <Route
                  key={path}
                  path={path}
                  element={<JoinDiscordTasks plugin={plugin} />}
                />,
                <Route
                  key={`${path}/create`}
                  path={`${path}/create`}
                  element={<CreateJoinDiscordTask plugin={plugin} />}
                />
              );
            }
            prev.allRoutes.push(
              <Route
                key={`${path}/:taskId`}
                path={`${path}/:taskId`}
                element={<JoinDiscordTask plugin={plugin} />}
              />
            );
            break;
          case PluginDefinitionType.OnboardingQuizTaskPlugin:
            if (isAdmin) {
              prev.allRoutes.push(
                <Route
                  key={path}
                  path={path}
                  element={<QuizTasks plugin={plugin} />}
                />,
                <Route
                  key={`${path}/create`}
                  path={`${path}/create`}
                  element={<CreateQuizTask plugin={plugin} />}
                />
              );
            }
            prev.allRoutes.push(
              <Route
                key={`${path}/:taskId`}
                path={`${path}/:taskId`}
                element={<QuizTask plugin={plugin} />}
              />
            );
            break;
        }
      }

      return prev;
    },
    {
      taskTypesMainMenu: {},
      menuItems: [],
      allRoutes: []
    }
  );
};
