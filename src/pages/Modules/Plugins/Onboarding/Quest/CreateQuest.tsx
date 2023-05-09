/* eslint-disable max-len */
import {
  useCreateQuestMutation,
  useGetAllOnboardingQuestsQuery,
  useUpdateQuestMutation
} from "@api/onboarding.api";
import { PluginDefinition } from "@aut-labs-private/sdk";
import ErrorDialog from "@components/Dialog/ErrorPopup";
import LoadingDialog from "@components/Dialog/LoadingPopup";
import { FormHelperText } from "@components/Fields";
import { StepperButton } from "@components/Stepper";
import {
  Box,
  Button,
  Container,
  InputAdornment,
  MenuItem,
  Stack,
  Tooltip,
  Typography
} from "@mui/material";
import { allRoles } from "@store/Community/community.reducer";
import { AutSelectField } from "@theme/field-select-styles";
import { AutTextField } from "@theme/field-text-styles";
import { pxToRem } from "@utils/text-size";
import { memo, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams
} from "react-router-dom";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { RequiredQueryParams } from "@api/RequiredQueryParams";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LinkWithQuery from "@components/LinkWithQuery";
import AddIcon from "@mui/icons-material/Add";
import { getMemberPhases, getOwnerPhases } from "@utils/beta-phases";

const errorTypes = {
  maxWords: `Words cannot be more than 3`,
  maxNameChars: `Characters cannot be more than 24`,
  maxLength: `Characters cannot be more than 280`
};

interface PluginParams {
  plugin: PluginDefinition;
}

const QuestSuccess = ({ newQuestId, existingQuestId, pluginAddress }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const path = useMemo(() => {
    if (existingQuestId) {
      return location.pathname.replaceAll("/create", `/${existingQuestId}`);
    }
    return location.pathname.replaceAll("/create", `/${newQuestId}`);
  }, [location.pathname]);

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
          Success! Your Onboarding Quest call has been{" "}
          {existingQuestId ? "edited" : "created"} and deployed on the
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
            sx={{
              my: pxToRem(50)
            }}
            color="offWhite"
            size="small"
            variant="outlined"
            startIcon={<AddIcon />}
            to="/aut-dashboard/modules/Task"
            queryParams={{
              onboardingQuestAddress: pluginAddress,
              returnUrlLinkName: "Back to quest",
              returnUrl: path,
              questId: (newQuestId || existingQuestId).toString()
            }}
            component={LinkWithQuery}
          >
            Add task
          </Button>
          <Button
            sx={{
              my: pxToRem(50)
            }}
            onClick={() => navigate(path)}
            type="submit"
            variant="outlined"
            size="medium"
            color="offWhite"
          >
            See Quest
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

function questDurationInDays() {
  const { phaseOneDuration, phaseTwoDuration } = getMemberPhases();
  const totalDuration = phaseOneDuration + phaseTwoDuration;
  const numberOfDays = totalDuration / (24 * 60 * 60 * 1000); // number of milliseconds in a day
  return numberOfDays;
}

const CreateQuest = ({ plugin }: PluginParams) => {
  const [roles] = useState(useSelector(allRoles));
  const [searchParams] = useSearchParams();
  const [initialized, setInitialized] = useState(false);
  const {
    control,
    handleSubmit,
    getValues,
    reset: resetForm,
    formState
  } = useForm({
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      durationInDays: questDurationInDays(),
      startDate: getOwnerPhases().phaseThreeEndDate,
      role: null
    }
  });

  const { quests, quest } = useGetAllOnboardingQuestsQuery(
    plugin.pluginAddress,
    {
      selectFromResult: ({ data }) => ({
        quests: data || [],
        quest: (data || []).find(
          (q) => q.questId === +searchParams.get(RequiredQueryParams.QuestId)
        )
      })
    }
  );

  const [
    createQuest,
    {
      error: createError,
      isError: createIsError,
      data: newQuest,
      isSuccess: createIsSuccess,
      isLoading: createIsLoading,
      reset: createReset
    }
  ] = useCreateQuestMutation();

  const [
    updateQuest,
    {
      error: updateError,
      isError: updateIsError,
      data: updatedQuest,
      isSuccess: updateIsSuccess,
      isLoading: updateIsLoading,
      reset: updateReset
    }
  ] = useUpdateQuestMutation();

  const onSubmit = async () => {
    const values = getValues();
    const startDate = Math.floor(new Date(values.startDate).getTime() / 1000);
    if (quest?.questId) {
      updateQuest({
        ...quest,
        pluginAddress: plugin.pluginAddress,
        role: values.role,
        durationInDays: values.durationInDays,
        startDate,
        metadata: {
          name:
            values.title || roles.find((r) => r.id === values.role)?.roleName,
          description: values.description,
          properties: {}
        }
      });
    } else {
      createQuest({
        pluginAddress: plugin.pluginAddress,
        role: values.role,
        durationInDays: values.durationInDays,
        startDate,
        metadata: {
          name:
            values.title || roles.find((r) => r.id === values.role)?.roleName,
          description: values.description,
          properties: {}
        }
      });
    }
  };

  useEffect(() => {
    if (!initialized && quest) {
      resetForm({
        title: quest.metadata.name,
        description: quest.metadata.description,
        durationInDays: quest.durationInDays,
        startDate: new Date(quest.startDate),
        role: quest.role
      });
      setInitialized(true);
    }
  }, [initialized, quest]);

  return (
    <>
      {createIsSuccess || updateIsSuccess ? (
        <QuestSuccess
          existingQuestId={quest?.questId}
          pluginAddress={plugin.pluginAddress}
          newQuestId={newQuest?.questId}
        />
      ) : (
        <Container
          sx={{ py: "20px", display: "flex", flexDirection: "column" }}
          maxWidth="lg"
          component="form"
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
        >
          <ErrorDialog
            handleClose={() => createReset()}
            open={createIsError}
            message={createError}
          />
          <ErrorDialog
            handleClose={() => updateReset()}
            open={updateIsError}
            message={updateError}
          />
          <LoadingDialog open={createIsLoading} message="Creating quest..." />
          <LoadingDialog open={updateIsLoading} message="Updating quest..." />

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              mb: 4,
              position: "relative",
              mx: "auto",
              width: "100%"
            }}
          >
            <Stack alignItems="center" justifyContent="center">
              {quest?.questId && (
                <Button
                  startIcon={<ArrowBackIcon />}
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
                  {searchParams.get("returnUrlLinkName") || "Back"}
                </Button>
              )}

              <Typography textAlign="center" color="white" variant="h3">
                {quest?.questId
                  ? "Editing onboarding quest"
                  : "Creating onboarding quest"}
              </Typography>
            </Stack>
          </Box>

          <Stack
            direction="column"
            gap={4}
            sx={{
              margin: "0 auto",
              width: {
                xs: "100%",
                sm: "400px",
                xxl: "800px"
              }
            }}
          >
            <Controller
              name="role"
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
                        return "Role" as any;
                      }
                      const role = roles.find((t) => t.id === selected);
                      return role?.roleName || selected;
                    }}
                    name={name}
                    value={value || ""}
                    displayEmpty
                    required
                    onChange={onChange}
                    helperText={
                      <FormHelperText
                        value={value}
                        name={name}
                        errors={formState.errors}
                      >
                        Select a role with which members can join
                      </FormHelperText>
                    }
                  >
                    {roles.map((type) => {
                      const questByRole = quests.some(
                        (q) => q.role === type.id
                      );
                      return (
                        <MenuItem
                          disabled={!!questByRole}
                          key={`role-${type.id}`}
                          value={type.id}
                        >
                          {type.roleName}
                          {!!questByRole && <> (Quest already created) </>}
                        </MenuItem>
                      );
                    })}
                  </AutSelectField>
                );
              }}
            />

            <Controller
              name="durationInDays"
              control={control}
              rules={{
                required: true
              }}
              render={({ field: { name, value, onChange } }) => {
                return (
                  <AutTextField
                    name={name}
                    disabled
                    value={value || ""}
                    type="number"
                    onChange={onChange}
                    variant="standard"
                    color="offWhite"
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment
                          sx={{
                            ".MuiTypography-root": {
                              color: "white"
                            }
                          }}
                          position="end"
                        >
                          days
                        </InputAdornment>
                      )
                    }}
                    placeholder="Duration"
                    helperText={
                      <FormHelperText
                        errorTypes={errorTypes}
                        value={value}
                        name={name}
                        errors={formState.errors}
                      >
                        <Tooltip title="During the closed beta, the duration of each onboarding quest will be Xdays and begin on the Xth, until then you can invite your community to allowlist for quests you have activated. During the onboarding period, every community will be listed on the Nova Leaderboard where the number of successful onboardings will correspond to their ranking. Happy Onboarding!">
                          <HelpOutlineIcon
                            // color="white"
                            sx={{
                              color: "white",
                              width: {
                                sm: "16px"
                              }
                            }}
                          />
                        </Tooltip>
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
                    placeholder="Describe the onboarding quest to your community"
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

            <StepperButton
              label={
                quest?.questId
                  ? "Edit Onboarding Quest"
                  : "Create Onboarding Quest"
              }
              disabled={!formState.isValid}
            />
          </Stack>
        </Container>
      )}
    </>
  );
};

export default memo(CreateQuest);
