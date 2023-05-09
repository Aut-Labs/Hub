import { Box, Link, styled, Typography } from "@mui/material";
import { useAppDispatch } from "@store/store.model";
import { useNavigation } from "react-router-dom";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { pxToRem } from "@utils/text-size";
import EmojiInputPicker, {
  hasEmoji
} from "@components/EmojiInputPicker/EmojiInputPicker";
import DeleteIcon from "@mui/icons-material/Delete";
import { CreatePollData, pollUpdateData } from "@store/Activity/poll.reducer";
import { useSelector } from "react-redux";
import { AutHeader } from "@components/AutHeader";
import { AutButton } from "@components/buttons";

const StepWrapper = styled("form")({
  textAlign: "center",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column"
});

const errorTypes = {
  missingEmoji: `Whoops! You forgot to add an emoji 🤭`
};

function FormArrayHelperText({ errors, name, children = null, value }) {
  const [key, index] = name.split(".");

  const error =
    errors && errors[key] && errors[key][+index] && errors[key][+index];
  if (error) {
    let message = "";
    const { type } = error;
    switch (type) {
      case "required":
        message = "Field is required!";
        break;
      case "missingEmoji":
        message = `Whoops! You forgot to add an emoji 🤭`;
        break;
      default:
        return null;
    }
    return (
      <Typography
        whiteSpace="nowrap"
        color="red"
        align="right"
        component="span"
        variant="body2"
      >
        {message}
      </Typography>
    );
  }
  return (
    <Typography color="primary" align="right" component="span" variant="body2">
      {children || ""}
    </Typography>
  );
}

const CreatePollOptionsStep = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigation();
  const data = useSelector(CreatePollData);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      options: data.options
    }
  });

  const { fields, append, remove } = useFieldArray<any>({
    control,
    name: "options"
  });

  const values = watch();

  const onSubmit = async () => {
    await dispatch(pollUpdateData(values));
    // navigate.push("/aut-dashboard/event-factory/polls/participants");
  };

  return (
    <>
      <AutHeader
        title=" Polls"
        titleStyles={{
          m: 0
        }}
        subtitle={<>Add 2-to-5 options & pick an emoji for each!</>}
      />
      <StepWrapper autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        {fields.map((field, index) => (
          <div
            style={{ display: "flex" }}
            className="field-with-delete-btn"
            key={field.id}
          >
            <Controller
              control={control}
              rules={{
                required: true,
                validate: {
                  missingEmoji: ({ option, emoji }) => {
                    return hasEmoji(option);
                  }
                }
              }}
              name={`options.${index}`}
              render={({ field: { value, onChange } }) => {
                return (
                  <EmojiInputPicker
                    type="text"
                    value={value}
                    onChange={onChange}
                    placeholder={`Option ${index + 1}`}
                    autoFocus={index === 0}
                    color="primary"
                    sx={{
                      mb: pxToRem(45)
                    }}
                    helperText={
                      <FormArrayHelperText
                        value={value}
                        name={`options.${index}`}
                        errors={errors}
                      />
                    }
                  />
                );
              }}
            />
            <>
              {index > 1 ? (
                <DeleteIcon
                  fontSize="small"
                  color="error"
                  onClick={() => remove(index)}
                  sx={{
                    cursor: "pointer",
                    ml: pxToRem(15),
                    width: pxToRem(25),
                    height: pxToRem(25)
                  }}
                />
              ) : (
                <Box
                  sx={{
                    ml: pxToRem(15),
                    width: pxToRem(25),
                    height: pxToRem(25)
                  }}
                />
              )}
            </>
          </div>
        ))}

        <Link
          underline="none"
          display="flex"
          disabled={values?.options?.length > 4}
          component="button"
          type="button"
          fontSize={pxToRem(18)}
          onClick={() => {
            append({ option: "", emoji: "" });
          }}
        >
          + Add Option
        </Link>

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
        >
          Next
        </AutButton>
      </StepWrapper>
    </>
  );
};

export default CreatePollOptionsStep;
