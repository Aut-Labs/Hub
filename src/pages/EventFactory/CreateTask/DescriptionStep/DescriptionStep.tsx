import { TextField, Typography } from "@mui/material";
import { useAppDispatch } from "@store/store.model";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { ResultState } from "@store/result-status";
import LoadingDialog from "@components/Dialog/LoadingPopup";
import ErrorDialog from "@components/Dialog/ErrorPopup";
import { useForm, Controller } from "react-hook-form";
import {
  ActivityCurrentStep,
  ActivityCurrentTask,
  ActivityStatus,
  activitySetCurrentStep,
  activityUpdateTask,
  activityUpdateTaskStatus
} from "@store/Activity/task.reducer";
import "./DescriptionStep.scss";
import { addActivityTask } from "@api/activities.api";
import { countWords } from "@utils/helpers";
import { pxToRem } from "@utils/text-size";
import { DiscordWebHookUrl } from "@store/AutDashboard/aut-dashboard.reducer";
import { useNavigation } from "react-router-dom";

const DescriptionStep = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigation();
  const { activeStep } = useSelector(ActivityCurrentStep);
  const status = useSelector(ActivityStatus);
  const webhookUrl = useSelector(DiscordWebHookUrl);
  const {
    role,
    isCoreTeamMembersOnly,
    allParticipants,
    participants,
    description,
    title
  } = useSelector(ActivityCurrentTask);

  const { control, handleSubmit, watch } = useForm({
    mode: "onChange",
    defaultValues: {
      title,
      description
    }
  });
  const values = watch();

  const onSubmit = async (data: any) => {
    await dispatch(activityUpdateTask(data));
    const result = await dispatch(
      addActivityTask({
        role,
        isCoreTeamMembersOnly,
        allParticipants,
        participants,
        description: values.description,
        title: values.title
      })
    );

    if (result.meta.requestStatus === "fulfilled") {
      // history.push("/aut-dashboard/event-factory/create-task-success");
    }
  };

  const handleDialogClose = () => {
    dispatch(activityUpdateTaskStatus(ResultState.Idle));
  };

  useEffect(() => {
    if (activeStep !== 2) {
      dispatch(
        activitySetCurrentStep({
          activeStep: 2,
          title: null,
          description: null,
          toPrevBtnPath: "/aut-dashboard/event-factory/create-task/roles",
          left: null
        })
      );
    }
  }, [dispatch, activeStep]);

  return (
    <div
      className="sw-description-wrapper"
      style={{
        maxWidth: pxToRem(635)
      }}
    >
      <ErrorDialog
        handleClose={handleDialogClose}
        open={status === ResultState.Failed}
        message="Something went wrong"
      />
      <LoadingDialog
        handleClose={handleDialogClose}
        open={status === ResultState.Updating}
        message="Creating task..."
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="sw-form-field">
          <Typography
            color="primary"
            sx={{ mb: pxToRem(25), fontSize: pxToRem(22) }}
            align="center"
            component="div"
            variant="h4"
          >
            Last but least, a clear Title to help identity your Task 🙌
          </Typography>
          <div className="sw-form-field-content">
            <Controller
              name="title"
              control={control}
              rules={{
                required: true,
                validate: {
                  maxWords: (v: string) => countWords(v) <= 6
                }
              }}
              render={({ field: { name, value, onChange } }) => {
                return (
                  <TextField
                    autoFocus
                    required
                    focused
                    name={name}
                    value={value || ""}
                    onChange={onChange}
                    inputProps={{ maxLength: 20 }}
                    color="primary"
                    helperText={
                      <Typography
                        color="primary"
                        align="right"
                        component="span"
                        variant="body2"
                      >
                        {6 - countWords(value)} Words left
                      </Typography>
                    }
                    sx={{
                      ".MuiInputBase-root": {
                        height: pxToRem(80)
                      }
                    }}
                  />
                );
              }}
            />
          </div>
        </div>
        <div className="sw-form-field">
          <Typography
            color="primary"
            sx={{ mb: pxToRem(25), fontSize: pxToRem(22) }}
            align="center"
            component="div"
            variant="h4"
          >
            And finally, the Description of what needs to get done 😎
          </Typography>
          <div className="sw-form-field-content">
            <Controller
              name="description"
              control={control}
              rules={{ maxLength: 280 }}
              render={({ field: { name, value, onChange } }) => {
                return (
                  <TextField
                    required
                    focused
                    name={name}
                    multiline
                    rows={8}
                    value={value || ""}
                    onChange={onChange}
                    inputProps={{ maxLength: 280 }}
                    color="primary"
                    placeholder="Description"
                    helperText={
                      <Typography
                        color="primary"
                        align="right"
                        component="span"
                        variant="body2"
                      >
                        {280 - (value?.length || 0)} of 280 characters left
                      </Typography>
                    }
                  />
                );
              }}
            />
          </div>
        </div>
        <div className="bottom-action" style={{ marginTop: "30px" }}>
          {/* <SwButton
            type="submit"
            disabled={!values?.description || !values.title}
            label="Create Task"
          /> */}
        </div>
      </form>
    </div>
  );
};

export default DescriptionStep;
