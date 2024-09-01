import AutOsTabs from "@components/AutOsTabs";
import { HubRoles, HubTasksGrid } from "../HubDetails";
import { memo, useMemo } from "react";
import Archetypes from "./Archetype/Archetype";
import { useSearchParams } from "react-router-dom";
import { HubOSHub } from "@api/hub.model";

interface AutTaskTabsProps {
  hub: HubOSHub;
  tasks: any[];
  selectedTab: any;
}

const AutTaskTabs = ({ hub, tasks, selectedTab }: AutTaskTabsProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const handleTabChange = (index: number) => {
    const tabRoute = index === 0 ? "archetype" : "roles";
    setSearchParams({ tab: tabRoute }, { replace: true });
  };

  const tabs = useMemo(() => {
    const _tabs: any[] = [];
    _tabs.push({
      label: "Archetypes",
      props: {
        hub
      },
      component: Archetypes
    });
    if (tasks) {
      _tabs.push({
        label: "Tasks",
        props: {
          tasks
        },
        component: HubTasksGrid
      });
    } else {
      _tabs.push({
        label: "Roles",
        props: {
          hub
        },
        component: HubRoles
      });
    }
    return _tabs;
  }, [hub, tasks]);

  return (
    <>
      <AutOsTabs
        selectedTabIndex={selectedTab}
        selectedTab={handleTabChange}
        tabs={tabs}
      ></AutOsTabs>
    </>
  );
};

export default memo(AutTaskTabs);
