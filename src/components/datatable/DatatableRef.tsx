import {
  GridColumns,
  GridEditRowApi,
  GridRenderEditCellParams,
  GridStateApi,
  useGridApiContext
} from "@mui/x-data-grid";
import { useRef, useMemo } from "react";
import { styled } from "@mui/material/styles";
import { InputBase } from "@mui/material";

const GridEditInputCellRoot = styled(InputBase, {
  name: "MuiDataGrid",
  slot: "EditInputCell",
  overridesResolver: (props, styles) => styles.editInputCell
})(({ theme }) => ({
  ...theme.typography.body2,
  padding: "1px 0",
  "& input": {
    padding: "0 16px",
    height: "100%",
    "&::placeholder": {
      opacity: 1,
      color: "#707070"
    },
    "&::-webkit-input-placeholder": {
      color: "#707070",
      opacity: 1
    },
    "&::-moz-placeholder": {
      color: "#707070",
      opacity: 1
    }
  }
}));

export function CustomEditComponent(
  props: GridRenderEditCellParams,
  placeholder: string
) {
  const { id, value, field, ...other } = props;
  const apiRef = useGridApiContext();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value; // The new value entered by the user
    apiRef.current.setEditCellValue({ id, field, value: newValue });
  };

  return (
    <GridEditInputCellRoot
      fullWidth
      type="text"
      value={value ?? ""}
      onChange={handleChange}
      placeholder={placeholder}
      {...other}
    />
  );
}

export const useDatatableApiRef = (
  tableColumns: (apiRef: any) => GridColumns
) => {
  const apiRef = useRef<GridEditRowApi & GridStateApi<any>>(null);
  const _columns = useMemo(() => {
    const columns = tableColumns(() => apiRef);
    return columns.concat({
      field: "__HIDDEN__",
      width: 0,
      minWidth: 0,
      flex: 0,
      sortable: false,
      renderCell: (params) => {
        apiRef.current = params.api;
        return null;
      }
    });
  }, [tableColumns]);

  return { apiRef, columns: _columns };
};
