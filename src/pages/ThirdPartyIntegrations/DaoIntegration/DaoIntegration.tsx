import { useState, useMemo, useEffect, useRef, memo } from "react";
import { Typography, Container } from "@mui/material";
import debounce from "lodash.debounce";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { useAppDispatch } from "@store/store.model";
import { useSelector } from "react-redux";
import { ResultState } from "@store/result-status";
import LoadingDialog from "@components/Dialog/LoadingPopup";
import { pxToRem } from "@utils/text-size";
import { AutTextField } from "@components/Fields";
import { AutButton } from "@components/buttons";
import { AutHeader } from "@components/AutHeader";
import { addPAUrl, getPAUrl } from "@api/community.api";

function AlertDialog({ handleClose, open }) {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent
        sx={{ maxWidth: "420px", minWidth: "420px", minHeight: "120px" }}
      >
        <DialogContentText
          sx={{
            textAlign: "center"
          }}
          id="alert-dialog-description"
        >
          <Typography
            variant="h1"
            textAlign="center"
            component="span"
            color="green"
          >
            Transaction was successful
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {/* <SwButton onClick={handleClose} autoFocus>
          Dismiss
        </SwButton> */}
      </DialogActions>
    </Dialog>
  );
}

const DaoIntegration = () => {
  const dispatch = useAppDispatch();
  const [disabled, setDisabled] = useState(false);
  const [daoUrl, setDaoUrl] = useState("");
  const [open, setOpen] = useState(false);
  const input = useRef<any>();
  const { status, paUrl } = useSelector((state: any) => state.dashboard);

  const handleClose = () => {
    setOpen(false);
  };

  const submit = async () => {
    dispatch(addPAUrl(daoUrl));
  };

  const debouncedChangeHandler = useMemo(() => {
    const changeHandler = (e) => {
      setDaoUrl(e.target.value);
    };
    return debounce(changeHandler, 10);
  }, []);

  useEffect(() => {
    return () => debouncedChangeHandler.cancel();
  }, [debouncedChangeHandler]);

  useEffect(() => {
    if (paUrl && input.current) {
      input.current.value = paUrl;
    }
    setDisabled(!!paUrl);
  }, [input, paUrl]);

  useEffect(() => {
    const promise = dispatch(getPAUrl(null));
    return () => promise.abort();
  }, [dispatch]);

  return (
    <Container
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
      }}
      maxWidth="md"
    >
      <LoadingDialog
        open={status === ResultState.Updating}
        message="Adding dao url..."
      />
      <AlertDialog handleClose={handleClose} open={open} />

      <AutHeader
        title="Your dāut"
        subtitle={
          <>
            This is where your DAO lives. Add the URL where you’ll be
            integrating <br />
            dAut’s Decentralized Authentication System using your Community
            Address.
          </>
        }
      />
      <AutTextField
        width="360"
        variant="standard"
        autoFocus
        disabled={disabled || status === ResultState.Loading}
        focused
        color="primary"
        placeholder="Your URL"
        inputRef={input}
        onChange={debouncedChangeHandler}
        helperText={
          <Typography fontSize={pxToRem(16)} color="white">
            Required Field
          </Typography>
        }
      />
      <AutButton
        sx={{
          minWidth: pxToRem(325),
          maxWidth: pxToRem(325),
          height: pxToRem(70),
          mt: pxToRem(100)
        }}
        type="submit"
        color="primary"
        variant="outlined"
        disabled={!daoUrl?.length || status === ResultState.Loading || disabled}
        onClick={submit}
      >
        Confirm & Sign
      </AutButton>
    </Container>
  );
};

export default memo(DaoIntegration);
