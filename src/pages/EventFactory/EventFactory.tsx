import { getPolls } from "@api/activities.api";
import { CommunityEventTypes } from "@api/api.model";
import { AutHeader } from "@components/AutHeader";
import { AutButton } from "@components/buttons";
import SwTabs from "@components/AutTabs/AutTabs";
import { Box, Container } from "@mui/material";
import {
  UpcomingSelectedTab,
  updateUpcomingState
} from "@store/Activity/upcoming.reducer";
import { useAppDispatch } from "@store/store.model";
import { setTitle } from "@store/ui-reducer";
import { pxToRem } from "@utils/text-size";
import { memo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CallsList from "./GroupCall/CallsList";
import PastEventsList from "./PastEventsList";
import PollsList from "./Polls/PollsList";

const EventFactory = () => {
  const dispatch = useAppDispatch();
  const selectedTabIndex = useSelector(UpcomingSelectedTab);
  const [tabs, setTabs] = useState([]);

  useEffect(() => {
    dispatch(setTitle(`Community Events - the lifeblood of your Community.`));
  }, [dispatch]);

  useEffect(() => {
    setTabs([
      {
        label: "On-going Polls",
        hideTop: true,
        props: {
          status: CommunityEventTypes.Ongoing
        },
        component: PollsList
      },
      {
        label: "Upcoming Gatherings",
        hideTop: true,
        props: {
          status: CommunityEventTypes.Upcoming
        },
        component: CallsList
      },
      {
        label: "Past Events",
        hideTop: true,
        props: {
          status: CommunityEventTypes.Past
        },
        component: PastEventsList
      }
    ]);
    dispatch(getPolls(null));
  }, [dispatch]);

  return (
    <Container
      maxWidth="lg"
      sx={{
        display: "flex",
        flexGrow: 1,
        py: pxToRem(30),
        flexDirection: "column"
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <Box>
          <AutHeader
            title="Community Events"
            subtitle={
              <>
                The past, the present and the future of your Community life.
                Have a bird-eye <br />
                view on everything that’s happening - or create a new one to
                kick things off!
              </>
            }
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            gridGap: "10px",
            flexDirection: "column"
          }}
        >
          <AutButton
            component={Link}
            to="/aut-dashboard/event-factory/polls"
            sx={{
              width: pxToRem(320),
              "&.MuiButton-root": {
                borderRadius: 0,
                borderWidth: "2px"
              }
            }}
            type="button"
            color="primary"
            variant="outlined"
          >
            New Poll
          </AutButton>
          <AutButton
            sx={{
              width: pxToRem(320),
              "&.MuiButton-root": {
                borderRadius: 0,
                borderWidth: "2px"
              }
            }}
            component={Link}
            to="/aut-dashboard/event-factory/group-call"
            type="button"
            color="primary"
            variant="outlined"
          >
            New Gathering
          </AutButton>
        </Box>
      </Box>
      <Box
        sx={{
          flex: 1,
          p: 0,
          m: 0,
          gridGap: "0"
        }}
        className="sw-box"
      >
        <SwTabs
          tabs={tabs}
          selectedTabIndex={selectedTabIndex}
          selectedTab={(selectedIndex: number) => {
            dispatch(
              updateUpcomingState({
                selectedTabIndex: selectedIndex
              })
            );
          }}
          // tabPanelStyles={{
          //   p: 0,
          //   border: "2px solid #439EDD"
          // }}
          // scrollbarStyles={{
          //   border: "0px",
          //   p: 0
          // }}
        />
      </Box>
    </Container>
  );
};

export default memo(EventFactory);
