import {
  Box,
  Divider,
  FormControl,
  FormControlLabel,
  List,
  ListItemButton,
  ListItemText,
  MenuItem,
  Radio,
  RadioGroup,
  styled,
  Typography
} from "@mui/material";
import { useAppDispatch } from "@store/store.model";
import { useSelector } from "react-redux";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { pxToRem } from "@utils/text-size";
import { generateDurationInterval } from "@utils/helpers";
import {
  ActivityGroupCallData,
  ActivityGroupCallError,
  ActivityGroupCallStatus,
  activityUpdateGroupCallData,
  activityUpdateGroupCallStatus
} from "@store/Activity/call.reducer";
import { format } from "date-fns";
import { allRoles } from "@store/Community/community.reducer";
import { addGroupCall } from "@api/activities.api";
import { ResultState } from "@store/result-status";
import ErrorDialog from "@components/Dialog/ErrorPopup";
import LoadingDialog from "@components/Dialog/LoadingPopup";
import { AutHeader } from "@components/AutHeader";
import { AutButton } from "@components/buttons";
import { AutSelectField, AutTextField } from "@components/Fields";
import { useNavigation } from "react-router-dom";

const StepWrapper = styled("form")({
  textAlign: "center",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column"
});

const CallInformationStep = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigation();
  const roles = useSelector(allRoles);
  const status = useSelector(ActivityGroupCallStatus);
  const errorMessage = useSelector(ActivityGroupCallError);
  const {
    startDate,
    duration,
    startTime,
    forCoreTeamRoles,
    role,
    allParticipants,
    participants
  } = useSelector(ActivityGroupCallData);
  const [timeSlots] = useState(generateDurationInterval());

  const { control, handleSubmit, watch, resetField, formState } = useForm({
    mode: "onChange",
    defaultValues: {
      duration,
      startTime,
      forCoreTeamRoles,
      role,
      allParticipants,
      participants
    }
  });
  const values = watch();

  const onSubmit = async () => {
    const metadata = {
      startDate,
      startTime,
      ...values
    };
    await dispatch(activityUpdateGroupCallData(values));
    const result = await dispatch(addGroupCall(metadata));
    if (result.meta.requestStatus === "fulfilled") {
      // navigate.push("/aut-dashboard/event-factory/group-call/success");
    }
  };

  const handleDialogClose = () => {
    dispatch(activityUpdateGroupCallStatus(ResultState.Idle));
  };

  return (
    <>
      <ErrorDialog
        handleClose={handleDialogClose}
        open={status === ResultState.Failed}
        message={errorMessage || "Something went wrong"}
      />
      <LoadingDialog
        handleClose={handleDialogClose}
        open={status === ResultState.Updating}
        message="Creating community call activity..."
      />

      <AutHeader
        title="Group Call"
        titleStyles={{
          m: 0
        }}
        subtitle={
          <>
            Almost there 🙌 Now just pick a duration ⌚ <br /> And decide
            whether the Call is for the entire Community, or a specific Role.
          </>
        }
      />
      <StepWrapper
        className="sw-info-wrapper"
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Box sx={{ display: "flex", flex: 1 }}>
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              ml: pxToRem(65)
            }}
          >
            <Typography
              sx={{ mb: pxToRem(20), fontSize: pxToRem(25) }}
              color="white"
            >
              {startDate && format(new Date(startDate), "PPPP")}
            </Typography>
            <Typography
              sx={{ mb: pxToRem(20) }}
              color="white"
              fontSize={pxToRem(18)}
            >
              How long would you like the call to be?
            </Typography>
            {/* <SwScrollbar
              sx={{
                height: pxToRem(400),
                flex: 1
              }}
            >
              <List
                sx={{
                  alignItems: "flex-start"
                }}
              >
                {timeSlots.map((slot, index) => {
                  return (
                    <Controller
                      key={`duration-key-${index}`}
                      name="duration"
                      control={control}
                      render={({ field: { value, onChange } }) => {
                        return (
                          <ListItemButton
                            sx={{
                              width: pxToRem(300),
                              height: pxToRem(60),
                              "&:hover, &.Mui-selected, &.Mui-selected:hover": {
                                backgroundColor: "#439EDD"
                              }
                            }}
                            selected={value === slot.value}
                            onClick={() => onChange(slot.value)}
                          >
                            <ListItemText
                              sx={{
                                ".MuiTypography-root": {
                                  color: "white",
                                  fontSize: pxToRem(21)
                                }
                              }}
                              primary={slot.label}
                            />
                          </ListItemButton>
                        );
                      }}
                    />
                  );
                })}
              </List>
            </SwScrollbar> */}
          </Box>
          <Divider sx={{ borderColor: "#707070" }} orientation="vertical" />
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              ml: pxToRem(65)
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                textAlign: "left",
                justifyContent: "flex-start"
              }}
            >
              <Typography
                sx={{ mb: pxToRem(20), fontSize: pxToRem(25) }}
                color="white"
              >
                Team & Role
              </Typography>
              <Typography
                sx={{ mb: pxToRem(20), fontSize: pxToRem(18) }}
                color="white"
              >
                Who will be joining the call?
              </Typography>
              <FormControl sx={{ mb: "20px" }}>
                <Controller
                  rules={{ required: true }}
                  control={control}
                  name="forCoreTeamRoles"
                  render={({ field: { value, onChange } }) => (
                    <RadioGroup
                      value={value}
                      sx={{
                        ".MuiRadio-root": {
                          color: "white"
                        }
                      }}
                      onChange={(e) => {
                        onChange(e.target.defaultValue === "true");
                        resetField("role");
                      }}
                    >
                      <FormControlLabel
                        sx={{
                          ".MuiTypography-root": {
                            fontSize: pxToRem(25),
                            color: "white"
                          },
                          ".MuiSvgIcon-root": {
                            width: pxToRem(30),
                            height: pxToRem(30)
                          }
                        }}
                        value
                        control={<Radio />}
                        label="Core Team"
                      />
                      <FormControlLabel
                        sx={{
                          ".MuiTypography-root": {
                            fontSize: pxToRem(25),
                            color: "white"
                          },
                          ".MuiSvgIcon-root": {
                            width: pxToRem(30),
                            height: pxToRem(30)
                          }
                        }}
                        value={false}
                        control={<Radio />}
                        label="Community"
                      />
                    </RadioGroup>
                  )}
                />
              </FormControl>
              <Controller
                rules={{
                  required: !values.forCoreTeamRoles
                }}
                name="role"
                control={control}
                render={({ field: { name, value, onChange } }) => {
                  return (
                    <AutSelectField
                      width="450"
                      name={name}
                      color="primary"
                      value={value || ""}
                      displayEmpty
                      disabled={
                        values.forCoreTeamRoles === undefined ||
                        values.forCoreTeamRoles === null
                      }
                      required={!values.forCoreTeamRoles}
                      renderValue={(selected: string) => {
                        if (!selected) {
                          return "Select One";
                        }
                        return selected;
                      }}
                      onChange={onChange}
                    >
                      {roles.map((r, index) => (
                        <MenuItem
                          key={`role-option-key-${r.roleName}-${index}`}
                          value={r.roleName}
                        >
                          {r.roleName}
                        </MenuItem>
                      ))}
                    </AutSelectField>
                  );
                }}
              />

              <Typography
                sx={{
                  color: "white",
                  fontSize: pxToRem(18),
                  mb: pxToRem(15),
                  mt: pxToRem(30)
                }}
                component="div"
              >
                How many Members should participate?
              </Typography>
              <div>
                <Controller
                  name="participants"
                  control={control}
                  rules={{ min: 0 }}
                  render={({ field: { name, value, onChange } }) => {
                    return (
                      <AutTextField
                        type="number"
                        variant="standard"
                        width="135"
                        autoFocus
                        required
                        disabled={values.allParticipants}
                        id={name}
                        name={name}
                        value={value || ""}
                        onChange={onChange}
                        inputProps={{ min: 0 }}
                        color="primary"
                        placeholder="Number"
                      />
                    );
                  }}
                />
                <Controller
                  name="allParticipants"
                  control={control}
                  render={({ field: { name, value, onChange } }) => {
                    return (
                      <AutButton
                        name={name}
                        type="button"
                        onClick={() => onChange(!value)}
                        sx={{
                          "&.MuiButton-root": {
                            borderRadius: 0,
                            borderWidth: "2px",
                            marginLeft: "10px",
                            marginTop: "5px"
                          }
                        }}
                        className={value ? "active-link" : ""}
                      >
                        <Typography variant="body2">All</Typography>
                      </AutButton>
                    );
                  }}
                />
              </div>
            </Box>
          </Box>
        </Box>

        <AutButton
          sx={{
            minWidth: pxToRem(325),
            maxWidth: pxToRem(325),
            height: pxToRem(70),
            mt: pxToRem(70)
          }}
          type="submit"
          disabled={!formState.isValid}
          color="primary"
          variant="outlined"
        >
          Submit
        </AutButton>
      </StepWrapper>
    </>
  );
};

export default CallInformationStep;
