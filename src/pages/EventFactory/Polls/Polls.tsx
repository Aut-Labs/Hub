import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Container } from "@mui/material";
import { resetPollState } from "@store/Activity/poll.reducer";
import { setTitle } from "@store/ui-reducer";
import CreatePollOptionsStep from "./CreatePollOptionsStep/CreatePollOptionsStep";
import CreatePollInfoStep from "./CreatePollInfoStep/CreatePollInfoStep";
import CreatePollParticipantsStep from "./CreatePollParticipantsStep/CreatePollParticipantsStep";
import SuccessStep from "./SuccessStep/SuccessStep";
import { pxToRem } from "@utils/text-size";
import { Routes } from "react-router-dom";

const Polls = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      dispatch(resetPollState());
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(setTitle(`Community Events - the lifeblood of your Community.`));
  }, [dispatch]);

  return (
    <Container
      maxWidth="md"
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        py: pxToRem(30)
      }}
    >
      <Routes>
        {/* <Route
          exact
          path="/aut-dashboard/event-factory/polls"
          component={CreatePollInfoStep}
        />
        <Route
          path="/aut-dashboard/event-factory/polls/options"
          component={CreatePollOptionsStep}
        />
        <Route
          path="/aut-dashboard/event-factory/polls/participants"
          component={CreatePollParticipantsStep}
        />
        <Route
          path="/aut-dashboard/event-factory/polls/success"
          component={SuccessStep}
        /> */}
      </Routes>
    </Container>
  );
};

export default Polls;
