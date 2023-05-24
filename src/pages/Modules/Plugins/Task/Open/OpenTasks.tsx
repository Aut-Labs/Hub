/* eslint-disable max-len */
import { useCreateTaskPerQuestMutation } from "@api/onboarding.api";
import { PluginDefinition, Task } from "@aut-labs-private/sdk";
import ErrorDialog from "@components/Dialog/ErrorPopup";
import LoadingDialog from "@components/Dialog/LoadingPopup";
import { FormHelperText } from "@components/Fields";
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography
} from "@mui/material";
import { AutSelectField } from "@theme/field-select-styles";
import { AutTextField } from "@theme/field-text-styles";
import { pxToRem } from "@utils/text-size";
import { memo, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { dateToUnix } from "@utils/date-format";
import { addMinutes } from "date-fns";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { RequiredQueryParams } from "@api/RequiredQueryParams";
import LinkWithQuery from "@components/LinkWithQuery";
import { countWords } from "@utils/helpers";
import { StepperButton } from "@components/StepperButton";

const errorTypes = {
  maxWords: `Words cannot be more than 6`,
  maxNameChars: `Characters cannot be more than 24`,
  maxLength: `Characters cannot be more than 257`
};

const AttachmentTypes = [
  {
    value: "url",
    label: "URL"
  },
  {
    value: "text",
    label: "Text"
  },
  {
    value: "image",
    label: "Image"
  }
];
interface PluginParams {
  plugin: PluginDefinition;
}

const TaskSuccess = ({ pluginId, reset }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  return (
    <Container
      maxWidth="sm"
      sx={{ mt: pxToRem(20), flexGrow: 1, display: "flex" }}
    >
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          my: "auto"
        }}
      >
        <Typography align="center" color="white" variant="h2" component="div">
          Success! Open task has been created and deployed on the Blockchain 🎉
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gridGap: "20px"
          }}
        >
          <Button
            startIcon={<AddIcon />}
            variant="outlined"
            sx={{
              my: pxToRem(50)
            }}
            size="medium"
            color="offWhite"
            to="/aut-dashboard/modules/Task"
            preserveParams
            component={LinkWithQuery}
          >
            Add another task
          </Button>
          {searchParams.has("returnUrl") && (
            <Button
              sx={{
                my: pxToRem(50)
              }}
              onClick={() => navigate(searchParams.get("returnUrl"))}
              type="submit"
              variant="outlined"
              size="medium"
              color="offWhite"
            >
              {searchParams.get("returnUrlLinkName") || "Go back"}
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
};

const endDatetime = new Date();
addMinutes(endDatetime, 45);

const OpenTasks = ({ plugin }: PluginParams) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { control, handleSubmit, getValues, formState } = useForm({
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      attachmentType: ""
    }
  });

  const [createTask, { error, isError, isSuccess, data, isLoading, reset }] =
    useCreateTaskPerQuestMutation();

  const onSubmit = async () => {
    const values = getValues();
    createTask({
      onboardingQuestAddress: searchParams.get(
        RequiredQueryParams.OnboardingQuestAddress
      ),
      pluginTokenId: plugin.tokenId,
      questId: +searchParams.get(RequiredQueryParams.QuestId),
      pluginAddress: plugin.pluginAddress,
      task: {
        role: 1,
        metadata: {
          name: values.title,
          description: values.description,
          properties: {
            attachmentType: values.attachmentType
          }
        },
        startDate: dateToUnix(new Date()),
        endDate: dateToUnix(endDatetime)
      } as unknown as Task
    });
  };

  useEffect(() => {
    if (isSuccess) {
      navigate({
        pathname: `/aut-dashboard/modules/OnboardingStrategy/QuestOnboardingPlugin/${+searchParams.get(
          RequiredQueryParams.QuestId
        )}`
      });
    }
  }, [isSuccess]);

  return (
    <Container
      sx={{ py: "20px", display: "flex", flexDirection: "column" }}
      maxWidth="lg"
      component="form"
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit)}
    >
      <ErrorDialog handleClose={() => reset()} open={isError} message={error} />
      <LoadingDialog open={isLoading} message="Creating task..." />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          position: "relative",
          flex: 1,
          mb: 4,
          mx: "auto",
          width: "100%"
        }}
      >
        <Stack alignItems="center" justifyContent="center">
          <Button
            startIcon={<ArrowBackIosNewIcon />}
            color="offWhite"
            sx={{
              position: {
                sm: "absolute"
              },
              left: {
                sm: "0"
              }
            }}
            to={searchParams.get("returnUrl")}
            component={Link}
          >
            {/* {searchParams.get("returnUrlLinkName") || "Back"} */}
            <Typography color="white" variant="body">
              Back
            </Typography>
          </Button>
          <Typography textAlign="center" color="white" variant="h3">
            Create an Open Task
          </Typography>
        </Stack>
        <Typography
          sx={{
            width: {
              xs: "100%",
              sm: "700px",
              xxl: "1000px"
            }
          }}
          mt={2}
          mx="auto"
          textAlign="center"
          color="white"
          variant="body"
        >
          Create an Open Task which will require you to approve or dismiss
          submissions. This Task type is designed to give you freedom on the
          nature and requirements of the Task.
        </Typography>
      </Box>
      <Stack
        direction="column"
        gap={8}
        sx={{
          margin: "0 auto",
          width: {
            xs: "100%",
            sm: "650px",
            xxl: "800px"
          }
        }}
      >
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
              <AutTextField
                variant="standard"
                color="offWhite"
                required
                autoFocus
                name={name}
                value={value || ""}
                onChange={onChange}
                placeholder="Title"
                helperText={
                  <FormHelperText
                    errorTypes={errorTypes}
                    value={value}
                    name={name}
                    errors={formState.errors}
                  >
                    <Typography color="white" variant="caption">
                      {6 - countWords(value)} Words left
                    </Typography>
                  </FormHelperText>
                }
              />
            );
          }}
        />

        <Controller
          name="description"
          control={control}
          rules={{
            required: true,
            maxLength: 257
          }}
          render={({ field: { name, value, onChange } }) => {
            return (
              <AutTextField
                name={name}
                value={value || ""}
                onChange={onChange}
                variant="outlined"
                color="offWhite"
                required
                multiline
                rows={5}
                placeholder="Describe the requirements of the task including instructions on what to submit. I.e. a link to an artwork or plain text."
                helperText={
                  <FormHelperText
                    errorTypes={errorTypes}
                    value={value}
                    name={name}
                    errors={formState.errors}
                  >
                    <Typography color="white" variant="caption">
                      {257 - (value?.length || 0)} of 257 characters left
                    </Typography>
                  </FormHelperText>
                }
              />
            );
          }}
        />

        <Stack
          direction="row"
          gap={4}
          sx={{
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            width: {
              xs: "100%",
              sm: "650px",
              xxl: "800px"
            }
          }}
        >
          <Typography color="white" variant="body" component="div">
            Attachment Type
          </Typography>
          <Controller
            name="attachmentType"
            control={control}
            rules={{
              validate: {
                selected: (v) => !!v
              }
            }}
            render={({ field: { name, value, onChange } }) => {
              return (
                <AutSelectField
                  variant="standard"
                  color="offWhite"
                  renderValue={(selected) => {
                    if (!selected) {
                      return "Type" as any;
                    }
                    const type = AttachmentTypes.find(
                      (t) => t.value === selected
                    );
                    return type?.label || selected;
                  }}
                  name={name}
                  value={value || ""}
                  displayEmpty
                  required
                  onChange={onChange}
                >
                  {AttachmentTypes.map((type) => {
                    return (
                      <MenuItem key={`role-${type.value}`} value={type.value}>
                        {type.label}
                      </MenuItem>
                    );
                  })}
                </AutSelectField>
              );
            }}
          />
          {/* <Controller
            name="attachmentType"
            control={control}
            rules={{
              required: true
            }}
            render={({ field: { name, value, onChange } }) => {
              return (
                <AutTextField
                  sx={{
                    width: "150px",
                    ".MuiSvgIcon-root ": {
                      fill: "white !important"
                    }
                  }}
                  id="attachmentType"
                  value={value}
                  name={name}
                  color="offWhite"
                  onChange={onChange}
                  label="Type"
                  size="small"
                  select
                  InputLabelProps={{
                    style: { color: "white" }
                  }}
                  SelectProps={{
                    style: { color: "white" }
                  }}
                ></AutTextField>
              );
            }}
          /> */}
        </Stack>
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
            disabled={!formState.isValid}
            sx={{ width: "250px" }}
          />
        </Box>
      </Stack>
    </Container>
  );
};

export default memo(OpenTasks);
