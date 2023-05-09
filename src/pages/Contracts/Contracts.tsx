import { MutableRefObject, useEffect, useState } from "react";
import {
  GridActionsCellItem,
  GridColumns,
  GridEditRowApi,
  GridRenderEditCellParams,
  GridRowApi
} from "@mui/x-data-grid";
import SWDatatable from "@components/datatable/Datatable";
import {
  CustomEditComponent,
  useDatatableApiRef
} from "@components/datatable/DatatableRef";
import { Container, Typography } from "@mui/material";
import SwEditToolbar from "@components/datatable/DatatableToolbar";
import {
  GetDatatableItems,
  GetDatatableChangedItems
} from "@components/datatable/DatatableHelpers";
import { ReactComponent as PinIcon } from "@assets/pin.svg";
import { ReactComponent as SaveIcon } from "@assets/actions/confirm.svg";
import { ReactComponent as CancelIcon } from "@assets/actions/cancel.svg";
import { ReactComponent as EditIcon } from "@assets/actions/edit.svg";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@store/store.model";
import { ResultState } from "@store/result-status";
import LoadingDialog from "@components/Dialog/LoadingPopup";
import { pxToRem } from "@utils/text-size";
import "./Contracts.scss";
import ErrorDialog from "@components/Dialog/ErrorPopup";
import { addPAContracts, getPAContracts } from "@api/community.api";
import { getLockedContracts } from "@store/AutDashboard/aut-dashboard.reducer";
import { AutButton } from "@components/buttons";

const tableColumns = (
  getRef: () => MutableRefObject<GridEditRowApi & GridRowApi>
): GridColumns => {
  const handleEditClick = (id) => (event) => {
    event.stopPropagation();
    const apiRef = getRef();
    apiRef.current.setRowMode(id, "edit");
  };

  const handleSaveClick = (id) => (event) => {
    const apiRef = getRef();
    event.stopPropagation();
    apiRef.current.commitRowChange(id);
    apiRef.current.setRowMode(id, "view");

    const row = apiRef.current.getRow(id);
    apiRef.current.updateRows([{ ...row, isNew: false }]);
  };

  const handleDeleteClick = (id) => (event) => {
    const apiRef = getRef();
    event.stopPropagation();
    apiRef.current.setRowMode(id, "view");
    apiRef.current.updateRows([{ id, _action: "delete" }]);
  };
  return [
    {
      headerName: "#",
      field: "id",
      width: 140,
      sortable: false,
      valueGetter: ({ id }) => `${+id + 1}.`
    },
    {
      headerName: "Use",
      field: "use",
      editable: true,
      flex: 1,
      sortable: false,
      renderEditCell: (props: GridRenderEditCellParams) => {
        const placeholder = `Use ${+props.id + 1}`;
        return CustomEditComponent(props, placeholder);
      }
    },
    {
      headerName: "Added By",
      field: "addedBy",
      editable: true,
      flex: 1,
      sortable: false,
      renderEditCell: (props: GridRenderEditCellParams) => {
        const placeholder = `New Contract ${+props.id + 1}`;
        return CustomEditComponent(props, placeholder);
      }
    },
    {
      headerName: "Address",
      field: "address",
      editable: true,
      flex: 1,
      sortable: false,
      renderEditCell: (props) => CustomEditComponent(props, `Ox...`),
      valueGetter: ({ row: { address } }) => {
        if (address) {
          const middle = Math.ceil(address.length / 2);
          const left = address.slice(0, middle).substring(0, 8);
          let right = address.slice(middle);
          right = right.substr(right.length - 8);
          return `${left}...${right}`;
        }
      }
    },
    {
      headerName: "",
      field: "actions",
      sortable: false,
      width: 100,
      type: "actions",
      getActions: ({ id }) => {
        const apiRef = getRef();
        const isInEditMode = apiRef.current.getRowMode(id) === "edit";

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleDeleteClick(id)}
              color="inherit"
            />,
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              onClick={handleSaveClick(id)}
              color="primary"
            />
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />
        ];
      }
    }
  ];
};

const Contracts = () => {
  const dispatch = useAppDispatch();
  const { apiRef, columns } = useDatatableApiRef(tableColumns);
  const [initialData, setInitialData] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [open, setOpen] = useState(false);
  const lockedContracts = useSelector(getLockedContracts);
  const { status, errorMessage } = useSelector((state: any) => state.dashboard);

  const handleClose = () => {
    setOpen(false);
  };

  const submit = async () => {
    const state = apiRef?.current?.state;

    if (!state) {
      return;
    }

    const { newItems, allItems } = GetDatatableItems(state);
    const { removedItems } = GetDatatableChangedItems(allItems, initialData);

    if (!newItems.length && !removedItems.length) {
      setOpen(true);
      return;
    }
    dispatch(addPAContracts({ removedItems, newItems }));
  };

  useEffect(() => {
    const [firstItem] = lockedContracts;
    if (firstItem?.isNew) {
      const timeout = setTimeout(() => {
        if (apiRef.current) {
          apiRef.current.setRowMode(0, "edit");
        }
      });
      return () => clearTimeout(timeout);
    }
    setInitialData(lockedContracts);
  }, [apiRef, lockedContracts]);

  useEffect(() => {
    const promise = dispatch(getPAContracts(null));
    return () => promise.abort();
  }, [dispatch]);

  return (
    <Container maxWidth="md" className="sw-core-team">
      <LoadingDialog
        open={status === ResultState.Updating}
        message="Updating contracts..."
      />
      <ErrorDialog
        open={open}
        handleClose={handleClose}
        message=" No new addresses were added!"
      />
      <ErrorDialog
        open={status === ResultState.Failed}
        handleClose={handleClose}
        message={errorMessage}
      />
      <Typography
        sx={{
          mt: pxToRem(20)
        }}
        color="primary.main"
        fontSize={pxToRem(50)}
        component="div"
      >
        Your Smart Contracts List
      </Typography>
      <Typography color="primary.main" fontSize={pxToRem(25)} component="div">
        Add the Contracts used by your Protocol or DApp,
      </Typography>
      <Typography
        sx={{
          mb: pxToRem(50)
        }}
        color="primary.main"
        fontSize={pxToRem(25)}
        component="div"
      >
        and track how Members of your Community interact with (and provide value
        to) them 🙌
      </Typography>
      <SWDatatable
        apiRef={apiRef}
        columns={columns}
        data={lockedContracts}
        loading={status === ResultState.Loading}
        isCellEditable={(params) => !params.row.locked}
        onStateChange={(state) => {
          const rowsToEdit = Object.keys(state.editRows || {}).length;
          setIsDisabled(rowsToEdit > 0);
        }}
        components={{
          Toolbar: SwEditToolbar
        }}
        componentsProps={{
          toolbar: { apiRef, title: "Add new Contract", focusOn: "use" }
        }}
      />
      <div className="sw-table-actions">
        <AutButton
          disabled={isDisabled || status === ResultState.Loading}
          onClick={submit}
          endIcon={<PinIcon />}
        >
          Save changes
        </AutButton>
      </div>
    </Container>
  );
};

export default Contracts;
