import { CopyToClipboard } from "react-copy-to-clipboard";
import { Tooltip, Typography, IconButton } from "@mui/material";
import { useState } from "react";
import LinkIcon from "@mui/icons-material/Link";

const CopyLink = ({ link, variant = null }) => {
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
    <CopyToClipboard text={link} onCopy={() => clickCopy(true)}>
      <div
        onClick={(event) => event.stopPropagation()}
        style={{ color: "white" }}
      >
        <Tooltip title={copied ? "Copied!" : "Copy link"}>
          <Typography
            variant={variant || "body1"}
            color="white"
            fontWeight="normal"
          >
            <IconButton sx={{ color: "white", p: 0 }}>
              <LinkIcon sx={{ cursor: "pointer", width: "20px", ml: "5px" }} />
            </IconButton>
          </Typography>
        </Tooltip>
      </div>
    </CopyToClipboard>
  );
};

export default CopyLink;
