import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as CoreTeam } from "@assets/core-team.svg";
import { ReactComponent as Community } from "@assets/community.svg";
import {
  ActivityCurrentStep,
  ActivityCurrentTask,
  activitySetCurrentStep,
  activityUpdateTask
} from "@store/Activity/task.reducer";
import { Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { pxToRem } from "@utils/text-size";
import "./CategoryStep.scss";
import { AutButton } from "@components/buttons";
import { useNavigation } from "react-router-dom";

const CategoryStep = () => {
  const navigate = useNavigation();
  const dispatch = useDispatch();
  const { activeStep } = useSelector(ActivityCurrentStep);
  const { isCoreTeamMembersOnly, role } = useSelector(ActivityCurrentTask);

  const { control, handleSubmit, watch } = useForm({
    mode: "onChange",
    defaultValues: {
      isCoreTeamMembersOnly
    }
  });
  const values = watch();

  const onSubmit = (data: any) => {
    const shouldResetRole =
      data?.isCoreTeamMembersOnly !== isCoreTeamMembersOnly;
    dispatch(
      activityUpdateTask({
        ...data,
        role: shouldResetRole ? null : role
      })
    );
    // navigate.push("/aut-dashboard/event-factory/create-task/roles");
  };

  useEffect(() => {
    if (activeStep !== 0) {
      dispatch(
        activitySetCurrentStep({
          activeStep: 0,
          title: null,
          description: null,
          toPrevBtnPath: null,
          left: null
        })
      );
    }
  }, [dispatch, activeStep]);

  return (
    <>
      <form className="sw-category-wrapper" onSubmit={handleSubmit(onSubmit)}>
        <Typography
          sx={{
            color: "primary.main",
            textAlign: "center",
            mb: pxToRem(35),
            fontSize: pxToRem(22)
          }}
          component="div"
        >
          This is an Open Task that lets you assign work, creative competitions
          and daily tasks to other Members of your DAO.
        </Typography>
        <Typography
          sx={{
            color: "primary.main",
            textAlign: "center",
            mb: pxToRem(35),
            fontSize: pxToRem(22)
          }}
          component="div"
        >
          First of all, tell us who is this for:
        </Typography>
        <div className="sw-category-options">
          <Controller
            name="isCoreTeamMembersOnly"
            control={control}
            render={({ field: { name, value, onChange } }) => {
              return (
                <AutButton
                  name={name}
                  onClick={() => onChange(true)}
                  className={value ? "active-link" : ""}
                  endIcon={<CoreTeam />}
                >
                  Core Team
                </AutButton>
              );
            }}
          />
          <Controller
            name="isCoreTeamMembersOnly"
            control={control}
            render={({ field: { name, value, onChange } }) => {
              return (
                <AutButton
                  name={name}
                  onClick={() => onChange(false)}
                  className={!value ? "active-link" : ""}
                  endIcon={<Community />}
                >
                  Community
                </AutButton>
              );
            }}
          />
        </div>

        <div className="bottom-action" style={{ marginTop: "80px" }}>
          <AutButton
            type="submit"
            disabled={values.isCoreTeamMembersOnly === null}
          >
            Next: Assign Role
          </AutButton>
        </div>
      </form>
    </>
  );
};

export default CategoryStep;
