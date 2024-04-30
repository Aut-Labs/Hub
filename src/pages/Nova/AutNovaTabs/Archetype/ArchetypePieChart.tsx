import React, { useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Sector
} from "recharts";
// import Size from "@assets/archetypes/people.png";
// import Growth from "@assets/archetypes/seed.png";
// import Performance from "@assets/archetypes/growth.png";
// import Reputation from "@assets/archetypes/reputation-management.png";
// import Conviction from "@assets/archetypes/deal.png";
import {
  NovaArchetype,
  NovaArchetypeParameters
} from "@aut-labs/sdk/dist/models/nova";
import { ArchetypeTypes } from "@api/archetype.api";

const nameShortcut = {
  Size: "S",
  Growth: "G",
  Performance: "P",
  Reputation: "R",
  Conviction: "C"
};

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
      {nameShortcut[name]}
    </text>
  );
};

const archetypeLimits = {
  [NovaArchetype.SIZE]: { min: 40, max: 60 },
  [NovaArchetype.GROWTH]: { min: 40, max: 60 },
  [NovaArchetype.PERFORMANCE]: { min: 40, max: 60 },
  [NovaArchetype.REPUTATION]: { min: 40, max: 60 },
  [NovaArchetype.CONVICTION]: { min: 40, max: 60 }
};

export const archetypeChartValues = (archetype: NovaArchetypeParameters) => {
  const { min: sizeMin, max: sizeMax } = archetypeLimits[NovaArchetype.SIZE];
  return {
    [NovaArchetype.SIZE]: {
      ...ArchetypeTypes[NovaArchetype.SIZE],
      value: archetype?.size,
      min: sizeMin,
      max: sizeMax,
      defaults: {
        [NovaArchetype.SIZE]: 40,
        [NovaArchetype.GROWTH]: 15,
        [NovaArchetype.PERFORMANCE]: 15,
        [NovaArchetype.REPUTATION]: 15,
        [NovaArchetype.CONVICTION]: 15
      }
    },
    [NovaArchetype.REPUTATION]: {
      ...ArchetypeTypes[NovaArchetype.REPUTATION],
      value: archetype?.reputation,
      min: sizeMin,
      max: sizeMax,
      defaults: {
        [NovaArchetype.SIZE]: 15,
        [NovaArchetype.GROWTH]: 15,
        [NovaArchetype.PERFORMANCE]: 15,
        [NovaArchetype.REPUTATION]: 40,
        [NovaArchetype.CONVICTION]: 15
      }
    },
    [NovaArchetype.CONVICTION]: {
      ...ArchetypeTypes[NovaArchetype.CONVICTION],
      value: archetype?.conviction,
      min: sizeMin,
      max: sizeMax,
      defaults: {
        [NovaArchetype.SIZE]: 15,
        [NovaArchetype.GROWTH]: 15,
        [NovaArchetype.PERFORMANCE]: 15,
        [NovaArchetype.REPUTATION]: 15,
        [NovaArchetype.CONVICTION]: 40
      }
    },
    [NovaArchetype.PERFORMANCE]: {
      ...ArchetypeTypes[NovaArchetype.PERFORMANCE],
      value: archetype?.performance,
      min: sizeMin,
      max: sizeMax,
      defaults: {
        [NovaArchetype.SIZE]: 15,
        [NovaArchetype.GROWTH]: 15,
        [NovaArchetype.PERFORMANCE]: 40,
        [NovaArchetype.REPUTATION]: 15,
        [NovaArchetype.CONVICTION]: 15
      }
    },
    [NovaArchetype.GROWTH]: {
      ...ArchetypeTypes[NovaArchetype.GROWTH],
      value: archetype?.growth,
      min: sizeMin,
      max: sizeMax,
      defaults: {
        [NovaArchetype.SIZE]: 15,
        [NovaArchetype.GROWTH]: 40,
        [NovaArchetype.PERFORMANCE]: 15,
        [NovaArchetype.REPUTATION]: 15,
        [NovaArchetype.CONVICTION]: 15
      }
    }
  };
};

const ArchetypePieChart = ({
  archetype
}: {
  archetype: {
    default: number;
    parameters: NovaArchetypeParameters;
  };
}) => {
  const mappedArchetype: NovaArchetypeParameters = useMemo(() => {
    return {
      archetype: archetype.default,
      size: archetype.default,
      growth: archetype.default,
      performance: archetype.default,
      reputation: archetype.default,
      conviction: archetype.default
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
          activeShape={renderActiveShape}
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
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

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
        {`(Rate ${(percent * 100).toFixed(0)}%)`}
      </text>
    </g>
  );
};

export default ArchetypePieChart;
