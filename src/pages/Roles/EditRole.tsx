import { TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import { pxToRem } from "@utils/text-size";

const EditRole = ({ control, activeRoleIndex }) => {
  return (
    <Controller
      key={`roles[${activeRoleIndex}].roleName`}
      name={`roles[${activeRoleIndex}].roleName`}
      control={control}
      render={({ field: { name, value, onChange } }) => {
        return (
          <TextField
            variant="standard"
            sx={{
              width: pxToRem(350),
              ".MuiInput-root": {
                width: pxToRem(350),
                color: "primary.main",
                fontSize: pxToRem(21),
                "&:hover:not(.Mui-disabled):before": {
                  borderBottom: "1px solid #000000"
                }
              }
            }}
            placeholder="Name your role"
            name={name}
            value={value || ""}
            onChange={onChange}
            color="primary"
          />
        );
      }}
    />
  );
};

export default EditRole;
