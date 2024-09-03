import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Slider,
  Paper,
  useTheme,
  useMediaQuery,
  Grid,
  Stack,
  FormControlLabel,
  Switch,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Tooltip as MuiTooltip,
  Radio,
  RadioGroup,
  Tab,
  Tabs,
  Grow,
  Fade
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps
} from "recharts";
import PerfectScrollbar from "react-perfect-scrollbar";
import { AutTextField } from "@theme/field-text-styles";
import { AutOsButton } from "@components/AutButton";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { StyledAccordion } from "./Accordion";
import { ValueChart } from "./ValueChart";
import { TabPanel } from "./TabPanel";
import { CustomSlider } from "./CustomSlider";

// Utility functions (unchanged)
const calculateTiCl = (TCM, avgICL) => Math.round(TCM * avgICL);
const calculateFiCl = (iCL, tiCl) => iCL / tiCl;
const calculateTCP = (TCM) => Math.round(TCM * 10);
const calculateEC = (TCP, fiCl) => TCP * fiCl;
const calculatePSInitial = (P) => P * 100;
const calculatePS = (PrevPC, P) => PrevPC * P;
const incrementTCMByPercent = (tcm, percent) => Math.round(tcm * (1 + percent));

function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

const generateInitialData = () => {
  const initialTCM = 10;
  const initialAvgICL = 5;
  const initialICL = 5;
  const initialPoints = [];
  for (let i = 0; i < 10; i++) {
    let dataPoint;
    if (i === 0) {
      const initialTiCl = calculateTiCl(initialTCM, initialAvgICL);
      const initialFiCl = calculateFiCl(initialICL, initialTiCl);
      const initialTCP = calculateTCP(initialTCM);
      const initialEC = calculateEC(initialTCP, initialFiCl);
      const initialP = 1.05;
      const initialPS = calculatePSInitial(initialP);
      dataPoint = {
        PS: initialPS,
        TCM: initialTCM,
        avgICL: initialAvgICL,
        iCL: initialICL,
        tiCL: initialTiCl,
        fiCL: initialFiCl,
        TCP: initialTCP,
        EC: initialEC,
        P: initialP,
        period: i + 1
      };
    } else {
      const prevPoint = initialPoints[i - 1];
      const newTCM = incrementTCMByPercent(prevPoint.TCM, 0.2);
      // const newAvgICL = randomFloat(1, 10);
      // const newICL = randomFloat(1, 10);
      const newAvgICL = initialAvgICL;
      const newICL = initialICL;
      const newTiCl = calculateTiCl(newTCM, newAvgICL);
      const newfiCl = calculateFiCl(newICL, newTiCl);
      const newTCP = calculateTCP(newTCM);
      const newEC = calculateEC(newTCP, newfiCl);
      const newP = 1.05;
      const newPS = calculatePS(prevPoint.PS, newP);
      dataPoint = {
        PS: newPS,
        TCM: newTCM,
        avgICL: newAvgICL,
        iCL: newICL, // New line: add iCL to dataPoint
        tiCL: newTiCl,
        fiCL: newfiCl,
        TCP: newTCP,
        EC: newEC,
        P: newP,
        period: i + 1
      };
    }
    initialPoints.push(dataPoint);
  }
  return initialPoints;
};
const ParticipationScore = () => {
  // Generate
  const [showVisualization, setShowVisualization] = useState(false);
  const [expandedAccordion, setExpandedAccordion] = useState(false);
  // Show More
  const [showMoreGraphs, setShowMoreGraphs] = useState(false);
  const toggleShowMoreGraphs = () => {
    setShowMoreGraphs(!showMoreGraphs);
  };

  const handleGenerateClick = () => {
    setShowVisualization(true);
    setTimeout(() => setExpandedAccordion(true), 500);
  };

  const handleAccordionChange = (event, isExpanded) => {
    setExpandedAccordion(isExpanded);
  };

  // show all
  const [showAllMembers, setShowAllMembers] = useState(true);

  const toggleShowAllMembers = () => {
    setShowAllMembers(!showAllMembers);
  };

  const renderMemberToggle = () => {
    if (memberCount <= 1) return null;

    return (
      <FormControlLabel
        control={
          <Switch
            checked={showAllMembers}
            onChange={toggleShowAllMembers}
            color="primary"
          />
        }
        label={
          <Typography fontFamily="FractulRegular" color="white">
            {showAllMembers ? "Show All Members" : "Show One Member"}
          </Typography>
        }
      />
    );
  };

  const renderMemberSwitches = () => {
    if (showAllMembers) {
      return [...Array(memberCount)].map((_, index) => (
        <FormControlLabel
          key={index}
          control={
            <Switch
              checked={activeMembers[index]}
              onChange={() => toggleMember(index)}
              color="primary"
            />
          }
          label={
            <Typography fontFamily="FractulRegular" color="white">
              Member {index + 1}
            </Typography>
          }
          sx={{ color: "white", mr: 2, mb: isMobile ? 1 : 0 }}
        />
      ));
    } else {
      return (
        <RadioGroup
          row
          value={activeMembers.findIndex(Boolean)}
          onChange={(e) => {
            const selectedIndex = parseInt(e.target.value, 10);
            setActiveMembers(activeMembers.map((_, i) => i === selectedIndex));
          }}
        >
          {[...Array(memberCount)].map((_, index) => (
            <FormControlLabel
              key={index}
              value={index}
              control={<Radio />}
              label={
                <Typography fontFamily="FractulRegular" color="white">
                  Member {index + 1}
                </Typography>
              }
            />
          ))}
        </RadioGroup>
      );
    }
  };

  const [tabValue, setTabValue] = useState(0);

  const [numPeriods, setNumPeriods] = useState(10);
  const [membersInSameHub, setMembersInSameHub] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const [copyFromPrevious, setCopyFromPrevious] = useState([
    false,
    false,
    false
  ]);
  const [copyHubFromPrevious, setCopyHubFromPrevious] = useState([
    false,
    false,
    false
  ]);

  const toggleCopyFromPrevious = (index) => {
    setCopyFromPrevious((prev) => {
      const newCopyFromPrevious = [...prev];
      newCopyFromPrevious[index] = !newCopyFromPrevious[index];
      return newCopyFromPrevious;
    });
  };

  const toggleCopyHubFromPrevious = (index) => {
    setCopyHubFromPrevious((prev) => {
      const newCopyHubFromPrevious = [...prev];
      newCopyHubFromPrevious[index] = !newCopyHubFromPrevious[index];
      return newCopyHubFromPrevious;
    });
  };

  useEffect(() => {
    // Update membersData when copyFromPrevious changes
    setMembersData((prevData) => {
      const newData = [...prevData];
      for (let i = 1; i < newData.length; i++) {
        if (copyFromPrevious[i]) {
          newData[i] = [...prevData[i - 1]];
        }
      }
      return newData;
    });
  }, [copyFromPrevious]);

  useEffect(() => {
    // Update membersData when copyHubFromPrevious changes
    if (!membersInSameHub) {
      setMembersData((prevData) => {
        const newData = [...prevData];
        for (let i = 1; i < newData.length; i++) {
          if (copyHubFromPrevious[i]) {
            newData[i] = newData[i].map((point, index) => ({
              ...point,
              TCM: prevData[i - 1][index].TCM,
              avgICL: prevData[i - 1][index].avgICL
            }));
          }
        }
        return newData;
      });
    }
  }, [copyHubFromPrevious, membersInSameHub]);
  const [memberCount, setMemberCount] = useState(1);
  const [autoIncrementTCM, setAutoIncrementTCM] = useState(true);
  const [tcmIncrementPercentage, setTcmIncrementPercentage] = useState(20);
  const [memberIncrementPercentages, setMemberIncrementPercentages] = useState([
    20, 20, 20
  ]);
  const [membersData, setMembersData] = useState(() => [
    generateInitialData(),
    generateInitialData(),
    generateInitialData()
  ]);
  const [activeMembers, setActiveMembers] = useState([true, false, false]);
  const [copyValuesEnabled, setCopyValuesEnabled] = useState([
    false,
    false,
    false
  ]);
  const [memberAutoIncrement, setMemberAutoIncrement] = useState([
    true,
    true,
    true
  ]);

  const handleMembersInSameHubChange = (event) => {
    const newValue = event.target.checked;
    setMembersInSameHub(newValue);

    if (newValue) {
      setMembersData((prevData) => {
        const firstMemberData = prevData[0];
        return prevData.map((memberData) =>
          memberData.map((point, index) => ({
            ...point,
            TCM: firstMemberData[index].TCM,
            avgICL: firstMemberData[index].avgICL
          }))
        );
      });
    }
  };

  const toggleMember = (index) => {
    setActiveMembers((prev) => {
      const newActiveMembers = [...prev];
      newActiveMembers[index] = !newActiveMembers[index];
      return newActiveMembers;
    });
  };

  const toggleCopyValues = (index) => {
    setCopyValuesEnabled((prev) => {
      const newCopyValuesEnabled = [...prev];
      newCopyValuesEnabled[index] = !newCopyValuesEnabled[index];
      return newCopyValuesEnabled;
    });
  };

  const handleIncrementPercentageChange = (index, value) => {
    setMemberIncrementPercentages((prev) => {
      const newPercentages = [...prev];
      newPercentages[index] = Number(value);
      return newPercentages;
    });
  };

  const copyValuesToOtherMembers = (sourceMemberIndex) => {
    const sourceMemberData = membersData[sourceMemberIndex];
    const newMemberData = membersData.map((memberData, index) => {
      if (index === sourceMemberIndex) {
        return memberData;
      }
      return sourceMemberData.map((point, pointIndex) => ({
        ...point,
        period: memberData[pointIndex].period
      }));
    });
    setMembersData(newMemberData);
  };

  const toggleMemberAutoIncrement = (index) => {
    setMemberAutoIncrement((prev) => {
      const newAutoIncrement = [...prev];
      newAutoIncrement[index] = !newAutoIncrement[index];
      return newAutoIncrement;
    });
  };

  const handleInputChange = (memberIndex, pointIndex, field, value) => {
    setMembersData((prevMembersData) => {
      const newMembersData = [...prevMembersData];

      const updateMemberData = (memberData) => {
        const newMemberData = [...memberData];
        newMemberData[pointIndex] = {
          ...newMemberData[pointIndex],
          [field]: Number(value)
        };

        for (let i = pointIndex; i < newMemberData.length; i++) {
          const point = newMemberData[i];
          const prevPoint = i > 0 ? newMemberData[i - 1] : null;

          if (field === "TCM" || field === "avgICL" || field === "iCL") {
            point.tiCL = calculateTiCl(point.TCM, point.avgICL);
            point.fiCL = calculateFiCl(point.iCL, point.tiCL);
            point.TCP = calculateTCP(point.TCM);
            point.EC = calculateEC(point.TCP, point.fiCL);
          }

          if (field === "P" || (i === pointIndex && field === "TCM")) {
            point.PS =
              i === 0
                ? calculatePSInitial(point.P)
                : calculatePS(prevPoint.PS, point.P);
          }

          if (
            field === "TCM" &&
            i < newMemberData.length - 1 &&
            memberAutoIncrement[memberIndex]
          ) {
            newMemberData[i + 1].TCM = incrementTCMByPercent(
              point.TCM,
              memberIncrementPercentages[memberIndex] / 100
            );
          }
        }

        return newMemberData;
      };

      // Update the changed member's data
      newMembersData[memberIndex] = updateMemberData(
        newMembersData[memberIndex]
      );

      // If members are in the same hub, copy TCM and avgICL to other members
      if (membersInSameHub && (field === "TCM" || field === "avgICL")) {
        newMembersData.forEach((_, index) => {
          if (index !== memberIndex) {
            newMembersData[index] = newMembersData[index].map(
              (point, pIndex) => ({
                ...point,
                [field]: newMembersData[memberIndex][pIndex][field]
              })
            );
          }
        });
      }

      // If copy values is enabled for this member, update other members
      if (copyValuesEnabled[memberIndex]) {
        newMembersData.forEach((memberData, index) => {
          if (index !== memberIndex) {
            newMembersData[index] = updateMemberData(memberData);
          }
        });
      }

      return newMembersData;
    });
  };

  const formatValue = (value) => {
    return typeof value === "number" ? value.toFixed(2) : value;
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const memberColors = ["#ff7300", "#82ca9d", "#8884d8"];

  const handleMemberCountChange = (event) => {
    const newCount = parseInt(event.target.value, 10);
    setMemberCount(newCount);
  };

  useEffect(() => {
    // Update membersData, activeMembers, copyValuesEnabled, and memberAutoIncrement when memberCount changes
    setMembersData((prevData) => {
      if (prevData.length < memberCount) {
        // Add new member data if increasing count
        return [
          ...prevData,
          ...Array(memberCount - prevData.length)
            .fill(0)
            .map(() => generateInitialData())
        ];
      }
      return prevData.slice(0, memberCount);
    });
    setActiveMembers((prevActive) =>
      Array(memberCount)
        .fill(false)
        .map((_, index) => index === 0)
    );
    setCopyValuesEnabled((prevCopy) => Array(memberCount).fill(false));
    setMemberAutoIncrement((prevAuto) => Array(memberCount).fill(true));
    setMemberIncrementPercentages((prevPercentages) =>
      Array(memberCount).fill(20)
    );
  }, [memberCount]);

  const [useDefaultPeriods, setUseDefaultPeriods] = useState(true);
  const [customPeriods, setCustomPeriods] = useState(10);

  const handleToggleChange = (event) => {
    setUseDefaultPeriods(event.target.checked);
  };

  const handleCustomPeriodsChange = (event) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setCustomPeriods(value);
    }
  };

  useEffect(() => {
    const periodsToUse = useDefaultPeriods ? 10 : customPeriods;
    updatePeriodsInData(periodsToUse);
  }, [useDefaultPeriods, customPeriods]);

  const updatePeriodsInData = (newPeriods) => {
    setNumPeriods(newPeriods);
    setMembersData((prevData) =>
      prevData.map((memberData) => {
        if (memberData.length < newPeriods) {
          return [
            ...memberData,
            ...Array(newPeriods - memberData.length)
              .fill(0)
              .map((_, i) => ({
                ...memberData[memberData.length - 1],
                period: memberData.length + i + 1
              }))
          ];
        } else {
          // Remove excess periods
          return memberData.slice(0, newPeriods);
        }
      })
    );
  };

  const renderMemberData = () => (
    <Box sx={{ overflowX: "auto" }}>
      <Grid
        container
        sx={{
          display: "flex",
          // flexWrap: "nowrap",
          pb: 2,
          minHeight: "100%",
          justifyContent: "flex-start" // Align items at the start
        }}
      >
        {membersData.map((memberData, memberIndex) => (
          <Grid
            item
            key={memberIndex}
            sx={{
              // Fixed width for each member's box
              mr: 2 // Add some margin between boxes
            }}
          >
            <Box
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "row"
              }}
            >
              {memberIndex === 0 && (
                <Box sx={{ width: 80, mr: 2 }}>
                  <Typography
                    fontFamily="FractulRegular"
                    color="white"
                    variant="body2"
                    sx={{ mt: "148px" }} // Adjust this value to align with the data rows
                  >
                    Period
                  </Typography>
                  {membersData[0].map((point, index) => (
                    <Box
                      key={index}
                      sx={{
                        mt: 1,
                        height: "72px",
                        display: "flex",
                        alignItems: "center", // Changed from "alignItem" to "alignItems"
                        justifyContent: "center"
                      }}
                    >
                      <Typography
                        fontFamily="FractulRegular"
                        color="white"
                        textAlign="center"
                        variant="body2"
                      >
                        {point.period}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
              <Box
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "15px",
                  p: 2,
                  width: 350
                }}
              >
                <Typography
                  fontFamily="FractulRegular"
                  color="white"
                  variant="h6"
                  gutterBottom
                >
                  Member {memberIndex + 1}
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={copyValuesEnabled[memberIndex]}
                      onChange={() => toggleCopyValues(memberIndex)}
                      color="primary"
                    />
                  }
                  label={
                    <Typography fontFamily="FractulRegular" color="white">
                      Copy Values to Others
                    </Typography>
                  }
                />
                <FormControlLabel
                  sx={{ visibility: memberIndex === 0 ? "hidden" : "visible" }}
                  control={
                    <Switch
                      checked={copyFromPrevious[memberIndex]}
                      onChange={() => toggleCopyFromPrevious(memberIndex)}
                      color="primary"
                    />
                  }
                  label={
                    <Typography fontFamily="FractulRegular" color="white">
                      Copy from Previous Member
                    </Typography>
                  }
                />
                <Box sx={{ mt: 2, flexGrow: 1, overflowY: "auto" }}>
                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={6}>
                      <MuiTooltip title="Individual Commitment Level" arrow>
                        <Typography
                          fontFamily="FractulRegular"
                          color="white"
                          variant="body2"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            cursor: "help"
                          }}
                        >
                          iCL
                          <InfoOutlinedIcon sx={{ fontSize: 16, ml: 0.5 }} />
                        </Typography>
                      </MuiTooltip>
                    </Grid>
                    <Grid item xs={6}>
                      <MuiTooltip title="Performance" arrow>
                        <Typography
                          fontFamily="FractulRegular"
                          color="white"
                          variant="body2"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            cursor: "help"
                          }}
                        >
                          P
                          <InfoOutlinedIcon sx={{ fontSize: 16, ml: 0.5 }} />
                        </Typography>
                      </MuiTooltip>
                    </Grid>
                  </Grid>
                  {memberData.map((point, index) => (
                    <Grid
                      container
                      spacing={1}
                      alignItems="center"
                      key={index}
                      sx={{ mt: 1 }}
                    >
                      <Grid item xs={6}>
                        <CustomSlider
                          value={point.iCL}
                          onChange={(e, newValue) =>
                            handleInputChange(
                              memberIndex,
                              index,
                              "iCL",
                              newValue
                            )
                          }
                          min={1}
                          max={10}
                          step={0.1}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <AutTextField
                          type="number"
                          sx={{
                            width: "100%",
                            "& .MuiInputBase-root": {
                              fontFamily: "FractulRegular"
                            }
                          }}
                          color="offWhite"
                          variant="outlined"
                          value={point.P}
                          onChange={(e) =>
                            handleInputChange(
                              memberIndex,
                              index,
                              "P",
                              e.target.value
                            )
                          }
                          inputProps={{ min: 0.01, step: 0.01 }}
                        />
                      </Grid>
                    </Grid>
                  ))}
                </Box>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderHubData = () => (
    <Box sx={{ overflowX: "auto" }}>
      <Grid
        container
        sx={{
          display: "flex",
          // flexWrap: "nowrap",
          pb: 2,
          minHeight: "100%",
          justifyContent: "flex-start"
        }}
      >
        <Grid item sx={{ width: 80, mr: 2 }}>
          <Typography
            fontFamily="FractulRegular"
            color="white"
            variant="body2"
            sx={{ mt: "116px" }}
          >
            Period
          </Typography>
          {membersData[0].map((point, index) => (
            <Box
              key={index}
              sx={{
                mt: 1,
                height: "72px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Typography
                fontFamily="FractulRegular"
                color="white"
                textAlign="center"
                variant="body2"
              >
                {point.period}
              </Typography>
            </Box>
          ))}
        </Grid>
        {membersData.map((memberData, memberIndex) => {
          if (membersInSameHub && memberIndex > 0) return null;
          return (
            <Grid
              item
              key={memberIndex}
              sx={{
                width: 350,
                mr: 2
              }}
            >
              <Box
                sx={{
                  height: "100%",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  p: 2,
                  borderRadius: "15px",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                <Typography
                  fontFamily="FractulRegular"
                  color="white"
                  variant="h6"
                  gutterBottom
                >
                  Hub {membersInSameHub ? "" : memberIndex + 1}
                </Typography>
                <Grid container spacing={2}>
                  {/* <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={memberAutoIncrement[memberIndex]}
                          onChange={() =>
                            toggleMemberAutoIncrement(memberIndex)
                          }
                          color="primary"
                        />
                      }
                      label={
                        <Typography fontFamily="FractulRegular" color="white">
                          Auto-increment TCM
                        </Typography>
                      }
                    />
                  </Grid>
                  {memberAutoIncrement[memberIndex] && (
                    <Grid item xs={12}>
                      <AutTextField
                        type="number"
                        color="offWhite"
                        variant="outlined"
                        value={memberIncrementPercentages[memberIndex]}
                        onChange={(e) =>
                          handleIncrementPercentageChange(
                            memberIndex,
                            e.target.value
                          )
                        }
                        inputProps={{ min: 0, step: 5 }}
                        sx={{
                          width: "100%",
                          "& .MuiFormLabel-root": {
                            color: "white",
                            fontFamily: "FractulRegular"
                          },
                          "& .MuiInputBase-root": {
                            fontFamily: "FractulRegular"
                          }
                        }}
                        label="Increment %"
                      />
                    </Grid>
                  )} */}
                  {!membersInSameHub && (
                    <Grid
                      sx={{
                        visibility: memberIndex === 0 ? "hidden" : "visible"
                      }}
                      item
                      xs={12}
                    >
                      <FormControlLabel
                        control={
                          <Switch
                            checked={copyHubFromPrevious[memberIndex]}
                            onChange={() =>
                              toggleCopyHubFromPrevious(memberIndex)
                            }
                            color="primary"
                          />
                        }
                        label={
                          <Typography fontFamily="FractulRegular" color="white">
                            Copy from Previous Hub
                          </Typography>
                        }
                      />
                    </Grid>
                  )}
                </Grid>
                <Box sx={{ mt: 2, flexGrow: 1, overflowY: "auto", p: 1 }}>
                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={6}>
                      <MuiTooltip title="Total Community Members" arrow>
                        <Typography
                          fontFamily="FractulRegular"
                          color="white"
                          variant="body2"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            cursor: "help"
                          }}
                        >
                          TCM
                          <InfoOutlinedIcon sx={{ fontSize: 16, ml: 0.5 }} />
                        </Typography>
                      </MuiTooltip>
                    </Grid>
                    <Grid item xs={6}>
                      <MuiTooltip
                        title="Average individual Commitment Level"
                        arrow
                      >
                        <Typography
                          fontFamily="FractulRegular"
                          color="white"
                          variant="body2"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            cursor: "help"
                          }}
                        >
                          avgICL
                          <InfoOutlinedIcon sx={{ fontSize: 16, ml: 0.5 }} />
                        </Typography>
                      </MuiTooltip>
                    </Grid>
                  </Grid>
                  {memberData.map((point, index) => (
                    <Grid
                      container
                      spacing={1}
                      alignItems="center"
                      key={index}
                      sx={{ mt: 1 }}
                    >
                      <Grid item xs={6}>
                        <AutTextField
                          sx={{
                            width: "100%",
                            "& .MuiInputBase-root": {
                              fontFamily: "FractulRegular"
                            }
                          }}
                          type="number"
                          color="offWhite"
                          variant="outlined"
                          value={point.TCM}
                          onChange={(e) =>
                            handleInputChange(
                              memberIndex,
                              index,
                              "TCM",
                              e.target.value
                            )
                          }
                          inputProps={{ min: 1 }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <CustomSlider
                          value={point.avgICL}
                          onChange={(e, newValue) =>
                            handleInputChange(
                              memberIndex,
                              index,
                              "avgICL",
                              newValue
                            )
                          }
                          min={1}
                          max={10}
                          step={0.1}
                        />
                      </Grid>
                    </Grid>
                  ))}
                </Box>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );

  return (
    <PerfectScrollbar
      style={{
        display: "flex",
        flexDirection: "column"
      }}
    >
      <Box sx={{ p: isMobile ? 0 : 3, mt: isMobile ? 0 : 4 }}>
        <Typography
          fontFamily="FractulRegular"
          color="white"
          variant="h4"
          gutterBottom
          sx={{ p: isMobile ? 2 : 0 }}
        >
          PS Playground
        </Typography>

        <StyledAccordion title="Number of Members">
          <RadioGroup
            row
            value={memberCount}
            onChange={handleMemberCountChange}
          >
            {[1, 2, 3].map((count) => (
              <FormControlLabel
                key={count}
                value={count}
                control={<Radio />}
                label={
                  <Typography fontFamily="FractulRegular" color="white">
                    {count} {count === 1 ? "Member" : "Members"}
                  </Typography>
                }
              />
            ))}
          </RadioGroup>
        </StyledAccordion>
        <StyledAccordion title="Parameters">
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <FormControlLabel
                control={
                  <Switch
                    checked={useDefaultPeriods}
                    onChange={handleToggleChange}
                    color="primary"
                  />
                }
                label={
                  <Typography
                    fontFamily="FractulRegular"
                    color="white"
                    variant="body2"
                  >
                    Default periods (10)
                  </Typography>
                }
              />
            </Grid>
            <Grid item>
              <AutTextField
                disabled={useDefaultPeriods}
                type="number"
                InputLabelProps={{
                  style: { color: useDefaultPeriods ? "gray" : "white" }
                }}
                value={customPeriods}
                label="Periods"
                onChange={handleCustomPeriodsChange}
                inputProps={{ min: 1 }}
                sx={{
                  width: "100px",
                  ml: 2,
                  "& .MuiInputBase-root": { fontFamily: "FractulRegular" }
                }}
                color="offWhite"
                variant="outlined"
              />
            </Grid>

            <Grid item>
              <FormControlLabel
                control={
                  <Switch
                    checked={membersInSameHub}
                    onChange={handleMembersInSameHubChange}
                    color="primary"
                  />
                }
                label={
                  <Typography
                    fontFamily="FractulRegular"
                    color="white"
                    variant="body2"
                  >
                    Members are in the same hub
                  </Typography>
                }
              />
            </Grid>
          </Grid>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="data editor tabs"
            centered
          >
            <Tab sx={{ color: "white" }} label="Members Data" />
            <Tab sx={{ color: "white" }} label="Hubs Data" />
          </Tabs>
          <TabPanel value={tabValue} index={0}>
            {renderMemberData()}
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            {renderHubData()}
          </TabPanel>
        </StyledAccordion>

        <Fade in={!showVisualization} timeout={500}>
          <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
            <AutOsButton onClick={handleGenerateClick}>Generate</AutOsButton>
          </Box>
        </Fade>

        <Grow in={showVisualization} timeout={1000}>
          <div>
            <Fade in={showVisualization} timeout={1500}>
              <div>
                <StyledAccordion
                  expanded={expandedAccordion}
                  onChange={handleAccordionChange}
                  title="In-Depth Visualization"
                >
                  <Box sx={{ mb: 2, display: "flex", flexDirection: "row" }}>
                    {renderMemberToggle()}
                    {renderMemberSwitches()}
                  </Box>
                  <Grid container spacing={isMobile ? 0 : 2}>
                    <Grid item xs={12}>
                      <ValueChart
                        membersData={membersData}
                        dataKey="PS"
                        title="Participation Score (PS)"
                        yAxisLabel="PS"
                        activeMembers={activeMembers}
                      />
                    </Grid>
                  </Grid>
                  <Box
                    sx={{ mt: 2, display: "flex", justifyContent: "center" }}
                  >
                    <Button
                      variant="contained"
                      onClick={toggleShowMoreGraphs}
                      sx={{
                        fontFamily: "FractulRegular",
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.2)"
                        }
                      }}
                    >
                      {showMoreGraphs ? "Show Less" : "Show More"}
                    </Button>
                  </Box>
                  {showMoreGraphs && (
                    <Fade in={showMoreGraphs} timeout={500}>
                      <Grid container spacing={isMobile ? 0 : 2} sx={{ mt: 2 }}>
                        <Grid item xs={12} md={6}>
                          <ValueChart
                            membersData={membersData}
                            dataKey="TCM"
                            title="Total Community Members (TCM)"
                            yAxisLabel="TCM"
                            activeMembers={activeMembers}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <ValueChart
                            membersData={membersData}
                            dataKey="avgICL"
                            title="Average Individual Commitment Level (avgICL)"
                            yAxisLabel="avgICL"
                            activeMembers={activeMembers}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <ValueChart
                            membersData={membersData}
                            dataKey="P"
                            title="Performance (P)"
                            yAxisLabel="P"
                            activeMembers={activeMembers}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <ValueChart
                            membersData={membersData}
                            dataKey="iCL"
                            title="Individual Commitment Level (iCL)"
                            yAxisLabel="iCL"
                            activeMembers={activeMembers}
                          />
                        </Grid>
                      </Grid>
                    </Fade>
                  )}
                </StyledAccordion>
              </div>
            </Fade>
          </div>
        </Grow>
      </Box>
    </PerfectScrollbar>
  );
};

export default ParticipationScore;
