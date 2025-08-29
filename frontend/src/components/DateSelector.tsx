import type { Dispatch, SetStateAction } from "react";
import { useEffect, useMemo } from "react";
import type { GrandPrix } from "@/types";
import { buildRaceDateString } from "../utils/stringUtils";

interface DateSelectorProps {
  races: GrandPrix[];
  startDate: string;
  endDate: string;
  setStartDate: Dispatch<SetStateAction<string>>;
  setEndDate: Dispatch<SetStateAction<string>>;
}

const DateSelector = ({
  races,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}: DateSelectorProps) => {
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

  return (
    <>
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
    </>
  );
};

export default DateSelector;
