/* eslint-disable max-len */
import { Quest, Task } from "@aut-labs-private/sdk";
import {
  Box,
  Typography,
  Button,
  TableCell,
  TableRow,
  Link as BtnLink,
  styled,
  tableCellClasses,
  Tooltip,
  Chip,
  Stack,
  MenuItem,
  debounce,
  Badge
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { memo, useMemo, useState } from "react";
import { allRoles } from "@store/Community/community.reducer";
import { useSelector } from "react-redux";
import { AutSelectField } from "@theme/field-select-styles";
import { AutTextField } from "@theme/field-text-styles";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Tasks from "../../Task/Shared/Tasks";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import LinkWithQuery from "@components/LinkWithQuery";
import OverflowTooltip from "@components/OverflowTooltip";
import CopyLink from "@components/CopyLink";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover
  },
  "&:last-child td, &:last-child th": {
    border: 0
  }
}));

export const QuestStyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}, &.${tableCellClasses.body}`]: {
    color: theme.palette.common.white,
    borderColor: theme.palette.divider
  }
}));

export const QuestListItem = memo(
  ({
    row,
    pluginAddress,
    daoAddress,
    isAdmin
  }: {
    row: Quest;
    daoAddress: string;
    pluginAddress: string;
    isAdmin: boolean;
  }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [roles] = useState(useSelector(allRoles));

    const roleName = useMemo(() => {
      return roles.find((r) => r.id === row.role)?.roleName;
    }, [roles]);

    return (
      <StyledTableRow
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      >
        <QuestStyledTableCell component="th" scope="row">
          <span
            style={{
              display: "flex",
              flexDirection: "column",
              gridGap: "8px"
            }}
          >
            <Box>
              <Badge
                invisible={!!row.metadata?.name}
                badgeContent={
                  <Tooltip title="Something went wrong fetching ipfs metadata. This does not affect the contract interactions">
                    <ErrorOutlineIcon
                      color="error"
                      sx={{
                        width: {
                          sm: "16px"
                        }
                      }}
                    />
                  </Tooltip>
                }
              >
                <Tooltip title="View quest and submissions">
                  <BtnLink
                    component="button"
                    color="primary.light"
                    variant="subtitle2"
                    onClick={() =>
                      navigate({
                        pathname: `${row.questId}`,
                        search: `onboardingQuestAddress=${pluginAddress}`
                      })
                    }
                  >
                    {row.metadata?.name || "n/a"}
                  </BtnLink>
                </Tooltip>
                <CopyLink
                  link={`${window?.location.origin}/quest/?questId=${row.questId}&onboardingQuestAddress=${pluginAddress}&daoAddress=${daoAddress}`}
                />
              </Badge>
            </Box>
            <OverflowTooltip
              typography={{
                maxWidth: "300px"
              }}
              text={row.metadata?.description}
            />
          </span>
        </QuestStyledTableCell>
        {/* <QuestStyledTableCell align="right">{roleName}</QuestStyledTableCell> */}
        {isAdmin && (
          <QuestStyledTableCell align="right">
            {row.tasksCount}
          </QuestStyledTableCell>
        )}
        <QuestStyledTableCell align="right">
          {row.durationInDays} days
        </QuestStyledTableCell>
        <QuestStyledTableCell align="right">
          <Chip
            label={row.active ? "Active" : "Inactive"}
            color={row.active ? "success" : "error"}
            size="small"
          />
        </QuestStyledTableCell>

        {isAdmin && !row.active && (
          <QuestStyledTableCell align="right">
            <Stack gap={1}>
              <Button
                sx={{
                  minWidth: "120px"
                }}
                color="offWhite"
                size="small"
                variant="outlined"
                startIcon={<AddIcon />}
                disabled={row.tasksCount >= 5}
                to="/aut-dashboard/modules/Task"
                preserveParams
                queryParams={{
                  onboardingQuestAddress: pluginAddress,
                  returnUrlLinkName: "Back to quest",
                  returnUrl: `${location.pathname}/${row.questId.toString()}`,
                  questId: row.questId.toString()
                }}
                component={LinkWithQuery}
              >
                Add task
              </Button>
              <Button
                sx={{
                  minWidth: "120px"
                }}
                color="offWhite"
                size="small"
                variant="outlined"
                startIcon={<EditIcon />}
                disabled={row.tasksCount >= 5}
                to="create"
                preserveParams
                queryParams={{
                  onboardingQuestAddress: pluginAddress,
                  returnUrlLinkName: "Back to quest",
                  returnUrl: `${location.pathname}/${row.questId.toString()}`,
                  questId: row.questId.toString()
                }}
                component={LinkWithQuery}
              >
                Edit quest
              </Button>
            </Stack>
          </QuestStyledTableCell>
        )}
      </StyledTableRow>
    );
  }
);

interface SearchState {
  title: string;
  role: string;
}

export const QuestFilters = memo(
  ({ searchCallback }: { searchCallback: (state: SearchState) => void }) => {
    const [searchState, setSearchState] = useState<SearchState>({
      title: "",
      role: null
    });
    const [roles] = useState(useSelector(allRoles));

    const changeRoleHandler = (event: any) => {
      const state = {
        ...searchState,
        role: event.target.value
      };
      setSearchState(state);
      searchCallback(state);
    };

    const debouncedChangeHandler = useMemo(() => {
      const changeHandler = (event) => {
        const state = {
          ...searchState,
          title: event.target.value
        };
        setSearchState(state);
        searchCallback(state);
      };
      return debounce(changeHandler, 200);
    }, [searchState]);

    return (
      <Stack direction="row" alignItems="center" spacing={2}>
        <AutTextField
          variant="standard"
          color="offWhite"
          onChange={debouncedChangeHandler}
          placeholder="Name"
          sx={{
            width: {
              sm: "200px"
            }
          }}
        />
        <AutSelectField
          variant="standard"
          color="offWhite"
          sx={{
            width: {
              sm: "200px"
            }
          }}
          value={searchState?.role || ""}
          renderValue={(selected) => {
            if (!selected) {
              return "Role" as any;
            }
            const role = roles.find((t) => t.id === selected);
            return role?.roleName || selected;
          }}
          displayEmpty
          onChange={changeRoleHandler}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {roles.map((type) => (
            <MenuItem key={`role-${type.id}`} value={type.id}>
              {type.roleName}
            </MenuItem>
          ))}
        </AutSelectField>
      </Stack>
    );
  }
);

interface QuestTasksParams {
  isLoading: boolean;
  onboardingQuestAddress: string;
  isAdmin: boolean;
  isSubmission: boolean;
  questId: number;
  tasks: Task[];
}

export const QuestTasks = memo(
  ({
    isLoading,
    tasks,
    onboardingQuestAddress,
    isSubmission,
    questId,
    isAdmin
  }: QuestTasksParams) => {
    const [searchState, setSearchState] = useState({
      title: ""
    });

    const filteredTasks = useMemo(() => {
      return tasks?.filter((q) =>
        (q?.metadata?.name || "")
          ?.toLowerCase()
          ?.includes(searchState?.title?.toLowerCase())
      );
    }, [tasks, searchState]);

    const debouncedChangeHandler = useMemo(() => {
      const changeHandler = (event) => {
        setSearchState({
          ...searchState,
          title: event.target.value
        });
      };
      return debounce(changeHandler, 200);
    }, [searchState]);

    return (
      <Box>
        {!isLoading && !!tasks?.length && !filteredTasks?.length && (
          <Box
            sx={{
              display: "flex",
              gap: "20px",
              pt: 12,
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Typography color="rgb(107, 114, 128)" variant="subtitle2">
              No tasks found!
            </Typography>
          </Box>
        )}

        {/* <Tasks isAdmin={isAdmin} isLoading={isLoading} tasks={filteredTasks} /> */}
      </Box>
    );
  }
);
