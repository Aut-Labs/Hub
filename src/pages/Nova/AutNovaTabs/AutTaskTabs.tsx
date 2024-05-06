import AutOsTabs from "@components/AutOsTabs";
import { EmptyNovaOnboardingCards, NovaTasksGrid } from "../NovaDetails";
import { useMemo } from "react";
import Archetypes from "./Archetype/Archetype";

interface AutTaskTabsProps {
  nova: any;
  tasks: any[];
}

const AutTaskTabs = ({ nova, tasks }: AutTaskTabsProps) => {
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

  // useEffect(() => {
  //   console.log("novaDetails", novaDetails);
  //   console.log("tasks", tasks);
  // }
  // const tabs = [
  //   {
  //     label: "Tech",
  //     props: {
  //       tasks: [
  //         {
  //           name: "Write a Blog Post",
  //           description:
  //             "Contribute to our blog by sharing your insights on the latest crypto trends and developments.",
  //           startDate: new Date("2022-01-01"),
  //           endDate: new Date("2022-01-05"),
  //           role: "Tech"
  //         },
  //         {
  //           name: "Code Review Session",
  //           description:
  //             "Help review and optimize a fellow developer's smart contract. Your expertise is valuable to the community.",
  //           startDate: new Date("2022-02-01"),
  //           endDate: new Date("2022-02-10"),
  //           role: "Tech"
  //         },
  //         {
  //           name: "Task 3",
  //           description: "Description for task 3",
  //           startDate: new Date("2022-03-01"),
  //           endDate: new Date("2022-03-10"),
  //           role: "Tech"
  //         }
  //       ]
  //     },
  //     component: NovaTasksGrid
  //   },
  //   {
  //     label: "Art",
  //     props: {
  //       tasks: [
  //         {
  //           name: "Write a Blog Post",
  //           description:
  //             "Contribute to our blog by sharing your insights on the latest crypto trends and developments.",
  //           startDate: new Date("2022-01-01"),
  //           endDate: new Date("2022-01-05"),
  //           role: "Art"
  //         },
  //         {
  //           name: "Code Review Session",
  //           description:
  //             "Help review and optimize a fellow developer's smart contract. Your expertise is valuable to the community.",
  //           startDate: new Date("2022-02-01"),
  //           endDate: new Date("2022-02-10"),
  //           role: "Art"
  //         },
  //         {
  //           name: "Task 3",
  //           description: "Description for task 3",
  //           startDate: new Date("2022-03-01"),
  //           endDate: new Date("2022-03-10"),
  //           role: "Art"
  //         },
  //         {
  //           name: "Task 4",
  //           description: "Description for task 4",
  //           startDate: new Date("2022-04-01"),
  //           endDate: new Date("2022-04-10"),
  //           role: "Art"
  //         }
  //       ]
  //     },
  //     component: NovaTasksGrid
  //   },
  //   {
  //     label: "Marketing",
  //     props: {
  //       tasks: [
  //         {
  //           name: "Write a Blog Post",
  //           description:
  //             "Contribute to our blog by sharing your insights on the latest crypto trends and developments.",
  //           startDate: new Date("2022-01-01"),
  //           endDate: new Date("2022-01-05"),
  //           role: "Marketing"
  //         },
  //         {
  //           name: "Code Review Session",
  //           description:
  //             "Help review and optimize a fellow developer's smart contract. Your expertise is valuable to the community.",
  //           startDate: new Date("2022-02-01"),
  //           endDate: new Date("2022-02-10"),
  //           role: "Marketing"
  //         },
  //         {
  //           name: "Task 3",
  //           description: "Description for task 3",
  //           startDate: new Date("2022-03-01"),
  //           endDate: new Date("2022-03-10"),
  //           role: "Art"
  //         }
  //       ]
  //     },
  //     component: NovaTasksGrid
  //   }
  // ];
  return (
    <>
      <AutOsTabs tabs={tabs}></AutOsTabs>
    </>
  );
};

export default AutTaskTabs;
