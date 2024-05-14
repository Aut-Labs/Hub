import AutOsTabs from "@components/AutOsTabs";
import { EmptyNovaOnboardingCards, NovaTasksGrid } from "../NovaDetails";
import { useMemo } from "react";
import Archetypes from "./Archetype/Archetype";
import { useAccount } from "wagmi";
import { useSearchParams } from "react-router-dom";

interface AutTaskTabsProps {
  nova: any;
  tasks: any[];
  selectedTab: any;
}

const AutTaskTabs = ({ nova, tasks, selectedTab }: AutTaskTabsProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const handleTabChange = (index: number) => {
    const tabRoute = index === 0 ? "archetype" : "roles";
    setSearchParams({ tab: tabRoute }, { replace: true });
  };
  const { address } = useAccount();
  const canSetArchetype = useMemo(() => {
    if (
      nova?.properties?.userData?.isAdmin ||
      address === nova?.properties?.deployer
    ) {
      return true;
    }
  }, [nova, address]);

  const tabs = useMemo(() => {
    const _tabs: any[] = [];
    _tabs.push({
      label: "Archetypes",
      props: {
        nova
      },
      component: Archetypes
    });
    if (tasks) {
      _tabs.push({
        label: "Tasks",
        props: {
          tasks
        },
        component: NovaTasksGrid
      });
    } else {
      const roles = nova?.properties?.roles;
      _tabs.push({
        label: "Roles",
        props: {
          roles
        },
        component: EmptyNovaOnboardingCards
      });
    }
    return _tabs;
  }, [nova, tasks]);

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

export default AutTaskTabs;
