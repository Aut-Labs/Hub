import { memo, useEffect, useMemo, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Link,
  Stack,
  SvgIcon,
  Typography,
  styled,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import { TOOLBAR_HEIGHT } from "./ToolbarConnector";
import CopyAddress from "@components/CopyAddress";
import CalendarIcon from "@assets/icons/calendar.png";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import {
  useCheckHasMintedForHubQuery,
  ArchetypeTypes,
  useGetAllHubsQuery,
  useGetHubTasksQuery,
  hubApi,
  useRegisterDomainMutation
} from "@api/hub.api";
import { ipfsCIDToHttpUrl } from "@api/storage.api";
import DiscordIcon from "@assets/SocialIcons/DiscordIcon.svg?react";
import GitHubIcon from "@assets/SocialIcons/GitHubIcon.svg?react";
import LensfrensIcon from "@assets/SocialIcons/LensfrensIcon.svg?react";
import TelegramIcon from "@assets/SocialIcons/TelegramIcon.svg?react";
import TwitterIcon from "@assets/SocialIcons/TwitterIcon.svg?react";
import AutTaskTabs from "./AutHubTabs/AutTaskTabs";
import AutIconLabel from "@components/AutIconLabel";
import TaskCard from "@components/TaskCard";
import RoleCard from "@components/RoleCard";
import { AutOsButton } from "@components/AutButton";
import { useAppDispatch } from "@store/store.model";
import { IsEditingHub, setOpenEditHub } from "@store/ui-reducer";
import { useSelector } from "react-redux";
import { useAccount } from "wagmi";
import { HubOSHub } from "@api/hub.model";
import AutLoading from "@components/AutLoading";
import DomainRegistrationDialog from "./RegisterDomainDialog";
import LoadingDialog from "@components/Dialog/LoadingPopup";
import ErrorDialog from "@components/Dialog/ErrorPopup";
import SuccessDialog from "@components/Dialog/SuccessPopup";
import { setHubAddress } from "@store/WalletProvider/WalletProvider";
import { HubOSAutID } from "@api/aut.model";
import { filterActiveHubs } from "./utils";
import { AutEditHubDialog } from "@components/AutEditHubDialog";
import { Role } from "@aut-labs/sdk/dist/models/role";
import { getHubSigil } from "@api/aut.api";
import { SocialUrls } from "@aut-labs/sdk";

const socialIcons = {
  discord: DiscordIcon,
  twitter: TwitterIcon,
  github: GitHubIcon,
  telegram: TelegramIcon,
  lensfrens: LensfrensIcon
};

const calculateFontSize = (name: string) => {
  const words = name.split(" ");
  const longestWordLength = Math.max(...words.map((word) => word.length));
  if (longestWordLength >= 22) {
    return "0.85rem !important";
  } else if (longestWordLength >= 20) {
    return "0.95rem !important";
  } else if (longestWordLength >= 18) {
    return "1.05rem !important";
  } else if (longestWordLength >= 16) {
    return "1.15rem !important";
  } else if (longestWordLength >= 14) {
    return "1.25rem !important";
  } else if (longestWordLength >= 12) {
    return "1.35rem !important";
  } else if (longestWordLength >= 10) {
    return "1.45rem !important";
  } else {
    return "";
  }
};

const AutContainer = styled("div")(({ theme }) => ({
  display: "flex",
  height: "100%",
  paddingTop: "32px",
  gap: "30px",
  flexDirection: "row",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
    width: "100%"
  }

  // backgroundImage: `url(${backgroundImage})`,
  // backgroundBlendMode: "hard-light",
  // backgroundSize: "cover",
  // backgroundRepeat: "repeat-y"
}));

const LeftWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "fit-content",
  width: "100%",
  maxWidth: "420px",
  backdropFilter: "blur(12px)",
  backgroundColor: "rgba(128, 128, 128, 0.06)",
  boxShadow: "0px 3px 6px #00000029",
  borderRadius: "24px",
  padding: "32px 16px",
  margin: "auto",
  marginLeft: "24px",
  [theme.breakpoints.down("md")]: {
    width: "90%",
    maxWidth: "unset",
    marginLeft: 0,
    marginRight: 0
  }
}));

const RightWrapper = styled(Box)(({ theme }) => ({
  alignSelf: "flex-start",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  padding: "32px 16px",
  // marginRight: "25px",
  // marginLeft: "25px",
  height: "100%",
  position: "relative",
  // width: "70%",
  flex: 1,
  [theme.breakpoints.down("md")]: {
    width: "100%",
    marginLeft: 0,
    marginRight: 0
  }
}));

export const IconContainer = styled("div")(({ theme }) => ({
  display: "flex",
  minHeight: "25px",
  height: "40px",

  flex: "1",
  flexBasis: "50%",

  [theme.breakpoints.down("md")]: {
    height: "35px",
    minHeight: "20px"
  }
}));

export const HubTasksGrid = ({ header, tasks }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        marginTop: theme.spacing(3),
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "1fr 1fr",
          md: "1fr 1fr",
          xl: "1fr 1fr 1fr",
          xxl: "1fr 1fr 1fr 1fr"
        },
        ml: {
          xs: theme.spacing(3),
          md: 0
        },
        mr: {
          xs: theme.spacing(3),
          md: theme.spacing(2)
        },
        gap: {
          xs: theme.spacing(2),
          md: theme.spacing(3),
          xl: theme.spacing(4),
          xxl: theme.spacing(4)
        }
      }}
    >
      {tasks?.map((row, index) => (
        <TaskCard key={`task-item-${row.name}`} row={row} />
      ))}
    </Box>
  );
};

export const HubRoles = ({ hub }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        marginTop: theme.spacing(3),
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "1fr 1fr",
          md: "1fr 1fr",
          xl: "1fr 1fr 1fr",
          xxl: "1fr 1fr 1fr 1fr"
        },
        ml: {
          xs: theme.spacing(3),
          md: 0
        },
        mr: {
          xs: theme.spacing(3),
          md: theme.spacing(2)
        },
        gap: {
          xs: theme.spacing(2),
          md: theme.spacing(3),
          xl: theme.spacing(4),
          xxl: theme.spacing(4)
        }
      }}
    >
      {hub.roles?.map((role: Role, index: number) => (
        <RoleCard
          key={`role-item-${role.roleName}-${index}`}
          hub={hub}
          role={role}
        />
      ))}
    </Box>
  );
};

const HubDetails = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const ps = useRef<HTMLElement>();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isEditingHub = useSelector(IsEditingHub);
  const { hubName } = useParams();
  const { address } = useAccount();
  const navigate = useNavigate();
  const [openDomainDialog, setOpenDomainDialog] = useState(false);
  const [domain, setDomain] = useState("");

  const [
    registerDomain,
    {
      isLoading: isRegisteringDomain,
      isError: failedToRegisterDomain,
      reset,
      isSuccess: successfullyRegisteredDomain
    }
  ] = useRegisterDomainMutation();

  const { data, isSuccess } = useGetAllHubsQuery(
    {
      connectedAddress: address
    },
    {
      refetchOnMountOrArgChange: true,
      selectFromResult: ({ data, isSuccess }) => ({
        isSuccess,
        data
      })
    }
  );

  const hub: HubOSHub = useMemo(() => {
    const hubResult = filterActiveHubs(data?.hubs || [], address).find((d) => {
      return d.name?.toLowerCase() === hubName?.toLowerCase();
    });
    if (domain) {
      hubResult.properties.domain = domain;
    }
    return hubResult;
  }, [data, hubName, address, domain]);

  const autId: HubOSAutID = useMemo(() => {
    if (!address) return null;
    return (data?.autIDs || [])?.find(
      (m) => m.properties.address?.toLowerCase() === address?.toLowerCase()
    );
  }, [data, address]);

  const hasJoinedHub = useMemo(() => {
    if (!autId) return false;
    return autId.properties.joinedHubs.some(
      (h) => h.hubAddress.toLowerCase() === hub?.properties.address.toLowerCase()
    );
  }
  , [autId, hub]);

  const isHubDeployer = useMemo(() => {
    if (!hub || !autId) return false;
    return hub.properties.deployer.toLowerCase() === autId.properties.address.toLowerCase();
  }, [hub, autId]);


  if(autId && hub)
    {
      debugger;
    }

  const isAdmin = useMemo(() => {
    if (!autId) return false;
    const joinedHub = autId.properties.joinedHubs.find(
      (h) =>
        h.hubAddress.toLowerCase() === hub?.properties.address.toLowerCase()
    );
    return joinedHub?.isAdmin;
  }, [autId, hub]);

  const [sigil, setSigil] = useState<string | null>(null);

  useEffect(() => {
    const generate = async () => {
      const toBase64 = await getHubSigil(hub.properties.address);
      setSigil(toBase64);
    };
    if (hub?.properties?.address) {
      generate();
    }
  }, [hub?.properties?.address]);

  const { data: result, isLoading: checkingIfMinted } =
    useCheckHasMintedForHubQuery(
      { address, hubAddress: hub?.properties?.address },
      {
        skip: !address || !hub
      }
    );

  useEffect(() => {
    if (hub) {
      dispatch(setHubAddress(hub?.properties?.address));
    } else if (!hub && isSuccess) {
      navigate("/");
    }
  }, [hub, isSuccess]);

  const canSetArchetype = useMemo(() => {
    return isAdmin;
  }, [isAdmin]);

  const selectedArchetype = useMemo(() => {
    if (!hub?.properties?.archetype?.default) {
      return null;
    }
    return ArchetypeTypes[hub?.properties?.archetype?.default];
  }, [hub]);

  const { data: tasks } = useGetHubTasksQuery(hub?.properties.address, {
    skip: !hub?.properties.address,
    refetchOnMountOrArgChange: true
  });

  const [searchParams] = useSearchParams();
  const selectedTab = searchParams.get("tab") === "archetype" ? 0 : 1;

  const openEditHubModal = () => {
    dispatch(setOpenEditHub(true));
  };

  const handleClose = () => {
    dispatch(setOpenEditHub(false));
  };

  useEffect(() => {
    const autDiv = document.querySelector("div.aut");
    const button = autDiv?.querySelector("button");
    if (button) {
      button.style.display = "none";
    }
  }, []);

  const onMinted = async (event: CustomEvent) => {
    dispatch(hubApi.util.invalidateTags(["hasMinted"]));
  };

  useEffect(() => {
    window.addEventListener("aut-minted", onMinted);
    window.addEventListener("aut-joined", onMinted);
    return () => {
      window.removeEventListener("aut-minted", onMinted);
      window.removeEventListener("aut-joined", onMinted);
    };
  }, []);

  const parsedTimeStamp = useMemo(() => {
    if (hub?.properties?.timestamp) {
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "2-digit"
      }).format(hub?.properties?.timestamp);
    }
  }, [hub]);

  const canSeeRegisterDomain = useMemo(() => {
    if (!hub) {
      return false;
    }
    if (!address) {
      return false;
    }

    return (
      address.toLowerCase() === hub?.properties.deployer.toLowerCase() &&
      !hub?.properties.domain
    );
  }, [address, hub]);

  return (
    <>
      {hub && (
        <AutEditHubDialog
          open={isEditingHub}
          hideCloseBtn={false}
          title="Edit Hub"
          hub={hub}
          onClose={handleClose}
        />
      )}
      <LoadingDialog
        open={isRegisteringDomain}
        message="Registering Hub Domain..."
      />

      <SuccessDialog
        titleVariant="h3"
        subtitleVariant="h4"
        message="Congrats!"
        subtitle="You have registered your hub's domain!"
        handleClose={() => {
          reset();
          setOpenDomainDialog(false);
        }}
        open={successfullyRegisteredDomain}
        // action={() => handleMint()}
      ></SuccessDialog>

      <ErrorDialog
        handleClose={() => reset()}
        open={failedToRegisterDomain}
        message={"Failed to register domain."}
      />
      <DomainRegistrationDialog
        open={openDomainDialog}
        onClose={() => setOpenDomainDialog(false)}
        onRegister={async (domain: string) => {
          const result = await registerDomain({
            domain: `${domain}.hub`,
            hubAddress: hub.properties.address,
            metadataUri: hub.properties.metadataUri
          });
          if ((result as any)?.data?.success) {
            // hack cause query fails to refetch
            setDomain(`${domain}.hub`);
          }
        }}
      ></DomainRegistrationDialog>
      <PerfectScrollbar
        containerRef={(el) => (ps.current = el)}
        style={{
          ...(isMobile && {
            marginTop: `${TOOLBAR_HEIGHT}px`,
            height: `calc(100% - ${TOOLBAR_HEIGHT + "px"})`
          }),
          ...(!isMobile && {
            marginTop: `${TOOLBAR_HEIGHT}px`,
            height: `calc(100% - ${TOOLBAR_HEIGHT + "px"})`
          }),
          display: "flex",
          flexDirection: "column"
        }}
      >
        {!!hub && !checkingIfMinted ? (
          <AutContainer>
            <LeftWrapper>
              <Stack
                sx={{
                  width: "75%",
                  maxWidth: "360px"
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "12px",
                    justifyContent: "center"
                  }}
                >
                  <Box
                    sx={{
                      flex: "1",
                      height: {
                        xs: "120px",
                        sm: "120px",
                        md: "120px",
                        xxl: "130px"
                      },
                      width: {
                        xs: "120px",
                        sm: "120px",
                        md: "120px",
                        xxl: "130px"
                      },
                      "@media (max-width: 370px)": {
                        height: "100px",
                        width: "100px"
                      },
                      minWidth: "120px",
                      position: "relative"
                    }}
                  >
                    <Avatar
                      sx={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "0",
                        background: "transparent"
                      }}
                      aria-label="avatar"
                    >
                      <img
                        src={ipfsCIDToHttpUrl(hub?.image as string)}
                        style={{
                          objectFit: "contain",
                          width: "100%",
                          height: "100%"
                        }}
                      />
                    </Avatar>

                    {sigil && (
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: {
                            xs: "-15px",
                            sm: "-15px",
                            md: "-17.5px",
                            xxl: "-10px"
                          },
                          right: {
                            xs: "10px",
                            sm: "10px",
                            md: "-17.5px",
                            xxl: "-17.5px"
                          },
                          "@media (max-width: 584px)": {
                            right: "5px"
                          },
                          "@media (max-width: 520px)": {
                            right: "-5px"
                          },
                          "@media (max-width: 480px)": {
                            right: "-15px"
                          },
                          height: {
                            xs: "35px",
                            sm: "35px",
                            md: "40px",
                            xxl: "40px"
                          },
                          width: {
                            xs: "35px",
                            sm: "35px",
                            md: "40px",
                            xxl: "40px"
                          },
                          backgroundColor: "transparent",
                          backdropFilter: "blur(8px)",
                          borderRadius: "8px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: "8px",
                          zIndex: 1
                        }}
                      >
                        <img
                          style={{
                            transform: "scale(1.8)",
                            height: "100%",
                            width: "100%",
                            objectFit: "contain"
                          }}
                          aria-label="card"
                          src={sigil}
                        />
                      </Box>
                    )}
                  </Box>

                  {/* {sigil && (
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: {
                          xs: "-17.5px",
                          md: "-20px",
                          xxl: "-22.5px"
                        },
                        right: { xs: "-17.5px", md: "-20px", xxl: "-22.5px" },
                        height: { xs: "35px", md: "40px", xxl: "45px" },
                        width: { xs: "35px", md: "40px", xxl: "45px" },
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        backdropFilter: "blur(8px)",
                        borderRadius: "8px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "8px",
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)"
                      }}
                    >
                      <img
                        style={{
                          transform: "scale(1.6)",
                          height: "100%",
                          width: "100%",
                          objectFit: "contain"
                        }}
                        aria-label="card"
                        src={sigil}
                      />
                    </Box>
                  )} */}
                  <div
                    style={{
                      flex: "1",
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "column",
                      justifyContent: "center"
                    }}
                  >
                    <Typography
                      color="offWhite.main"
                      textAlign="center"
                      lineHeight={1}
                      variant="h3"
                      marginBottom={2}
                      fontSize={calculateFontSize(hub?.name as string)}
                    >
                      {hub?.name}
                      {hub.properties.domain && (
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
                    <CopyAddress address={hub?.properties.address} />
                    {/* Add domain information here */}
                    <Typography
                      color="offWhite.main"
                      textAlign="center"
                      variant="body2"
                      marginTop={1}
                    >
                      {hub.properties.domain
                        ? hub.properties.domain
                        : "Domain not registered"}
                    </Typography>
                  </div>
                </Box>
                <Stack
                  direction="row"
                  sx={{
                    marginTop: 3
                  }}
                >
                  <Stack
                    width="100%"
                    direction="column"
                    justifyContent="space-around"
                    sx={{
                      marginTop: theme.spacing(2)
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        marginRight: "16px",
                        mb: "8px",
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
                          mb: "0px",
                          color: "#FFF"
                        }}
                      >
                        {hub?.properties.members?.length}
                      </Typography>
                      <Typography
                        fontWeight="bold"
                        fontFamily="FractulRegular"
                        variant="caption"
                        sx={{
                          mb: "0px",
                          color: "#A7B1C4"
                        }}
                      >
                        members
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
                          mb: "0px",
                          color: "#FFF"
                        }}
                      >
                        {hub?.prestige}
                      </Typography>
                      <Typography
                        fontWeight="bold"
                        fontFamily="FractulRegular"
                        variant="caption"
                        sx={{
                          mb: "0px",
                          color: "#A7B1C4"
                        }}
                      >
                        prestige
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack
                    width="100%"
                    justifyContent="space-around"
                    sx={{
                      marginTop: theme.spacing(2)
                    }}
                  >
                    <AutIconLabel
                      textColor="#FFF"
                      sx={{
                        border: "1px solid #707070",
                        minHeight: "42px",
                        minWidth: "165px"
                      }}
                      icon={
                        <SvgIcon
                          sx={{
                            width: "16px"
                          }}
                          inheritViewBox
                          component={hub?.marketTemplate?.icon}
                        ></SvgIcon>
                      }
                      label={hub?.marketTemplate?.title}
                    ></AutIconLabel>
                    <AutIconLabel
                      textColor="#FFF"
                      sx={{
                        border: "1px solid #707070",
                        minHeight: "42px",
                        minWidth: "165px",
                        ...(!selectedArchetype?.title && {
                          ".MuiSvgIcon-root": {
                            display: "none"
                          }
                        })
                        // flex: "1"
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
                  </Stack>
                </Stack>
                <Box
                  sx={{
                    marginTop: theme.spacing(2)
                  }}
                >
                  <Box sx={{ padding: "8px 0px" }}>
                    <Typography
                      sx={{ flex: "1" }}
                      color="offWhite.main"
                      textAlign="left"
                      variant="body"
                    >
                      {hub?.description || "No description yet..."}
                    </Typography>
                  </Box>
                </Box>
                <Box
                  marginTop={theme.spacing(2)}
                  sx={{
                    display: "flex",
                    marginTop: theme.spacing(2),
                    flexDirection: "row",
                    gap: "12px",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <IconContainer>
                    {hub?.properties.socials.map((social, index) => {
                      const AutIcon =
                        socialIcons[Object.keys(socialIcons)[index]];

                      return (
                        <Link
                          key={`social-icon-${index}`}
                          {...(!!social.link && {
                            component: "a",
                            href: social.link,
                            target: "_blank",
                            sx: {
                              svg: {
                                color: theme.palette.offWhite.main
                              }
                            }
                          })}
                          {...((!social.link ||
                            social.link ===
                              SocialUrls[social.type]?.prefix) && {
                            sx: {
                              // display: "none",
                              svg: {
                                color: theme.palette.divider
                              }
                            },
                            component: "a",
                            pointerEvents: "none",
                            disabled: true
                          })}
                        >
                          <SvgIcon
                            sx={{
                              height: {
                                xs: "25px",
                                xxl: "30px"
                              },
                              width: {
                                xs: "25px",
                                xxl: "30px"
                              },
                              mr: {
                                xs: "10px",
                                xxl: "15px"
                              }
                            }}
                            key={`socials.${index}.icon`}
                            component={AutIcon}
                          />
                        </Link>
                      );
                    })}
                  </IconContainer>
                </Box>
                <Box
                  marginTop={theme.spacing(2)}
                  sx={{
                    textAlign: "center",
                    color: theme.palette.offWhite.main,
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  <img
                    style={{ height: "20px", width: "20px" }}
                    src={CalendarIcon}
                  ></img>
                  <Typography
                    align="center"
                    marginLeft={1}
                    color="white"
                    lineHeight={1}
                    variant="caption"
                  >
                    {`Created on ${parsedTimeStamp}`}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    gap: 2,
                    marginTop: theme.spacing(2)
                  }}
                >
                  {canSetArchetype && (
                    <AutOsButton
                      onClick={openEditHubModal}
                      type="button"
                      color="primary"
                      disabled={!canSetArchetype}
                      variant="outlined"
                    >
                      <Typography
                        fontWeight="700"
                        fontSize="16px"
                        lineHeight="26px"
                      >
                        Edit Hub
                      </Typography>
                    </AutOsButton>
                  )}
                  {canSeeRegisterDomain && (
                    <AutOsButton
                      onClick={() => setOpenDomainDialog(true)}
                      type="button"
                      color="primary"
                      variant="outlined"
                    >
                      <Typography
                        fontWeight="700"
                        fontSize="16px"
                        lineHeight="26px"
                      >
                        Register Domain
                      </Typography>
                    </AutOsButton>
                  )}
                </Box>
              </Stack>
            </LeftWrapper>
            <RightWrapper>
              {isHubDeployer && !hasJoinedHub && (
                <Typography
                  variant="h5"
                  color="white"
                  sx={{ textAlign: "center", marginBottom: theme.spacing(2) }}
                >
                  Pick a Role to verify your Hub
                </Typography>
              )}
              {!!tasks && !!hub && (
                <AutTaskTabs
                  hub={hub}
                  tasks={tasks.tasks}
                  selectedTab={selectedTab}
                />
              )}
            </RightWrapper>
          </AutContainer>
        ) : (
          <AutLoading width="130px" height="130px" />
        )}
      </PerfectScrollbar>
    </>
  );
};

export default memo(HubDetails);
