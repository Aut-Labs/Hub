/* eslint-disable max-len */
import {
  useFinaliseOpenTaskMutation,
  useGetAllTasksPerQuestQuery,
  useSubmitOpenTaskMutation
} from "@api/onboarding.api";
import AutSDK, { PluginDefinition, Task } from "@aut-labs-private/sdk";
import AutLoading from "@components/AutLoading";
import {
  Card,
  CardContent,
  Chip,
  Container,
  Link,
  Stack,
  Typography
} from "@mui/material";
import { CommunityData, IsAdmin } from "@store/Community/community.reducer";
import { AutTextField } from "@theme/field-text-styles";
import { memo, useEffect, useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useSelector } from "react-redux";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import TaskDetails from "../Shared/TaskDetails";
import { RequiredQueryParams } from "@api/RequiredQueryParams";
import { PluginDefinitionType } from "@aut-labs-private/sdk/dist/models/plugin";
import { taskTypes } from "../Shared/Tasks";
import ErrorDialog from "@components/Dialog/ErrorPopup";
import LoadingDialog from "@components/Dialog/LoadingPopup";
import { useEthers } from "@usedapp/core";
import { TaskStatus } from "@aut-labs-private/sdk/dist/models/task";
import { ipfsCIDToHttpUrl } from "@api/storage.api";
import AFileUpload, { TaskFileUpload } from "@components/FileUpload";
import { toBase64 } from "@utils/to-base-64";
import SuccessDialog from "@components/Dialog/SuccessPopup";
import { FormHelperText } from "@components/Fields";
import { StepperButton } from "@components/StepperButton";

interface PluginParams {
  plugin: PluginDefinition;
}

interface UserSubmitContentProps {
  task: Task;
  userAddress: string;
  isLoadingTasks: boolean;
  submission?: Task;
  plugin: PluginDefinition;
}

const errorTypes = {
  pattern: "Invalid url."
};

const UserSubmitContent = ({
  task,
  userAddress,
  isLoadingTasks,
  plugin
}: UserSubmitContentProps) => {
  const [searchParams] = useSearchParams();
  const [initialized, setInitialized] = useState(false);
  const navigate = useNavigate();
  const [openSubmitSuccess, setOpenSubmitSuccess] = useState(false);
  const { control, handleSubmit, formState, setValue } = useForm({
    mode: "onChange",
    defaultValues: {
      openTask: null,
      attachment: null
    }
  });

  useEffect(() => {
    if (!initialized && task) {
      setValue("openTask", task.submission?.description);
      setInitialized(true);
    }
  }, [initialized, task]);

  const [submitTask, { isSuccess, error, isError, isLoading, reset }] =
    useSubmitOpenTaskMutation();

  useEffect(() => {
    if (isSuccess) {
      setOpenSubmitSuccess(true);
    }
  }, [isSuccess]);

  const onSubmit = async (values) => {
    submitTask({
      file: values.attachment,
      task: {
        ...task,
        submission: {
          name: "Open task submission",
          description: values.openTask,
          properties: {} as any
        }
      },
      onboardingQuestAddress: searchParams.get(
        RequiredQueryParams.OnboardingQuestAddress
      ),
      pluginAddress: plugin.pluginAddress,
      pluginDefinitionId: plugin.pluginDefinitionId
    });
  };

  const attachmentType = useMemo(() => {
    // @ts-ignore
    return task.metadata.properties.attachmentType;
  }, [task]);

  const textRequired = useMemo(() => {
    // @ts-ignore
    return task.metadata.properties.textRequired;
  }, [task]);

  return (
    <Stack
      direction="column"
      gap={4}
      sx={{
        flex: 1,
        justifyContent: "space-between",
        margin: "0 auto",
        width: {
          xs: "100%",
          sm: "600px",
          xxl: "800px"
        }
      }}
    >
      <ErrorDialog handleClose={() => reset()} open={isError} message={error} />
      <LoadingDialog open={isLoading} message="Submitting task..." />
      <SuccessDialog
        open={openSubmitSuccess}
        message="Congrats!"
        titleVariant="h2"
        subtitle="You successfully submitted the task!"
        subtitleVariant="subtitle1"
        handleClose={() => {
          setOpenSubmitSuccess(false);
          navigate({
            pathname: "/quest",
            search: searchParams.toString()
          });
        }}
      ></SuccessDialog>

      {task?.status === TaskStatus.Created ||
      task?.status === TaskStatus.Taken ? (
        <Card
          sx={{
            bgcolor: "nightBlack.main",
            borderColor: "divider",
            borderRadius: "16px",
            boxShadow: 3
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column"
            }}
          >
            <Typography
              color="white"
              variant="body"
              textAlign="center"
              p="20px"
            >
              {task?.metadata?.description}
            </Typography>
            {textRequired && (
              <Controller
                name="openTask"
                control={control}
                rules={{
                  required: true,
                  maxLength: 257
                }}
                render={({ field: { name, value, onChange } }) => {
                  return (
                    <AutTextField
                      name={name}
                      disabled={
                        task.status === TaskStatus.Submitted ||
                        task.status === TaskStatus.Finished
                      }
                      value={value || ""}
                      sx={{ mb: "20px" }}
                      onChange={onChange}
                      variant="outlined"
                      color="offWhite"
                      multiline
                      rows={5}
                      placeholder={`Enter text here (required)`}
                    />
                  );
                }}
              />
            )}
            {attachmentType === "url" && (
              <>
                <Typography
                  color="white"
                  variant="body"
                  textAlign="center"
                  p="20px"
                >
                  URL
                </Typography>
                <Controller
                  name="attachment"
                  control={control}
                  rules={{
                    required: true,
                    pattern:
                      /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/
                  }}
                  render={({ field: { name, value, onChange } }) => {
                    return (
                      <AutTextField
                        name={name}
                        disabled={
                          task.status === TaskStatus.Submitted ||
                          task.status === TaskStatus.Finished
                        }
                        value={value || ""}
                        sx={{ mt: "20px" }}
                        onChange={onChange}
                        variant="outlined"
                        color="offWhite"
                        required
                        rows={1}
                        placeholder="URL Link Here"
                        helperText={
                          <FormHelperText
                            value={value}
                            name={name}
                            errors={formState.errors}
                            errorTypes={errorTypes}
                          />
                        }
                      />
                    );
                  }}
                />
              </>
            )}
            {(attachmentType === "image" || attachmentType === "text") && (
              <>
                <Typography
                  color="white"
                  variant="body"
                  textAlign="center"
                  p="20px"
                >
                  {`Upload a file ${
                    attachmentType === "image"
                      ? "(.png, .jpg, .jpeg)"
                      : "(.doc, .docx, .txt, .pdf)"
                  }`}
                </Typography>
                <Controller
                  name="attachment"
                  control={control}
                  rules={{
                    required: true
                  }}
                  render={({ field: { onChange } }) => {
                    return (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column"
                        }}
                      >
                        <TaskFileUpload
                          attachmentType={attachmentType}
                          color="offWhite"
                          fileChange={async (file) => {
                            if (file) {
                              onChange(file);
                            } else {
                              onChange(null);
                            }
                          }}
                        />
                      </div>
                    );
                  }}
                />
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card
          sx={{
            bgcolor: "nightBlack.main",
            borderColor: "divider",
            borderRadius: "16px",
            boxShadow: 3
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column"
            }}
          >
            {(task as any)?.status === TaskStatus.Finished && (
              <Stack direction="column" alignItems="flex-end" mb="15px">
                <Chip label="Approved" color="success" size="small" />
              </Stack>
            )}

            <Stack direction="column" alignItems="center" mb="15px">
              <Typography
                color="white"
                variant="body"
                textAlign="center"
                p="5px"
              >
                {task?.metadata?.description}
              </Typography>
              <Typography variant="caption" className="text-secondary">
                Task Description
              </Typography>
            </Stack>

            <Stack direction="column" alignItems="center">
              <Typography
                color="white"
                variant="body"
                textAlign="center"
                p="5px"
              >
                <Link
                  color="primary"
                  sx={{
                    mt: 1,
                    cursor: "pointer"
                  }}
                  variant="body"
                  target="_blank"
                  href={ipfsCIDToHttpUrl(
                    task?.submission?.properties["fileUri"]
                  )}
                >
                  Open attachment
                </Link>
              </Typography>
              <Typography variant="caption" className="text-secondary">
                Attachment File
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      )}

      <Stack
        sx={{
          margin: "0 auto",
          width: {
            xs: "100%",
            sm: "600px",
            xxl: "800px"
          }
        }}
      >
        {(task?.status === TaskStatus.Created ||
          task?.status === TaskStatus.Taken) && (
          <StepperButton
            label="Submit"
            onClick={handleSubmit(onSubmit)}
            disabled={!formState.isValid || isLoadingTasks}
          />
        )}
      </Stack>
    </Stack>
  );
};

const OpenTask = ({ plugin }: PluginParams) => {
  const [searchParams] = useSearchParams();
  const { account: userAddress } = useEthers();

  const params = useParams();

  const { task, submission, isLoading } = useGetAllTasksPerQuestQuery(
    {
      userAddress,
      isAdmin: false,
      pluginAddress: searchParams.get(
        RequiredQueryParams.OnboardingQuestAddress
      ),
      questId: +searchParams.get(RequiredQueryParams.QuestId)
    },
    {
      selectFromResult: ({ data, isLoading, isFetching }) => ({
        isLoading: isLoading || isFetching,
        submission: (data?.submissions || []).find((t) => {
          const [pluginType] = location.pathname.split("/").splice(-2);
          return (
            t.submitter === userAddress &&
            t.taskId === +params?.taskId &&
            PluginDefinitionType[pluginType] ===
              taskTypes[t.taskType].pluginType
          );
        }),
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
      {task ? (
        <>
          <TaskDetails task={submission || task} />
          <UserSubmitContent
            task={submission || task}
            plugin={plugin}
            isLoadingTasks={isLoading}
            userAddress={userAddress}
          />
        </>
      ) : (
        <AutLoading width="130px" height="130px"></AutLoading>
      )}
    </Container>
  );
};

export default memo(OpenTask);
