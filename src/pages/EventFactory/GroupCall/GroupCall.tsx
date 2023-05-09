import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Container } from "@mui/material";
import { resetActivityGroupCall } from "@store/Activity/call.reducer";
import { setTitle } from "@store/ui-reducer";
import CalendarStep from "./CalendarStep/CalendarStep";
import CallInformationStep from "./CallInformationStep/CallInformationStep";
import SuccessStep from "./SuccessStep/SuccessStep";
import { pxToRem } from "@utils/text-size";

const GroupCall = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      dispatch(resetActivityGroupCall());
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
          path="/aut-dashboard/event-factory/group-call"
          component={CalendarStep}
        />
        <Route
          path="/aut-dashboard/event-factory/group-call/info"
          component={CallInformationStep}
        />
        <Route
          path="/aut-dashboard/event-factory/group-call/success"
          component={SuccessStep}
        /> */}
      </Routes>
    </Container>
  );
};

export default GroupCall;
