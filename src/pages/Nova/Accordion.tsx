import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Box,
  FormControlLabel,
  Switch
} from "@mui/material";
import { AutTextField } from "@theme/field-text-styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export const StyledAccordion = ({
  title,
  children,
  expanded = undefined,
  onChange = undefined
}) => {
  const [internalExpanded, setInternalExpanded] = useState(false);

  const isControlled = expanded !== undefined;
  const isExpanded = isControlled ? expanded : internalExpanded;

  const handleChange = (event, isExpanded) => {
    if (!isControlled) {
      setInternalExpanded(isExpanded);
    }
    if (onChange) {
      onChange(event, isExpanded);
    }
  };

  return (
    <Accordion
      expanded={isExpanded}
      onChange={handleChange}
      sx={{
        background: "transparent",
        marginBottom: 2,
        borderRadius: "15px !important",
        "&::before": {
          display: "none"
        }
      }}
    >
      <AccordionSummary
        sx={{
          borderRadius: "15px"
        }}
        expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
      >
        <Typography fontFamily="FractulRegular" color="white" variant="h6">
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          borderRadius: "15px"
        }}
      >
        {children}
      </AccordionDetails>
    </Accordion>
  );
};
