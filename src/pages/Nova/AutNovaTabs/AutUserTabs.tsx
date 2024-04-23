import AutOsTabs from "@components/AutOsTabs";
import { CommunityTasksTable } from "../NovaDetails";
import { useEffect, useMemo } from "react";
import Archetypes from "./Archetype/Archetype";

interface AutTaskTabsProps {
  nova: any;
  tasks: any[];
}

const AutTaskTabs = ({ nova, tasks }: AutTaskTabsProps) => {
  const tabs = useMemo(() => {
    const tabs = [
      {
        label: "Archetypes",
        props: {
          tasks: []
        },
        component: Archetypes
      }
    ];
    if (tasks) {
      for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        if (!tabs.find((t) => t.label === task.role)) {
          tabs.push({
            label: task.role,
            props: {
              tasks: tasks.filter((t) => t.role === task.role)
            },
            component: CommunityTasksTable as any
          });
        }
      }
    }
    return tabs;
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
  //     component: CommunityTasksTable
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
  //     component: CommunityTasksTable
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
  //     component: CommunityTasksTable
  //   }
  // ];
  return (
    <>
      <AutOsTabs tabs={tabs}></AutOsTabs>
    </>
  );
};

export default AutTaskTabs;
