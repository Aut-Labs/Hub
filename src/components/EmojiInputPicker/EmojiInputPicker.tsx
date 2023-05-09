import "emoji-mart/css/emoji-mart.css";
import {
  IconButton,
  InputAdornment,
  Menu,
  StandardTextFieldProps,
  SvgIcon,
  TextField
} from "@mui/material";
import { useRef, useState } from "react";
import { ReactComponent as EmojiIcon } from "@assets/smile-emoji.svg";
import { AutTextField } from "@components/Fields";

const removeEmojisFromText = (text = "") => {
  return text.replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, "");
};

export const removeEmoji = (text: string) => {
  const formattedText = text
    .replace(
      // eslint-disable-next-line max-len
      /([#0-9]\u20E3)|[\xA9\xAE\u203C\u2047-\u2049\u2122\u2139\u3030\u303D\u3297\u3299][\uFE00-\uFEFF]?|[\u2190-\u21FF][\uFE00-\uFEFF]?|[\u2300-\u23FF][\uFE00-\uFEFF]?|[\u2460-\u24FF][\uFE00-\uFEFF]?|[\u25A0-\u25FF][\uFE00-\uFEFF]?|[\u2600-\u27BF][\uFE00-\uFEFF]?|[\u2900-\u297F][\uFE00-\uFEFF]?|[\u2B00-\u2BF0][\uFE00-\uFEFF]?|(?:\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDEFF])[\uFE00-\uFEFF]?|[\u20E3]|[\u26A0-\u3000]|\uD83E[\udd00-\uddff]|[\u00A0-\u269F]/g,
      ""
    )
    .trim();
  return formattedText;
};

export const hasEmoji = (text: string) => {
  const regexExp =
    /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi;
  const result = regexExp.test(text);
  return result;
};

interface EmojiPickerProps extends StandardTextFieldProps {
  emojiButtonProps?: {
    disabled?: boolean;
  };
}

const EmojiInputPicker = ({
  emojiButtonProps,
  value,
  onChange,
  ...inputProps
}: EmojiPickerProps) => {
  const textRef = useRef<any>();
  const [anchorEl, setAnchorEl] = useState(null);

  const openMenu = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const closeMenu = () => {
    setAnchorEl(null);
  };

  const onSelectEmoji = ({ native }) => {
    if (textRef.current) {
      // textRef.current.value = `${removeEmojisFromText(textRef.current.value).trim()} ${native}`;
      onChange({
        ...(value as unknown as any),
        emoji: native,
        option: `${removeEmojisFromText(
          (value as unknown as any)?.option
        ).trim()} ${native}`
      });
      closeMenu();
    }
  };

  return (
    <>
      <AutTextField
        variant="standard"
        {...inputProps}
        inputRef={textRef}
        value={(value as unknown as any)?.option}
        onChange={(event) => {
          onChange({
            ...(value as unknown as any),
            option: event.target.value
          });
        }}
        width="450"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                sx={{
                  position: "relative",
                  width: "25px",
                  height: "25px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
                disabled={emojiButtonProps?.disabled}
                onClick={openMenu}
                component="span"
              >
                <SvgIcon
                  sx={{
                    margin: "0 auto",
                    width: "21px",
                    height: "21px",
                    color: !emojiButtonProps?.disabled ? "#000" : "#777777",
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-43%, -43%)"
                  }}
                  component={EmojiIcon}
                />
              </IconButton>
            </InputAdornment>
          )
        }}
      />
      {/* <TextField
        {...inputProps}
        inputRef={textRef}
        value={(value as unknown as any)?.option}
        onChange={(event) => {
          onChange({
            ...(value as unknown as any),
            option: event.target.value,
          });
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                sx={{
                  position: "relative",
                  width: "25px",
                  height: "25px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                disabled={emojiButtonProps?.disabled}
                onClick={openMenu}
                color="primary"
                component="span"
              >
                <SvgIcon
                  sx={{
                    margin: "0 auto",
                    width: "21px",
                    height: "21px",
                    color: !emojiButtonProps?.disabled ? "#000" : "#777777",
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-43%, -43%)",
                  }}
                  component={EmojiIcon}
                />
              </IconButton>
            </InputAdornment>
          ),
        }}
      /> */}
      <Menu
        id="long-menu"
        MenuListProps={{
          style: {
            padding: 0
          }
        }}
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={closeMenu}
        PaperProps={{
          style: {
            width: "338px",
            border: "none",
            background: "transparent"
          }
        }}
      >
        {/* <Picker onSelect={onSelectEmoji} /> */}
      </Menu>
    </>
  );
};

export default EmojiInputPicker;
