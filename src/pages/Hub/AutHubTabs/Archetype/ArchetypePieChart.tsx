import { memo, useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Sector
} from "recharts";
import { ArchetypeTypes } from "@api/hub.api";
import { Box, Typography } from "@mui/material";
import { HubArchetype, HubArchetypeParameters } from "@aut-labs/sdk";

const COLORS = ["#9BA1ED", "#272D76", "#4A3398", "#5C0E8D", "#2360EA"];
const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
  name,
  value
}) => {
  if (value === 0) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle" // Change 'centre' to 'middle'
      dominantBaseline="middle" // Add this line
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const archetypeLimits = {
  [HubArchetype.SIZE]: { min: 40, max: 60 },
  [HubArchetype.GROWTH]: { min: 40, max: 60 },
  [HubArchetype.PERFORMANCE]: { min: 40, max: 60 },
  [HubArchetype.REPUTATION]: { min: 40, max: 60 },
  [HubArchetype.CONVICTION]: { min: 40, max: 60 }
};

export const archetypeChartValues = (archetype: HubArchetypeParameters) => {
  const { min: sizeMin, max: sizeMax } = archetypeLimits[HubArchetype.SIZE];
  return {
    [HubArchetype.SIZE]: {
      ...ArchetypeTypes[HubArchetype.SIZE],
      value: archetype?.size,
      min: sizeMin,
      max: sizeMax,
      defaults: {
        [HubArchetype.SIZE]: 40,
        [HubArchetype.GROWTH]: 15,
        [HubArchetype.PERFORMANCE]: 15,
        [HubArchetype.REPUTATION]: 15,
        [HubArchetype.CONVICTION]: 15
      }
    },
    [HubArchetype.REPUTATION]: {
      ...ArchetypeTypes[HubArchetype.REPUTATION],
      value: archetype?.reputation,
      min: sizeMin,
      max: sizeMax,
      defaults: {
        [HubArchetype.SIZE]: 15,
        [HubArchetype.GROWTH]: 15,
        [HubArchetype.PERFORMANCE]: 15,
        [HubArchetype.REPUTATION]: 40,
        [HubArchetype.CONVICTION]: 15
      }
    },
    [HubArchetype.CONVICTION]: {
      ...ArchetypeTypes[HubArchetype.CONVICTION],
      value: archetype?.conviction,
      min: sizeMin,
      max: sizeMax,
      defaults: {
        [HubArchetype.SIZE]: 15,
        [HubArchetype.GROWTH]: 15,
        [HubArchetype.PERFORMANCE]: 15,
        [HubArchetype.REPUTATION]: 15,
        [HubArchetype.CONVICTION]: 40
      }
    },
    [HubArchetype.PERFORMANCE]: {
      ...ArchetypeTypes[HubArchetype.PERFORMANCE],
      value: archetype?.performance,
      min: sizeMin,
      max: sizeMax,
      defaults: {
        [HubArchetype.SIZE]: 15,
        [HubArchetype.GROWTH]: 15,
        [HubArchetype.PERFORMANCE]: 40,
        [HubArchetype.REPUTATION]: 15,
        [HubArchetype.CONVICTION]: 15
      }
    },
    [HubArchetype.GROWTH]: {
      ...ArchetypeTypes[HubArchetype.GROWTH],
      value: archetype?.growth,
      min: sizeMin,
      max: sizeMax,
      defaults: {
        [HubArchetype.SIZE]: 15,
        [HubArchetype.GROWTH]: 40,
        [HubArchetype.PERFORMANCE]: 15,
        [HubArchetype.REPUTATION]: 15,
        [HubArchetype.CONVICTION]: 15
      }
    }
  };
};

const CustomTooltip = ({ active, payload }) => {
  const template = useMemo(() => {
    if (!active || !payload || !payload.length) return null;

    const {
      name,
      payload: { description, value }
    } = payload[0];

    if (value < 40) return null;

    return (
      <Box
        sx={{
          borderRadius: "8px",
          maxWidth: {
            xs: "200px",
            sm: "220px",
            xl: "240px",
            xxl: "280px"
          },
          boxShadow: 2,
          background: "rgba(240, 245, 255, 0.4)",
          backdropFilter: "blur(12px)",
          padding: 2
        }}
      >
        <Typography mb={1} variant="subtitle1">
          {name}
        </Typography>
        <Typography variant="body">{description}</Typography>
      </Box>
    );
  }, [active, payload]);

  return template;
};

const ArchetypePieChart = ({
  archetype
}: {
  archetype: {
    default: number;
    parameters: HubArchetypeParameters;
  };
}) => {
  const mappedArchetype: HubArchetypeParameters = useMemo(() => {
    return {
      archetype: archetype?.default,
      ...archetype?.parameters
    };
  }, [archetype]);

  const mappedData = useMemo(() => {
    const data = archetypeChartValues(mappedArchetype);
    return Object.keys(data || {}).reduce((prev, curr) => {
      prev = [
        ...prev,
        {
          ...data[curr],
          name: data[curr].title
        }
      ];
      return prev;
    }, []);
  }, [mappedArchetype]);

  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_data, index) => {
    setActiveIndex(index);
  };

  return (
    <ResponsiveContainer>
      <PieChart>
        <Pie
          activeIndex={activeIndex}
          // activeShape={renderActiveShape}
          data={mappedData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={150} // Increased the chart size
          fill="#8884d8"
          onMouseEnter={onPieEnter}
          dataKey="value"
        >
          {mappedData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={CustomTooltip} />
      </PieChart>
    </ResponsiveContainer>
  );
};

// const renderActiveShape = (props) => {
//   const RADIAN = Math.PI / 180;
//   const {
//     cx,
//     cy,
//     midAngle,
//     outerRadius,
//     startAngle,
//     endAngle,
//     fill,
//     payload,
//     percent,
//     value
//   } = props;
//   const sin = Math.sin(-RADIAN * midAngle);
//   const cos = Math.cos(-RADIAN * midAngle);
//   const sx = cx + (outerRadius + 10) * cos;
//   const sy = cy + (outerRadius + 10) * sin;
//   const mx = cx + (outerRadius + 30) * cos;
//   const my = cy + (outerRadius + 30) * sin;
//   const ex = mx + (cos >= 0 ? 1 : -1) * 22;
//   const ey = my;
//   const textAnchor = cos >= 0 ? "start" : "end";

//   // Split description into lines
//   const maxCharPerLine = 25; // Adjust as needed
//   const words = payload?.description.split(" ");
//   const lines = [];
//   let currentLine = words[0];

//   words.slice(1).forEach((word) => {
//     if ((currentLine + " " + word).length > maxCharPerLine) {
//       lines.push(currentLine);
//       currentLine = word;
//     } else {
//       currentLine += " " + word;
//     }
//   });
//   lines.push(currentLine); // Push the last line

//   const lineHeight = 16; // Line height for text elements
//   const backgroundPadding = 20; // Padding around text for background

//   return (
//     <g>
//       <Sector
//         cx={cx}
//         cy={cy}
//         outerRadius={outerRadius}
//         startAngle={startAngle}
//         endAngle={endAngle}
//         fill={fill}
//       />
//       <Sector
//         cx={cx}
//         cy={cy}
//         startAngle={startAngle}
//         endAngle={endAngle}
//         outerRadius={outerRadius + 6}
//         fill={fill}
//       />
//       <path
//         d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
//         stroke={fill}
//         fill="none"
//       />
//       <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
//       {/* Background rectangle for text */}
//       <rect
//         x={ex + (cos >= 0 ? 1 : -1) * 12 - backgroundPadding}
//         y={ey - lineHeight / 2 - backgroundPadding}
//         width={maxCharPerLine * 6 + 2 * backgroundPadding} // Approximate width calculation
//         height={lines.length * lineHeight + 2 * backgroundPadding}
//         fill="rgba(255, 255, 255, 0.8)" // Semi-transparent white
//       />
//       {lines.map((line, index) => (
//         <text
//           key={index}
//           x={ex + (cos >= 0 ? 1 : -1) * 12}
//           y={ey + index * lineHeight}
//           dy={18}
//           textAnchor={textAnchor}
//           fill="#333"
//         >
//           {line}
//         </text>
//       ))}
//     </g>
//   );
// };

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        outerRadius={outerRadius + 6}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      {/* <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`Value ${value}`}</text> */}
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {payload?.description}
      </text>
    </g>
  );
};

export default memo(ArchetypePieChart);
