import { useCreateTaskPerQuestMutation } from "@api/onboarding.api";
import { PluginDefinition, Task } from "@aut-labs-private/sdk";
import ErrorDialog from "@components/Dialog/ErrorPopup";
import LoadingDialog from "@components/Dialog/LoadingPopup";
import { FormHelperText } from "@components/Fields";
import { Box, Button, Chip, Container, Stack, Typography } from "@mui/material";
import { AutTextField } from "@theme/field-text-styles";
import { pxToRem } from "@utils/text-size";
import { memo, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { dateToUnix } from "@utils/date-format";
import { addMinutes } from "date-fns";
import { RequiredQueryParams } from "@api/RequiredQueryParams";
import { useSelector } from "react-redux";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import DoneIcon from "@mui/icons-material/Done";
import {
  DiscordLink,
  IsDiscordVerified
} from "@store/Community/community.reducer";
import DiscordServerVerificationPopup from "@components/Dialog/DiscordServerVerificationPopup";
import LinkWithQuery from "@components/LinkWithQuery";
import { countWords } from "@utils/helpers";
import { StepperButton } from "@components/StepperButton";

const errorTypes = {
  maxWords: `Words cannot be more than 6`,
  maxNameChars: `Characters cannot be more than 24`,
  maxLength: `Characters cannot be more than 257`
};

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
          Success! Join Discord task has been created and deployed on the
          Blockchain 🎉
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

const JoinDiscordTasks = ({ plugin }: PluginParams) => {
  const isDiscordVerified = useSelector(IsDiscordVerified);
  const inviteLink = useSelector(DiscordLink);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [discordDialogOpen, setDiscordDialogOpen] = useState(false);
  const { control, handleSubmit, getValues, formState } = useForm({
    mode: "onChange",
    defaultValues: {
      title: "",
      // inviteUrl: inviteLink || "",
      description: ""
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
            inviteUrl: inviteLink
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
      sx={{ py: "30px", display: "flex", flexDirection: "column" }}
      maxWidth="lg"
      component="form"
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit)}
    >
      <DiscordServerVerificationPopup
        open={discordDialogOpen}
        handleClose={() => setDiscordDialogOpen(false)}
      ></DiscordServerVerificationPopup>
      <ErrorDialog handleClose={() => reset()} open={isError} message={error} />
      <LoadingDialog open={isLoading} message="Creating task..." />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          mb: 4,
          position: "relative",
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
            Join Discord
          </Typography>
        </Stack>

        <Typography
          mt={2}
          mx="auto"
          textAlign="center"
          color="white"
          sx={{
            width: {
              xs: "100%",
              sm: "700px",
              xxl: "1000px"
            }
          }}
          variant="body"
        >
          Ask your community to Join your Discord Community.
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
        {!isDiscordVerified && (
          <Stack
            sx={{
              margin: "0 auto",
              width: {
                xs: "100%",
                sm: "400px",
                xxl: "500px"
              }
            }}
          >
            {/* <Typography
              className="text-secondary"
              mx="auto"
              my={2}
              textAlign="center"
              color="white"
              variant="body1"
            >
              Please verify the discord account for your community.
            </Typography> */}
            <Button
              sx={{
                textTransform: "uppercase"
              }}
              onClick={() => setDiscordDialogOpen(true)}
              type="button"
              variant="outlined"
              size="medium"
              color="offWhite"
            >
              Connect your discord
            </Button>
          </Stack>
        )}

        {isDiscordVerified && (
          <Chip icon={<DoneIcon />} color="success" label="Discord Verified" />
        )}
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
            required: true
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
                placeholder="Write a personalised message to your community asking them to join your community."
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

        {/* <Controller
        name="inviteUrl"
        control={control}
        rules={{
          required: true
        }}
        render={({ field: { name, value, onChange } }) => {
          return (
            <AutTextField
              variant="standard"
              color="offWhite"
              required
              name={name}
              value={value || ""}
              onChange={onChange}
              placeholder="1234"
              helperText={
                <FormHelperText
                  value={value}
                  name={name}
                  errors={formState.errors}
                >
                  Discord Invite
                </FormHelperText>
              }
            />
          );
        }}
      /> */}
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
            disabled={!formState.isValid || !inviteLink}
            sx={{ width: "250px" }}
          />
        </Box>
      </Stack>
    </Container>
  );
};

export default memo(JoinDiscordTasks);
