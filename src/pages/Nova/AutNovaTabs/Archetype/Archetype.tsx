/* eslint-disable max-len */
import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import {
  Box,
  Button,
  CardHeader,
  CardMedia,
  Avatar,
  Container,
  styled,
  Stack,
  Slider,
  IconButton,
  SvgIcon,
  Tooltip,
  alpha,
  useTheme
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArchetypePieChart, { archetypeChartValues } from "./ArchetypePieChart";
import { ReactComponent as EditIcon } from "@assets/actions/edit.svg";
import CloseIcon from "@mui/icons-material/Close";
import ErrorDialog from "@components/Dialog/ErrorPopup";
import LoadingDialog from "@components/Dialog/LoadingPopup";
import {
  NovaArchetype,
  NovaArchetypeParameters
} from "@aut-labs/sdk/dist/models/nova";
import { calculateAV } from "@utils/av-calculator";
import {
  useGetArchetypeAndStatsQuery,
  useSetArchetypeMutation
} from "@api/archetype.api";
import { AutOsButton } from "@components/AutButton";
import { useParams, useSearchParams } from "react-router-dom";
import { useGetAllNovasQuery } from "@api/community.api";
import { RequiredQueryParams } from "@api/RequiredQueryParams";
import { useAutConnector, useWalletConnector } from "@aut-labs/connector";
import { ArchetypeDialog } from "./ArchetypeDialog";

const GridCard = styled(Card)(({ theme }) => {
  return {
    minHeight: "365px",
    margin: "0 auto",
    transition: theme.transitions.create(["transform"]),
    "&:hover": {
      transform: "scale(1.019)"
    }
  };
});

const ChooseArchetypeBtn = styled(Button, {
  shouldForwardProp: (prop) => prop !== "isHovered"
})<{
  isHovered?: boolean;
}>(({ theme, isHovered }) => ({
  position: "absolute",
  bottom: "40px",
  left: "50%",
  transform: "translateX(-50%)",
  opacity: isHovered ? 1 : 0,
  transition: "opacity 0.35s ease"
}));

const Title = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "isHovered"
})<{
  isHovered?: boolean;
}>(({ theme, isHovered }) => ({
  position: "absolute",
  width: "100%",
  left: "0",
  bottom: isHovered ? "110px" : "80px",
  textAlign: "center",
  textTransform: "uppercase",
  zIndex: 1,
  transition: theme.transitions.create("bottom")
}));

const Description = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "isHovered"
})<{
  isHovered?: boolean;
}>(({ theme, isHovered }) => ({
  opacity: isHovered ? 0 : 1,
  textAlign: "center",
  transition: theme.transitions.create("opacity")
}));

const Overlay = styled("div", {
  shouldForwardProp: (prop) => prop !== "isHovered"
})<{
  isHovered?: boolean;
}>(({ theme, isHovered }) => ({
  position: "absolute",
  top: "0",
  left: "0",
  width: "100%",
  height: "100%",
  background: isHovered ? "rgba(0, 0, 0, 0.3)" : "rgba(0, 0, 0, 0)",
  transition: theme.transitions.create("background")
}));

const ArchetypeCard = ({
  title,
  description,
  logo,
  type,
  onSelect,
  activeArchetype
}) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = React.useState(false);
  return (
    <Box
      sx={{
        alignItems: "center",
        justifyContent: "flex-start",
        backdropFilter: "blur(50px)",
        backgroundColor: "rgba(128, 128, 128, 0.05)",
        backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='6' ry='6' stroke='rgb(96,96,96)' stroke-width='2' stroke-dasharray='6%2c 14' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`,
        borderRadius: "6px",
        opacity: 1,
        WebkitBackdropFilter: "blur(6px)",
        padding: {
          xs: "36px 32px",
          md: "24px 24px",
          xxl: "36px 32px"
        },
        display: "flex",
        flexDirection: "column",
        height: "100%",
        mx: 4
      }}
    >
      <Stack direction="row" justifyContent="center" display="flex">
        <Avatar
          sx={{
            flex: "1",
            height: {
              xs: "50px",
              md: "60px",
              xxl: "70px"
            },
            borderRadius: "6px",
            width: {
              xs: "50px",
              md: "60px",
              xxl: "70px"
            },
            background: "transparent"
          }}
          aria-label="avatar"
        >
          <SvgIcon component={logo} inheritViewBox />
          {/* <img
            src={logo}
            style={{ objectFit: "contain", width: "100%", height: "100%" }}
          /> */}
        </Avatar>
        <div
          style={{
            flex: "2",
            display: "flex",
            alignItems: "center"
          }}
        >
          <Typography
            color="offWhite.main"
            textAlign="center"
            lineHeight={1}
            variant="subtitle2"
            marginLeft={1}
          >
            {title}
          </Typography>
        </div>
      </Stack>
      <Stack
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <Typography
          color="offWhite.main"
          textAlign="left"
          lineHeight={1}
          variant="body1"
        >
          <Typography
            marginTop={3}
            color="offWhite.main"
            textAlign="center"
            fontFamily="FractulAltLight"
            lineHeight={1}
            variant="subtitle2"
          >
            {description}
          </Typography>
        </Typography>
        <AutOsButton
          sx={{
            mt: "24px",
            bgcolor: "transparent",
            "&.MuiButton-root": {
              background: "linear-gradient(#244AFF, #1BB8FF)",
              transition: theme.transitions.create([
                "border-color",
                "background",
                "color"
              ]),
              "&:hover": {
                background: "linear-gradient(#2037e0, #17a1e0)"
              }
            }
          }}
          onClick={() =>
            onSelect({
              title,
              description,
              logo,
              type
            })
          }
        >
          <Typography variant="body" fontWeight="normal" color="white">
            Choose archetype
          </Typography>
        </AutOsButton>
      </Stack>
    </Box>
    // <Box
    //   sx={{
    //     display: "flex",
    //     border: "1px solid",
    //     borderColor: "#576176",
    //     minWidth: "170px",
    //     boxShadow: 3,
    //     borderRadius: "8.5px",
    //     padding: theme.spacing(3)
    //   }}
    // >
    //   <Box
    //     sx={{
    //       height: "100%",
    //       width: "100%",
    //       display: "flex",
    //       justifyContent: "space-between",
    //       flexDirection: "column"
    //     }}
    //   >
    //     <Box
    //       sx={{
    //         display: "flex",
    //         flexDirection: {
    //           xs: "row"
    //         },
    //         justifyContent: {
    //           xs: "flex-start"
    //         },
    //         alignItems: "center"
    //       }}
    //     >
    //       <Avatar
    //         sx={{
    //           width: {
    //             xs: "40px",
    //             md: "50px"
    //           },
    //           height: {
    //             xs: "40px",
    //             md: "50px"
    //           },
    //           borderRadius: "0"
    //         }}
    //         aria-label="nova-avatar"
    //         src={logo}
    //       />
    //       <Box
    //         sx={{
    //           marginLeft: {
    //             xs: theme.spacing(3),
    //             sm: theme.spacing(1),
    //             md: theme.spacing(2),
    //             xxl: theme.spacing(3)
    //           },
    //           display: "flex",
    //           flexDirection: "column",
    //           justifyContent: "space-between"
    //         }}
    //       >
    //         <Typography variant="subtitle2" color="offWhite.main">
    //           {title}
    //         </Typography>
    //       </Box>
    //     </Box>
    //     <Box
    //       sx={{
    //         marginTop: theme.spacing(3),
    //         justifyContent: "center",
    //         display: "flex"
    //       }}
    //     >
    //       <Typography
    //         variant="caption"
    //         color="offWhite.main"
    //         textAlign="center"
    //       >
    //         {description}
    //       </Typography>
    //     </Box>
    //     <Box
    //       sx={{
    //         display: "flex",
    //         justifyContent: "center",
    //         marginTop: theme.spacing(3)
    //       }}
    //     >
    //       <AutOsButton
    //         type="button"
    //         onClick={() =>
    //           onSelect({
    //             title,
    //             description,
    //             logo,
    //             type
    //           })
    //         }
    //         // disabled={isLoading || isActive}
    //         // sx={{
    //         //   "&.MuiButton-root": {
    //         //     background: isActive ? "#4caf50" : "#576176",
    //         //     "&.Mui-disabled": {
    //         //       color: isActive ? "white" : "#818CA2",
    //         //       opacity: "1"
    //         //     }
    //         //   }
    //         // }}
    //         variant="outlined"
    //       >
    //         {activeArchetype ? (
    //           <Typography fontWeight="700" fontSize="16px" lineHeight="26px">
    //             Change Archetype
    //           </Typography>
    //         ) : (
    //           <>
    //             <Typography fontWeight="700" fontSize="16px" lineHeight="26px">
    //               Set Archetype
    //             </Typography>
    //             {/* {isIdle && (
    //               <Typography
    //                 fontWeight="700"
    //                 fontSize="16px"
    //                 lineHeight="26px"
    //               >
    //                 Verify
    //               </Typography>
    //             )}
    //             {isLoading && (
    //               <CircularProgress
    //                 size={23}
    //                 color="secondary"
    //               ></CircularProgress>
    //             )} */}
    //           </>
    //         )}
    //       </AutOsButton>
    //     </Box>
    //   </Box>
    // </Box>
    // <GridCard
    //   onMouseEnter={() => setIsHovered(true)}
    //   onMouseLeave={() => setIsHovered(false)}
    //   onClick={() =>
    //     onSelect({
    //       title,
    //       description,
    //       logo,
    //       type
    //     })
    //   }
    //   sx={{
    //     ...(!activeArchetype
    //       ? {
    //           bgcolor: "nightBlack.main"
    //         }
    //       : {
    //           bgcolor: alpha(theme.palette.primary.main, 0.3)
    //         }),
    //     display: "flex",
    //     flexDirection: "column",
    //     justifyContent: "space-between",
    //     borderColor: "divider",
    //     borderRadius: "16px",
    //     minHeight: "300px",
    //     position: "relative",
    //     boxShadow: 7,
    //     width: {
    //       xs: "100%",
    //       md: "250px",
    //       lg: "300px",
    //       xxl: "350px"
    //     }
    //   }}
    //   variant="outlined"
    // >
    //   <Overlay isHovered={isHovered} />
    //   <CardMedia
    //     sx={{ height: "140px", width: "140px", margin: "0 auto", mt: 2, mb: 0 }}
    //     image={logo}
    //     title={title}
    //   />
    //   <CardContent
    //     sx={{
    //       pt: 0,
    //       display: "flex",
    //       flexDirection: "column"
    //     }}
    //   >
    //     <Title
    //       fontFamily={"FractulAltBold"}
    //       fontWeight={900}
    //       color="white"
    //       variant="subtitle1"
    //       isHovered={isHovered}
    //     >
    //       {title}
    //     </Title>
    //     <Description
    //       isHovered={isHovered}
    //       textAlign="center"
    //       color="white"
    //       variant="body"
    //     >
    //       {description}
    //     </Description>
    //     <ChooseArchetypeBtn
    //       onClick={() => onSelect(type)}
    //       color="offWhite"
    //       variant="outlined"
    //       sx={{
    //         width: "80%"
    //       }}
    //       size="large"
    //       isHovered={isHovered}
    //     >
    //       {activeArchetype ? "Change archetype" : "Choose Archetype"}
    //     </ChooseArchetypeBtn>
    //   </CardContent>
    // </GridCard>
  );
};

const ChooseYourArchetype = ({ setSelected, archetype }) => {
  const [state, setState] = React.useState(archetypeChartValues(archetype));
  console.log("state: ", state);
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          mb: 4,
          position: "relative"
        }}
      >
        <Typography textAlign="center" color="white" variant="h3">
          Choose your Archetype
        </Typography>
        <Typography
          mt={2}
          mx="auto"
          textAlign="center"
          color="white"
          sx={{
            width: {
              xs: "100%",
              sm: "700px",
              xxl: "1000px"
            }
          }}
          variant="body"
        >
          The archetype represents the KPI, the driver of your community. Set up
          your community values, deliver, and thrive. The better you perform,
          the more your community credibility will grow. Read more about
          Archetypes
        </Typography>
      </Box>
      <Grid container spacing={0} rowSpacing={3} sx={{ flexGrow: 1 }}>
        {/* Row 1 */}
        <Grid item xs={12} sm={6} md={4}>
          <ArchetypeCard
            activeArchetype={archetype?.archetype === NovaArchetype.SIZE}
            onSelect={setSelected}
            {...state[NovaArchetype.SIZE]}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <ArchetypeCard
            activeArchetype={archetype?.archetype === NovaArchetype.REPUTATION}
            onSelect={setSelected}
            {...state[NovaArchetype.REPUTATION]}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <ArchetypeCard
            activeArchetype={archetype?.archetype === NovaArchetype.CONVICTION}
            onSelect={setSelected}
            {...state[NovaArchetype.CONVICTION]}
          />
        </Grid>

        {/* Row 2 */}
        <Grid
          display={{
            xs: "none",
            md: "inherit"
          }}
          item
          xs={false}
          sm={false}
          md={2}
        />
        <Grid item xs={12} sm={6} md={4}>
          <ArchetypeCard
            activeArchetype={archetype?.archetype === NovaArchetype.PERFORMANCE}
            onSelect={setSelected}
            {...state[NovaArchetype.PERFORMANCE]}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <ArchetypeCard
            activeArchetype={archetype?.archetype === NovaArchetype.GROWTH}
            onSelect={setSelected}
            {...state[NovaArchetype.GROWTH]}
          />
        </Grid>
        <Grid
          display={{
            xs: "none",
            md: "inherit"
          }}
          item
          xs={false}
          sm={false}
          md={2}
        />
      </Grid>
    </>
  );
};

const YourArchetype = ({ selectedArchetype, unselect, archetype, stats }) => {
  const { novaName } = useParams();
  const [editMode, setEditMode] = React.useState(
    selectedArchetype?.type != archetype?.archetype
  );
  const { open } = useWalletConnector();
  const { address } = useAutConnector();
  const [initialValues, setInitialValues] = React.useState(true);
  const theme = useTheme();
  const [state, setState] = React.useState(archetypeChartValues(archetype));

  const { data: nova } = useGetAllNovasQuery(
    {
      connectedAddress: address
    },
    {
      selectFromResult: ({ data }) => ({
        data: (data?.daos || []).find((d) => {
          return d.name === novaName;
        })
      })
    }
  );

  const TOTAL_VALUE = 100;

  // Calculate the total value of all sliders and the remaining value to allocate
  const totalValue = Object.keys(state).reduce(
    (total, key) => total + state[key].value,
    0
  );

  const remainingValue = TOTAL_VALUE - totalValue;
  const showNotification = totalValue !== TOTAL_VALUE;

  const handleChange = (sliderId) => (_, newValue) => {
    let min = 0;
    let max = 100;

    const activeState = state[selectedArchetype.type];
    if (+sliderId === selectedArchetype?.type) {
      min = activeState.min;
      max = activeState.max;
    } else {
      min = 0;
      max = activeState.min;
    }

    console.log(min, max, sliderId, selectedArchetype, activeState);

    if (newValue >= min && newValue <= max) {
      setState((prevState) => ({
        ...prevState,
        [sliderId]: {
          ...prevState[sliderId],
          value: newValue
        }
      }));
    }
  };

  React.useEffect(() => {
    if (!initialValues) return;

    const activeState = state[selectedArchetype.type];

    const currentValue = activeState.value;
    const minValue = activeState.min;

    if (minValue > currentValue && initialValues) {
      const newState = Object.keys(state).reduce((prev, key) => {
        prev[key] = {
          ...state[key],
          value: activeState.defaults[key]
        };
        return prev;
      }, {} as any);

      console.log(newState, "newState");
      setState(newState);
      setInitialValues(false);
    }
  }, [selectedArchetype, initialValues, state]);

  const av = React.useMemo(() => {
    const updatedArchetype = {
      size: state[NovaArchetype.SIZE].value,
      reputation: state[NovaArchetype.REPUTATION].value,
      conviction: state[NovaArchetype.CONVICTION].value,
      performance: state[NovaArchetype.PERFORMANCE].value,
      growth: state[NovaArchetype.GROWTH].value
    };

    return calculateAV(updatedArchetype);
  }, [state]);

  const actionName = React.useMemo(() => {
    if (!archetype?.archetype) {
      return "Set Archetype";
    }

    if (selectedArchetype?.type === archetype?.archetype) {
      return "Confirm";
    }

    return "Change and Confirm";
  }, [selectedArchetype, archetype]);

  const [setArchetype, { error, isError, isLoading, reset }] =
    useSetArchetypeMutation();

  const updateArchetype = async () => {
    try {
      if (!address) {
        await open();
      }
      const updatedArchetype: Partial<NovaArchetypeParameters> = {
        size: state[NovaArchetype.SIZE].value,
        growth: state[NovaArchetype.GROWTH].value,
        conviction: state[NovaArchetype.CONVICTION].value,
        performance: state[NovaArchetype.PERFORMANCE].value,
        reputation: state[NovaArchetype.REPUTATION].value
      };
      setArchetype({
        nova,
        archetype: {
          default: selectedArchetype?.type,
          parameters: updatedArchetype as NovaArchetypeParameters
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <ErrorDialog handleClose={() => reset()} open={isError} message={error} />
      <LoadingDialog open={isLoading} message="Updating Archertype..." />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          mb: 2,
          position: "relative"
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            position: "relative",
            mx: "auto",
            width: "100%"
          }}
        >
          <Stack alignItems="center" justifyContent="center">
            <Button
              startIcon={<ArrowBackIcon />}
              color="offWhite"
              onClick={() => unselect()}
              sx={{
                position: {
                  sm: "absolute"
                },
                left: {
                  sm: "0"
                }
              }}
            >
              Back
            </Button>

            <Typography textAlign="center" color="white" variant="h3">
              Your Archetype
            </Typography>
          </Stack>
        </Box>
        <Typography
          mt={2}
          mx="auto"
          textAlign="center"
          color="white"
          sx={{
            width: {
              xs: "100%",
              sm: "700px",
              xxl: "1000px"
            }
          }}
          variant="body"
        >
          The archetype represents the KPI, the driver of your community.
        </Typography>
      </Box>
      <Grid container spacing={4} mt={0}>
        <Grid item sm={12} md={6}>
          <Card
            sx={{
              borderColor: "divider",
              borderRadius: "16px",
              boxShadow: 7,
              width: "100%",
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
              background: "transparent",
              maxWidth: {
                xs: "100%",
                sm: "90%",
                md: "80%",
                xxl: "65%"
              }
            }}
          >
            <CardHeader
              avatar={
                <Avatar
                  sx={{
                    width: {
                      xs: "120px",
                      xxl: "300px"
                    },
                    height: "100%"
                  }}
                  variant="square"
                  srcSet={selectedArchetype?.logo}
                />
              }
              sx={{
                px: 4,
                pt: 4,
                alignItems: "flex-start",
                flexDirection: {
                  xs: "column",
                  md: "row"
                },
                maxWidth: {
                  xs: "100%",
                  sm: "400px",
                  md: "600px",
                  xxl: "800px"
                },

                ".MuiCardContent-root": {
                  width: "100%",
                  padding: "0px 16px"
                },

                width: "100%",
                ".MuiAvatar-root": {
                  backgroundColor: "transparent"
                }
              }}
              title={
                <>
                  <Box
                    sx={{
                      display: "flex",
                      gridGap: "4px"
                    }}
                  >
                    <Typography variant="subtitle1" color="white">
                      {selectedArchetype.title}
                    </Typography>
                  </Box>
                </>
              }
            />
            <CardContent
              sx={{
                flex: 1,
                width: "100%",
                px: 4,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}
            >
              <Typography color="white" variant="body">
                {selectedArchetype.description}
              </Typography>

              <Stack mt={4} mb={4} gap={2}>
                <Box display="flex" gap={2} flexDirection="column">
                  <Typography color="primary" variant="subtitle2">
                    Stats:
                  </Typography>
                  <Stack ml={4} gap={2}>
                    <Box display="flex" gap={2}>
                      <Typography color="white" variant="subtitle2">
                        Your Av:
                      </Typography>
                      <Typography color="white" variant="subtitle2">
                        {Number(av || 0).toFixed(2)}
                      </Typography>
                    </Box>
                    <Box display="flex" gap={2}>
                      <Typography color="white" variant="subtitle2">
                        Period no.
                      </Typography>
                      <Typography color="white" variant="subtitle2">
                        #{stats?.lastPeriod}
                      </Typography>
                    </Box>
                    <Box display="flex" gap={2}>
                      <Typography color="white" variant="subtitle2">
                        exp. AV in period:
                      </Typography>
                      <Typography color="white" variant="subtitle2">
                        n+1
                      </Typography>
                    </Box>
                    <Box display="flex" gap={2}>
                      <Typography color="white" variant="subtitle2">
                        how you’re doing:
                      </Typography>
                      <Typography color="white" variant="subtitle2">
                        0%
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item sm={12} md={6}>
          <Box
            sx={{
              p: 4,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 auto"
            }}
          >
            <Box
              sx={{
                width: "100%",
                position: "relative",
                height: "350px"
              }}
            >
              {editMode && (
                <>
                  <Tooltip title="Close">
                    <IconButton
                      onClick={() => setEditMode(false)}
                      sx={{
                        zIndex: 1,
                        color: "white",
                        position: "absolute",
                        right: "0"
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Tooltip>
                  <Box
                    sx={{
                      mt: "70px",
                      width: "100%"
                    }}
                  >
                    {Object.keys(state).map((slider) => (
                      <Box
                        mt={1.5}
                        gap={2}
                        display="flex"
                        key={state[slider]?.type}
                      >
                        <Box
                          sx={{
                            textAlign: "right",
                            minWidth: "120px"
                          }}
                        >
                          <Typography variant="subtitle2" color="white">
                            {state[slider]?.title}
                          </Typography>
                        </Box>
                        <Slider
                          step={2}
                          sx={{
                            "& > .MuiSlider-track": {
                              ...(slider == selectedArchetype?.type && {
                                background: `${alpha(
                                  theme.palette.primary.main,
                                  1
                                )} !important`
                              })
                            },

                            width: "100%",
                            height: "20px",
                            ".MuiSlider-thumb": {
                              display: "none"
                            }
                          }}
                          min={0}
                          max={100}
                          value={state[slider].value}
                          onChange={handleChange(slider)}
                        />
                        <Box
                          sx={{
                            textAlign: "left",
                            minWidth: "40px"
                          }}
                        >
                          <Typography variant="subtitle2" color="white">
                            {state[slider].value}%
                          </Typography>
                        </Box>
                      </Box>
                    ))}

                    {showNotification && (
                      <Box
                        sx={{
                          textAlign: "center",
                          minWidth: "120px",
                          mt: 2
                        }}
                      >
                        <Typography variant="subtitle2" color="error">
                          {`Remaining value to allocate: ${remainingValue}%`}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      gap: 4,
                      mt: 2
                    }}
                  >
                    <Button
                      onClick={() => updateArchetype()}
                      color="offWhite"
                      variant="outlined"
                      size="medium"
                    >
                      {actionName}
                    </Button>
                  </Box>
                </>
              )}
              {!editMode && (
                <>
                  <Tooltip title="Edit">
                    <IconButton
                      onClick={() => setEditMode(true)}
                      sx={{
                        zIndex: 1,
                        color: "white",
                        position: "absolute",
                        right: "0"
                      }}
                    >
                      <SvgIcon component={EditIcon} />
                    </IconButton>
                  </Tooltip>

                  <ArchetypePieChart archetype={archetype} />
                </>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

const Archetypes = () => {
  const {
    archetype,
    stats,
    isLoading: isLoadingArchetype,
    isFetching: isFetchingArchetype
  } = useGetArchetypeAndStatsQuery(null, {
    selectFromResult: ({ data, isLoading, isFetching }) => ({
      isLoading,
      isFetching,
      archetype: data?.archetype,
      stats: data?.stats
    })
  });
  const [isArchetypeOpen, setIsArchetypeOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(null);
  const archetypeData = React.useMemo(() => {
    if (archetype?.archetype === selected?.type) {
      return archetype;
    }
    return {
      archetype: NovaArchetype.NONE,
      size: 0,
      reputation: 0,
      conviction: 0,
      performance: 0,
      growth: 0
    };
  }, [archetype, selected]);

  console.log("archetypeData: ", archetypeData, archetype, selected);

  const showInteractionLayer = true;

  const handleClose = () => {
    setIsArchetypeOpen(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: "20px", height: "100%" }}>
      <>
        <ArchetypeDialog
          open={isArchetypeOpen}
          archetype={archetypeData}
          title="Interactions"
          onClose={handleClose}
        />
        {showInteractionLayer && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gridGap: "12px",
              textAlign: "center",
              position: "absolute",
              top: "100px",
              left: "100px",
              right: "100px",
              bottom: "100px",
              zIndex: 99,
              backdropFilter: "blur(12px)",
              background: "rgba(128, 128, 128, 0.06)",
              borderRadius: "42px"
            }}
          >
            <Typography mb={4} color="white" variant="subtitle2">
              this project didn’t set an archetype yet.
              <br />
              is this your project?
            </Typography>
            <AutOsButton
              onClick={() => setIsArchetypeOpen(true)}
              type="button"
              color="primary"
              size="small"
              variant="outlined"
            >
              <Typography fontWeight="700" fontSize="16px" lineHeight="26px">
                Set Archetype
              </Typography>
            </AutOsButton>
          </Box>
        )}
        <Box
          className="map-wrapper"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            width: "100%",
            height: "100%",
            "& > DIV": {
              width: "100%"
            },
            // @ts-ignore
            ...(showInteractionLayer && {
              mixBlendMode: "plus-lighter",
              opacity: 0.6,
              filter: "blur(20px)"
            })
          }}
        >
          <Box
            sx={{
              position: "relative",
              height: "400px",
              width: "400px"
            }}
          >
            <ArchetypePieChart archetype={archetype} />
          </Box>

          {/* {mapData?.centralNode && (
            <InteractionMap
              mapData={mapData}
              isActive={!showInteractionLayer}
              parentRef={ref}
            />
          )} */}
        </Box>
      </>
      {/* {selected && (
        <YourArchetype
          archetype={archetypeData}
          stats={stats}
          unselect={() => setSelected(null)}
          selectedArchetype={selected}
        ></YourArchetype>
      )}
      {!selected && (
        <ChooseYourArchetype
          archetype={archetype}
          setSelected={setSelected}
        ></ChooseYourArchetype>
      )} */}
    </Container>
  );
};

export default Archetypes;
