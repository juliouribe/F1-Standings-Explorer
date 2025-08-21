import type { GrandPrix } from "@/types";
import { abbreviateGrandPrixName } from "./stringUtils";

// TODO: Write an interface to replace Record<string, any> with something descriptive.

function calculateStandings(races: GrandPrix[]): Record<string, any> {
  const driverNameMap: Record<string, string> = {};
  const raceLabels = [];
  const raceInfo = [];

  // Iterate over races and find how many races and drivers there are.
  for (const race of races) {
    const acronym = abbreviateGrandPrixName(race.name);
    raceInfo.push({
      round: race.round,
      name: race.race_track.name,
      acronym: acronym,
    });
    raceLabels.push(acronym);

    race.race_results.forEach((result) => {
      driverNameMap[result.driver.short_name] = result.driver.name;
    });
  }

  // Build out matrices to hold driver points across races.
  // These matrices are formatted for data visualizations using Chart JS.
  const driverList = Object.keys(driverNameMap);
  const pointsMatrix: Record<string, number[]> = {}; // driverID -> array of points per race
  const cumulativeMatrix: Record<string, number[]> = {}; // driverID -> array of cumalitive points
  driverList.forEach((driverID) => {
    pointsMatrix[driverID] = new Array(races.length + 1).fill(null); // one extra for the total
    cumulativeMatrix[driverID] = new Array(races.length).fill(null);
  });

  for (const [idx, race] of races.entries()) {
    for (const result of race.race_results) {
      const driverID = result.driver.short_name;
      pointsMatrix[driverID][idx] = result.points;
      const prevTotal = idx > 0 ? cumulativeMatrix[driverID][idx - 1] : 0;
      cumulativeMatrix[driverID][idx] = prevTotal + result.points;

      // On the last loop, set the total using the last cumalitve value.
      if (idx == races.length - 1)
        pointsMatrix[driverID][idx + 1] = cumulativeMatrix[driverID][idx];
    }
  }

  const sortedDrivers = Object.keys(driverNameMap).sort((a, b) => {
    const totalA = cumulativeMatrix[a][cumulativeMatrix[a].length - 1];
    const totalB = cumulativeMatrix[b][cumulativeMatrix[b].length - 1];
    return totalB - totalA; // Descending order
  });

  return {
    raceLabels,
    sortedDrivers,
    drivers: driverNameMap,
    pointsPerRace: pointsMatrix,
    cumulativePoints: cumulativeMatrix,
  };
}

export default calculateStandings;
