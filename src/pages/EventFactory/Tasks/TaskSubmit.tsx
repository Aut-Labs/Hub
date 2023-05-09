import {
  Alert,
  AlertTitle,
  Box,
  Container,
  TextField,
  Typography
} from "@mui/material";
import {
  SingleTask,
  TaskErrorMessage,
  TasksStatus,
  tasksUpdateStatus
} from "@store/Activity/tasks.reducer";
import { Task, TaskStatus } from "@store/model";
import { useAppDispatch } from "@store/store.model";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { ResultState } from "@store/result-status";
import ErrorDialog from "@components/Dialog/ErrorPopup";
import LoadingDialog from "@components/Dialog/LoadingPopup";
import SuccessDialog from "@components/Dialog/SuccessPopup";
import { getTaskById, submitActivityTask } from "@api/activities.api";
import { Controller, useForm } from "react-hook-form";
import "./Tasks.scss";
import AutLoading from "@components/AutLoading";

const TaskSubmit = () => {
  const dispatch = useAppDispatch();
  const { taskActivityId } = useParams<any>();
  const selectedTask: Task = useSelector(SingleTask);
  const status = useSelector(TasksStatus);
  const errorMessage = useSelector(TaskErrorMessage);

  const { control, handleSubmit, watch } = useForm({
    mode: "all",
    defaultValues: {
      description: ""
    }
  });
  const values = watch();

  const submitTask = () => {
    dispatch(submitActivityTask({ task: selectedTask, values }));
  };

  const handleDialogClose = () => {
    dispatch(tasksUpdateStatus(ResultState.Idle));
  };

  useEffect(() => {
    dispatch(getTaskById(taskActivityId));
  }, [dispatch, taskActivityId]);

  return (
    <Container maxWidth="md" sx={{ flexGrow: 1 }}>
      <SuccessDialog
        handleClose={handleDialogClose}
        open={status === ResultState.Success}
        message="Success!"
        subtitle="You have submitted your task"
      />
      <LoadingDialog
        handleClose={handleDialogClose}
        open={status === ResultState.Updating}
        message="Submitting task"
      />
      <ErrorDialog
        handleClose={handleDialogClose}
        open={status === ResultState.Failed}
        message={errorMessage || "Something went wrong"}
      />
      <Box
        className="sw-tasks-base-container"
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        {status === ResultState.Loading ? (
          <div className="tasks-loading-spinner">
            <AutLoading />
          </div>
        ) : (
          <>
            <Box
              sx={{
                flex: 1,
                height: "100%",
                display: "flex",
                flexDirection: "column"
              }}
              className="sw-box"
            >
              <Typography
                sx={{
                  color: "primary.main",
                  mb: "16px"
                }}
                variant="h1"
              >
                Submit Task
              </Typography>

              {/* <SwScrollbar
                sx={{
                  height: "100%",
                  flex: 1
                }}
              >
                <form
                  className="sw-task-submit-wrapper"
                  onSubmit={handleSubmit(submitTask)}
                >
                  <Box
                    sx={{
                      flex: 1,
                      px: "20px",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column"
                    }}
                  >
                    <Typography
                      sx={{
                        color: "primary.main",
                        mb: "16px"
                      }}
                      variant="subtitle1"
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {selectedTask?.title || "N/A"}
                        {selectedTask?.status === TaskStatus.Finished && (
                          <Alert
                            sx={{
                              border: 0,
                              py: 0,
                              m: 0,
                              ml: 2,
                              height: "30px",
                              width: "134px",
                              display: "flex",
                              alignItems: "center"
                            }}
                            severity="success"
                          >
                            <AlertTitle
                              sx={{
                                p: 0,
                                m: 0
                              }}
                            >
                              [ Completed ]
                            </AlertTitle>
                          </Alert>
                        )}
                      </div>
                    </Typography>
                    <Typography
                      sx={{
                        color: "primary.main",
                        mb: "35px"
                      }}
                      variant="body1"
                    >
                      {selectedTask?.description}
                    </Typography>
                    <Controller
                      name="description"
                      key="description"
                      control={control}
                      render={({ field: { name, value, onChange } }) => {
                        return (
                          <TextField
                            disabled={
                              selectedTask?.status === TaskStatus.Finished
                            }
                            name={name}
                            value={value || ""}
                            onChange={onChange}
                            className="submit-descr"
                            required
                            focused
                            multiline
                            rows={4}
                            color="primary"
                            placeholder="Type something"
                          />
                        );
                      }}
                    />

                    <div className="upload-file">
                      <Typography
                        sx={{
                          color: "primary.main"
                        }}
                        variant="h2"
                      >
                        testfile.jpg
                      </Typography>
                      <SwButton
                        sx={{
                          width: "180px",
                          height: "40px",
                          minHeight: "40px"
                        }}
                        disabled={selectedTask?.status === TaskStatus.Finished}
                        label="Upload"
                      />
                    </div>

                    <div className="submit-action">
                      <SwButton
                        sx={{
                          width: "180px",
                          height: "85px",
                          minHeight: "85px"
                        }}
                        disabled={selectedTask?.status === TaskStatus.Finished}
                        onClick={submitTask}
                        label="Submit"
                      />
                    </div>
                  </Box>
                </form>
              </SwScrollbar> */}
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
};

export default TaskSubmit;
