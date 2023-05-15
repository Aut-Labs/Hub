import { Typography, styled } from "@mui/material";
import { memo } from "react";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";
import { isValid } from "date-fns";

const Countdown = styled("div")({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  "& > DIV > DIV:nth-of-type(even)": {
    marginLeft: "4px",
    marginRight: "4px"
  },
  "& > DIV > DIV:nth-of-type(odd) > DIV:nth-of-type(2)": {
    marginRight: "2px"
  }
});

const BetaCountdown = ({
  to,
  textAlign = "center",
  hasStarted = false
}: {
  to: Date;
  hasStarted: boolean;
  textAlign?: string;
}) => {
  return (
    <>
      {isValid(to) && (
        <Countdown>
          <Typography
            width="100%"
            textAlign={textAlign as any}
            variant="subtitle2"
            mb={1}
            className="text-secondary"
          >
            {hasStarted ? "Beta ends in" : "Beta starts in"}
          </Typography>
          <FlipClockCountdown
            digitBlockStyle={{
              fontFamily: "FractulRegular",
              width: "26px",
              height: "40px",
              fontSize: "38px"
            }}
            labelStyle={{
              fontSize: "12px",
              fontFamily: "FractulRegular"
            }}
            separatorStyle={{
              size: "4px"
            }}
            to={to?.toUTCString()}
          />
        </Countdown>
      )}
    </>
  );
};

export default memo(BetaCountdown);
