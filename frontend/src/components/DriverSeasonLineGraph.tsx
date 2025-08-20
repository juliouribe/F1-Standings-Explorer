import { Line } from "react-chartjs-2";
import "../chartConfig.js";

interface DriverSeasonLineGraphProps {
  lineGraphData: Record<string, any>;
  championship: string;
  year: string;
}

const DriverSeasonLineGraph = ({
  lineGraphData,
  championship,
  year,
}: DriverSeasonLineGraphProps) => {
  const title =
    championship == "driver"
      ? `Driver's Championship ${year}`
      : `Constructor's Chamiponship ${year}`;

  const data = {
    labels: lineGraphData.labels,
    datasets: lineGraphData.datasets,
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
  return <Line data={data} options={options} />;
};

export default DriverSeasonLineGraph;
