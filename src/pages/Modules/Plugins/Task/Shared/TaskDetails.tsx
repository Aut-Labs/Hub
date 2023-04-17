import { Task } from "@aut-labs-private/sdk";
import LoadingProgressBar from "@components/LoadingProgressBar";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Stack,
  Tooltip,
  Typography
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { memo } from "react";
import OverflowTooltip from "@components/OverflowTooltip";
import { Link, useSearchParams } from "react-router-dom";
import { TaskStatus } from "@aut-labs-private/sdk/dist/models/task";
import { taskStatuses, taskTypes } from "./Tasks";

interface TaskDetailsParams {
  task: Task;
}

const TaskDetails = ({ task }: TaskDetailsParams) => {
  const [searchParams] = useSearchParams();
  const isLoading = false;

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: "20px",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        marginBottom: {
          xs: "20px",
          xxl: "30px"
        }
      }}
    >
      {isLoading ? (
        <CircularProgress className="spinner-center" size="60px" />
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
            position: "relative"
          }}
        >
          <Stack alignItems="center" justifyContent="center">
            <Button
              startIcon={<ArrowBackIcon />}
              color="offWhite"
              sx={{
                position: {
                  sm: "absolute"
                },
                left: {
                  sm: "0"
                }
              }}
              to={searchParams.get("returnUrl")}
              component={Link}
            >
              {searchParams.get("returnUrlLinkName") || "Back"}
            </Button>
            <Typography textAlign="center" color="white" variant="h3">
              {task?.metadata?.name}
            </Typography>
          </Stack>

          <Typography textAlign="center" color="white" variant="body">
            {taskTypes[task?.taskType]?.label}
          </Typography>

          {/* <OverflowTooltip
            typography={{
              maxWidth: "400px"
            }}
            text={task?.metadata?.description}
          /> */}

          <Box
            sx={{
              display: "grid",
              alignItems: "center",
              mx: "auto",
              gridTemplateColumns: "1fr 1fr 1fr 1fr"
            }}
          >
            <Stack direction="column" alignItems="center" sx={{ mr: "10px" }}>
              <Typography
                fontFamily="FractulAltBold"
                color="white"
                variant="subtitle2"
              >
                {new Date(task?.startDate).toDateString()}
              </Typography>
              <Typography variant="caption" className="text-secondary">
                Start date
              </Typography>
            </Stack>
            <Stack direction="column" alignItems="center">
              <Typography
                fontFamily="FractulAltBold"
                color="white"
                variant="subtitle2"
              >
                {new Date(task?.endDate)?.toDateString()}
              </Typography>
              <Typography variant="caption" className="text-secondary">
                End date
              </Typography>
            </Stack>
            <Stack direction="column" alignItems="center">
              <Typography
                fontFamily="FractulAltBold"
                variant="subtitle2"
                color={`${taskStatuses[task?.status]?.color}.main`}
              >
                {taskStatuses[task?.status]?.label}
              </Typography>
              <Typography variant="caption" className="text-secondary">
                Status
              </Typography>
            </Stack>
            <Stack direction="column" alignItems="center">
              <Typography
                fontFamily="FractulAltBold"
                color="white"
                variant="subtitle2"
              >
                {new Date(task?.createdOn * 1000).toDateString()}
              </Typography>
              <Typography variant="caption" className="text-secondary">
                Created On
              </Typography>
            </Stack>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default memo(TaskDetails);
