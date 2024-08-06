import React, { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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
  AccordionSummary
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
import { TOOLBAR_HEIGHT } from "./ToolbarConnector";
import PerfectScrollbar from "react-perfect-scrollbar";
import { AutTextField } from "@theme/field-text-styles";
import { AutOsButton } from "@components/AutButton";

export const StyledAccordion = ({ title, children }) => {
  return (
    <Accordion
      sx={{
        background: "transparent",
        marginBottom: 2,
        borderRadius: "15px !important",
        "&::before": {
          display: "none"
        }
      }}
    >
      <AccordionSummary
        sx={{
          borderRadius: "15px"
        }}
        expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
      >
        <Typography color="white" variant="h6">
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          borderRadius: "15px"
        }}
      >
        {children}
      </AccordionDetails>
    </Accordion>
  );
};

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
  const initialAvgICL = 6;
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
        iCl: initialICL,
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
      const newAvgICL = randomFloat(1, 10);
      const newTiCl = calculateTiCl(newTCM, newAvgICL);
      const newfiCl = calculateFiCl(prevPoint.iCl, newTiCl);
      const newTCP = calculateTCP(newTCM);
      const newEC = calculateEC(newTCP, newfiCl);
      const newP = 1.05;
      const newPS = calculatePS(prevPoint.PS, newP);
      dataPoint = {
        PS: newPS,
        TCM: newTCM,
        avgICL: newAvgICL,
        iCl: prevPoint.iCl,
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

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
  active,
  payload,
  label
}) => {
  if (active && payload && payload.length) {
    return (
      <Paper sx={{ p: 2 }}>
        {/* <Typography color="white" variant="body2">
            Period: {Number(label) + 1}
          </Typography> */}
        {payload.map((entry, index) => (
          <Typography key={index} variant="body2" color={entry.color}>
            {entry.name}: {entry.value.toFixed(2)}
          </Typography>
        ))}
      </Paper>
    );
  }
  return null;
};

const ValueChart = ({
  membersData,
  dataKey,
  title,
  yAxisLabel,
  activeMembers
}) => {
  const memberColors = ["#ff7300", "#82ca9d", "#8884d8"];

  return (
    <Box sx={{ height: 300, width: "100%", mb: 4 }}>
      <Typography color="white" variant="h6" gutterBottom>
        {title}
      </Typography>
      <ResponsiveContainer>
        <LineChart margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="period"
            type="number"
            domain={[1, 10]}
            label={{
              value: "Period",
              position: "insideBottomRight",
              offset: -10
            }}
          />
          <YAxis
            label={{ value: yAxisLabel, angle: -90, position: "insideLeft" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" height={36} />
          {membersData.map(
            (memberData, index) =>
              activeMembers[index] && (
                <Line
                  key={index}
                  type="monotone"
                  dataKey={dataKey}
                  data={memberData}
                  stroke={memberColors[index]}
                  name={`Member ${index + 1}`}
                />
              )
          )}
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

const ParticipationScore = () => {
  const [autoIncrementTCM, setAutoIncrementTCM] = useState(true);
  const [tcmIncrementPercentage, setTcmIncrementPercentage] = useState(20);
  const [membersData, setMembersData] = useState(() => [
    generateInitialData(),
    generateInitialData(),
    generateInitialData()
  ]);
  const [activeMembers, setActiveMembers] = useState([true, false, false]);

  const toggleMember = (index) => {
    setActiveMembers((prev) => {
      const newActiveMembers = [...prev];
      newActiveMembers[index] = !newActiveMembers[index];
      return newActiveMembers;
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

  const handleInputChange = (memberIndex, pointIndex, field, value) => {
    setMembersData((prevMembersData) => {
      const newMembersData = [...prevMembersData];
      const newMemberData = [...newMembersData[memberIndex]];
      newMemberData[pointIndex] = {
        ...newMemberData[pointIndex],
        [field]: Number(value)
      };

      // Recalculate values for this point and all subsequent points
      for (let i = pointIndex; i < newMemberData.length; i++) {
        const point = newMemberData[i];
        const prevPoint = i > 0 ? newMemberData[i - 1] : null;

        if (field === "TCM" || field === "avgICL") {
          point.tiCL = calculateTiCl(point.TCM, point.avgICL);
          point.fiCL = calculateFiCl(point.iCl, point.tiCL);
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
          autoIncrementTCM
        ) {
          newMemberData[i + 1].TCM = incrementTCMByPercent(
            point.TCM,
            tcmIncrementPercentage / 100
          );
        }
      }

      newMembersData[memberIndex] = newMemberData;
      return newMembersData;
    });
  };

  const formatValue = (value) => {
    return typeof value === "number" ? value.toFixed(2) : value;
  };

  const memberColors = ["#ff7300", "#82ca9d", "#8884d8"];

  return (
    <PerfectScrollbar
      style={{
        display: "flex",
        flexDirection: "column"
      }}
    >
      <Box sx={{ p: 3, mt: 4 }}>
        <Typography color="white" variant="h4" gutterBottom>
          Participation Score Progression
        </Typography>
        <StyledAccordion title="Participation Score Progression">
          <Stack
            alignItems="center"
            justifyContent="center"
            gap={2}
            direction="row"
            sx={{ mb: 4 }}
          >
            <FormControlLabel
              sx={{ color: "white" }}
              control={
                <Switch
                  checked={autoIncrementTCM}
                  onChange={(e) => setAutoIncrementTCM(e.target.checked)}
                  color="primary"
                />
              }
              label="Auto-increment TCM"
            />

            {autoIncrementTCM && (
              <AutTextField
                type="number"
                color="offWhite"
                variant="outlined"
                value={tcmIncrementPercentage}
                onChange={(e) =>
                  setTcmIncrementPercentage(Number(e.target.value))
                }
                inputProps={{ min: 0, step: 5 }}
                sx={{
                  ml: 2,
                  width: "100px",
                  "& .MuiFormLabel-root": {
                    color: "white"
                  }
                }}
                label="Increment %"
              />
            )}

            <Box>
              {[0, 1, 2].map((index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Switch
                      checked={activeMembers[index]}
                      onChange={() => toggleMember(index)}
                      color="primary"
                    />
                  }
                  label={`Member ${index + 1}`}
                  sx={{ color: "white", mr: 2 }}
                />
              ))}
            </Box>
          </Stack>
        </StyledAccordion>

        <StyledAccordion title="Members Data">
          {membersData.map(
            (memberData, memberIndex) =>
              activeMembers[memberIndex] && (
                <TableContainer
                  key={memberIndex}
                  sx={{
                    mb: 4,
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "15px"
                  }}
                >
                  <Stack direction="row" alignItems="center" gap={2}>
                    <Typography color="white" variant="h6" sx={{ p: 2 }}>
                      Member {memberIndex + 1}
                    </Typography>

                    <AutOsButton
                      onClick={() => copyValuesToOtherMembers(memberIndex)}
                      s
                      sx={{ color: "white", borderColor: "white" }}
                      variant="outlined"
                    >
                      Copy Values to Other Members
                    </AutOsButton>
                  </Stack>
                  <Table size="medium">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ color: "white" }}>Period</TableCell>
                        <TableCell sx={{ color: "white" }}>TCM</TableCell>
                        <TableCell sx={{ color: "white" }}>avgICL</TableCell>
                        <TableCell sx={{ color: "white" }}>P</TableCell>
                        <TableCell sx={{ color: "white" }}>PS</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {memberData.map((point, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Typography color="white" variant="body">
                              {point.period}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <AutTextField
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
                          </TableCell>
                          <TableCell>
                            <Slider
                              value={point.avgICL}
                              sx={{
                                height: "30px",
                                width: {
                                  xs: "175px",
                                  sm: "250px",
                                  md: "400px",
                                  lg: "450px"
                                },
                                "& .MuiSlider-markLabel": {
                                  color: "white"
                                },
                                "& .MuiSlider-mark": {
                                  color: "transparent"
                                },
                                "& .MuiSlider-thumb": {
                                  width: "40px",
                                  height: "40px"
                                }
                              }}
                              color="offWhite"
                              onChange={(e, newValue) =>
                                handleInputChange(
                                  memberIndex,
                                  index,
                                  "avgICL",
                                  newValue
                                )
                              }
                              min={0.1}
                              max={10}
                              step={0.1}
                              valueLabelDisplay="auto"
                              marks={[
                                { value: 0.1, label: "0.1" },
                                { value: 10, label: "10" }
                              ]}
                            />
                          </TableCell>
                          <TableCell>
                            <AutTextField
                              type="number"
                              sx={{ height: "35px" }}
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
                          </TableCell>
                          <TableCell>
                            <Typography color="white" variant="body">
                              {formatValue(point.PS)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )
          )}
        </StyledAccordion>
        <StyledAccordion title="In-Depth Visualization">
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <ValueChart
                membersData={membersData}
                dataKey="PS"
                title="Participation Score (PS)"
                yAxisLabel="PS"
                activeMembers={activeMembers}
              />
            </Grid>
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
                title="Average Individual Contribution Level (avgICL)"
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
          </Grid>
          <Typography color="white" variant="h5" gutterBottom>
            Participation Score
          </Typography>
          <Box sx={{ height: 400, width: "100%" }}>
            <ResponsiveContainer>
              <LineChart margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="period"
                  type="number"
                  domain={[1, 10]}
                  label={{
                    value: "Period",
                    position: "insideBottomRight",
                    offset: -10
                  }}
                />
                <YAxis yAxisId="left" orientation="left" stroke="#ffffff" />
                <YAxis yAxisId="right" orientation="right" stroke="#ffffff" />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="top" height={36} />
                {membersData.map(
                  (memberData, memberIndex) =>
                    activeMembers[memberIndex] && (
                      <React.Fragment key={memberIndex}>
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="PS"
                          data={memberData}
                          stroke={memberColors[memberIndex]}
                          name={`PS (Member ${memberIndex + 1})`}
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="TCM"
                          data={memberData}
                          stroke={memberColors[memberIndex]}
                          strokeDasharray="5 5"
                          name={`TCM (Member ${memberIndex + 1})`}
                        />
                      </React.Fragment>
                    )
                )}
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </StyledAccordion>
      </Box>
    </PerfectScrollbar>
  );
};

export default ParticipationScore;
