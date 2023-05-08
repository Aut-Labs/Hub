import { Button, Stack, Typography } from "@mui/material";
import DialogWrapper from "./DialogWrapper";
import CloseIcon from "@mui/icons-material/Close";
import { TwitterShareButton } from "react-share";
import { AutButton } from "@components/buttons";

const SuccessDialog = ({
  open,
  handleClose,
  subtitle,
  message,
  fullScreen,
  titleVariant,
  subtitleVariant,
  twitterProps
}: any) => {
  return (
    <DialogWrapper open={open} onClose={handleClose} fullScreen={fullScreen}>
      <div
        className="sw-join-dialog-content"
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Stack>
          <Typography
            sx={{
              color: "white",
              textAlign: "center",
              mt: 2
            }}
            component="div"
            variant={titleVariant || "h1"}
          >
            {message}
          </Typography>
        </Stack>
        <Stack sx={{ flex: "1", justifyContent: "center" }}>
          <Typography
            sx={{
              color: "white",
              textAlign: "center",
              mt: 2
            }}
            component="div"
            variant={subtitleVariant || "h2"}
          >
            {subtitle}
          </Typography>
        </Stack>
      </div>
    </DialogWrapper>
  );
};

export default SuccessDialog;
