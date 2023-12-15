import { Box, Button, Link, Typography, styled } from "@mui/material";
import { memo, useEffect, useMemo, useState } from "react";
import { ipfsCIDToHttpUrl } from "@api/storage.api";
import Flipcard from "@components/Flipcard";
import FlipIcon from "@assets/flip.svg";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import { ApplyOrWithdrawFromQuest } from "./ApplyOrWithdrawFromQuest";
import { NovaDAO } from "@api/community.model";
import { useNavigate } from "react-router-dom";

const getRoleName = (daoData, quest) => {
  const role = daoData.properties.rolesSets[0].roles.find(
    (r) => r.id === quest.role
  );
  if (role) {
    return role.roleName;
  }
  return "N/A";
};

const AutCardFront = styled("div")({
  width: "100%",
  height: "100%",
  border: "1px"
});

const SeeQuestButton = styled(Button)(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {
    width: "300px"
  },
  [theme.breakpoints.up("sm")]: {
    width: "300px"
  },
  [theme.breakpoints.up("md")]: {
    width: "300px"
  },
  [theme.breakpoints.up("xl")]: {
    width: "330px"
  },
  [theme.breakpoints.up("xxl")]: {
    width: "380px"
  }
}));

const AutCardContainer = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {
    width: "300px",
    height: "350px"
  },
  [theme.breakpoints.up("sm")]: {
    width: "300px",
    height: "350px"
  },
  [theme.breakpoints.up("md")]: {
    width: "300px",
    height: "350px"
  },
  [theme.breakpoints.up("xl")]: {
    width: "330px",
    height: "380px"
  },
  [theme.breakpoints.up("xxl")]: {
    width: "380px",
    height: "430px"
  },
  boxShadow:
    "0px 4px 5px -2px rgba(0,0,0,0.2), 0px 7px 10px 1px rgba(0,0,0,0.14), 0px 2px 16px 1px rgba(0,0,0,0.12)",
  // boxShadow: "10px 10px 10px black",
  backgroundColor: "#262626",
  borderColor: "#3f3f40",
  borderStyle: "solid",
  borderWidth: "3px",
  padding: "0px 5px",
  overflow: "hidden",
  borderRadius: "16px",
  // borderTopLeftRadius: "16px",
  // borderTopRightRadius: "16px",
  // borderBottomLeftRadius: "0",
  // borderBottomRightRadius: "0",
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  flexDirection: "column",
  "&.highlighted": {
    boxShadow: "20px 20px 20px #0063a2"
  },
  transition: theme.transitions.create(["transform"]),
  "&:hover": {
    transform: "scale(1.019)"
  }
}));

const AutCardBack = styled("div")({
  height: "100%",
  width: "100%"
});

const Countdown = styled("div")({
  display: "flex",
  flexDirection: "column",
  marginTop: "45px",
  justifyContent: "center",
  alignItems: "center",
  "& > DIV > DIV:nth-of-type(even)": {
    marginLeft: "4px",
    marginRight: "4px"
  },
  "& > DIV > DIV:nth-of-type(odd) > DIV:nth-of-type(2)": {
    marginRight: "2px"
  }
});

export const NovaCard = ({ daoData }: { daoData: any }) => {
  const navigate = useNavigate();
  const [isFlipped, setFlipped] = useState(false);
  const [hasTimePassed, setHasTimePassed] = useState(false);

  const flipCard = () => {
    if (isFlipped) {
      setFlipped(false);
    } else {
      setFlipped(true);
    }
  };

  return (
    <div
    // style={{
    //   marginBottom: "65px"
    // }}
    >
      <Flipcard
        isFlipped={isFlipped}
        onClick={flipCard}
        containerClassName={`${isFlipped ? "flipped" : ""}`}
      >
        <AutCardFront
          className={`aut-card-front ${isFlipped ? "flipped" : ""}`}
        >
          <AutCardContainer className={`aut-card-container front`}>
            {" "}
            <img
              src={ipfsCIDToHttpUrl(daoData.properties?.image)}
              alt="Dao image"
              style={{
                marginTop: "15px",
                width: "100px",
                height: "100px"
              }}
            />
            <Typography
              fontWeight="bold"
              fontFamily="FractulAltBold"
              variant="subtitle1"
              sx={{
                mt: "25px",
                mb: "0px",
                color: "white"
              }}
            >
              {daoData.name}
            </Typography>
            <Box
              display="flex"
              justifyContent="flex-end"
              marginTop="auto"
              marginBottom="10px"
              width="100%"
            >
              {daoData.properties.roles.map((role: any) => (
                <Button
                  key={role.id}
                  sx={{
                    color: "white",
                    backgroundColor: "transparent",
                    "&:hover": {
                      backgroundColor: "white",
                      color: "black"
                    }
                  }}
                >
                  {role.name}
                </Button>
              ))}
            </Box>
            <Box sx={{ maxWidth: "600px", display: "flex" }}>
              <Box
                sx={{
                  display: "flex",
                  marginRight: "16px",
                  flexDirection: "column"
                }}
              >
                <Typography
                  fontWeight="bold"
                  fontFamily="FractulAltBold"
                  variant="body"
                  sx={{
                    mt: "25px",
                    mb: "0px",
                    color: "white"
                  }}
                >
                  {daoData.properties.prestige}
                </Typography>
                <Typography
                  fontWeight="bold"
                  fontFamily="FractulAltBold"
                  variant="body"
                  sx={{
                    mt: "25px",
                    mb: "0px",
                    color: "white"
                  }}
                >
                  Prestige
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  marginRight: "16px",
                  flexDirection: "column"
                }}
              >
                <Typography
                  fontWeight="bold"
                  fontFamily="FractulAltBold"
                  variant="body"
                  sx={{
                    mt: "25px",
                    mb: "0px",
                    color: "white"
                  }}
                >
                  {daoData.properties.members}
                </Typography>
                <Typography
                  fontWeight="bold"
                  fontFamily="FractulAltBold"
                  variant="body"
                  sx={{
                    mt: "25px",
                    mb: "0px",
                    color: "white"
                  }}
                >
                  Members
                </Typography>
              </Box>
            </Box>
            <div
              style={{
                marginTop: "auto",
                marginBottom: "10px",
                width: "100%",
                display: "flex",
                justifyContent: "flex-end"
              }}
            >
              <img
                style={{
                  width: "22px",
                  height: "22px",
                  marginRight: "10px"
                }}
                src={FlipIcon}
                alt="Flip icon"
              />
            </div>
          </AutCardContainer>
        </AutCardFront>
        <AutCardBack className="aut-card-back">
          <AutCardContainer className={`aut-card-container back`}>
            <img
              src={ipfsCIDToHttpUrl(daoData.properties?.image)}
              alt="Dao image"
              style={{
                marginTop: "15px",
                width: "100px",
                height: "100px"
              }}
            />
            <Typography
              fontWeight="bold"
              fontFamily="FractulAltBold"
              variant="subtitle1"
              sx={{
                mt: "25px",
                mb: "0px",
                color: "white"
              }}
            >
              {daoData.name}
            </Typography>
            <Typography
              fontFamily="FractulAltBold"
              variant="body"
              sx={{
                mt: "25px",
                mb: "0px",
                color: "white"
              }}
            >
              {daoData.properties.description}
            </Typography>

            <div
              style={{
                marginTop: "auto",
                marginBottom: "10px",
                width: "100%",
                display: "flex",
                justifyContent: "flex-end"
              }}
            >
              <img
                style={{
                  width: "22px",
                  height: "22px",
                  marginRight: "10px"
                }}
                src={FlipIcon}
                alt="Flip icon"
              />
            </div>
          </AutCardContainer>
        </AutCardBack>
      </Flipcard>
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <SeeQuestButton
          sx={{
            width: "100%",
            mt: "24px",
            boxShadow:
              "0px 4px 5px -2px rgba(0,0,0,0.2), 0px 7px 10px 1px rgba(0,0,0,0.14), 0px 2px 16px 1px rgba(0,0,0,0.12)"
          }}
          variant="outlined"
          size="normal"
          color="offWhite"
          onClick={() => {
            navigate(`/dao?daoAddress=${daoData.address}`);
          }}
        >
          Join
        </SeeQuestButton>
      </div>
    </div>
  );
};

export default memo(NovaCard);
