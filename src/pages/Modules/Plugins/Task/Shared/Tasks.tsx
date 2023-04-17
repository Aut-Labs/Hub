import { Task } from "@aut-labs-private/sdk";
import {
  Badge,
  Box,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Link as BtnLink,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  styled,
  tableCellClasses,
  Chip,
  IconButton
} from "@mui/material";
import { memo, useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

import CopyAddress from "@components/CopyAddress";
import { TaskStatus } from "@store/model";
import { useGetAllPluginDefinitionsByDAOQuery } from "@api/plugin-registry.api";
import LinkWithQuery from "@components/LinkWithQuery";
import { PluginDefinitionType } from "@aut-labs-private/sdk/dist/models/plugin";
import { TaskType } from "@aut-labs-private/sdk/dist/models/task";
import DeleteIcon from "@mui/icons-material/Delete";
import { useConfirmDialog } from "react-mui-confirm";
import OverflowTooltip from "@components/OverflowTooltip";
import AutLoading from "@components/AutLoading";
import { useRemoveTaskFromQuestMutation } from "@api/onboarding.api";
import ErrorDialog from "@components/Dialog/ErrorPopup";
import LoadingDialog from "@components/Dialog/LoadingPopup";
import { useEthers } from "@usedapp/core";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover
  },
  "&:last-child td, &:last-child th": {
    border: 0
  }
}));

const TaskStyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}, &.${tableCellClasses.body}`]: {
    color: theme.palette.common.white,
    borderColor: theme.palette.divider
  }
}));

export const taskStatuses: any = {
  [TaskStatus.Created]: {
    label: "To Do",
    color: "info"
  },
  [TaskStatus.Finished]: {
    label: "Complete",
    color: "success"
  },
  [TaskStatus.Submitted]: {
    label: "Submitted",
    color: "warning"
  },
  [TaskStatus.Taken]: {
    label: "Taken",
    color: "info"
  }
};

export const taskTypes = {
  [TaskType.Open]: {
    pluginType: PluginDefinitionType.OnboardingOpenTaskPlugin,
    label: "Open Task"
  },
  [TaskType.ContractInteraction]: {
    pluginType: PluginDefinitionType.OnboardingTransactionTaskPlugin,
    label: "Contract Interaction"
  },
  [TaskType.Quiz]: {
    pluginType: PluginDefinitionType.OnboardingQuizTaskPlugin,
    label: "Multiple-Choice Quiz"
  },
  [TaskType.JoinDiscord]: {
    pluginType: PluginDefinitionType.OnboardingJoinDiscordTaskPlugin,
    label: "Join Discord"
  }
};

const dateTypes = (start: number, end: number) => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  return (
    <Stack alignItems="flex-end">
      <Stack direction="row" flexWrap="wrap">
        <Stack direction="row">
          <Typography color="success.main">
            {startDate.toDateString()}
          </Typography>
          <Typography mx={0.5} color="white">
            -
          </Typography>
        </Stack>
        <Typography color="error">{endDate.toDateString()}</Typography>
      </Stack>
    </Stack>
  );
};

const TaskListItem = memo(
  ({
    row,
    isAdmin,
    canDelete
  }: {
    row: Task;
    isAdmin: boolean;
    canDelete: boolean;
  }) => {
    const location = useLocation();
    const params = useParams<{ questId: string }>();
    const confirm = useConfirmDialog();
    const [removeTask, { error, isError, isLoading, reset }] =
      useRemoveTaskFromQuestMutation();

    const { plugin, questOnboarding } = useGetAllPluginDefinitionsByDAOQuery(
      null,
      {
        selectFromResult: ({ data }) => ({
          questOnboarding: (data || []).find(
            (p) =>
              PluginDefinitionType.QuestOnboardingPlugin ===
              p.pluginDefinitionId
          ),
          plugin: (data || []).find(
            (p) => taskTypes[row.taskType].pluginType === p.pluginDefinitionId
          )
        })
      }
    );

    const confimDelete = () =>
      confirm({
        title: "Are you sure you want to delete this task?",
        onConfirm: () => {
          removeTask({
            task: row,
            questId: +params.questId,
            pluginTokenId: plugin.tokenId,
            pluginAddress: plugin.pluginAddress,
            onboardingQuestAddress: questOnboarding?.pluginAddress
          });
        }
      });

    const path = useMemo(() => {
      if (!plugin) return;
      const stackType = plugin.metadata.properties.module.type;
      const stack = `modules/${stackType}`;
      return `${stack}/${PluginDefinitionType[plugin.pluginDefinitionId]}`;
    }, [plugin]);

    return (
      <StyledTableRow
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      >
        <ErrorDialog
          handleClose={() => reset()}
          open={isError}
          message={error}
        />
        <LoadingDialog open={isLoading} message="Removing task..." />
        <TaskStyledTableCell component="th" scope="row">
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
                <Tooltip title="View task details">
                  <BtnLink
                    variant="subtitle2"
                    sx={{
                      color: "primary.light"
                    }}
                    to={`/aut-dashboard/${path}/${row.taskId}`}
                    preserveParams
                    queryParams={{
                      onboardingQuestAddress: plugin?.pluginAddress,
                      returnUrlLinkName: "Back to quest",
                      returnUrl: location?.pathname,
                      questId: params.questId,
                      submitter: row?.submitter
                    }}
                    component={LinkWithQuery}
                  >
                    {row.metadata?.name || "n/a"}
                  </BtnLink>
                </Tooltip>
              </Badge>
            </Box>
            <OverflowTooltip
              typography={{
                maxWidth: "300px"
              }}
              text={row.metadata?.description}
            />
          </span>
        </TaskStyledTableCell>
        {!isAdmin && (
          <TaskStyledTableCell align="right">
            <CopyAddress address={row.creator} />
            <BtnLink
              color="primary.light"
              variant="caption"
              target="_blank"
              href={`https://my.aut.id/${row.creator}`}
            >
              View profile
            </BtnLink>
          </TaskStyledTableCell>
        )}
        <TaskStyledTableCell align="right">
          <Chip {...taskStatuses[row.status]} size="small" />
        </TaskStyledTableCell>
        <TaskStyledTableCell align="right">
          {taskTypes[row.taskType]?.label}
        </TaskStyledTableCell>
        {isAdmin && canDelete && (
          <TaskStyledTableCell align="right">
            <Tooltip title="Remove task">
              <IconButton onClick={confimDelete} color="error">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </TaskStyledTableCell>
        )}
      </StyledTableRow>
    );
  }
);

interface TasksParams {
  isLoading: boolean;
  tasks: Task[];
  canDelete?: boolean;
  isAdmin: boolean;
}

const Tasks = ({ isLoading, tasks, isAdmin, canDelete }: TasksParams) => {
  return (
    <Box>
      {isLoading ? (
        <AutLoading width="130px" height="130px" />
      ) : (
        <>
          {!!tasks?.length && (
            <TableContainer
              sx={{
                minWidth: {
                  sm: "700px"
                },
                width: {
                  xs: "360px",
                  sm: "unset"
                },
                borderRadius: "16px",
                backgroundColor: "nightBlack.main",
                borderColor: "divider",
                my: 4
              }}
              component={Paper}
            >
              <Table
                sx={{
                  minWidth: {
                    xs: "700px",
                    sm: "unset"
                  },
                  ".MuiTableBody-root > .MuiTableRow-root:hover": {
                    backgroundColor: "#ffffff0a"
                  }
                }}
              >
                <TableHead>
                  <TableRow>
                    <TaskStyledTableCell>Name</TaskStyledTableCell>

                    {!isAdmin && (
                      <TaskStyledTableCell align="right">
                        Creator
                      </TaskStyledTableCell>
                    )}

                    <TaskStyledTableCell align="right">
                      Status
                    </TaskStyledTableCell>
                    <TaskStyledTableCell align="right">
                      Task type
                    </TaskStyledTableCell>
                    {isAdmin && canDelete && (
                      <TaskStyledTableCell align="right">
                        Action
                      </TaskStyledTableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tasks?.map((row, index) => (
                    <TaskListItem
                      isAdmin={isAdmin}
                      canDelete={canDelete}
                      key={`table-row-${index}`}
                      row={row}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {!isLoading && !tasks?.length && (
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
              <Typography className="text-secondary" variant="subtitle2">
                No tasks yet...
              </Typography>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default memo(Tasks);
