import { Line } from "react-chartjs-2";
import "../chartConfig.js";
import { useEffect, useState } from "react";
import { MEDIUM_SIZED_SCREEN } from "../constants/screenSize.js";
import type { LegendPosition } from "@/types";

interface DriverSeasonLineGraphProps {
  driverLineGraphData: Record<string, any>;
  year: string;
}

const DriverSeasonLineGraph = ({
  driverLineGraphData,
  year,
}: DriverSeasonLineGraphProps) => {
  const [legendPosition, setLegendPosition] = useState<LegendPosition>("left");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < MEDIUM_SIZED_SCREEN) {
        setLegendPosition("bottom");
      } else {
        setLegendPosition("left");
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const title = `Driver's Championship ${year}`;

  const data = {
    labels: driverLineGraphData.labels,
    datasets: driverLineGraphData.datasets,
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: legendPosition },
      title: {
        display: true,
        text: title,
        font: { size: 24 },
        padding: { top: 10, bottom: 10 },
      },
      tooltip: {
        callbacks: {
          label: function (context: Record<string, any>) {
            const dataset = context.dataset;
            const fullName = dataset.fullName || dataset.label;
            return `${fullName}: ${context.parsed.y} points`;
          },
        },
      },
    },
  };

  return <Line className="mb-6" data={data} options={options} />;
};

export default DriverSeasonLineGraph;
