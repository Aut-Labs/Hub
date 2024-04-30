import {
  Avatar,
  Box,
  Button,
  Link,
  Typography,
  styled,
  keyframes
} from "@mui/material";
import { memo, useEffect, useMemo, useState } from "react";
import { ipfsCIDToHttpUrl } from "@api/storage.api";
import Flipcard from "@components/Flipcard";
import FlipIcon from "@assets/flip.svg";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import { NovaDAO } from "@api/community.model";
import { useNavigate } from "react-router-dom";
import AutIconLabel from "./AutIconLabel";
import { Markets } from "@api/community.api";
import { ReactComponent as ArrowIcon } from "@assets/autos/move-right.svg";

import { ReactComponent as OpenSource } from "@assets/icons/opensource.svg";
import { ReactComponent as ArtEvents } from "@assets/icons/artevents.svg";
import { ReactComponent as Social } from "@assets/icons/social.svg";
import { ReactComponent as Refi } from "@assets/icons/refi.svg";

import { ReactComponent as Size } from "@assets/icons/size.svg";
import { ReactComponent as Growth } from "@assets/icons/growth.svg";
import { ReactComponent as Performance } from "@assets/icons/performance.svg";
import { ReactComponent as Reputation } from "@assets/icons/reputation.svg";
import { ReactComponent as Conviction } from "@assets/icons/conviction.svg";

import { ReactComponent as Cross } from "@assets/autos/cross.svg";
import { ReactComponent as Check } from "@assets/autos/check.svg";
import { RequiredQueryParams } from "@api/RequiredQueryParams";
import { NovaArchetype } from "@aut-labs/sdk/dist/models/nova";

export const ArchetypeIcons = {
  [NovaArchetype.SIZE]: <Size />,
  [NovaArchetype.GROWTH]: <Growth />,
  [NovaArchetype.PERFORMANCE]: <Performance />,
  [NovaArchetype.REPUTATION]: <Reputation />,
  [NovaArchetype.CONVICTION]: <Conviction />
};

export const MarketIcons = {
  [Markets["Open-Source & Infra"]]: <OpenSource />,
  [Markets["Art, Events & NFTs"]]: <ArtEvents />,
  [Markets["Social, Gaming & DeFi"]]: <Social />,
  [Markets["ReFi & Public Goods"]]: <Refi />
};

const getRoleName = (daoData, quest) => {
  const role = daoData.properties.rolesSets[0].roles.find(
    (r) => r.id === quest.role
  );
  if (role) {
    return role.roleName;
  }
  return "N/A";
};
export const pulsate = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(27, 95, 168, 0.9);
  }
  70% {
    box-shadow: 0 0 0 15px rgba(27, 95, 168, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(27, 95, 168, 0);
  }
`;

const AutCardFront = styled("div")({
  width: "100%",
  height: "100%",
  border: "1px"
});

const SeeQuestButton = styled(Button)(({ theme }) => ({
  height: "70px",
  borderRadius: "9px !important",
  [theme.breakpoints.up("xs")]: {
    width: "330px"
  },
  [theme.breakpoints.up("sm")]: {
    width: "330px"
  },
  [theme.breakpoints.up("md")]: {
    width: "330px"
  },
  [theme.breakpoints.up("xl")]: {
    width: "350px"
  },
  [theme.breakpoints.up("xxl")]: {
    width: "350px"
  }
}));

const AutCardContainer = styled("div")<{ isHighlighted?: boolean }>(
  ({ theme, isHighlighted }) => ({
    [theme.breakpoints.up("xs")]: {
      width: "330px",
      height: "350px"
    },
    [theme.breakpoints.up("sm")]: {
      width: "330px",
      height: "350px"
    },
    [theme.breakpoints.up("md")]: {
      width: "330px",
      height: "350px"
    },
    [theme.breakpoints.up("xl")]: {
      width: "350px",
      height: "380px"
    },
    [theme.breakpoints.up("xxl")]: {
      width: "350px",
      height: "430px"
    },
    boxShadow:
      "0px 4px 5px -2px rgba(0,0,0,0.2), 0px 7px 10px 1px rgba(0,0,0,0.14), 0px 2px 16px 1px rgba(0,0,0,0.12)",
    // boxShadow: "10px 10px 10px black",
    backgroundColor: "#FFF",
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
    },
    animation: isHighlighted ? `${pulsate} 2s infinite` : "none"
  })
);

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

export const NovaCard = ({
  daoData,
  isHighlighted
}: {
  daoData: any;
  isHighlighted?: boolean;
}) => {
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
          <AutCardContainer
            isHighlighted={isHighlighted}
            className={`aut-card-container front`}
          >
            <img
              src={ipfsCIDToHttpUrl(daoData?.image)}
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
                color: "#000"
              }}
            >
              {daoData.name}
            </Typography>
            <Box
              sx={{
                maxWidth: "600px",
                width: "60%",
                display: "flex",
                alignItems: "space-between",
                justifyContent: "space-between"
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Typography
                  fontWeight="bold"
                  fontFamily="FractulAltBold"
                  variant="subtitle1"
                  sx={{
                    mt: "20px",
                    mb: "0px",
                    color: "#000"
                  }}
                >
                  {daoData.properties.prestige}
                </Typography>
                <Typography
                  fontWeight="bold"
                  fontFamily="FractulRegular"
                  variant="body"
                  sx={{
                    mt: "4px",
                    mb: "0px",
                    color: "#000"
                  }}
                >
                  Prestige
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  marginRight: "16px",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Typography
                  fontWeight="bold"
                  fontFamily="FractulAltBold"
                  variant="subtitle1"
                  sx={{
                    mt: "20px",
                    mb: "0px",
                    color: "#000"
                  }}
                >
                  {daoData.properties.members}
                </Typography>
                <Typography
                  fontWeight="bold"
                  fontFamily="FractulRegular"
                  variant="body"
                  sx={{
                    mt: "4px",
                    mb: "0px",
                    color: "#000"
                  }}
                >
                  Members
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: "12px",
                justifyContent: "flex-end",
                alignItems: "center"
              }}
              marginTop="auto"
              width="90%"
              marginBottom="10px"
            >
              {daoData.properties.roles.map((role: any) => (
                <Box
                  key={role.roleName}
                  sx={{
                    minHeight: "33px",
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "0px 10px",
                    alignItems: "center",
                    flexDirection: "row",
                    flex: "1",
                    color: "#000",
                    maxWidth: "85px",
                    fontFamily: "FractulAltLight",
                    fontSize: "10px",
                    overflow: "hidden",
                    border: "2px solid #000",
                    borderRadius: "24px",
                    borderColor: "#000"
                  }}
                >
                  <Typography
                    fontFamily="FractulRegular"
                    variant="body"
                    sx={{
                      color: "#000",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }}
                  >
                    {role.roleName}
                  </Typography>
                  <Check
                    style={{
                      minHeight: "15px",
                      minWidth: "15px"
                    }}
                  />
                </Box>
                // <Button
                //   key={role.roleName}
                //   sx={{
                //     flex: "1",
                //     color: "#000",
                //     maxWidth: "85px",
                //     fontFamily: "FractulAltLight",
                //     fontSize: "10px",
                //     overflow: "hidden",
                //     border: "2px solid #000",
                //     borderRadius: "24px",
                //     borderColor: "#000",
                //     "&:hover": {
                //       backgroundColor: "#000",
                //       color: "white"
                //     }
                //   }}
                // >
                //   {/* <Typography
                //     fontFamily="FractulAltLight"
                //     variant="caption"
                //     sx={{
                //       mt: "4px",
                //       mb: "0px",
                //       color: "#000"
                //     }}
                //   > */}
                //   {role.roleName}
                //   {/* </Typography> */}
                // </Button>
              ))}
            </Box>
            <div
              style={{
                marginTop: "auto",
                marginBottom: "10px",
                width: "100%",
                display: "flex",
                justifyContent: "center"
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
          <AutCardContainer
            className={`aut-card-container back`}
            isHighlighted={isHighlighted}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "12px",
                justifyContent: "space-between",
                width: "100%",
                alignItems: "center",
                marginTop: "24px",
                padding: "0px 34px"
              }}
            >
              <Avatar
                sx={{
                  height: {
                    xs: "60px",
                    md: "70px",
                    xxl: "70px"
                  },
                  borderRadius: "0",
                  width: {
                    xs: "60px",
                    md: "70px",
                    xxl: "70px"
                  },
                  bgcolor: "purple",
                  background: "transparent"
                }}
                aria-label="avatar"
                src={ipfsCIDToHttpUrl(daoData?.image as string)}
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <Typography
                  color="#000"
                  textAlign="left"
                  lineHeight={1}
                  variant="h3"
                >
                  {daoData?.name}
                </Typography>
              </div>
            </Box>
            <Typography
              fontFamily="FractulRegular"
              variant="body1"
              sx={{
                mt: "25px",
                padding: "0px 24px",
                color: "#000"
              }}
            >
              {daoData?.description}
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "12px",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                padding: "0px 14px",
                marginTop: "auto"
              }}
            >
              <AutIconLabel
                textColor="#FFF"
                sx={{
                  flex: "1",
                  flexBasis: "50%"
                  // marginTop: theme.spacing(2)
                }}
                icon={MarketIcons[daoData?.properties.marketId]}
                label={Markets[daoData?.properties.marketId]}
              ></AutIconLabel>
              <AutIconLabel
                textColor="#FFF"
                sx={{
                  flex: "1",
                  flexBasis: "50%"
                  // marginTop: theme.spacing(2)
                }}
                icon={ArchetypeIcons[daoData?.properties.archetype]}
                label={""}
              ></AutIconLabel>
            </Box>

            <div
              style={{
                marginTop: "14px",
                marginBottom: "10px",
                width: "100%",
                display: "flex",
                justifyContent: "center"
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
            border: "2px solid #FFF",
            borderRadius: "9px",
            width: "100%",
            mt: "24px",
            boxShadow:
              "0px 4px 5px -2px rgba(0,0,0,0.2), 0px 7px 10px 1px rgba(0,0,0,0.14), 0px 2px 16px 1px rgba(0,0,0,0.12)"
          }}
          variant="outlined"
          size="normal"
          color="offWhite"
          onClick={() => {
            navigate(`/project/${daoData.name}`);
          }}
        >
          Join
        </SeeQuestButton>
      </div>
    </div>
  );
};

export default memo(NovaCard);
