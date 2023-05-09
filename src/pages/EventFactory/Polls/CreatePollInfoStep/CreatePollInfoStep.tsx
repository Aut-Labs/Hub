import { styled, Typography } from "@mui/material";
import { useAppDispatch } from "@store/store.model";
import { Controller, useForm } from "react-hook-form";
import { pxToRem } from "@utils/text-size";
import { CreatePollData, pollUpdateData } from "@store/Activity/poll.reducer";
import { countWords } from "@utils/helpers";
import { Fragment } from "react";
import { useSelector } from "react-redux";
import { AutHeader } from "@components/AutHeader";
import { AutTextField, FormHelperText } from "@components/Fields";
import { AutButton } from "@components/buttons";
import { useNavigation } from "react-router-dom";

const StepWrapper = styled("form")({
  textAlign: "center",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column"
});

const errorTypes = {
  maxLength: `Characters cannot be more than 280`
};

const CreatePollInfoStep = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigation();
  const { title, description, duration } = useSelector(CreatePollData);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      title,
      description,
      duration
    }
  });

  const durations = [
    { durationName: "1 Day", durationValue: "1d" },
    { durationName: "1 Week", durationValue: "1w" },
    { durationName: "1 Month", durationValue: "1mo" }
  ];

  const values = watch();

  const onSubmit = async (data: any) => {
    await dispatch(pollUpdateData(data));
    // navigate.push("/aut-dashboard/event-factory/polls/options");
  };

  return (
    <>
      <AutHeader
        title="Polls"
        titleStyles={{
          m: 0
        }}
        subtitle={
          <>Add Title, Description and Duration for your Community Proposal.</>
        }
      />
      <StepWrapper autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
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
              <>
                <AutTextField
                  variant="standard"
                  focused
                  id={name}
                  name={name}
                  value={value}
                  width="450"
                  autoFocus
                  placeholder="Poll Title"
                  onChange={onChange}
                  inputProps={{ maxLength: 20 }}
                  sx={{
                    mb: pxToRem(45)
                  }}
                  helperText={
                    <FormHelperText
                      errorTypes={errorTypes}
                      value={value}
                      name={name}
                      errors={errors}
                    >
                      <span>{6 - countWords(value)} Words left</span>
                    </FormHelperText>
                  }
                />
              </>
            );
          }}
        />

        <Controller
          name="description"
          control={control}
          rules={{ maxLength: 280 }}
          render={({ field: { name, value, onChange } }) => {
            return (
              <AutTextField
                width="450"
                name={name}
                value={value || ""}
                onChange={onChange}
                color="primary"
                multiline
                rows={5}
                sx={{
                  mb: pxToRem(45)
                }}
                placeholder="Poll Description"
                helperText={
                  <FormHelperText
                    errorTypes={errorTypes}
                    value={value}
                    name={name}
                    errors={errors}
                  >
                    <span>Max characters {280 - (value?.length || 0)}</span>
                  </FormHelperText>
                }
              />
            );
          }}
        />
        <div
          className="sw-duration-options"
          style={{
            display: "flex",
            gridGap: pxToRem(25)
          }}
        >
          {durations.map(({ durationName, durationValue }, index) => {
            return (
              <Fragment key={durationValue}>
                <Controller
                  rules={{
                    required: true
                  }}
                  name="duration"
                  control={control}
                  render={({ field: { name, value, onChange } }) => {
                    return (
                      <AutButton
                        name={name}
                        type="button"
                        onClick={() => onChange(durationValue)}
                        sx={{
                          "&.MuiButton-root": {
                            borderRadius: 0,
                            borderWidth: "2px"
                          }
                        }}
                        className={value === durationValue ? "active-link" : ""}
                      >
                        <Typography variant="body2">{durationName}</Typography>
                      </AutButton>
                    );
                  }}
                />
              </Fragment>
            );
          })}
        </div>

        <AutButton
          sx={{
            minWidth: pxToRem(325),
            maxWidth: pxToRem(325),
            height: pxToRem(70),
            mt: pxToRem(100)
          }}
          type="submit"
          color="primary"
          variant="outlined"
          disabled={!values?.description || !values.title || !values.duration}
        >
          Next
        </AutButton>
      </StepWrapper>
    </>
  );
};

export default CreatePollInfoStep;
