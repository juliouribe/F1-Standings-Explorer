import { Line } from "react-chartjs-2";

const DriverSeasonLineGraph = (props: Record<string, any>) => {
  const { datasets, championship, year } = props;
  const title =
    championship == "driver"
      ? `Driver's Championship ${year}`
      : `Constructor's Chamiponship ${year}`;

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: title,
      },
    },
  };
  return <Line data={datasets} options={options} />;
};

export default DriverSeasonLineGraph;
