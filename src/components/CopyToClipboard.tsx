import React, { useState } from "react";
import { styled, Typography } from "@mui/material";

const CopyWrapper = styled("div")(
  ({ theme }) => `
  display: flex;
  align-content: center;
  text-transform: none;
  width: 100%;
  justify-content: space-between;
  line-height: 48px;
  height: 48px;
  border-width: 1px;
  border-style: solid;
  padding: 0 15px;
  margin-top: 5px;
  align-items: center;
  cursor: pointer;
  &.dark {
    background-color: ${theme.palette.background.paper} !important;
  }
  &.light {
    border: 1px solid ${theme.palette.primary.main};
  }
`
);

function ClipboardToCopy({ url, mode, sx = {}, trim = (v) => v }) {
  const [isCopied, setIsCopied] = useState(false);

  // This is the function we wrote earlier
  async function copyTextToClipboard(text) {
    if ("clipboard" in navigator) {
      return navigator.clipboard.writeText(text);
    }
    return document.execCommand("copy", true, text);
  }

  // onClick handler function for the copy button
  const handleCopyClick = () => {
    // Asynchronously call copyTextToClipboard
    copyTextToClipboard(url)
      .then(() => {
        // If successful, update the isCopied state value
        setIsCopied(true);

        setTimeout(() => {
          setIsCopied(false);
        }, 2500);
      })
      .catch(console.error);
  };

  return (
    <CopyWrapper
      style={sx}
      className={`copy-wrapper ${mode}`}
      onClick={handleCopyClick}
    >
      <Typography
        variant="h4"
        sx={{
          textAlign: "center",
          flex: 1
        }}
        color="info.dark"
        component="span"
      >
        {trim(url)}
      </Typography>
      <div
        className="copy-text"
        style={{
          transition: "all 0.3s ease-in",
          opacity: isCopied ? "0.7" : "1"
        }}
      >
        <Typography variant="h4" color="info.dark" component="span">
          {isCopied ? "Copied!" : "COPY"}
        </Typography>
      </div>
    </CopyWrapper>
  );
}

export default ClipboardToCopy;
