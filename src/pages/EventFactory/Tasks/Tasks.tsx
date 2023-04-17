import { Box, CircularProgress, Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { resetActivityTaskState } from "@store/Activity/task.reducer";
import { Link } from "react-router-dom";
import SwTabs from "@components/AutTabs/AutTabs";
import AddIcon from "@mui/icons-material/Add";
import {
  TasksRefreshStatus,
  TasksSelectedTab,
  TasksStatus,
  tasksUpdateSelectedTab,
  tasksUpdateStatus
} from "@store/Activity/tasks.reducer";
import { pxToRem } from "@utils/text-size";
import { getAllTasks, takeActivityTask } from "@api/activities.api";
import { Task, TaskTypes } from "@store/model";
import { ActivityTypes } from "@api/api.model";
import { useAppDispatch } from "@store/store.model";
import ErrorDialog from "@components/Dialog/ErrorPopup";
import LoadingDialog from "@components/Dialog/LoadingPopup";
import { ResultState } from "@store/result-status";
import TasksList from "./TasksList";
import "./Tasks.scss";

const Tasks = () => {
  const [tabs, setTabs] = useState([]);
  const [message, setLoadingMessage] = useState("");
  const dispatch = useAppDispatch();
  const selectedTabIndex = useSelector(TasksSelectedTab);
  const status = useSelector(TasksStatus);
  const refreshStatus = useSelector(TasksRefreshStatus);

  const handleDialogClose = () => {
    dispatch(tasksUpdateStatus(ResultState.Idle));
  };

  useEffect(() => {
    const handleTask = async (s: TaskTypes, task: Task) => {
      switch (s) {
        case TaskTypes.Open:
          setLoadingMessage("Claiming task...");
          await dispatch(takeActivityTask(task));
          break;
        default:
          break;
      }
    };
    setTabs([
      {
        label: "Open Tasks",
        hideTop: true,
        props: {
          status: TaskTypes.Open,
          handleTask
        },
        component: TasksList
      },
      {
        label: "Ongoing Tasks",
        hideTop: true,
        props: {
          status: TaskTypes.Ongoing,
          handleTask
        },
        component: TasksList
      },
      {
        label: "Closed Tasks",
        hideTop: true,
        props: {
          status: TaskTypes.Closed,
          handleTask
        },
        component: TasksList
      }
      // {
      //   label: 'Your Tasks',
      //   hideTop: true,
      //   props: {
      //     status: TaskTypes.MyTasks,
      //     handleTask,
      //   },
      //   component: TasksList,
      // },
    ]);
    dispatch(getAllTasks(ActivityTypes.Tasks));
    return () => {
      dispatch(resetActivityTaskState());
    };
  }, [dispatch]);

  return (
    <Container maxWidth="md" sx={{ mt: pxToRem(20) }}>
      <ErrorDialog
        handleClose={handleDialogClose}
        open={status === ResultState.Failed}
        message="Something went wrong"
      />
      <LoadingDialog
        handleClose={handleDialogClose}
        open={status === ResultState.Updating}
        message={message}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          height: pxToRem(60)
        }}
      >
        <Box>
          {refreshStatus === ResultState.Loading && (
            <div className="refreshing-loading-spinner">
              <CircularProgress
                size="30px"
                sx={{
                  justifyContent: "center",
                  alignContent: "center"
                }}
              />
              <Typography
                sx={{
                  color: "primary.main"
                }}
                variant="h6"
              >
                Updating tasks...
              </Typography>
            </div>
          )}
        </Box>

        <div className="create-task-btn">
          {/* <SwButton
            startIcon={<AddIcon />}
            sx={{
              width: pxToRem(180),
              height: pxToRem(50)
            }}
            to="/aut-dashboard/event-factory/create-task"
            component={Link}
            label="Open task"
          /> */}
        </div>
      </Box>
      <div className="sw-tasks-base-container">
        <Box
          sx={{
            p: 0,
            m: 0,
            gridGap: "0"
          }}
          className="sw-box"
        >
          <SwTabs
            tabs={tabs}
            selectedTabIndex={selectedTabIndex}
            selectedTab={(selectedIndex: number) => {
              dispatch(tasksUpdateSelectedTab(selectedIndex));
            }}
            // tabPanelStyles={{
            //   p: 0
            // }}
            // scrollbarStyles={{
            //   border: "0px",
            //   p: 0
            // }}
          />
        </Box>
      </div>
    </Container>
  );
};

export default Tasks;
