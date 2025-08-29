import { useMemo, useState } from "react";
import type { GrandPrix } from "@/types";
import { useQuery } from "@tanstack/react-query";
import ConstructorPositionsTable from "./ConstructorPositionsTable";
import DriverPositionsTable from "./DriverPositionsTable";
import calculateStandings from "../utils/calcuateStandings";
import {
  generateDriverLineChartData,
  generateConstructorLineChartData,
} from "../utils/generateDataSets";
import DriverSeasonLineGraph from "./DriverSeasonLineGraph";
import ConstructorLineGraph from "./ConstructorLineGraph";
import ChampionshipToggleSwitch from "./ChampionshipToggleSwitch";
import { API_BASE_URL } from "../constants/urls";
import SeasonSelector from "./SeasonSelector";
import ClearDatesButton from "./ClearDatesButton";
import DateSelector from "./DateSelector";

const SeasonView = () => {
  const [isTeam, setIsTeam] = useState(false);
  const [year, setYear] = useState("2025");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { isPending, error, data } = useQuery({
    queryKey: ["season", year],
    queryFn: () =>
      fetch(`${API_BASE_URL}/api/races/grand_prix/search/?year=${year}`).then(
        (res) => {
          if (!res.ok) throw new Error(`HTTP error! status ${res.status}`);
          return res.json();
        }
      ),
    staleTime: 60 * 60 * 1000, // Considered 'fresh' for 1 hour.
    gcTime: 60 * 60 * 1000 * 2, // Garbage collection doesn't kick in for two hours.
  });
  const races = (data as GrandPrix[]) || [];

  const processedData = useMemo(
    () => calculateStandings(races, startDate, endDate),
    [races, startDate, endDate]
  );
  const driverLineGraphData = useMemo(
    () => generateDriverLineChartData(processedData),
    [processedData]
  );
  const constructorLineGraphData = useMemo(
    () => generateConstructorLineChartData(processedData),
    [processedData]
  );

  if (isPending) return <div className="p-4">Loading race results...</div>;
  if (error)
    return <div className="p-4 text-red-600">Error: {error.message}</div>;

  return (
    <div
      className="p-6 max-w-full mx-auto flex flex-col justify-center items-center"
      style={{ maxWidth: "95%" }}
    >
      <div className="px-5 py-1.5 flex flex-col md:flex-row items-start md:items-center space-x-1 md:space-x-2 gap-3 text-md border border-black rounded-2xl bg-gray-100">
        <ChampionshipToggleSwitch isTeam={isTeam} setIsTeam={setIsTeam} />
        <SeasonSelector year={year} setYear={setYear} />
        <DateSelector
          races={races}
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
        <ClearDatesButton
          races={races}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
      </div>
      {processedData.raceInfo.length <= 1 ? (
        <div className="p-6">
          To render line graphs, select date ranges containing at least two
          races.
        </div>
      ) : isTeam ? (
        <ConstructorLineGraph
          constructorLineGraphData={constructorLineGraphData}
          year={year}
        />
      ) : (
        <DriverSeasonLineGraph
          driverLineGraphData={driverLineGraphData}
          year={year}
        />
      )}
      {isTeam ? (
        <ConstructorPositionsTable processedData={processedData} />
      ) : (
        <DriverPositionsTable processedData={processedData} />
      )}
    </div>
  );
};

export default SeasonView;
