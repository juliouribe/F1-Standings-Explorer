import { useEffect, useMemo, useState } from "react";
import type { GrandPrix } from "@/types";
import { useQuery } from "@tanstack/react-query";
import PositionsTable from "./PositionsTable";
import calculateStandings from "../utils/calcuateStandings";
import {
  generateDriverLineChartData,
  generateConstructorLineChartData,
} from "../utils/generateDataSets";
import { buildRaceDateString } from "../utils/stringUtils";
import DriverSeasonLineGraph from "./DriverSeasonLineGraph";
import ConstructorLineGraph from "./ConstructorLineGraph";
import ChampionshipToggleSwitch from "./ChampionshipToggleSwitch";

const SeasonView = () => {
  const [isTeam, setIsTeam] = useState(false);
  const [year, setYear] = useState("2025");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
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

  useEffect(() => {
    if (races.length > 0) {
      setStartDate(races[0].date);
      setEndDate(races[races.length - 1].date);
    }
  }, [races]);

  // Filter end date options to only show dates after the startDate.
  const availableEndDates = useMemo(() => {
    if (!startDate) return races;

    const startIndex = races.findIndex((race) => race.date === startDate);
    return startIndex >= 0 ? races.slice(startIndex) : races;
  }, [races, startDate]);

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
    <div className="p-6 max-w-6xl mx-auto flex flex-col justify-center items-center ">
      <div className="flex space-x-4 text-md font-bold">
        <ChampionshipToggleSwitch isTeam={isTeam} setIsTeam={setIsTeam} />
        {/* Create an endpoint and generate this with the results */}
        <select value={year} onChange={(e) => setYear(e.target.value)}>
          <option value={2018}>2018</option>
          <option value={2019}>2019</option>
          <option value={2020}>2020</option>
          <option value={2021}>2021</option>
          <option value={2022}>2022</option>
          <option value={2023}>2023</option>
          <option value={2024}>2024</option>
          <option value={2025}>2025</option>
        </select>
        <select
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        >
          {races.map((race) => (
            <option value={race.date} key={`s${race.round}`}>
              {buildRaceDateString(race)}
            </option>
          ))}
        </select>
        <select value={endDate} onChange={(e) => setEndDate(e.target.value)}>
          {availableEndDates.map((race) => (
            <option value={race.date} key={`e${race.round}`}>
              {buildRaceDateString(race)}
            </option>
          ))}
        </select>
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
      <PositionsTable processedData={processedData} />
    </div>
  );
};

export default SeasonView;
