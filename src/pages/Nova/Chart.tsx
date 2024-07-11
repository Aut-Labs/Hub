import React, { useEffect, useState, useRef } from "react";
import { Chart } from "chart.js/auto";
import { Box, Typography, TextField, Button } from "@mui/material";

const SimulationChart = () => {
  const chartRef = useRef(null);
  const [chart, setChart] = useState(null);
  const [periods, setPeriods] = useState(10);
  const [performance, setPerformance] = useState(1.05);

  const generateChartData = () => {
    // This is a simplified version. You'd replace this with your actual simulation logic.
    const labels = Array.from({ length: periods }, (_, i) => `Period ${i + 1}`);
    const datasets = [
      {
        label: "Member 1 PS",
        data: Array.from(
          { length: periods },
          (_, i) => 100 * Math.pow(performance, i + 1)
        ),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)"
      },
      {
        label: "Member 2 PS",
        data: Array.from(
          { length: periods },
          (_, i) => 100 * Math.pow(performance, i + 1)
        ),
        borderColor: "rgb(54, 162, 235)",
        backgroundColor: "rgba(54, 162, 235, 0.5)"
      },
      {
        label: "Member 3 PS",
        data: Array.from(
          { length: periods },
          (_, i) => 100 * Math.pow(performance, i + 1)
        ),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)"
      }
    ];
    return { labels, datasets };
  };

  useEffect(() => {
    if (chart) {
      chart.destroy();
    }
    const ctx = chartRef.current.getContext("2d");
    const newChart = new Chart(ctx, {
      type: "line",
      data: generateChartData(),
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top"
          },
          title: {
            display: true,
            text: "Participation Score Simulation"
          }
        }
      }
    });
    setChart(newChart);
  }, [periods, performance]);

  const handleUpdateChart = () => {
    if (chart) {
      chart.data = generateChartData();
      chart.update();
    }
  };

  return (
    <Box
      sx={{
        // backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem"
      }}
    >
      <Typography variant="h4" gutterBottom>
        Participation Score Simulation
      </Typography>
      <Box sx={{ width: "80%", maxWidth: "800px" }}>
        <canvas ref={chartRef} />
      </Box>
      <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
        <TextField
          label="Periods"
          type="number"
          value={periods}
          onChange={(e) => setPeriods(Number(e.target.value))}
        />
        <TextField
          label="Performance"
          type="number"
          value={performance}
          onChange={(e) => setPerformance(Number(e.target.value))}
        />
        <Button variant="contained" onClick={handleUpdateChart}>
          Update Chart
        </Button>
      </Box>
    </Box>
  );
};

export default SimulationChart;
