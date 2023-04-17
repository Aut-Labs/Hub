import { Quest, Task } from "@aut-labs-private/sdk";
import {
  Badge,
  Box,
  Paper,
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
  Chip
} from "@mui/material";
import { memo, useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { PluginDefinitionType } from "@aut-labs-private/sdk/dist/models/plugin";
import { TaskStatus, TaskType } from "@aut-labs-private/sdk/dist/models/task";
import { useGetAllPluginDefinitionsByDAOQuery } from "@api/plugin-registry.api";
import CopyAddress from "@components/CopyAddress";
import LinkWithQuery from "@components/LinkWithQuery";
import OverflowTooltip from "@components/OverflowTooltip";
import AutLoading from "@components/AutLoading";

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

const taskTypes = {
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

const TaskListItem = memo(
  ({
    row,
    quest,
    hasAppliedForQuest,
    hasQuestStarted
  }: {
    row: Task;
    quest: Quest;
    hasQuestStarted: boolean;
    hasAppliedForQuest: boolean;
  }) => {
    const location = useLocation();
    const params = useParams<{ questId: string }>();

    const { plugin } = useGetAllPluginDefinitionsByDAOQuery(null, {
      selectFromResult: ({ data }) => ({
        plugin: (data || []).find(
          (p) => taskTypes[row.taskType].pluginType === p.pluginDefinitionId
        )
      })
    });

    const path = useMemo(() => {
      if (!plugin) return;
      return `task/${PluginDefinitionType[plugin.pluginDefinitionId]}`;
    }, [plugin]);

    return (
      <StyledTableRow
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      >
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
                <Tooltip
                  disableHoverListener={
                    !quest?.active || !hasAppliedForQuest || !hasQuestStarted
                  }
                  title={
                    !quest?.active || !hasAppliedForQuest || !hasQuestStarted
                      ? ""
                      : "View task details"
                  }
                >
                  <BtnLink
                    variant="subtitle2"
                    sx={{
                      color: "primary.light",
                      "&:hover": {
                        textDecoration:
                          !quest?.active ||
                          !hasAppliedForQuest ||
                          !hasQuestStarted
                            ? "unset"
                            : "underline"
                      }
                    }}
                    {...(quest?.active &&
                      hasQuestStarted &&
                      hasAppliedForQuest && {
                        to: `/quest/${path}/${row.taskId}`,
                        preserveParams: true,
                        queryParams: {
                          onboardingQuestAddress: plugin?.pluginAddress,
                          returnUrlLinkName: "Back to quest",
                          returnUrl: `${location?.pathname}${location?.search}`,
                          questId: params.questId
                        },
                        component: LinkWithQuery
                      })}
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
        <TaskStyledTableCell align="right">
          <Chip {...taskStatuses[row.status]} size="small" />
        </TaskStyledTableCell>
        <TaskStyledTableCell align="right">
          {taskTypes[row.taskType]?.label}
        </TaskStyledTableCell>
      </StyledTableRow>
    );
  }
);

interface TasksParams {
  isLoading: boolean;
  tasks: Task[];
  quest: Quest;
  hasQuestStarted: boolean;
  hasAppliedForQuest: boolean;
}

const Tasks = ({
  isLoading,
  tasks,
  quest,
  hasQuestStarted,
  hasAppliedForQuest
}: TasksParams) => {
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
                  width: {
                    xs: "100%"
                  },
                  ".MuiTableBody-root > .MuiTableRow-root:hover": {
                    backgroundColor: "#ffffff0a"
                  }
                }}
              >
                <TableHead>
                  <TableRow>
                    <TaskStyledTableCell>Name</TaskStyledTableCell>
                    <TaskStyledTableCell align="right">
                      Creator
                    </TaskStyledTableCell>
                    <TaskStyledTableCell align="right">
                      Status
                    </TaskStyledTableCell>
                    <TaskStyledTableCell align="right">
                      Task type
                    </TaskStyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tasks?.map((row, index) => (
                    <TaskListItem
                      quest={quest}
                      hasQuestStarted={hasQuestStarted}
                      hasAppliedForQuest={hasAppliedForQuest}
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
                mt: 12,
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Typography className="text-secondary" variant="subtitle2">
                There are no tasks on this quest yet...
              </Typography>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default memo(Tasks);
