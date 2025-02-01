import { useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { useAppDispatch } from "@store/store.model";
import { useOAuthSocials } from "@components/Oauth2/oauth2";
import {
  getServerDetails,
  useVerifyGuildOwnershipMutation
} from "@api/discord.api";
import { HubData } from "@store/Hub/hub.reducer";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  styled,
  useTheme,
  useMediaQuery
} from "@mui/material";
import { SvgIcon } from "@mui/material";
import CloseIcon from "@assets/autos/close-icon.svg?react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { AutTextField } from "@theme/field-text-styles";
import { useState } from "react";
import { AutOsButton } from "@components/AutButton";
import { useMutation } from "@tanstack/react-query";

const AutStyledDialog = styled(Dialog)(({ theme }) => ({
  ".MuiPaper-root": {
    margin: "0",
    width: "620px",
    height: "720px",
    border: "none",
    position: "relative",
    flexDirection: "column-reverse",
    backgroundColor: "#1E2430",
    borderRadius: "30px",
    padding: "30px 0px",
    boxShadow:
      "0px 16px 80px 0px #2E90FA, 0px 0px 16px 0px rgba(20, 200, 236, 0.64), 0px 0px 16px 0px rgba(20, 200, 236, 0.32)"
  },
  [theme.breakpoints.down("md")]: {
    ".MuiPaper-root": {
      margin: "0",
      height: "100%",
      width: "100%",
      border: "none",
      borderRadius: "0",
      boxShadow: "none"
    }
  }
}));

const StyledTextField = styled(AutTextField)(({ theme }) => ({
  width: "100%",
  ".MuiInputBase-input": {
    fontSize: "16px",
    color: theme.palette.offWhite.main,
    "&::placeholder": {
      color: theme.palette.offWhite.main,
      opacity: 0.5
    },
    "&.Mui-disabled": {
      color: "#7C879D",
      textFillColor: "#7C879D"
    }
  },
  ".MuiInputBase-root": {
    caretColor: theme.palette.primary.main,
    fieldset: {
      border: "1.5px solid #576176 !important",
      borderRadius: "6px"
    },
    borderRadius: "6px",
    background: "#2F3746"
  },
  ".MuiInputLabel-root": {
    color: "#7C879D"
  }
}));

const FormWrapper = styled("form")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  alignItems: "flex-start",
  width: "100%",
  [theme.breakpoints.down("lg")]: {
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center"
  },
  [theme.breakpoints.down("md")]: {
    width: `calc(100% - 100px)`
  },
  [theme.breakpoints.down("sm")]: {
    width: `calc(100% - 20px)`
  }
}));

const DiscordServerVerificationPopup = ({
  open,
  onClose,
  hub,
  onChange,
  setValue,
  index
}) => {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("md"));
  const { getAuthDiscord, authenticating } = useOAuthSocials();
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const { mutateAsync } = useVerifyGuildOwnershipMutation({
    // onSuccess: (data) => {
    //   if (data.isAdmin) {
    //     console.log("Verification successful! User is the guild owner.");
    //   } else {
    //     console.log("Verification failed. User is not the guild owner.");
    //   }
    // },
    // onError: (error) => {
    //   console.error("An error occurred during verification:", error);
    // }
  });

  const { control, handleSubmit, formState } = useForm({
    mode: "onChange",
    defaultValues: {
      inviteLink: ""
    }
  });

  const authenticateDiscord = async (data) => {
    const { inviteLink } = data;
    // setLoading(true);
    const serverDetails = await getServerDetails(inviteLink);
    console.log(serverDetails);
    getAuthDiscord(
      async (data) => {
        console.log(data);
        const { access_token } = data;
        console.log("access_token", access_token);
        const result = await mutateAsync({
          accessToken: access_token,
          guildId: serverDetails.guild.id
        });
        console.log(result);
        if (result.isAdmin) {
          for (let i = 0; i < hub.properties.socials.length; i++) {
            const element = hub.properties.socials[i];
            if (element.type === "discord") {
              element.link = inviteLink;
              element.metadata.guildId = serverDetails.guild_id;
              element.metadata.guildName = serverDetails.guild.name;
            }
          }
        }
        onChange(serverDetails.guild.name);
        setValue(`socials.${index}.link`, inviteLink);
        setValue(`socials.${index}.metadata`, {
          guildId: serverDetails.guild.id,
          guildName: serverDetails.guild.name
        });
        console.log("hub", hub);
        onClose();
      },
      () => {
        setLoading(false);
      }
    );
    // await getAuth(
    //   async (authData) => {
    //     const { access_token } = authData;
    //     const result = await verifyDiscordServerOwnership({
    //       accessToken: access_token,
    //       guildId: serverDetails.guild.id
    //     });

    //     if (result.meta.requestStatus === "rejected") {
    //       setLoading(false);
    //     } else {
    //       for (let i = 0; i < hub.properties.socials.length; i++) {
    //         const element = hub.properties.socials[i];
    //         if (element.type === "discord") {
    //           element.link = inviteLink;
    //           element.guildId = serverDetails.guild_id;
    //         }
    //       }
    //       setLoading(false);
    //       onClose();
    //     }
    //   },
    //   () => {
    //     setLoading(false);
    //   }
    // );
  };

  return (
    <AutStyledDialog
      fullScreen={!desktop}
      maxWidth={false}
      onClose={onClose}
      open={open}
    >
      <DialogContent
        sx={{
          border: 0,
          padding: "20px 30px"
        }}
      >
        <PerfectScrollbar
          style={{
            height: "calc(100%)",
            display: "flex",
            flexDirection: "column",
            width: "100%"
          }}
        >
          <FormWrapper onSubmit={handleSubmit(authenticateDiscord)}>
            <Typography variant="subtitle1" color="offWhite.main" mb={2}>
              Verify Discord Server ownership
            </Typography>
            <Typography variant="body2" color="offWhite.main" mb={4}>
              Enter an invite link and authorize with Discord.
            </Typography>
            <Controller
              name="inviteLink"
              control={control}
              rules={{
                required: true,
                pattern:
                  /\b(?:https?:\/\/)?(?:www\.)?(?:discord\.(?:gg|com|io|me|li|gg\/invite))\/([a-zA-Z0-9-]{2,32})/
              }}
              render={({ field: { name, value, onChange } }) => (
                <StyledTextField
                  name={name}
                  value={value}
                  onChange={onChange}
                  placeholder="Discord server invite link"
                  fullWidth
                  disabled={loading || authenticating}
                />
              )}
            />
          </FormWrapper>
        </PerfectScrollbar>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: "space-between",
          width: "100%",
          padding: "0px 30px",
          mt: {
            xs: "64px",
            md: "0"
          }
        }}
      >
        <Box
          sx={{
            width: {
              xs: "17%",
              md: "33%"
            }
          }}
        >
          <SvgIcon
            onClick={onClose}
            sx={{
              fill: "transparent",
              height: "30px",
              width: "30px",
              cursor: "pointer"
            }}
            component={CloseIcon}
          />
        </Box>
        <Box
          sx={{
            width: {
              xs: "50%",
              md: "33%"
            },
            justifyContent: "center",
            display: "flex"
          }}
        >
          <Typography
            variant="subtitle1"
            fontSize={{
              xs: "14px",
              md: "20px"
            }}
            color="offWhite.main"
            fontWeight="bold"
          >
            Verify Discord Server
          </Typography>
        </Box>
        <Box
          sx={{
            width: "33%",
            justifyContent: "flex-end",
            display: "flex"
          }}
        >
          <AutOsButton
            onClick={handleSubmit(authenticateDiscord)}
            type="submit"
            color="primary"
            variant="outlined"
            disabled={!formState.isValid || loading || authenticating}
            sx={{
              width: "100px"
            }}
          >
            <Typography fontWeight="bold" fontSize="16px" lineHeight="26px">
              {loading || authenticating ? "Verifying..." : "Verify"}
            </Typography>
          </AutOsButton>
        </Box>
      </DialogActions>
    </AutStyledDialog>
  );
};

export default DiscordServerVerificationPopup;
