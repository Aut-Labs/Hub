import { Box, Container, styled, Typography } from "@mui/material";
import { pxToRem } from "@utils/text-size";
import { ReactComponent as CutLogo } from "@assets/aut/cut.svg";
import { AutButton } from "@components/buttons";
import { Link, useParams } from "react-router-dom";

const StepWrapper = styled(Container)({
  textAlign: "center",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column"
});

const SuccessStep = () => {
  const params = useParams<{ address: string }>();
  return (
    <StepWrapper
      maxWidth="md"
      sx={{
        width: "100%",
        flexGrow: 1,
        boxSizing: "border-box",
        position: "relative"
      }}
    >
      <Typography
        letterSpacing="10.5px"
        textTransform="uppercase"
        marginTop={pxToRem(50)}
        fontSize={pxToRem(70)}
        color="white"
      >
        Congratulations
      </Typography>
      <CutLogo />

      <Typography
        letterSpacing="1.25px"
        minHeight={pxToRem(240)}
        maxWidth="80%"
        marginTop={pxToRem(40)}
        fontSize={pxToRem(25)}
        color="white"
      >
        Great, your Poll now exists on the Blockchain. Just share it on Discord
        to kick it off and get your Members onboard!
      </Typography>
      <Box
        sx={{ gridGap: "30px", display: "flex", justifyContent: "center" }}
        className="right-box"
      >
        <AutButton
          sx={{
            width: pxToRem(450),
            height: pxToRem(90)
          }}
          type="submit"
          color="primary"
          variant="outlined"
        >
          Share
        </AutButton>
        <AutButton
          sx={{
            width: pxToRem(450),
            height: pxToRem(90)
          }}
          component={Link}
          to="/aut-dashboard/event-factory/polls"
          type="submit"
          color="primary"
          variant="outlined"
        >
          Create another Poll
        </AutButton>
      </Box>
    </StepWrapper>
  );
};

export default SuccessStep;
