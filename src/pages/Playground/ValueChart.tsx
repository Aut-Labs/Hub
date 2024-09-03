import { Box, Paper, Typography } from "@mui/material";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  TooltipProps
} from "recharts";

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
          <Typography
            fontFamily="FractulRegular"
            key={index}
            variant="body2"
            color={entry.color}
          >
            {entry.name}: {entry.value.toFixed(2)}
          </Typography>
        ))}
      </Paper>
    );
  }
  return null;
};

export const ValueChart = ({
  membersData,
  dataKey,
  title,
  yAxisLabel,
  activeMembers
}) => {
  const memberColors = ["#ff7300", "#82ca9d", "#8884d8"];

  return (
    <Box sx={{ height: 300, width: "100%", mb: 4 }}>
      <Typography
        fontFamily="FractulRegular"
        color="white"
        variant="h6"
        gutterBottom
      >
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
