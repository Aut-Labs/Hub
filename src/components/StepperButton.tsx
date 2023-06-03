import { ButtonProps, Button } from "@mui/material";
import { pxToRem } from "@utils/text-size";

export const StepperButton = ({
  label,
  ...props
}: ButtonProps & { label: string }) => {
  return (
    <Button
      sx={{
        my: pxToRem(40),
        minWidth: "200px"
      }}
      type="submit"
      variant="outlined"
      size="large"
      color="offWhite"
      {...props}
    >
      {label}
    </Button>
  );
};
