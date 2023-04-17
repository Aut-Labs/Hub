import { TextField } from "@mui/material";
import { useFieldArray, Controller } from "react-hook-form";
import { pxToRem } from "@utils/text-size";

const RoleSkills = ({ control, activeRoleIndex }) => {
  const skillsFields = useFieldArray({
    control,
    name: `roles[${activeRoleIndex}].skills`
  });

  return (
    <>
      {skillsFields.fields.map((_, index) => {
        return (
          <Controller
            key={`roles[${activeRoleIndex}].skills[${index}].name`}
            name={`roles[${activeRoleIndex}].skills[${index}].name`}
            control={control}
            render={({ field: { name, value, onChange } }) => {
              return (
                <TextField
                  variant="standard"
                  sx={{
                    width: pxToRem(330),
                    "& + .MuiFormControl-root": {
                      mt: pxToRem(50)
                    },
                    ".MuiInput-root": {
                      width: pxToRem(330),
                      color: "primary.main",
                      fontSize: pxToRem(21),
                      "&:hover:not(.Mui-disabled):before": {
                        borderBottom: "1px solid #000000"
                      }
                    }
                  }}
                  placeholder="Add a skill"
                  name={name}
                  value={value || ""}
                  onChange={onChange}
                  color="primary"
                />
              );
            }}
          />
        );
      })}
    </>
  );
};

export default RoleSkills;
