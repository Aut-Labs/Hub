import { Task } from "@aut-labs-private/sdk";
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { memo } from "react";
import { Link, useSearchParams } from "react-router-dom";

interface TaskDetailsParams {
  task: Task;
}

const TaskDetails = ({ task }: TaskDetailsParams) => {
  const [searchParams] = useSearchParams();
  const isLoading = false;

  return (
    <>
      {isLoading ? (
        <CircularProgress className="spinner-center" size="60px" />
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            mb: 4,
            position: "relative",
            mx: "auto",
            width: "100%"
          }}
        >
          <Stack alignItems="center" justifyContent="center">
            <Button
              startIcon={<ArrowBackIosNewIcon />}
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
              {/* {searchParams.get("returnUrlLinkName") || "Back"} */}
              <Typography color="white" variant="body">
                Back
              </Typography>
            </Button>
            <Typography textAlign="center" color="white" variant="h3">
              {task?.metadata?.name}
            </Typography>
          </Stack>

          <Typography
            mt={2}
            mx="auto"
            textAlign="center"
            color="white"
            sx={{
              width: {
                xs: "100%",
                sm: "700px",
                xxl: "1000px"
              }
            }}
            variant="body"
          >
            {task?.metadata?.description}
          </Typography>

          {/* <OverflowTooltip
          typography={{
            maxWidth: "400px"
          }}
          text={task?.metadata?.description}
        /> */}
        </Box>
      )}
    </>
  );
};

export default memo(TaskDetails);
