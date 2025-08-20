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
      // legend: {
      //   position: "top",
      // },
      title: {
        display: true,
        text: title,
      },
    },
  };
  return <Line data={data} options={options} />;
};

export default DriverSeasonLineGraph;
