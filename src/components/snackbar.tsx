import { useDispatch, useSelector } from "react-redux";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { closeSnackbar } from "@store/ui-reducer";
import React from "react";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function SWSnackbar() {
  const dispatch = useDispatch();

  const { message, duration, severity, open } = useSelector(
    (state: any) => state.ui.snackbar
  );

  const handleClose = () => {
    dispatch(closeSnackbar());
  };

  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right"
      }}
      autoHideDuration={duration}
      open={open}
      onClose={handleClose}
    >
      <Alert
        onClose={handleClose}
        severity={severity as any}
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
