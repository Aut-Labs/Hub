import { memo, useEffect, useMemo, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Link,
  Stack,
  SvgIcon,
  TableCell,
  TableRow,
  Typography,
  styled,
  tableCellClasses,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import { TOOLBAR_HEIGHT } from "./ToolbarConnector";
import CopyAddress from "@components/CopyAddress";
import CalendarIcon from "@assets/icons/calendar.png";

import {
  useCheckHasMintedForNovaQuery,
  ArchetypeTypes,
  useGetAllNovasQuery,
  useGetNovaTasksQuery,
  communityApi
} from "@api/community.api";
import { ipfsCIDToHttpUrl } from "@api/storage.api";
import { ReactComponent as DiscordIcon } from "@assets/SocialIcons/DiscordIcon.svg";
import { ReactComponent as GitHubIcon } from "@assets/SocialIcons/GitHubIcon.svg";
import { ReactComponent as LensfrensIcon } from "@assets/SocialIcons/LensfrensIcon.svg";
import { ReactComponent as TelegramIcon } from "@assets/SocialIcons/TelegramIcon.svg";
import { ReactComponent as TwitterIcon } from "@assets/SocialIcons/TwitterIcon.svg";
import { socialUrls } from "@api/aut.model";
import AutTaskTabs from "./AutNovaTabs/AutTaskTabs";
import AutIconLabel from "@components/AutIconLabel";
import TaskCard from "@components/TaskCard";
import { parseNovaTimestamp } from "@utils/date-format";
import RoleCard from "@components/RoleCard";
import { AutOsButton } from "@components/AutButton";
import { useAppDispatch } from "@store/store.model";
import { IsEditingNova, setOpenEditNova } from "@store/ui-reducer";
import { useSelector } from "react-redux";
import { AutEditNovaDialog } from "@components/AutEditNovaDialog";
import { useAccount } from "wagmi";
import { setNovaAddress } from "@store/WalletProvider/WalletProvider";
import { MarketTemplates } from "@api/community.model";
import AutLoading from "@components/AutLoading";
import { filterActiveNovas } from "./utils";
import { generateAutIdDAOSigil } from "@utils/AutSIgilGenerator/SigilGenerator";

const socialIcons = {
  discord: DiscordIcon,
  github: GitHubIcon,
  twitter: TwitterIcon,
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
  px: "30px",
  marginRight: "25px",
  marginLeft: "25px",
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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}, &.${tableCellClasses.body}`]: {
    color: theme.palette.common.white,
    borderColor: "#576176",
    padding: theme.spacing(3),
    "&:nth-of-type(2)": {
      padding: `${theme.spacing(3)} 0 ${theme.spacing(3)} ${theme.spacing(3)}`
    },
    "&:nth-of-type(3)": {
      padding: `${theme.spacing(3)} ${theme.spacing(3)} ${theme.spacing(3)} 0`
    }
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:last-child td, &:last-child th": {
    border: 0
  }
}));

export const NovaTasksGrid = ({ header, tasks }) => {
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

export const EmptyNovaOnboardingCards = ({ roles }) => {
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
      {roles?.map((role, index) => (
        <RoleCard key={`role-item-${role.roleName}`} role={role} />
      ))}
    </Box>
  );
};

const NovaDetails = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const ps = useRef<HTMLElement>();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isEditingNova = useSelector(IsEditingNova);
  const { novaName } = useParams();
  const { address } = useAccount();
  const navigate = useNavigate();

  const { data, isSuccess } = useGetAllNovasQuery(
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

  const nova = useMemo(() => {
    return filterActiveNovas(data?.daos || [], address).find((d) => {
      return d.name?.toLowerCase() === novaName?.toLowerCase();
    });
  }, [data, novaName, address]);

  const [sigil, setSigil] = useState<string | null>(null);

  useEffect(() => {
    const generate = async () => {
      const { toBase64 } = await generateAutIdDAOSigil(nova.properties.address);
      setSigil(toBase64());
    };
    if (nova) {
      generate();
    }
  }, []);

  const {
    data: result,
    isLoading: checkingIfMinted,
    isUninitialized
  } = useCheckHasMintedForNovaQuery(
    { address, novaAddress: nova?.properties?.address },
    {
      skip: !address || !nova
    }
  );

  useEffect(() => {
    if (nova) {
      dispatch(setNovaAddress(nova?.properties?.address));
    } else if (!nova && isSuccess) {
      navigate("/");
    }
  }, [nova, isSuccess]);

  const canSetArchetype = useMemo(() => {
    if (
      nova?.properties?.userData?.isAdmin ||
      address === nova?.properties?.deployer
    ) {
      return true;
    }
  }, [nova, address]);

  const selectedArchetype = useMemo(() => {
    if (!nova?.properties?.archetype?.default) {
      return null;
    }
    return ArchetypeTypes[nova?.properties?.archetype?.default];
  }, [nova]);

  const marketTemplate = useMemo(() => {
    const marketName = nova?.properties?.market;
    return MarketTemplates.find(
      (v) => v.title === marketName || v.market === +marketName
    );
  }, [nova]);

  const { data: tasks } = useGetNovaTasksQuery(nova?.properties.address, {
    skip: !nova?.properties.address,
    refetchOnMountOrArgChange: true
  });

  const [searchParams] = useSearchParams();
  const selectedTab = searchParams.get("tab") === "archetype" ? 0 : 1;

  const handleDialogClose = () => {};

  // const archetype = useMemo(() => {
  //   return archetypeChartValues(nova?.properties.archetype);
  // }, [nova]);

  const openEditNovaModal = () => {
    dispatch(setOpenEditNova(true));
  };

  const handleClose = () => {
    dispatch(setOpenEditNova(false));
  };

  useEffect(() => {
    const autDiv = document.querySelector("div.aut");
    const button = autDiv?.querySelector("button");
    if (button) {
      button.style.display = "none";
    }

    // return () => {
    //   if (button) {
    //     button.style.display = ""; // Reset the style when the component unmounts
    //   }
    // };
  }, []);

  const onMinted = async (event: CustomEvent) => {
    dispatch(communityApi.util.invalidateTags(["hasMinted"]));
  };

  useEffect(() => {
    window.addEventListener("aut-minted", onMinted);
    // window.addEventListener("aut_profile", onAutMenuProfile);
    // window.addEventListener("aut-Init", onAutInit);
    // window.addEventListener("aut-onConnected", onAutLogin);
    // window.addEventListener("aut-onDisconnected", onDisconnected);

    return () => {
      // window.removeEventListener("aut_profile", onAutMenuProfile);
      // window.removeEventListener("aut-Init", onAutInit);
      // window.removeEventListener("aut-onConnected", onAutLogin);
      // window.removeEventListener("aut-onDisconnected", onAutLogin);
      // if (abort.current) {
      //   abort.current.abort();
      // }
      window.removeEventListener("aut-minted", onMinted);
    };
  }, []);

  const parsedTimeStamp = useMemo(() => {
    if (nova?.properties?.timestamp) {
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "2-digit"
      }).format(parseNovaTimestamp(nova?.properties?.timestamp));
    }
  }, [nova]);

  return (
    <>
      {nova && (
        <AutEditNovaDialog
          open={isEditingNova}
          hideCloseBtn={false}
          title="Edit Hub"
          nova={nova}
          onClose={handleClose}
        />
      )}
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
        {!!nova && !checkingIfMinted ? (
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
                        src={ipfsCIDToHttpUrl(nova?.image as string)}
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
                      fontSize={calculateFontSize(nova?.name as string)}
                    >
                      {nova?.name}
                    </Typography>
                    <CopyAddress address={nova?.properties.address} />
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
                        {nova?.properties.members}
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
                        {nova?.properties.prestige}
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
                          component={marketTemplate?.icon}
                        ></SvgIcon>
                      }
                      label={marketTemplate?.title}
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
                      {nova?.description || "No description yet..."}
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
                    {nova?.properties.socials.map((social, index) => {
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
                              socialUrls[social.type]?.prefix) && {
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
                    display: "flex",
                    justifyContent: "center",
                    marginTop: theme.spacing(2)
                  }}
                >
                  {canSetArchetype && (
                    <AutOsButton
                      onClick={openEditNovaModal}
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
                </Box>
              </Stack>
            </LeftWrapper>
            <RightWrapper>
              {!!tasks && !!nova && (
                <AutTaskTabs
                  nova={nova}
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

export default memo(NovaDetails);
