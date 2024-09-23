import {
  Avatar,
  Box,
  Button,
  Typography,
  styled,
  keyframes,
  SvgIcon,
  useTheme,
  Tooltip
} from "@mui/material";
import { memo, useMemo, useState } from "react";
import { ipfsCIDToHttpUrl } from "@api/storage.api";
import Flipcard from "@components/Flipcard";
import FlipIcon from "@assets/flip.svg";
import { useNavigate } from "react-router-dom";
import AutIconLabel from "./AutIconLabel";
import Check from "@assets/autos/check.svg?react";
import { HubOSHub, MarketTemplates } from "@api/hub.model";
import { useAccount } from "wagmi";
import { ArchetypeTypes } from "@api/hub.api";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Role } from "@aut-labs/sdk/dist/models/role";

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
  height: "60px",
  borderRadius: "9px !important",
  [theme.breakpoints.up("xs")]: {
    width: "280px"
  },
  [theme.breakpoints.up("sm")]: {
    width: "280px"
  },
  [theme.breakpoints.up("md")]: {
    width: "300px"
  },
  [theme.breakpoints.up("xl")]: {
    width: "320px"
  },
  [theme.breakpoints.up("xxl")]: {
    width: "320px"
  }
}));

const AnimatedText = styled("div")(({ theme }) => ({
  transition: theme.transitions.create(["opacity"]),
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)"
}));

const AutCardContainer = styled("div")<{ isHighlighted?: boolean }>(
  ({ theme, isHighlighted }) => ({
    [theme.breakpoints.up("xs")]: {
      width: "280px",
      height: "300px"
    },
    [theme.breakpoints.up("sm")]: {
      width: "285px",
      height: "310px"
    },
    [theme.breakpoints.up("md")]: {
      width: "290px",
      height: "320px"
    },
    [theme.breakpoints.up("xl")]: {
      width: "320px",
      height: "360px"
    },
    [theme.breakpoints.up("xxl")]: {
      width: "320px",
      height: "370px"
    },
    boxShadow:
      "0px 4px 5px -2px rgba(0,0,0,0.2), 0px 7px 10px 1px rgba(0,0,0,0.14), 0px 2px 16px 1px rgba(0,0,0,0.12)",
    backgroundColor: "#FFF",
    borderColor: "#3f3f40",
    borderStyle: "solid",
    borderWidth: "3px",
    padding: "0px 5px",
    overflow: "hidden",
    borderRadius: "16px",
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

export const HubCard = ({
  hubData,
  isHighlighted
}: {
  hubData: HubOSHub;
  isHighlighted?: boolean;
}) => {
  const navigate = useNavigate();
  const [isFlipped, setFlipped] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(false);
  const theme = useTheme();
  const { address } = useAccount();
  const selectedArchetype = useMemo(() => {
    if (!hubData?.properties?.archetype?.default) {
      return null;
    }
    return ArchetypeTypes[hubData?.properties?.archetype?.default];
  }, [hubData]);

  const marketTemplate = useMemo(() => {
    const marketName = hubData?.properties?.market;
    return MarketTemplates.find(
      (v) => v.title === marketName || (v.market as any) === marketName
    );
  }, [hubData]);

  const userHubState = useMemo(() => {
    const member = hubData?.properties?.members.find(
      (aut) => aut.properties.address.toLowerCase() === address?.toLowerCase()
    );
    const joinedHub = member?.properties.joinedHubs.find(
      (hub) =>
        hub.hubAddress?.toLowerCase() ===
        hubData?.properties?.address?.toLowerCase()
    );
    const hasJoined = !!member;
    const hasDeployed =
      hubData?.properties?.deployer?.toLowerCase() === address?.toLowerCase();
    const isAdmin = joinedHub?.isAdmin;
    const selectedRole = hubData.roles.find(
      (role) => +role.id === +joinedHub?.role
    );

    return {
      hasJoined,
      hasDeployed,
      isAdmin,
      selectedRole
    };
  }, [hubData]);

  const flipCard = () => {
    if (isFlipped) {
      setFlipped(false);
    } else {
      setFlipped(true);
    }
  };

  return (
    <div>
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
              src={ipfsCIDToHttpUrl(hubData?.image)}
              alt="Hub image"
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
              {hubData.name}
              {hubData.properties.domain && (
                <SvgIcon
                  component={CheckCircleIcon}
                  sx={{
                    fontSize: "0.8em",
                    marginLeft: "4px",
                    verticalAlign: "middle",
                    color: theme.palette.success.main
                  }}
                />
              )}
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
                  {hubData.prestige}
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
                  {hubData.properties.members?.length}
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
                justifyContent: "center",
                alignItems: "center"
              }}
              marginTop="auto"
              width="90%"
              marginBottom="10px"
            >
              {hubData.roles.map((role: Role) => (
                <Tooltip title={role?.roleName} key={role.roleName}>
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
                      borderColor: "#000",
                      ...(userHubState?.selectedRole?.roleName ===
                        role.roleName && {
                        backgroundColor: "#000",
                        color: "white"
                      })
                    }}
                  >
                    <Typography
                      fontFamily="FractulRegular"
                      variant="body"
                      sx={{
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
                        minWidth: "15px",
                        fill:
                          userHubState?.selectedRole?.roleName === role.roleName
                            ? "white"
                            : "#000"
                      }}
                    />
                  </Box>
                </Tooltip>
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
                src={ipfsCIDToHttpUrl(hubData?.image as string)}
              />
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Typography
                  fontWeight="bold"
                  fontFamily="FractulAltBold"
                  variant="subtitle1"
                  sx={{
                    mb: "0px",
                    color: "#000"
                  }}
                >
                  {hubData?.name}
                  {hubData.properties.domain && (
                    <SvgIcon
                      component={CheckCircleIcon}
                      sx={{
                        fontSize: "0.8em",
                        marginLeft: "4px",
                        verticalAlign: "middle",
                        color: theme.palette.success.main
                      }}
                    />
                  )}
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
              {hubData?.description}
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
                  flexBasis: "50%",
                  minHeight: "42px"
                  // marginTop: theme.spacing(2)
                }}
                icon={
                  <SvgIcon
                    sx={{
                      width: "16px"
                    }}
                    inheritViewBox
                    component={marketTemplate?.icon}
                  ></SvgIcon>
                }
                label={marketTemplate?.title}
              ></AutIconLabel>
              <AutIconLabel
                textColor="#FFF"
                sx={{
                  flex: "1",
                  flexBasis: "50%",
                  minHeight: "42px",
                  ...(!selectedArchetype?.title && {
                    ".MuiSvgIcon-root": {
                      display: "none"
                    }
                  })
                  // marginTop: theme.spacing(2)
                }}
                icon={
                  <SvgIcon
                    sx={{
                      width: "16px"
                    }}
                    inheritViewBox
                    component={selectedArchetype?.logo}
                  ></SvgIcon>
                }
                label={selectedArchetype?.title ?? "N/A"}
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
            position: "relative",
            width: "100%",
            mt: 2,
            animation:
              !userHubState?.hasJoined && !userHubState?.hasDeployed
                ? `${pulsate} 2s infinite`
                : "none",
            boxShadow:
              "0px 4px 5px -2px rgba(0,0,0,0.2), 0px 7px 10px 1px rgba(0,0,0,0.14), 0px 2px 16px 1px rgba(0,0,0,0.12)"
          }}
          variant="outlined"
          size="normal"
          color="offWhite"
          onMouseEnter={() => setHoveredButton(true)}
          onMouseLeave={() => setHoveredButton(false)}
          onClick={() => {
            if (userHubState?.hasDeployed) {
              navigate(`/project/${hubData.name}?tab=archetype`);
            } else {
              navigate(`/project/${hubData.name}?tab=roles`);
            }
          }}
        >
          <AnimatedText style={{ opacity: hoveredButton ? 0 : 1 }}>
            {!userHubState?.hasJoined
              ? userHubState?.hasDeployed
                ? "Verify"
                : "Join"
              : userHubState?.hasDeployed
                ? "Verified"
                : "Joined"}
            {userHubState?.hasJoined && userHubState?.hasDeployed && (
              <SvgIcon
                component={CheckCircleIcon}
                sx={{
                  marginLeft: 1,
                  verticalAlign: "middle",
                  color: "#fff"
                }}
              />
            )}
          </AnimatedText>
          <AnimatedText style={{ opacity: hoveredButton ? 1 : 0 }}>
            View Hub
          </AnimatedText>
        </SeeQuestButton>
      </div>
    </div>
  );
};

export default memo(HubCard);
