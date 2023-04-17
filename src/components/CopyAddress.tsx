import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { trimAddress } from "@utils/helpers";
import { Tooltip, Typography, IconButton } from "@mui/material";
import { useState } from "react";

export const CopyAddress = ({ address, variant = null }) => {
  const [copied, setCopied] = useState(false);

  function clickCopy(copied) {
    if (copied === true) {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    } else {
      return null;
    }
  }

  return (
    <CopyToClipboard text={address} onCopy={() => clickCopy(true)}>
      <div
        onClick={(event) => event.stopPropagation()}
        style={{ color: "white" }}
      >
        <Tooltip title={copied ? "Copied!" : "Copy Address"}>
          <Typography
            variant={variant || "body1"}
            color="white"
            fontWeight="normal"
          >
            {trimAddress(address)}
            <IconButton sx={{ color: "white", p: 0 }}>
              <ContentCopyIcon
                sx={{ cursor: "pointer", width: "20px", ml: "5px" }}
              />
            </IconButton>
          </Typography>
        </Tooltip>
      </div>
    </CopyToClipboard>
  );
};

export default CopyAddress;
