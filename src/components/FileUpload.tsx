import { Avatar, SvgIcon, Typography, styled, useTheme } from "@mui/material";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { ReactComponent as UploadIcon } from "@assets/aut/upload-icon.svg";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

const UploadWrapper = styled("div")(({ theme, color }) => {
  return {
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    border: `1px solid ${theme.palette[color].dark}`,
    transition: theme.transitions.create(["border-color"]),
    "&:hover": {
      borderWidth: "2px",
      borderColor: theme.palette[color].dark
    },
    cursor: "pointer",
    position: "relative",
    [theme.breakpoints.up("xs")]: {
      height: "70px",
      width: "70px"
    },
    [theme.breakpoints.up("xxl")]: {
      height: "70px",
      width: "70px"
    }
  };
});

const TaskUploadWrapper = styled("div")(({ theme, color }) => {
  return {
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    border: `1px solid ${theme.palette[color].dark}`,
    borderRadius: "8.5px",
    transition: theme.transitions.create(["border-color"]),
    "&:hover": {
      borderWidth: "2px",
      borderColor: theme.palette[color].dark
    },
    cursor: "pointer",
    position: "relative",
    width: "100%",
    [theme.breakpoints.up("xs")]: {
      height: "70px"
    },
    [theme.breakpoints.up("xxl")]: {
      height: "70px"
    }
  };
});

const Action = styled("div")(({ theme, color }) => ({
  opacity: 0,
  "&.show": {
    opacity: 1
  },
  width: "100%",
  height: "100%",
  position: "absolute",
  display: "flex",
  top: 0,
  left: 0,
  alignItems: "center",
  justifyContent: "center",
  transition: theme.transitions.create(["opacity", "transform"]),
  ".MuiAvatar-fallback": {
    fill: theme.palette[color].dark
  },
  ".MuiSvgIcon-root": {
    width: "1.2em",
    height: "1.2em",
    "&.remove": {
      color: theme.palette.error.main
    },
    "&.upload": {
      fill: theme.palette.primary.main
    }
  }
}));

const AFileUpload = ({
  fileChange = (file: File) => null,
  initialPreviewUrl = null,
  color = null
}) => {
  const [preview, setPreview] = useState(initialPreviewUrl);
  const [showAction, setShowAction] = useState(false);
  const theme = useTheme();
  const { getRootProps, getInputProps, open } = useDropzone({
    noClick: true,
    multiple: false,
    noKeyboard: true,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"]
    },
    onDrop: ([file]) => {
      const url = URL.createObjectURL(file);
      setPreview(url);
      fileChange(file);
    }
  });

  const handleActionClick = () => {
    if (preview) {
      setPreview(null);
      fileChange(null);
    } else {
      open();
    }
  };

  const toggleActions = (show: boolean) => {
    setShowAction(show);
  };

  return (
    <UploadWrapper
      onMouseEnter={() => toggleActions(true)}
      onMouseLeave={() => toggleActions(false)}
      onClick={handleActionClick}
      color={color}
    >
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
      </div>
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center"
        }}
      >
        <Avatar
          alt="Avatar"
          variant="square"
          src={preview}
          sx={{
            cursor: "pointer",
            background: "transparent",
            height: "100%",
            width: "100%",
            "&.MuiAvatar-root": {
              justifyContent: "center"
            }
          }}
          imgProps={{
            style: {
              maxHeight: "100%",
              maxWidth: "100%",
              objectFit: "cover"
            }
          }}
        >
          <SvgIcon
            sx={{
              fill: theme.palette[color].dark
            }}
            component={UploadIcon}
            inheritViewBox
          />
        </Avatar>
        <Action color={color} className={`${showAction ? "show" : ""}`}>
          {preview ? <HighlightOffIcon className="remove" /> : null}
        </Action>
      </div>
    </UploadWrapper>
  );
};

export default AFileUpload;

export const TaskFileUpload = ({
  fileChange = (file: File) => null,
  initialPreviewUrl = null,
  color = null
}) => {
  const [preview, setPreview] = useState(initialPreviewUrl);
  const [file, setFile] = useState(null);
  const [showAction, setShowAction] = useState(false);
  const theme = useTheme();
  const { getRootProps, getInputProps, open } = useDropzone({
    noClick: true,
    multiple: false,
    noKeyboard: true,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "application/pdf": [".pdf"],
      "text/plain": [".txt"]
    },
    onDrop: ([file]) => {
      const url = URL.createObjectURL(file);
      setPreview(url);
      setFile(file);
      fileChange(file);
    }
  });

  const handleActionClick = () => {
    if (preview) {
      setPreview(null);
      setFile(null);
      fileChange(null);
    } else {
      open();
    }
  };

  const toggleActions = (show: boolean) => {
    setShowAction(show);
  };

  return (
    <TaskUploadWrapper
      onMouseEnter={() => toggleActions(true)}
      onMouseLeave={() => toggleActions(false)}
      onClick={handleActionClick}
      color={color}
    >
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
      </div>
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {file ? (
          <Typography
            variant="subtitle2"
            color="white"
            sx={{ textOverflow: "ellipsis", overflow: "hidden" }}
          >
            {file.name}
          </Typography>
        ) : (
          <Avatar
            alt="Avatar"
            variant="square"
            src={preview}
            sx={{
              cursor: "pointer",
              background: "transparent",
              height: "100%",
              width: "100%",
              "&.MuiAvatar-root": {
                justifyContent: "center"
              }
            }}
            imgProps={{
              style: {
                maxHeight: "100%",
                maxWidth: "100%",
                objectFit: "cover"
              }
            }}
          >
            <SvgIcon
              sx={{
                fill: theme.palette[color].dark
              }}
              component={UploadIcon}
              inheritViewBox
            />
          </Avatar>
        )}

        <Action color={color} className={`${showAction ? "show" : ""}`}>
          {preview ? <HighlightOffIcon className="remove" /> : null}
        </Action>
      </div>
    </TaskUploadWrapper>
  );
};
