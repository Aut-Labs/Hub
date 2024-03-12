import { memo, useEffect, useMemo, useRef } from "react";
import {
  Avatar,
  Box,
  CircularProgress,
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
import { useSearchParams } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import { TOOLBAR_HEIGHT } from "./ToolbarConnector";
import CopyAddress from "@components/CopyAddress";
import CalendarIcon from "@assets/icons/calendar.png";

import {
  Markets,
  NovaArchetype,
  useGetAllNovasQuery,
  useGetNovaTasksQuery
} from "@api/community.api";
import { RequiredQueryParams } from "@api/RequiredQueryParams";
import { ipfsCIDToHttpUrl } from "@api/storage.api";
import { ReactComponent as DiscordIcon } from "@assets/SocialIcons/DiscordIcon.svg";
import { ReactComponent as GitHubIcon } from "@assets/SocialIcons/GitHubIcon.svg";
import { ReactComponent as LensfrensIcon } from "@assets/SocialIcons/LensfrensIcon.svg";
import { ReactComponent as TelegramIcon } from "@assets/SocialIcons/TelegramIcon.svg";
import { ReactComponent as TwitterIcon } from "@assets/SocialIcons/TwitterIcon.svg";
import { socialUrls } from "@api/aut.model";
import AutUserTabs from "./AutNovaTabs/AutUserTabs";
import AutIconLabel from "@components/AutIconLabel";
import { EnvMode, environment } from "@api/environment";
import { ArchetypeIcons, MarketIcons } from "@components/NovaCard";
import TaskCard from "@components/TaskCard";
import { parseNovaTimestamp, parseTimestamp } from "@utils/date-format";

const socialIcons = {
  discord: DiscordIcon,
  github: GitHubIcon,
  twitter: TwitterIcon,
  telegram: TelegramIcon,
  lensfrens: LensfrensIcon
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
  width: "30%",
  backdropFilter: "blur(12px)",
  backgroundColor: "rgba(128, 128, 128, 0.06)",
  boxShadow: "0px 3px 6px #00000029",
  borderRadius: "24px",
  padding: "32px 16px",
  marginLeft: "24px",
  marginRight: "24px",

  [theme.breakpoints.down("md")]: {
    width: "90%",
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
  width: "70%",
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

export const CommunityTasksTable = ({ header, tasks }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        marginTop: theme.spacing(3),
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "1fr 1fr",
          md: "1fr 1fr 1fr",
          xl: "1fr 1fr 1fr 1fr"
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
          md: theme.spacing(3)
        }
      }}
    >
      {tasks?.map((row, index) => (
        <TaskCard key={`task-item-${row.name}`} row={row} />
      ))}
    </Box>
  );
};

const NovaDetails = () => {
  const theme = useTheme();
  const ps = useRef<HTMLElement>();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [searchParams] = useSearchParams();

  const { data: nova } = useGetAllNovasQuery(null, {
    selectFromResult: ({ data }) => ({
      data: (data?.daos || []).find((d) => {
        return (
          d.properties.address ===
          searchParams.get(RequiredQueryParams.DaoAddress)
        );
      })
    })
  });

  const { data: tasks } = useGetNovaTasksQuery(nova?.properties.address, {
    skip: !nova?.properties.address
  });

  const handleDialogClose = () => {};

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

  useEffect(() => {
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
      {nova ? (
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
                <Avatar
                  sx={{
                    flex: "1",
                    height: {
                      xs: "120px",
                      md: "120px",
                      xxl: "130px"
                    },
                    borderRadius: "0",
                    width: {
                      xs: "120px",
                      md: "120px",
                      xxl: "130px"
                    },
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
                {/* TODO: Implement when nova sigil is available  */}
                {/* {nova?.sigil && typeof nova?.sigil == "string" && (
                  <Box
                    sx={{
                      position: "absolute",
                      cursor: "pointer",
                      bottom: "-20px",
                      left: "100px",
                      transform: "rotate(7deg)",
                      height: {
                        xs: "130px",
                        md: "140px",
                        xxl: "140px"
                      }
                    }}
                  >
                    <img
                      style={{
                        height: "100%",
                        width: "100%"
                      }}
                      aria-label="card"
                      src={ipfsCIDToHttpUrl(nova?.sigil as string)}
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
                      height: "36px",
                      minWidth: "165px"
                      // height: "45px",
                      // flex: "1"
                      // marginTop: theme.spacing(2)
                    }}
                    icon={MarketIcons[nova?.properties.marketId]}
                    label={Markets[nova?.properties.marketId]}
                  ></AutIconLabel>
                  <AutIconLabel
                    textColor="#FFF"
                    sx={{
                      border: "1px solid #707070",
                      height: "36px",
                      minWidth: "165px"
                      // flex: "1"
                      // marginTop: theme.spacing(2)
                    }}
                    icon={ArchetypeIcons[nova?.properties.archetype]}
                    label={NovaArchetype[nova?.properties.archetype]}
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
                          social.link === socialUrls[social.type].prefix) && {
                          sx: {
                            // display: "none",
                            svg: {
                              color: theme.palette.divider
                            }
                          },
                          component: "button",
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
                  {`Joined ${parsedTimeStamp}`}
                </Typography>
              </Box>
            </Stack>
          </LeftWrapper>
          <RightWrapper>
            {!!tasks && !!nova && (
              <AutUserTabs nova={nova} tasks={tasks.tasks} />
            )}
          </RightWrapper>
        </AutContainer>
      ) : (
        <CircularProgress size={23} color="secondary"></CircularProgress>
      )}
    </PerfectScrollbar>
  );
};

export default memo(NovaDetails);
