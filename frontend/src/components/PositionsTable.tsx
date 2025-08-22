import type { ProcessedData } from "@/types";

const PositionsTable = ({
  processedData,
}: {
  processedData: ProcessedData;
}) => {
  const { raceInfo, drivers, sortedDrivers, positionPerRace } = processedData;

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pos.
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                Driver
              </th>
              {raceInfo.map((race, idx) => (
                <th
                  className="px-2 py-2 text-xs text-center font-medium text-gray-500 uppercase tracking-wider"
                  key={`header${idx}`}
                >
                  {race.acronym}
                </th>
              ))}
              <th className="px-2 py-2 text-xs text-center font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedDrivers.map((driver, idx) => {
              return (
                <tr key={`driverRow${idx}`} className="hover:bg-gray-50">
                  <td className="px-2 py-2 whitespace-nowrap text-sm text-center font-medium text-gray-900">
                    {idx + 1}
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-sm text-center text-gray-500">
                    {drivers[driver] || "N/A"}
                  </td>
                  {raceInfo.map((_, raceIdx) => (
                    <td
                      key={`pos${raceIdx}`}
                      className="px-2 py-2 whitespace-nowrap text-sm text-center text-gray-500"
                    >
                      {positionPerRace[driver][raceIdx] || ""}
                    </td>
                  ))}
                  <td className="px-2 py-2 whitespace-nowrap text-sm text-center text-gray-500">
                    {positionPerRace[driver][raceInfo.length] || 0}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {raceInfo.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No race results found
        </div>
      )}
    </>
  );
};

export default PositionsTable;
