/* eslint-disable max-len */
import { useCreateTaskPerQuestMutation } from "@api/onboarding.api";
import { PluginDefinition, Task } from "@aut-labs-private/sdk";
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
  Typography
} from "@mui/material";
import { AutTextField } from "@theme/field-text-styles";
import { pxToRem } from "@utils/text-size";
import { memo, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { dateToUnix } from "@utils/date-format";
import { addMinutes } from "date-fns";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { RequiredQueryParams } from "@api/RequiredQueryParams";
import { AutSelectField } from "@theme/field-select-styles";
import { InteractionNetworks } from "@utils/transaction-networks";
import LinkWithQuery from "@components/LinkWithQuery";
import { countWords } from "@utils/helpers";

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
          Success! Transaction task has been created and deployed on the
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
              {searchParams.get("returnUrlLinkName") || "Back"}
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
};

const endDatetime = new Date();
addMinutes(endDatetime, 45);

const TransactionTasks = ({ plugin }: PluginParams) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { control, handleSubmit, getValues, formState } = useForm({
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      linkToInteractUrl: "",
      smartContractAddress: "",
      functionName: "",
      network: ""
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
            network: values.network,
            linkToInteractUrl: values.linkToInteractUrl,
            smartContractAddress: values.smartContractAddress,
            functionName: values.functionName
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
            Create a Smart Contract Task
          </Typography>
        </Stack>
        <Typography
          mt={2}
          sx={{
            width: {
              xs: "100%",
              sm: "700px",
              xxl: "1000px"
            }
          }}
          mx="auto"
          textAlign="center"
          color="white"
          variant="body"
        >
          Create a task based on a Smart Contract Interaction. We will
          automatically validate the interaction on the chosen smart contract(s)
          in order to approve the submission.
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
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {value ? (
                        <></>
                      ) : (
                        <Typography variant="caption" color="offWhite.dark">
                          e.g. Mint an NFT on Opensea
                        </Typography>
                      )}
                    </InputAdornment>
                  )
                }}
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
                placeholder="Write a description of the task for your community"
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
          name="network"
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
                    return "Network" as any;
                  }
                  const network = InteractionNetworks.find(
                    (t) => t.network === selected
                  );
                  return network?.name || selected;
                }}
                name={name}
                value={value || ""}
                displayEmpty
                required
                onChange={onChange}
              >
                {InteractionNetworks.map((type) => {
                  return (
                    <MenuItem key={`role-${type.network}`} value={type.network}>
                      {type.name}
                    </MenuItem>
                  );
                })}
              </AutSelectField>
            );
          }}
        /> */}

        <Controller
          name="linkToInteractUrl"
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
                placeholder="Your DApp's URL"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {value ? (
                        <></>
                      ) : (
                        <Typography variant="caption" color="offWhite.dark">
                          e.g. https://opensea.io/
                        </Typography>
                      )}
                    </InputAdornment>
                  )
                }}
              />
            );
          }}
        />

        <Controller
          name="smartContractAddress"
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
                placeholder="Smart Contract Address"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {value ? (
                        <></>
                      ) : (
                        <Typography variant="caption" color="offWhite.dark">
                          0x…
                        </Typography>
                      )}
                    </InputAdornment>
                  )
                }}
              />
            );
          }}
        />

        <Controller
          name="functionName"
          control={control}
          render={({ field: { name, value, onChange } }) => {
            return (
              <AutTextField
                variant="standard"
                color="offWhite"
                name={name}
                value={value || ""}
                onChange={onChange}
                placeholder="Copy your Contract function"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {value ? (
                        <></>
                      ) : (
                        <Typography variant="caption" color="offWhite.dark">
                          e.g. _Mint
                        </Typography>
                      )}
                    </InputAdornment>
                  )
                }}
                helperText={
                  <FormHelperText
                    errorTypes={errorTypes}
                    value={value}
                    name={name}
                    errors={formState.errors}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column"
                      }}
                    >
                      <Typography
                        color="white"
                        variant="caption"
                        textAlign="right"
                      >
                        *Only required if you’d like to specify the interaction
                        function.
                      </Typography>
                      <Typography
                        color="white"
                        variant="caption"
                        textAlign="right"
                      >
                        Not applicable to multiple contract tasks
                      </Typography>
                    </Box>
                  </FormHelperText>
                }
              />
            );
          }}
        />

        <Box
          sx={{
            width: "100%",
            display: "flex",
            mt: 2,
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

export default memo(TransactionTasks);
