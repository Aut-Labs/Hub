import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  styled,
  Typography
} from "@mui/material";
import { useAppDispatch } from "@store/store.model";
import { useSelector } from "react-redux";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { SwCalendarPicker } from "@components/Fields";
import { pxToRem } from "@utils/text-size";
import { generateTimeSlots } from "@utils/helpers";
import {
  ActivityGroupCallData,
  activityUpdateGroupCallData
} from "@store/Activity/call.reducer";
import { format, isEqual } from "date-fns";
import { AutHeader } from "@components/AutHeader";
import { AutButton } from "@components/buttons";
import { useNavigation } from "react-router-dom";

const StepWrapper = styled("form")({
  textAlign: "center",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column"
});

const CalendarStep = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigation();
  const { startDate, startTime } = useSelector(ActivityGroupCallData);
  const [timeSlots] = useState(
    generateTimeSlots({
      start: 10,
      end: 24,
      interval: 30
    })
  );

  const { control, handleSubmit, watch, formState } = useForm({
    mode: "onChange",
    defaultValues: {
      startDate,
      startTime
    }
  });
  const values = watch();

  const onSubmit = async () => {
    dispatch(activityUpdateGroupCallData(values));
    // navigate.push("/aut-dashboard/event-factory/group-call/info");
  };

  return (
    <>
      <AutHeader
        title="Group Call"
        titleStyles={{
          m: 0
        }}
        subtitle={
          <>
            Hello friend I’m your Web3 scheduling assistant <br />
            Set a date and time for your Community Call & let’s make it
            official.
          </>
        }
      />
      <StepWrapper autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: "flex", flex: 1 }}>
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              mr: pxToRem(65)
            }}
          >
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center"
              }}
            >
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <div className="sw-form-field">
                  <div className="sw-form-field-content">
                    <SwCalendarPicker
                      control={control}
                      name="startDate"
                      minDate={new Date()}
                    />
                  </div>
                </div>
              </LocalizationProvider>
            </Box>
          </Box>
          <Divider
            sx={{
              height: `calc(100% + ${pxToRem(40)})`,
              borderColor: "#707070"
            }}
            orientation="vertical"
          />
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
              sx={{
                height: "20px",
                margin: `0 auto ${pxToRem(20)} auto`,
                fontSize: pxToRem(25)
              }}
              color="white"
              textAlign="center"
            >
              {values.startDate
                ? format(new Date(values.startDate), "PPPP")
                : "Select date"}
            </Typography>
            {/* <SwScrollbar
              sx={{
                height: pxToRem(400),
                flex: 1
              }}
            >
              <List>
                {timeSlots.map((slot, index) => {
                  return (
                    <Controller
                      key={`slot-key-${index}`}
                      name="startTime"
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
                            disabled={!values.startDate}
                            selected={isEqual(
                              new Date(!!value ? value : startTime),
                              slot
                            )}
                            color="primary"
                            onClick={() => onChange(slot)}
                          >
                            <ListItemText
                              sx={{
                                ".MuiTypography-root": {
                                  color: "white",
                                  fontSize: pxToRem(21)
                                }
                              }}
                              primary={format(slot, "hh:mm a")}
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
        </Box>

        <AutButton
          sx={{
            minWidth: pxToRem(325),
            maxWidth: pxToRem(325),
            height: pxToRem(70),
            mt: pxToRem(70)
          }}
          type="submit"
          disabled={!values.startDate || !values.startTime}
          color="primary"
          variant="outlined"
        >
          Next
        </AutButton>
      </StepWrapper>
    </>
  );
};

export default CalendarStep;
