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

  return (
    <>
      {raceInfo.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No race results found
        </div>
      ) : (
        <div className="w-fit max-w-full">
          {/* Mobile scroll hint */}
          <div className="md:hidden text-xs text-gray-600 mb-2 text-center">
            ← Scroll horizontally to see all races →
          </div>
          <div className="overflow-x-auto shadow-sm border border-gray-300 rounded-lg">
            <div className="min-w-max">
              <table className="min-w-full bg-white border-2 border-gray-400 text-xs">
                <thead>
                  <tr className="bg-gray-200 border-b-2 border-gray-400 sticky top-0 z-10">
                    <th
                      className="px-1 py-1 text-center font-bold text-gray-800 border-r border-gray-400 w-8 min-w-[32px] sticky left-0 bg-gray-200 z-20"
                      title="Position"
                    >
                      Pos
                    </th>
                    <th className="px-2 py-1 text-left font-bold text-gray-800 border-r border-gray-400 min-w-[120px] w-28 sticky left-8 bg-gray-200 z-20">
                      Constructor
                    </th>
                    <th className="px-2 py-1 text-left font-bold text-gray-800 border-r border-gray-400 min-w-[120px] w-28 sticky left-36 bg-gray-200 z-20">
                      Driver
                    </th>
                    {raceInfo.map((race, idx) => (
                      <th
                        className="px-1 py-1 text-center font-bold text-gray-800 border-r border-gray-400 w-8 min-w-[32px]"
                        key={`header${idx}`}
                        title={
                          race.is_sprint
                            ? `Sprint Race at ${race.name}`
                            : race.name
                        }
                      >
                        <div className="text-[10px] leading-3">
                          {race.acronym}
                        </div>
                      </th>
                    ))}
                    <th className="px-2 py-1 text-center font-bold text-gray-800 w-8 min-w-[36px]">
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
                            className="px-1 py-1 text-center font-bold text-gray-900 border-r border-gray-300 align-middle sticky left-0 bg-white z-10"
                          >
                            {constructorIdx + 1}
                          </td>
                        )}
                        {/* Constructor - only show for first driver, span across all drivers */}
                        {isFirstDriverInConstructor && (
                          <td
                            rowSpan={driversInConstructorCount}
                            className="px-2 py-1 text-left font-medium text-gray-900 border-r border-gray-300 align-middle sticky left-8 bg-white z-10"
                          >
                            <div className="truncate">{driver.constructor}</div>
                          </td>
                        )}
                        <td className="px-2 py-1 text-left font-medium text-gray-900 border-r border-gray-300 sticky left-36 bg-white z-10">
                          <div className="truncate">{driver.full_name}</div>
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
                            {
                              constructorPoints[constructor][
                                raceInfo.length - 1
                              ]
                            }
                          </td>
                        ) : null}
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConstructorPositionsTable;
