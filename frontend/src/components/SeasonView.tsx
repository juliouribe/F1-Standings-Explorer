import { useEffect, useMemo, useState } from "react";
import type { GrandPrix } from "@/types";
import { useQuery } from "@tanstack/react-query";
import ConstructorPositionsTable from "./ConstructorPositionsTable";
import DriverPositionsTable from "./DriverPositionsTable";
import calculateStandings from "../utils/calcuateStandings";
import {
  generateDriverLineChartData,
  generateConstructorLineChartData,
} from "../utils/generateDataSets";
import { buildRaceDateString } from "../utils/stringUtils";
import DriverSeasonLineGraph from "./DriverSeasonLineGraph";
import ConstructorLineGraph from "./ConstructorLineGraph";
import ChampionshipToggleSwitch from "./ChampionshipToggleSwitch";
import { API_BASE_URL } from "../constants/urls";

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
  });
  const races = (data as GrandPrix[]) || [];

  const { data: seasonData } = useQuery({
    queryKey: ["season"],
    queryFn: () =>
      fetch(`${API_BASE_URL}/api/races/seasons/`).then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status ${res.status}`);
        return res.json();
      }),
  });
  const seasons = (seasonData as string[]) || [];

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
    <div
      className="p-6 max-w-full mx-auto flex flex-col justify-center items-center"
      style={{ maxWidth: "95%" }}
    >
      <div className="px-5 py-1.5 flex flex-col md:flex-row items-start md:items-center space-x-1 md:space-x-2 gap-3 text-md border border-black rounded-2xl bg-gray-100">
        <ChampionshipToggleSwitch isTeam={isTeam} setIsTeam={setIsTeam} />
        <div className="flex gap-1 justify-center items-center">
          <span className={`text-md`}>Season:</span>
          <select
            className="border border-gray-400 p-1 rounded-sm text-sm hover:bg-gray-300 cursor-pointer"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            {seasons.map((season) => (
              <option key={`dropdown${season}`} value={season}>
                {season}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-1 justify-center items-center">
          <span className={`text-md`}>Start Date:</span>
          <select
            className="border border-gray-400 p-1 rounded-sm text-sm hover:bg-gray-300 cursor-pointer"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          >
            {races
              .filter((race) => !race.is_sprint)
              .map((race, idx) => (
                <option value={race.date} key={`s${race.round}${idx}`}>
                  {buildRaceDateString(race)}
                </option>
              ))}
          </select>
        </div>
        <div className="flex gap-1 justify-center items-center">
          <span className={`text-md`}>End Date:</span>
          <select
            className="border border-gray-400 p-1 rounded-sm text-sm hover:bg-gray-300 cursor-pointer"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          >
            {availableEndDates
              .filter((race) => !race.is_sprint)
              .map((race, idx) => (
                <option value={race.date} key={`e${race.round}${idx}`}>
                  {buildRaceDateString(race)}
                </option>
              ))}
          </select>
        </div>
        <button
          className="border border-gray-400 px-2 py-1 rounded-md text-sm hover:bg-gray-300 cursor-pointer"
          onClick={() => {
            setStartDate(races[0].date);
            setEndDate(races[races.length - 1].date);
          }}
        >
          Clear Dates
        </button>
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
