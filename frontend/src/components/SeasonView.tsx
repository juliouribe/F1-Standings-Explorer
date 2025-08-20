import { useMemo, useState } from "react";
import type { GrandPrix } from "@/types";
import { useQuery } from "@tanstack/react-query";
import SeasonTable from "./SeasonTable";
import calculateStandings from "../utils/calcuateStandings";
import { generateLineChartData } from "../utils/generateDataSets";

const SeasonView = () => {
  const [year, setYear] = useState("2025");
  const { isPending, error, data } = useQuery({
    queryKey: ["season", year],
    queryFn: () =>
      fetch(
        `http://127.0.0.1:8000/api/races/grand_prix/search/?year=${year}`
      ).then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status ${res.status}`);
        return res.json();
      }),
  });
  const races = (data as GrandPrix[]) || [];
  const processedData = useMemo(() => calculateStandings(races), [races]);
  const lineGraphData = useMemo(
    () => generateLineChartData(processedData),
    [processedData]
  );

  if (isPending) return <div className="p-4">Loading race results...</div>;
  if (error)
    return <div className="p-4 text-red-600">Error: {error.message}</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{year} F1 Race Results</h1>
      <div className="text-2xl font-bold mb-6">
        <select value={year} onChange={(e) => setYear(e.target.value)}>
          <option value={2023}>2023</option>
          <option value={2024}>2024</option>
          <option value={2025}>2025</option>
        </select>
      </div>
      <SeasonTable races={races} />
    </div>
  );
};

export default SeasonView;
