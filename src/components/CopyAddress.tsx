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
          <div style={{ display: "flex" }}>
            <Typography
              variant={variant || "body1"}
              color="offWhite.main"
              fontFamily="FractulRegular"
              sx={{
                display: "flex",
                fontSize: "12px",
                fontStyle: "normal",
                fontWeight: "400",
                lineHeight: "18px",
                letterSpacing: "0.66px",
                alignItems: "center",
                textDecoration: "underline",
                borderRadius: "8px 0px 0px 8px",
                background: "rgba(255, 255, 255, 0.16)",
                cursor: "pointer",
                padding: "5px 5px 5px 10px",
                ":hover": {
                  background: "rgba(255, 255, 255, 0.24)"
                }
              }}
            >
              {trimAddress(address)}
            </Typography>
            <IconButton
              sx={{
                color: "offWhite.main",
                p: 0,
                borderRadius: "0px 8px 8px 0px",
                ml: "2px",
                background: "rgba(255, 255, 255, 0.16)",
                padding: "5px 10px 5px 5px",
                ":hover": {
                  background: "rgba(255, 255, 255, 0.24)"
                }
              }}
            >
              <ContentCopyIcon
                sx={{ cursor: "pointer", width: "17px", ml: "5px" }}
              />
            </IconButton>
          </div>
        </Tooltip>
      </div>
    </CopyToClipboard>
  );
};

export default CopyAddress;
