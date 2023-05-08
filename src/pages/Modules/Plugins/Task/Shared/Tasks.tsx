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
  IconButton,
  CardHeader,
  CardContent,
  Card,
  Button,
  CardActionArea
} from "@mui/material";
import { memo, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
import {
  useGetAllOnboardingQuestsQuery,
  useRemoveTaskFromQuestMutation
} from "@api/onboarding.api";
import ErrorDialog from "@components/Dialog/ErrorPopup";
import LoadingDialog from "@components/Dialog/LoadingPopup";
import { useEthers } from "@usedapp/core";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { differenceInDays } from "date-fns";

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
                      color: "primary"
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
              color="primary"
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

const TaskCard = ({
  row,
  isAdmin,
  canDelete,
  onboardingQuestAddress,
  questId
}: {
  row: Task;
  isAdmin: boolean;
  canDelete: boolean;
  onboardingQuestAddress: string;
  questId: number;
}) => {
  const location = useLocation();
  const params = useParams<{ questId: string }>();
  const navigate = useNavigate();
  const confirm = useConfirmDialog();
  const [removeTask, { error, isError, isLoading, reset }] =
    useRemoveTaskFromQuestMutation();

  const { plugin, questOnboarding } = useGetAllPluginDefinitionsByDAOQuery(
    null,
    {
      selectFromResult: ({ data }) => ({
        questOnboarding: (data || []).find(
          (p) =>
            PluginDefinitionType.QuestOnboardingPlugin === p.pluginDefinitionId
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
    <>
      <ErrorDialog handleClose={() => reset()} open={isError} message={error} />
      <GridCard
        sx={{
          bgcolor: "nightBlack.main",
          borderColor: "divider",
          borderRadius: "16px",
          minHeight: "385px",
          boxShadow: 7,
          display: "flex",
          flexDirection: "column"
        }}
        variant="outlined"
      >
        <CardHeader
          sx={{
            alignItems: "flex-start",
            ".MuiCardHeader-action": {
              mt: "3px"
            }
          }}
          titleTypographyProps={{
            fontFamily: "FractulAltBold",
            mb: 2,
            fontWeight: 900,
            color: "white",
            variant: "subtitle1"
          }}
          subheaderTypographyProps={{
            color: "white"
          }}
          action={
            <IconButton color="offWhite">
              <EditIcon />
            </IconButton>
          }
          title={plugin?.metadata?.properties?.title}
        />
        <CardContent
          sx={{
            pt: 0,
            flex: 1,
            display: "flex",
            flexDirection: "column"
          }}
        >
          <Stack flex={1} direction="column" gap={2}>
            <Typography variant="body" color="white">
              Task type: {taskTypes[row.taskType]?.label}
            </Typography>
            <Typography variant="body" color="white">
              Duration:{" "}
              {differenceInDays(new Date(row.endDate), new Date(row.startDate))}{" "}
              days
            </Typography>

            <OverflowTooltip maxLine={4} text={row.metadata?.description} />
          </Stack>

          <Box
            sx={{
              width: "100%",
              display: "flex"
            }}
          >
            {plugin.pluginDefinitionId ===
              PluginDefinitionType.OnboardingOpenTaskPlugin && (
              <Button
                sx={{
                  width: "80%",
                  mt: 6,
                  mb: 4,
                  mx: "auto"
                }}
                onClick={() => {
                  navigate({
                    pathname: `/aut-dashboard/modules/Task/OnboardingOpenTaskPlugin/${row.taskId}/submissions`,
                    search: new URLSearchParams({
                      onboardingQuestAddress,
                      returnUrlLinkName: "Back to quest",
                      returnUrl: `/aut-dashboard/modules/OnboardingStrategy/QuestOnboardingPlugin/${questId}`,
                      questId: `${questId}`
                    }).toString()
                  });
                }}
                size="large"
                variant="outlined"
                color="offWhite"
              >
                Submissions
              </Button>
            )}
          </Box>
        </CardContent>
      </GridCard>
    </>
  );
};

const GridCard = styled(Card)(({ theme }) => {
  return {
    minHeight: "365px",
    width: "100%",
    transition: theme.transitions.create(["transform"]),
    "&:hover": {
      transform: "scale(1.019)"
    }
  };
});

const GridBox = styled(Box)(({ theme }) => {
  return {
    boxSizing: "border-box",
    display: "grid",
    gridTemplateColumns: "1fr",
    gridGap: "30px",
    [theme.breakpoints.up("sm")]: {
      gridTemplateColumns: "repeat(2,minmax(0,1fr))"
    },
    [theme.breakpoints.up("lg")]: {
      gridTemplateColumns: "repeat(3,minmax(0,1fr))"
    }
  };
});

export const EmptyTaskCard = ({ onboardingQuestAddress, questId }) => {
  const navigate = useNavigate();

  return (
    <GridCard
      sx={{
        bgcolor: "nightBlack.main",
        borderColor: "divider",
        borderStyle: "dashed",
        borderRadius: "16px",
        boxShadow: 7,
        minHeight: "385px"
      }}
      variant="outlined"
    >
      <CardActionArea
        onClick={() => {
          navigate({
            pathname: "/aut-dashboard/modules/Task",
            search: new URLSearchParams({
              onboardingQuestAddress,
              returnUrlLinkName: "Back to quest",
              returnUrl: `/aut-dashboard/modules/OnboardingStrategy/QuestOnboardingPlugin/${questId}`,
              questId: questId
            }).toString()
          });
        }}
        sx={{
          height: "100%"
        }}
      >
        <CardContent
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flexGrow: 1,
            cursor: "pointer"
          }}
        >
          <Typography textAlign="center" color="white" variant="body">
            Add task
          </Typography>
          <AddIcon
            sx={{
              mt: 2,
              color: "white",
              fontSize: "80px"
            }}
          />
        </CardContent>
      </CardActionArea>
    </GridCard>
  );
};

interface TasksParams {
  isLoading: boolean;
  tasks: Task[];
  canDelete?: boolean;
  isAdmin: boolean;
  onboardingQuestAddress: string;
  questId: number;
}

const Tasks = ({
  isLoading,
  tasks,
  isAdmin,
  canDelete,
  onboardingQuestAddress,
  questId
}: TasksParams) => {
  return (
    <Box>
      {isLoading ? (
        <AutLoading width="130px" height="130px" />
      ) : (
        <>
          {!!tasks?.length && (
            <GridBox sx={{ flexGrow: 1, mt: 4 }}>
              {tasks.map((row, index) => (
                <TaskCard
                  onboardingQuestAddress={onboardingQuestAddress}
                  questId={questId}
                  isAdmin={isAdmin}
                  canDelete={canDelete}
                  key={`table-row-${index}`}
                  row={row}
                />
              ))}
              <EmptyTaskCard
                onboardingQuestAddress={onboardingQuestAddress}
                questId={questId}
              />
            </GridBox>
            // <TableContainer
            //   sx={{
            //     minWidth: {
            //       sm: "700px"
            //     },
            //     width: {
            //       xs: "360px",
            //       sm: "unset"
            //     },
            //     borderRadius: "16px",
            //     backgroundColor: "nightBlack.main",
            //     borderColor: "divider",
            //     my: 4
            //   }}
            //   component={Paper}
            // >
            //   <Table
            //     sx={{
            //       minWidth: {
            //         xs: "700px",
            //         sm: "unset"
            //       },
            //       ".MuiTableBody-root > .MuiTableRow-root:hover": {
            //         backgroundColor: "#ffffff0a"
            //       }
            //     }}
            //   >
            //     <TableHead>
            //       <TableRow>
            //         <TaskStyledTableCell>Name</TaskStyledTableCell>

            //         {!isAdmin && (
            //           <TaskStyledTableCell align="right">
            //             Creator
            //           </TaskStyledTableCell>
            //         )}

            //         <TaskStyledTableCell align="right">
            //           Status
            //         </TaskStyledTableCell>
            //         <TaskStyledTableCell align="right">
            //           Task type
            //         </TaskStyledTableCell>
            //         {isAdmin && canDelete && (
            //           <TaskStyledTableCell align="right">
            //             Action
            //           </TaskStyledTableCell>
            //         )}
            //       </TableRow>
            //     </TableHead>
            //     <TableBody>
            //       {tasks?.map((row, index) => (
            //         <TaskListItem
            //           isAdmin={isAdmin}
            //           canDelete={canDelete}
            //           key={`table-row-${index}`}
            //           row={row}
            //         />
            //       ))}
            //     </TableBody>
            //   </Table>
            // </TableContainer>
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
