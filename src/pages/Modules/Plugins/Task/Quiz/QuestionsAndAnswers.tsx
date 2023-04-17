import {
  Stack,
  Card,
  CardHeader,
  IconButton,
  CardContent,
  Button,
  Radio,
  Tooltip,
  Typography,
  Box,
  styled,
  Checkbox
} from "@mui/material";
import { AutTextField } from "@theme/field-text-styles";
import {
  useFieldArray,
  Controller,
  useWatch,
  Control,
  useFormState
} from "react-hook-form";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { FormHelperText } from "@components/Fields";

const errorTypes = {
  uniqueQuestion: `Question should be unique`
};

interface AnswersParams {
  control: Control<any, any>;
  questionIndex: number;
}

const Answers = ({ control, questionIndex }: AnswersParams) => {
  const { fields } = useFieldArray({
    control,
    name: `questions[${questionIndex}].answers`
  });

  const formState = useFormState({
    name: `questions[${questionIndex}].answers`,
    control
  });

  const values = useWatch({
    name: `questions[${questionIndex}].answers`,
    control
  });

  return (
    <GridBox>
      {fields.map((_, index) => {
        return (
          <GridRow key={`questions[${questionIndex}].answers[${index}]`}>
            <Controller
              name={`questions[${questionIndex}].answers[${index}].value`}
              control={control}
              rules={{
                required: index <= 1
              }}
              render={({ field: { name, value, onChange } }) => {
                return (
                  <AutTextField
                    variant="standard"
                    color="offWhite"
                    sx={{
                      width: "100%"
                    }}
                    InputProps={{
                      startAdornment: (
                        <Typography mr={1} color="white" variant="subtitle2">
                          {answers[index]}
                        </Typography>
                      )
                    }}
                    required={index <= 1}
                    name={name}
                    value={value || ""}
                    onChange={onChange}
                    placeholder={`Answer ${index + 1}`}
                    helperText={
                      <FormHelperText
                        errorTypes={errorTypes}
                        value={value}
                        name={name}
                        errors={formState.errors}
                      />
                    }
                  />
                );
              }}
            />
            <Controller
              name={`questions[${questionIndex}].answers[${index}].correct`}
              control={control}
              rules={{
                required: !values?.some((v) => v.correct)
              }}
              render={({ field: { name, value, onChange } }) => {
                return (
                  <Checkbox
                    name={name}
                    color="primary"
                    required={!values?.some((v) => v.correct)}
                    value={value}
                    tabIndex={-1}
                    onChange={onChange}
                  />
                );
              }}
            />
          </GridRow>
        );
      })}
    </GridBox>
  );
};

export const emptyQuestion = {
  question: "",
  answers: [
    {
      value: "",
      correct: false
    },
    {
      value: "",
      correct: false
    },
    {
      value: "",
      correct: false
    },
    {
      value: "",
      correct: false
    }
  ]
};

const answers = {
  0: "A",
  1: "B",
  2: "C",
  3: "D"
};

export const GridBox = styled(Box)(({ theme }) => ({
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  gridGap: "20px",
  marginTop: "20px",
  [theme.breakpoints.up("sm")]: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr"
  }
}));

const GridRow = styled(Box)({
  boxSizing: "border-box",
  display: "grid",
  gridTemplateColumns: "1fr 40px",
  gridGap: "8px"
});

const QuestionsAndAnswers = ({ control }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions"
  });

  const values = useWatch({
    name: `questions`,
    control
  });

  return (
    <Stack
      direction="column"
      gap={4}
      sx={{
        mt: 6,
        mx: "auto",
        width: {
          xs: "100%",
          sm: "600px",
          xxl: "800px"
        }
      }}
    >
      {fields.map((field, index) => (
        <Card
          key={`questions[${index}].question`}
          sx={{
            bgcolor: "nightBlack.main",
            borderColor: "divider",
            borderRadius: "16px",
            boxShadow: 3
          }}
        >
          <CardHeader
            action={
              <IconButton
                disabled={index === 0}
                tabIndex={-1}
                color="error"
                onClick={() => remove(index)}
              >
                <DeleteIcon />
              </IconButton>
            }
            titleTypographyProps={{
              fontFamily: "FractulAltBold",
              fontWeight: 900,
              color: "white",
              variant: "subtitle1"
            }}
            title={`Question ${index + 1}`}
          />
          <CardContent>
            <Controller
              name={`questions[${index}].question`}
              control={control}
              rules={{
                required: true,
                validate: {
                  uniqueQuestion: (v) => {
                    const counts = {
                      [v]: v
                    };
                    const count = values.reduce((prev, curr) => {
                      if (counts[curr.question] === curr.question) {
                        prev += 1;
                      }
                      return prev;
                    }, 0);
                    return count <= 1;
                  }
                }
              }}
              render={({ formState, field: { name, value, onChange } }) => {
                return (
                  <AutTextField
                    variant="standard"
                    color="offWhite"
                    sx={{
                      width: "100%"
                    }}
                    required
                    name={name}
                    value={value || ""}
                    onChange={onChange}
                    placeholder="Question"
                    helperText={
                      <FormHelperText
                        errorTypes={errorTypes}
                        value={value}
                        name={name}
                        errors={formState.errors}
                      />
                    }
                  />
                );
              }}
            />

            <Answers control={control} questionIndex={index} />
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end"
              }}
            >
              <Typography
                className="text-secondary"
                mt={2}
                textAlign="end"
                color="white"
                variant="body1"
              >
                Tick the box next to the correct answer(s)
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ))}

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end"
        }}
      >
        <Button
          startIcon={<AddIcon />}
          variant="outlined"
          size="medium"
          color="offWhite"
          onClick={() => append(emptyQuestion)}
        >
          Add question
        </Button>
      </Box>
    </Stack>
  );
};

export default QuestionsAndAnswers;
