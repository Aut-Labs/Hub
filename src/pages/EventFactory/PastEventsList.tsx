/* eslint-disable react/no-unstable-nested-components */
import AutLoading from "@components/AutLoading";
import { Box, CircularProgress, ListItem, Typography } from "@mui/material";
import { PollStatus } from "@store/Activity/poll.reducer";
import { PastEvents } from "@store/Activity/upcoming.reducer";
import { ResultState } from "@store/result-status";
import { pxToRem } from "@utils/text-size";
import { format } from "date-fns";
import { useSelector } from "react-redux";

const PastEventsList = () => {
  const status = useSelector(PollStatus);
  const events = useSelector(PastEvents);

  return (
    <div className="sw-tasks-list-base-container">
      <Box
        sx={{
          pt: !events.length ? pxToRem(100) : 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column"
        }}
        className="sw-box"
      >
        {status === ResultState.Loading ? (
          <div className="tasks-loading-spinner">
            <AutLoading />
          </div>
        ) : events.length ? (
          events.map((poll, index) => (
            <ListItem
              sx={{
                minHeight: pxToRem(215),
                display: "flex",
                flexDirection: "row",
                borderBottom: "2px solid #439EDD",
                justifyContent: "space-between",
                "&:last-child": {
                  borderBottom: "0"
                }
              }}
              key={index}
              disablePadding
            >
              <Box
                sx={{
                  px: "20px",
                  py: "28px",
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                <Typography
                  sx={{
                    color: "white",
                    mb: pxToRem(25),
                    fontSize: pxToRem(25)
                  }}
                >
                  {poll.pollData.title || "N/A"}
                </Typography>
                <Typography
                  sx={{
                    color: "white",
                    maxWidth: "70%",
                    fontSize: pxToRem(20)
                  }}
                >
                  {poll.pollData.description}
                </Typography>
              </Box>
              <Box
                sx={{
                  px: "20px",
                  py: "28px",
                  display: "flex",
                  minWidth: "30%",
                  flexDirection: "column"
                }}
              >
                <Typography
                  sx={{
                    color: "white",
                    mb: pxToRem(20),
                    fontSize: pxToRem(20)
                  }}
                >
                  {format(new Date(+poll.timestamp * 1000), "PPPP")}
                  {"  "}
                  {format(new Date(+poll.timestamp * 1000), "hh:mm a")}
                </Typography>
                <Typography
                  sx={{
                    color: "white",
                    mb: pxToRem(20),
                    fontSize: pxToRem(20)
                  }}
                >
                  Role assigned to{" "}
                  {poll.pollData.allRoles ? "All" : poll.pollData.roleName}
                </Typography>
              </Box>
            </ListItem>
          ))
        ) : (
          <Typography
            sx={{
              color: "white",
              mb: pxToRem(30),
              fontSize: pxToRem(30)
            }}
          >
            No past events found!
          </Typography>
        )}
      </Box>
    </div>
  );
};

export default PastEventsList;
