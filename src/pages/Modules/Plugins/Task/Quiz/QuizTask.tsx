import {
  useGetAllTasksPerQuestQuery,
  useSubmitQuizTaskMutation
} from "@api/onboarding.api";
import { PluginDefinition } from "@aut-labs-private/sdk";
import { TaskStatus } from "@aut-labs-private/sdk/dist/models/task";
import AutLoading from "@components/AutLoading";
import ErrorDialog from "@components/Dialog/ErrorPopup";
import LoadingDialog from "@components/Dialog/LoadingPopup";
import { StepperButton } from "@components/Stepper";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Container,
  Stack,
  styled,
  Typography
} from "@mui/material";
import { IsAdmin } from "@store/Community/community.reducer";
import { memo, useEffect, useState } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import TaskDetails from "../Shared/TaskDetails";
import { GridBox } from "./QuestionsAndAnswers";
import { RequiredQueryParams } from "@api/RequiredQueryParams";
import { PluginDefinitionType } from "@aut-labs-private/sdk/dist/models/plugin";
import { taskTypes } from "../Shared/Tasks";
import { useEthers } from "@usedapp/core";

interface PluginParams {
  plugin: PluginDefinition;
}

const GridRow = styled(Box)({
  boxSizing: "border-box",
  display: "grid",
  gridTemplateColumns: "1fr 40px",
  gridGap: "8px"
});

const Row = styled(Box)({
  display: "flex",
  justifyContent: "flex-end",
  width: "100%"
});

const Answers = memo(({ control, questionIndex, answers, taskStatus }: any) => {
  const values = useWatch({
    name: `questions[${questionIndex}].answers`,
    control
  });

  const alphabetize = {
    0: "A",
    1: "B",
    2: "C",
    3: "D"
  };

  return (
    <GridBox>
      {answers.map((answer, index) => {
        return (
          <>
            {answer?.value && (
              <GridRow key={`questions[${questionIndex}].answers[${index}]`}>
                <Stack
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center"
                  }}
                >
                  <Typography mr={1} color="white" variant="subtitle2">
                    {alphabetize[index]}
                  </Typography>
                  <Typography color="white" variant="body" lineHeight="40px">
                    {answer?.value}
                  </Typography>
                </Stack>
                <Controller
                  name={`questions[${questionIndex}].answers[${index}].checked`}
                  control={control}
                  rules={{
                    required: !values?.some((v) => v.checked)
                  }}
                  render={({ field: { name, value, onChange } }) => {
                    return (
                      <Checkbox
                        name={name}
                        sx={{
                          color: "white",
                          "&.Mui-checked": {
                            color: "primary"
                          },
                          "&.Mui-disabled": {
                            color: "nightBlack.light"
                          }
                        }}
                        value={value}
                        tabIndex={-1}
                        onChange={onChange}
                        disabled={
                          taskStatus === TaskStatus.Submitted ||
                          taskStatus === TaskStatus.Finished
                        }
                      />
                    );
                  }}
                />
              </GridRow>
            )}
          </>
        );
      })}
    </GridBox>
  );
});

const AnswersAdminView = memo(({ questionIndex, answers }: any) => {
  return (
    <GridBox>
      {answers.map((answer, index) => {
        return (
          <GridRow
            key={`questions[${questionIndex}].answers[${index}]`}
            style={{ gridTemplateColumns: "40px 1fr" }}
          >
            <Checkbox
              sx={{
                color: "white",
                "&.Mui-checked": {
                  color: "primary"
                },
                "&.Mui-disabled": {
                  color: "nightBlack.light"
                }
              }}
              checked={!!answer?.correct}
              disabled={true}
            />
            <Typography
              color={answer?.correct ? "success.main" : "error.main"}
              variant="body"
              lineHeight="40px"
            >
              {answer?.value}
            </Typography>
          </GridRow>
        );
      })}
    </GridBox>
  );
});

const QuizTask = ({ plugin }: PluginParams) => {
  const [searchParams] = useSearchParams();
  const isAdmin = useSelector(IsAdmin);
  const { account: userAddress } = useEthers();
  const params = useParams();
  const [initialized, setInitialized] = useState(false);

  const { task, isLoading: isLoadingPlugins } = useGetAllTasksPerQuestQuery(
    {
      userAddress,
      isAdmin,
      pluginAddress: searchParams.get(
        RequiredQueryParams.OnboardingQuestAddress
      ),
      questId: +searchParams.get(RequiredQueryParams.QuestId)
    },
    {
      selectFromResult: ({ data, isLoading, isFetching }) => ({
        isLoading: isLoading || isFetching,
        task: (data?.tasks || []).find((t) => {
          const [pluginType] = location.pathname.split("/").splice(-2);
          return (
            t.taskId === +params?.taskId &&
            PluginDefinitionType[pluginType] ===
              taskTypes[t.taskType].pluginType
          );
        })
      })
    }
  );

  const { control, handleSubmit, getValues, setValue, formState } = useForm({
    mode: "onChange",
    defaultValues: {
      questions: []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions"
  });

  useEffect(() => {
    if (!initialized && task) {
      setValue("questions", (task as any)?.metadata?.properties?.questions);
      setInitialized(true);
    }
  }, [initialized, task]);

  const [submitTask, { error, isError, isLoading, reset }] =
    useSubmitQuizTaskMutation();

  const onSubmit = async () => {
    const values = getValues();
    submitTask({
      task,
      questionsAndAnswers: values.questions.map((q) => ({
        ...q,
        answers: q.answers.map((a) => ({
          ...a,
          correct: a.checked || false
        }))
      })),
      onboardingQuestAddress: searchParams.get(
        RequiredQueryParams.OnboardingQuestAddress
      ),
      pluginAddress: plugin.pluginAddress,
      pluginDefinitionId: plugin.pluginDefinitionId
    });
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 4,
        height: "100%",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        position: "relative"
      }}
    >
      <ErrorDialog handleClose={() => reset()} open={isError} message={error} />
      <LoadingDialog open={isLoading} message="Submitting task..." />
      {task ? (
        <>
          <TaskDetails task={task} />

          <Stack
            direction="column"
            gap={4}
            sx={{
              flex: 1,
              justifyContent: "space-between",
              margin: "0 auto",
              width: {
                xs: "100%",
                sm: "650px",
                xxl: "800px"
              }
            }}
          >
            {((task as any)?.metadata?.properties?.questions as any[])?.map(
              (question, questionIndex) => (
                <Card
                  key={`questions.${questionIndex}.question`}
                  sx={{
                    bgcolor: "nightBlack.main",
                    borderColor: "divider",
                    borderRadius: "16px",
                    boxShadow: 3
                  }}
                >
                  <CardHeader
                    titleTypographyProps={{
                      fontFamily: "FractulAltBold",
                      fontWeight: 900,
                      color: "white",
                      variant: "subtitle1"
                    }}
                    title={question?.question}
                  />
                  <CardContent>
                    <Answers
                      control={control}
                      answers={question?.answers}
                      questionIndex={questionIndex}
                      taskStatus={task?.status}
                    ></Answers>
                  </CardContent>
                </Card>
              )
            )}

            <Box
              sx={{
                width: "100%",
                display: "flex",
                mb: 4,
                justifyContent: {
                  xs: "center",
                  sm: "flex-end"
                }
              }}
            >
              <StepperButton
                label="Confirm"
                disabled={
                  !formState.isValid || task?.status !== TaskStatus.Created
                }
                onClick={handleSubmit(onSubmit)}
                sx={{ width: "250px" }}
              />
            </Box>
          </Stack>
        </>
      ) : (
        <AutLoading></AutLoading>
      )}
    </Container>
  );
};

export default memo(QuizTask);
