import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Box,
  styled
} from "@mui/material";
import { AutOsButton } from "@components/AutButton";

const AutStyledDialog = styled(Dialog)(({ theme }) => ({
  ".MuiPaper-root": {
    margin: "0",
    width: "400px",
    backgroundColor: "#1E2430",
    borderRadius: "24px",
    padding: "24px",
    boxShadow:
      "0px 16px 80px 0px #2E90FA, 0px 0px 16px 0px rgba(20, 200, 236, 0.64), 0px 0px 16px 0px rgba(20, 200, 236, 0.32)"
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  width: "100%",
  "& .MuiInputBase-input": {
    color: theme.palette.offWhite.main,
    textFillColor: theme.palette.offWhite.main // Using camelCase here
  },
  "& .MuiInputBase-root": {
    caretColor: theme.palette.primary.main,
    "& fieldset": {
      borderColor: "#576176",
      borderRadius: "6px"
    },
    "&:hover fieldset": {
      borderColor: theme.palette.primary.light
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main
    }
  },
  "& .MuiInputLabel-root": {
    color: "#7C879D"
  }
}));

const DomainRegistrationDialog = ({ open, onClose, onRegister }) => {
  const [domain, setDomain] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    validateDomain(domain);
  }, [domain]);

  const validateDomain = (value) => {
    const domainRegex =
      /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+$/;
    const hubEndingRegex = /\.hub$/i;
    const trimmedValue = value.trim().toLowerCase();

    if (trimmedValue === "") {
      setIsValid(false);
      setErrorMessage("Domain name is required");
    } else if (!domainRegex.test(trimmedValue)) {
      setIsValid(false);
      setErrorMessage("Invalid domain format");
    } else if (trimmedValue.length > 253) {
      setIsValid(false);
      setErrorMessage("Domain name is too long (max 253 characters)");
    } else if (!hubEndingRegex.test(trimmedValue)) {
      setIsValid(false);
      setErrorMessage("Domain must end with '.hub'");
    } else {
      setIsValid(true);
      setErrorMessage("");
    }
  };

  const handleRegister = () => {
    if (isValid) {
      onRegister(domain.trim().toLowerCase());
    }
  };

  return (
    <AutStyledDialog open={open} onClose={onClose}>
      <DialogTitle>
        <Typography variant="subtitle1" color="offWhite.main">
          Register Domain
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="offWhite.main" gutterBottom>
          Enter a domain name for your Nova.
        </Typography>
        <StyledTextField
          autoFocus
          margin="dense"
          label="Domain"
          type="text"
          fullWidth
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          helperText={errorMessage || " "}
          error={Boolean(errorMessage)}
        />
      </DialogContent>
      <DialogActions>
        <AutOsButton
          onClick={onClose}
          type="button"
          color="primary"
          variant="outlined"
          sx={{
            width: "100px"
          }}
        >
          <Typography fontWeight="700" fontSize="16px" lineHeight="26px">
            Cancel
          </Typography>
        </AutOsButton>
        <AutOsButton
          onClick={handleRegister}
          type="button"
          color="primary"
          variant="outlined"
          disabled={!isValid}
          sx={{
            width: "100px"
          }}
        >
          <Typography fontWeight="bold" fontSize="16px" lineHeight="26px">
            Register
          </Typography>
        </AutOsButton>
      </DialogActions>
    </AutStyledDialog>
  );
};

export default DomainRegistrationDialog;
