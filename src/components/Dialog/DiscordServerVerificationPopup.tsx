import {
  getServerDetails,
  verifyDiscordServerOwnership
} from "@api/discord.api";
import { AutButton } from "@components/buttons";
import { FormHelperText } from "@components/Fields";
import { useOAuth } from "@components/Oauth2/oauth2";
import { Typography } from "@mui/material";
import { HubData } from "@store/Hub/hub.reducer";
import { useAppDispatch } from "@store/store.model";
import { AutTextField } from "@theme/field-text-styles";
import { pxToRem } from "@utils/text-size";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import AutLoading from "../AutLoading";
import DialogWrapper from "./DialogWrapper";

const errorTypes = {
  pattern: "Invalid discord invite link"
};

const DiscordServerVerificationPopup = ({
  open,
  fullScreen = false,
  handleClose
}: any) => {
  const hubData = useSelector(HubData);
  const { getAuth, authenticating } = useOAuth();
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const { control, formState, handleSubmit, getValues } = useForm({
    mode: "onChange",
    defaultValues: {
      inviteLink: ""
    }
  });

  const authenticateDiscord = async () => {
    const values = getValues();
    const { inviteLink } = values;
    setLoading(true);
    const serverDetails = await getServerDetails(inviteLink);
    await getAuth(
      async (data) => {
        const { access_token } = data;
        const result = await dispatch(
          verifyDiscordServerOwnership({
            accessToken: access_token,
            guildId: serverDetails.guild.id
          })
        );
        if (result.meta.requestStatus === "rejected") {
          setLoading(false);
        } else {
          const hub = { ...hubData };
          for (let i = 0; i < hub.properties.socials.length; i++) {
            const element = hub.properties.socials[i];
            if (element.type === "discord") {
              element.link = values.inviteLink;
            }
          }
          // const hubUpdateResult = await dispatch(
          //   updateDiscordSocials({ hub, inviteLink })
          // );
          // if (hubUpdateResult.meta.requestStatus !== "rejected") {
          //   handleClose();
          // }
          setLoading(false);
        }
      },
      () => {
        setLoading(false);
      }
    );
  };

  return (
    <DialogWrapper
      open={open}
      fullScreen={fullScreen}
      onClose={() => handleClose()}
    >
      <form onSubmit={handleSubmit(authenticateDiscord)}>
        <div
          className="sw-join-dialog-content"
          style={{
            minHeight: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-around"
          }}
        >
          {loading || authenticating ? (
            <>
              <Typography variant="subtitle2" color="white" textAlign="center">
                Verifying..
              </Typography>
              <AutLoading width="130px" height="130px"></AutLoading>
            </>
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center"
                }}
              >
                <Typography
                  textAlign="center"
                  color="white"
                  variant="subtitle1"
                >
                  Verify Discord Server ownership
                </Typography>
                <Typography
                  width="100%"
                  textAlign="center"
                  color="white"
                  mb="10"
                  variant="body"
                >
                  Enter an invite link and authorize with discord.
                </Typography>
              </div>
              <Controller
                name="inviteLink"
                control={control}
                rules={{
                  required: true,
                  pattern:
                    /\b(?:https?:\/\/)?(?:www\.)?(?:discord\.(?:gg|com|io|me|li|gg\/invite))\/([a-zA-Z0-9-]{2,32})/
                }}
                render={({ field: { name, value, onChange } }) => {
                  return (
                    <AutTextField
                      sx={{
                        minWidth: pxToRem(325),
                        mt: pxToRem(80)
                      }}
                      name={name}
                      value={value || ""}
                      onChange={onChange}
                      variant="outlined"
                      color="offWhite"
                      required
                      rows={1}
                      placeholder="Discord server invite link."
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
              <div
                style={{
                  position: "relative"
                }}
              >
                <AutButton
                  disabled={!formState.isValid}
                  sx={{
                    minWidth: pxToRem(325),
                    maxWidth: pxToRem(325),
                    height: pxToRem(70),
                    mt: pxToRem(60)
                  }}
                  type="submit"
                  color="primary"
                  variant="outlined"
                >
                  Verify
                </AutButton>
              </div>
            </>
          )}
        </div>
      </form>
    </DialogWrapper>
  );
};

export default DiscordServerVerificationPopup;
