import { Box, CircularProgress, Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { resetActivityTaskState } from "@store/Activity/task.reducer";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import {
  TasksRefreshStatus,
  TasksStatus,
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

const YourTasks = () => {
  const [message, setLoadingMessage] = useState("");
  const dispatch = useAppDispatch();
  const status = useSelector(TasksStatus);
  const refreshStatus = useSelector(TasksRefreshStatus);

  const handleDialogClose = () => {
    dispatch(tasksUpdateStatus(ResultState.Idle));
  };

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

  useEffect(() => {
    dispatch(getAllTasks(ActivityTypes.Tasks));
    return () => {
      dispatch(resetActivityTaskState());
    };
  }, [dispatch]);

  return (
    <Container maxWidth="md" sx={{ mt: pxToRem(20) }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gridGap: "10px" }}>
          <Typography
            color="primary.main"
            fontSize={pxToRem(50)}
            component="div"
          >
            Your Tasks
          </Typography>
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

      <Typography
        sx={{
          mb: pxToRem(50)
        }}
        color="primary.main"
        fontSize={pxToRem(20)}
        component="div"
      >
        These are the Tasks assigned to you. <br />
        The more you tasks you complete, the more you’ll grow your Web3
        reputation.
      </Typography>
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
      <div className="sw-tasks-base-container">
        <Box
          sx={{
            p: 0,
            m: 0,
            gridGap: "0"
          }}
          className="sw-box"
        >
          <TasksList status={TaskTypes.MyTasks} handleTask={handleTask} />
        </Box>
      </div>
    </Container>
  );
};

export default YourTasks;
