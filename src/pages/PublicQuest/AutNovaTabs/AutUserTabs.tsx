import AutOsTabs from "@components/AutOsTabs";
import { CommunityTasksTable } from "../NovaDetails";

const AutUserTabs = () => {
  const tabs = [
    {
      label: "Retroactive",
      props: {
        tasks: [
          {
            name: "Write a Blog Post",
            description:
              "Contribute to our blog by sharing your insights on the latest crypto trends and developments.",
            startDate: new Date("2022-01-01"),
            endDate: new Date("2022-01-05"),
            role: "Tech"
          },
          {
            name: "Code Review Session",
            description:
              "Help review and optimize a fellow developer's smart contract. Your expertise is valuable to the community.",
            startDate: new Date("2022-02-01"),
            endDate: new Date("2022-02-10"),
            role: "Art"
          },
          {
            name: "Task 3",
            description: "Description for task 3",
            startDate: new Date("2022-03-01"),
            endDate: new Date("2022-03-10"),
            role: "Marketing"
          },
          {
            name: "Task 4",
            description: "Description for task 4",
            startDate: new Date("2022-04-01"),
            endDate: new Date("2022-04-10"),
            role: "Tech"
          },
          {
            name: "Task 5",
            description: "Description for task 5",
            startDate: new Date("2022-05-01"),
            endDate: new Date("2022-05-10"),
            role: "Art"
          }
        ]
      },
      component: CommunityTasksTable
    },
    {
      label: "Retroactive",
      props: {
        tasks: [
          {
            name: "Write a Blog Post",
            description:
              "Contribute to our blog by sharing your insights on the latest crypto trends and developments.",
            startDate: new Date("2022-01-01"),
            endDate: new Date("2022-01-05"),
            role: "Tech"
          },
          {
            name: "Code Review Session",
            description:
              "Help review and optimize a fellow developer's smart contract. Your expertise is valuable to the community.",
            startDate: new Date("2022-02-01"),
            endDate: new Date("2022-02-10"),
            role: "Art"
          },
          {
            name: "Task 3",
            description: "Description for task 3",
            startDate: new Date("2022-03-01"),
            endDate: new Date("2022-03-10"),
            role: "Marketing"
          },
          {
            name: "Task 4",
            description: "Description for task 4",
            startDate: new Date("2022-04-01"),
            endDate: new Date("2022-04-10"),
            role: "Tech"
          },
          {
            name: "Task 5",
            description: "Description for task 5",
            startDate: new Date("2022-05-01"),
            endDate: new Date("2022-05-10"),
            role: "Art"
          }
        ]
      },
      component: CommunityTasksTable
    }
  ];
  return (
    <>
      <AutOsTabs tabs={tabs}></AutOsTabs>
    </>
  );
};

export default AutUserTabs;
