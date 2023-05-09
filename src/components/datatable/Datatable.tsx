import React, { useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useTheme } from "@mui/material";

const Datatable = ({
  apiRef,
  data,
  loading,
  columns,
  onStateChange,
  ...rest
}: any) => {
  const theme = useTheme();

  const handleDoubleCellClick = useCallback((params, event) => {
    event.defaultMuiPrevented = true;
  }, []);

  const handleCellKeyDown = useCallback((params, event) => {
    if (["Escape", "Delete", "Backspace", "Enter"].includes(event.key)) {
      event.defaultMuiPrevented = true;
    }
  }, []);

  const handleCellFocusOut = useCallback((params, event) => {
    if (params.cellMode === "edit" && event) {
      event.defaultMuiPrevented = true;
    }
  }, []);

  return (
    <div
      className="sw-datatable"
      style={{
        border: `3px solid ${theme.palette.primary.main}`,
        padding: "35px"
      }}
    >
      <DataGrid
        autoHeight
        apiRef={apiRef}
        editMode="row"
        loading={loading}
        onCellDoubleClick={handleDoubleCellClick}
        onCellFocusOut={handleCellFocusOut}
        onCellKeyDown={handleCellKeyDown}
        onStateChange={onStateChange}
        hideFooter
        hideFooterPagination
        hideFooterSelectedRowCount
        disableColumnFilter
        showCellRightBorder={false}
        showColumnRightBorder={false}
        disableColumnMenu
        disableColumnSelector
        density="compact"
        sx={{
          border: "none",
          color: "primary.main",
          ".MuiInputBase-input": {
            color: "info.dark",
            fontSize: "16px",
            textAlign: "center"
          },
          ".MuiDataGrid-columnHeaders": {
            borderBottom: "2px solid",
            borderColor: "primary.main"
          },
          ".MuiDataGrid-columnSeparator": {
            display: "none"
          },
          ".MuiDataGrid-cell": {
            fontSize: "16px",
            textAlign: "center"
          },
          ".MuiDataGrid-columnHeaderTitle": {
            width: "100%",
            textAlign: "center"
          },
          ".MuiDataGrid-columnHeader": {
            fontSize: "20px"
          },
          "& .actions": {
            color: "primary.main"
          },
          "& .textPrimary": {
            color: "primary.main"
          },
          ".MuiDataGrid-columnHeaderTitleContainer": {
            padding: 0
          }
        }}
        headerHeight={70}
        columns={columns}
        rows={data}
        {...rest}
      />
    </div>
  );
};

const SWDatatable = React.forwardRef((props: any, ref) => (
  <Datatable innerRef={ref} {...props} />
));

export default SWDatatable;
