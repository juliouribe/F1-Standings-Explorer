import type { Dispatch, SetStateAction } from "react";
import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "../constants/urls";

interface SeasonSelectorProps {
  year: string;
  setYear: Dispatch<SetStateAction<string>>;
}

const SeasonSelector = ({ year, setYear }: SeasonSelectorProps) => {
  const { data } = useQuery({
    queryKey: ["season"],
    queryFn: () =>
      fetch(`${API_BASE_URL}/api/races/seasons/`).then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status ${res.status}`);
        return res.json();
      }),
    staleTime: 60 * 60 * 1000, // Considered 'fresh' for 1 hour.
    gcTime: 60 * 60 * 1000 * 2, // Garbage collection doesn't kick in for two hours.
  });
  const seasons = (data as string[]) || [];

  return (
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
  );
};

export default SeasonSelector;
