import type { ProcessedData } from "@/types";

const ConstructorPositionsTable = ({
  processedData,
}: {
  processedData: ProcessedData;
}) => {
  const {
    raceInfo,
    sortedConstructors,
    sortedDrivers,
    positionPerRace,
    constructorPoints,
  } = processedData;

  const driverRows = sortedConstructors.flatMap(
    (constructor, constructorIdx) => {
      const drivers = sortedDrivers.filter(
        (driver) => driver.constructor === constructor
      );
      return drivers.map((driver, driverIdxInConstructor) => ({
        driver,
        constructorIdx,
        constructor,
        isFirstDriverInConstructor: driverIdxInConstructor === 0,
        driversInConstructorCount: drivers.length,
      }));
    }
  );

  // Get background color based on finishing position (Wikipedia F1 style)
  const getPositionColor = (position: string | number) => {
    const pos = typeof position === "string" ? parseInt(position) : position;
    if (!pos || isNaN(pos)) return "bg-gray-100"; // No result/DNF
    switch (pos) {
      case 1:
        return "bg-yellow-200"; // Gold for 1st
      case 2:
        return "bg-gray-200"; // Silver for 2nd
      case 3:
        return "bg-orange-200"; // Bronze for 3rd
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
      case 10:
        return "bg-green-100"; // Light green for top 10
      default:
        return "bg-violet-200"; // Violet for non-points
    }
  };
  console.log(sortedConstructors);

  return (
    <>
      {raceInfo.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No race results found
        </div>
      ) : (
        <div className="overflow-x-auto shadow-sm">
          <table className="min-w-full bg-white border-2 border-gray-400 text-xs">
            <thead>
              <tr className="bg-gray-200 border-b-2 border-gray-400">
                <th className="px-1 py-1 text-center font-bold text-gray-800 border-r border-gray-400 w-8">
                  Pos
                </th>
                <th className="px-2 py-1 text-left font-bold text-gray-800 border-r border-gray-400 min-w-[120px]">
                  Constructor
                </th>
                <th className="px-2 py-1 text-left font-bold text-gray-800 border-r border-gray-400 min-w-[120px]">
                  Driver
                </th>
                {raceInfo.map((race, idx) => (
                  <th
                    className="px-1 py-1 text-center font-bold text-gray-800 border-r border-gray-400 w-8"
                    key={`header${idx}`}
                    title={race.name || race.acronym}
                  >
                    {race.acronym}
                  </th>
                ))}
                <th className="px-2 py-1 text-center font-bold text-gray-800 w-12">
                  Pts
                </th>
              </tr>
            </thead>
            <tbody>
              {driverRows.map(
                ({
                  driver,
                  constructorIdx,
                  constructor,
                  isFirstDriverInConstructor,
                  driversInConstructorCount,
                }) => (
                  <tr
                    key={`${constructor}-${driver.short_name}`}
                    className="border-b border-gray-300 hover:bg-gray-50"
                  >
                    {/* Position - only show for first driver, span across all drivers in constructor */}
                    {isFirstDriverInConstructor && (
                      <td
                        rowSpan={driversInConstructorCount}
                        className="px-1 py-1 text-center font-bold text-gray-900 border-r border-gray-300 align-middle"
                      >
                        {constructorIdx + 1}
                      </td>
                    )}
                    {/* Constructor - only show for first driver, span across all drivers */}
                    {isFirstDriverInConstructor && (
                      <td
                        rowSpan={driversInConstructorCount}
                        className="px-2 py-1 text-left font-medium text-gray-900 border-r border-gray-300 align-middle"
                      >
                        {driver.constructor}
                      </td>
                    )}
                    <td className="px-2 py-1 text-left font-medium text-gray-900 border-r border-gray-300">
                      {driver.full_name}
                    </td>
                    {raceInfo.map((_, raceIdx) => {
                      const position =
                        positionPerRace[driver.short_name][raceIdx];
                      const bgColor = getPositionColor(position);

                      return (
                        <td
                          key={`pos${raceIdx}`}
                          className={`px-1 py-1 text-center border-r border-gray-300 text-gray-800 ${bgColor}`}
                        >
                          {position || ""}
                        </td>
                      );
                    })}

                    {/* Total - only show for first driver */}
                    {isFirstDriverInConstructor ? (
                      <td
                        rowSpan={driversInConstructorCount}
                        className="px-2 py-1 text-center font-bold text-gray-900 align-middle"
                      >
                        {constructorPoints[constructor][raceInfo.length - 1]}
                      </td>
                    ) : null}
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default ConstructorPositionsTable;
