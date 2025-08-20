import { Line } from "react-chartjs-2";
import "../chartConfig.js";

interface DriverSeasonLineGraphProps {
  driverLineGraphData: Record<string, any>;
  year: string;
}

const DriverSeasonLineGraph = ({
  driverLineGraphData,
  year,
}: DriverSeasonLineGraphProps) => {
  const title = `Driver's Championship ${year}`;

  const data = {
    labels: driverLineGraphData.labels,
    datasets: driverLineGraphData.datasets,
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "left" as const },
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
