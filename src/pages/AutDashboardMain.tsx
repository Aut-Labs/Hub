import { Navigate, Route, Routes } from "react-router-dom";
import SidebarDrawer from "@components/Sidebar/Sidebar";
import Dashboard from "./Dashboard/Dashboard";
import Members from "./Members/Members";
import { useGetAllPluginDefinitionsByDAOQuery } from "@api/plugin-registry.api";
import { Suspense, memo, useMemo } from "react";
import { ReactComponent as StackIcon } from "@assets/aut/stack.svg";
import AutLoading from "@components/AutLoading";
import { pluginRoutes } from "./Modules/Shared/routes";
import Modules from "./Modules/Modules";
import { useSelector } from "react-redux";
import { IsAdmin } from "@store/Community/community.reducer";
import useBreadcrumbs from "use-react-router-breadcrumbs";

const AutDashboardMain = () => {
  const breadcrumbs = useBreadcrumbs();
  const isAdmin = useSelector(IsAdmin);
  const { data: plugins, isLoading } = useGetAllPluginDefinitionsByDAOQuery(
    null,
    {
      refetchOnMountOrArgChange: false,
      skip: false
    }
  );

  // const modules = useMemo(() => {
  //   // const { allRoutes, menuItems } = pluginRoutes(plugins || [], isAdmin);
  //   return {
  //     menuItem: {
  //       title: "Modules",
  //       route: "modules",
  //       exact: true,
  //       icon: StackIcon,
  //       children: menuItems
  //     },
  //     routes: allRoutes
  //   };
  // }, [plugins, isAdmin]);

  return (
    <>
      {isLoading ? (
        <AutLoading />
      ) : (
        <SidebarDrawer addonMenuItems={[]}>
          {/* <Suspense fallback={<AutLoading />}>
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="members" element={<Members />} />
              <Route path="modules" element={<Modules />} />
              {modules.routes.map((r) => r)}
              <Route path="*" element={<Navigate to="/aut-dashboard" />} />
            </Routes>
          </Suspense> */}
        </SidebarDrawer>
      )}
    </>
  );
};

export default memo(AutDashboardMain);
