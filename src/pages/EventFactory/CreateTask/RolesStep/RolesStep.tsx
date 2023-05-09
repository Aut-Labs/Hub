import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "react-router-dom";
import { TextField, Typography } from "@mui/material";
import { ReactComponent as TagIcon } from "@assets/tag.svg";
import { allRoles } from "@store/Community/community.reducer";
import { useForm, Controller } from "react-hook-form";
import {
  ActivityCurrentStep,
  ActivityCurrentTask,
  activitySetCurrentStep,
  activityUpdateTask
} from "@store/Activity/task.reducer";
import { pxToRem } from "@utils/text-size";
import "./RolesStep.scss";
import { AutButton } from "@components/buttons";

const RolesStep = () => {
  const dispatch = useDispatch();
  const navigate = useNavigation();
  const { activeStep } = useSelector(ActivityCurrentStep);
  const { role, allParticipants, participants } =
    useSelector(ActivityCurrentTask);
  const [roles] = useState(useSelector(allRoles));

  const { control, handleSubmit, watch } = useForm({
    mode: "onChange",
    defaultValues: {
      role,
      participants,
      allParticipants
    }
  });

  const values = watch();

  const onSubmit = (data: any) => {
    dispatch(activityUpdateTask(data));
    // navigate.push("/aut-dashboard/event-factory/create-task/description");
  };

  useEffect(() => {
    if (activeStep !== 1) {
      dispatch(
        activitySetCurrentStep({
          activeStep: 1,
          title: null,
          description: null,
          toPrevBtnPath: "/aut-dashboard/event-factory/create-task",
          left: null
        })
      );
    }
  }, [dispatch, activeStep]);

  return (
    <>
      <form className="sw-task-roles-wrapper" onSubmit={handleSubmit(onSubmit)}>
        <Typography
          sx={{
            color: "primary.main",
            textAlign: "center",
            mb: pxToRem(35),
            fontSize: pxToRem(22)
          }}
          component="div"
          variant="h4"
        >
          What Role would you like to assign this Task to?
        </Typography>
        <div className="sw-roles-options">
          {roles.map(({ roleName }) => {
            return (
              <Fragment key={roleName}>
                <Controller
                  rules={{
                    required: true
                  }}
                  name="role"
                  control={control}
                  render={({ field: { name, value, onChange } }) => {
                    return (
                      <AutButton
                        name={name}
                        type="button"
                        startIcon={<TagIcon />}
                        onClick={() => onChange(roleName)}
                        className={value === roleName ? "active-link" : ""}
                      >
                        <Typography variant="body2">{roleName}</Typography>
                      </AutButton>
                    );
                  }}
                />
              </Fragment>
            );
          })}
        </div>

        <Typography
          sx={{
            color: "primary.main",
            textAlign: "center",
            mt: pxToRem(70),
            mb: pxToRem(35),
            fontSize: pxToRem(22)
          }}
          component="div"
        >
          How many Members should participate?
        </Typography>

        <div
          className="form-fields"
          style={{
            gridGap: pxToRem(92)
          }}
        >
          <div className="sw-form-field">
            <div className="sw-form-field-content">
              <Controller
                name="participants"
                control={control}
                rules={{ min: 0 }}
                render={({ field: { name, value, onChange } }) => {
                  return (
                    <TextField
                      type="number"
                      autoFocus
                      required
                      disabled={values.allParticipants}
                      focused
                      id={name}
                      name={name}
                      value={value}
                      onChange={onChange}
                      inputProps={{ min: 0 }}
                      color="primary"
                      placeholder="Number"
                      sx={{
                        ".MuiInputBase-root": {
                          width: pxToRem(135),
                          height: pxToRem(40)
                        }
                      }}
                    />
                  );
                }}
              />
            </div>
          </div>
          <div className="sw-form-field">
            <div className="sw-form-field-content">
              <Controller
                name="allParticipants"
                control={control}
                render={({ field: { name, value, onChange } }) => {
                  return (
                    <AutButton
                      name={name}
                      type="button"
                      onClick={() => onChange(!value)}
                      className={value ? "active-link" : ""}
                    >
                      <Typography variant="body2">All</Typography>
                    </AutButton>
                  );
                }}
              />
            </div>
          </div>
        </div>

        <div className="bottom-action" style={{ marginTop: "80px" }}>
          <AutButton
            type="submit"
            disabled={
              !values.role ||
              (values.allParticipants ? false : +values.participants === 0)
            }
          >
            Next: Describe the Task
          </AutButton>
        </div>
      </form>
    </>
  );
};

export default RolesStep;
