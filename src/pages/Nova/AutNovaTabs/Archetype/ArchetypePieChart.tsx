import React, { useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Sector
} from "recharts";
import Size from "@assets/archetypes/people.png";
import Growth from "@assets/archetypes/seed.png";
import Performance from "@assets/archetypes/growth.png";
import Reputation from "@assets/archetypes/reputation-management.png";
import Conviction from "@assets/archetypes/deal.png";
import {
  NovaArchetype,
  NovaArchetypeParameters
} from "@aut-labs/sdk/dist/models/nova";

const nameShortcut = {
  Size: "S",
  Growth: "G",
  Performance: "P",
  Reputation: "R",
  Conviction: "C"
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];
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
      type: NovaArchetype.SIZE,
      title: "Size",
      description: "how many members",
      logo: Size,
      value: archetype?.size,
      min: sizeMin,
      max: sizeMax,
      defaults: {
        [NovaArchetype.SIZE]: 60,
        [NovaArchetype.GROWTH]: 10,
        [NovaArchetype.PERFORMANCE]: 10,
        [NovaArchetype.REPUTATION]: 10,
        [NovaArchetype.CONVICTION]: 10
      }
    },
    [NovaArchetype.REPUTATION]: {
      type: NovaArchetype.REPUTATION,
      title: "Reputation",
      description: "avg. reputation of members",
      logo: Reputation,
      value: archetype?.reputation,
      min: sizeMin,
      max: sizeMax,
      defaults: {
        [NovaArchetype.SIZE]: 10,
        [NovaArchetype.GROWTH]: 10,
        [NovaArchetype.PERFORMANCE]: 10,
        [NovaArchetype.REPUTATION]: 60,
        [NovaArchetype.CONVICTION]: 10
      }
    },
    [NovaArchetype.CONVICTION]: {
      type: NovaArchetype.CONVICTION,
      title: "Conviction",
      description: "avg. commitment level of members",
      logo: Conviction,
      value: archetype?.conviction,
      min: sizeMin,
      max: sizeMax,
      defaults: {
        [NovaArchetype.SIZE]: 10,
        [NovaArchetype.GROWTH]: 10,
        [NovaArchetype.PERFORMANCE]: 10,
        [NovaArchetype.REPUTATION]: 10,
        [NovaArchetype.CONVICTION]: 60
      }
    },
    [NovaArchetype.PERFORMANCE]: {
      type: NovaArchetype.PERFORMANCE,
      title: "Performance",
      description: "ratio between Created Points and Completed Points",
      logo: Performance,
      value: archetype?.performance,
      min: sizeMin,
      max: sizeMax,
      defaults: {
        [NovaArchetype.SIZE]: 10,
        [NovaArchetype.GROWTH]: 10,
        [NovaArchetype.PERFORMANCE]: 60,
        [NovaArchetype.REPUTATION]: 10,
        [NovaArchetype.CONVICTION]: 10
      }
    },
    [NovaArchetype.GROWTH]: {
      type: NovaArchetype.GROWTH,
      title: "Growth",
      description: "% of member’s growth respect to previous period",
      logo: Growth,
      value: archetype?.growth,
      min: sizeMin,
      max: sizeMax,
      defaults: {
        [NovaArchetype.SIZE]: 10,
        [NovaArchetype.GROWTH]: 60,
        [NovaArchetype.PERFORMANCE]: 10,
        [NovaArchetype.REPUTATION]: 10,
        [NovaArchetype.CONVICTION]: 10
      }
    }
  };
};

const ArchetypePieChart = ({
  archetype
}: {
  archetype: NovaArchetypeParameters;
}) => {
  const mappedData = useMemo(() => {
    const data = archetypeChartValues(archetype);
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
  }, [archetype]);

  console.log(mappedData);

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
          outerRadius={100} // Increased the chart size
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
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`Value ${value}`}</text>
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
