import { useState } from "react";
import type { GrandPrix } from "@/types";
import { useQuery } from "@tanstack/react-query";

const RaceResults = () => {
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
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Grand Prix
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Circuit
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {races.map((race, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {race.date || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {race.race_track.name || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {races.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No race results found
        </div>
      )}
    </div>
  );
};

export default RaceResults;
