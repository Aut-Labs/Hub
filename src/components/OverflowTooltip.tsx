import { Tooltip, Typography as Text, TypographyProps } from "@mui/material";
import React, { memo, useMemo, useRef, useState } from "react";
import LinesEllipsis from "react-lines-ellipsis";

interface OverflowTooltipParams {
  basedOn: string;
  className: string;
  component: string;
  ellipsis: string;
  maxLine: number;
  onReflow: () => void;
  text: string;
  trimRight: boolean;
  typography: Partial<TypographyProps>;
}

const OverflowTooltip = ({ text, ...rest }: Partial<OverflowTooltipParams>) => {
  const [tooltipEnabled, setTooltipEnabled] = useState(false);

  return (
    <Tooltip
      title={text}
      disableInteractive
      disableFocusListener
      disableHoverListener={!tooltipEnabled}
    >
      <Text
        variant="body"
        className="text-secondary"
        {...(rest?.typography || {})}
      >
        <LinesEllipsis
          text={text}
          onReflow={({ clamped }) => setTooltipEnabled(clamped)}
          maxLine={rest.maxLine || 1}
          ellipsis={rest.ellipsis || "..."}
          trimRight={rest.trimRight || true}
          basedOn={rest.basedOn || "letters"}
        />
      </Text>
    </Tooltip>
  );
};

export default memo(OverflowTooltip);
