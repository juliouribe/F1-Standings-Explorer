import type { GrandPrix, ProcessedData } from "@/types";
import { abbreviateGrandPrixName, isDateBetween } from "./stringUtils";

function calculateStandings(
  races: GrandPrix[],
  start: string,
  end: string
): ProcessedData {
  const driverNameMap: Record<string, string> = {};
  const constructorMap = new Set<string>();
  const raceLabels = [];
  const raceInfo: Record<string, any>[] = [];

  const racesFiltered = races.filter((race) =>
    isDateBetween(race.date, start, end)
  );
  // Iterate over races and find how many races and drivers there are.
  for (const race of racesFiltered) {
    const acronym = abbreviateGrandPrixName(race.name);
    raceInfo.push({
      round: race.round,
      name: race.race_track.name,
      acronym: acronym,
    });
    raceLabels.push(acronym);

    race.race_results.forEach((result) => {
      driverNameMap[result.driver.short_name] = result.driver.name;
      constructorMap.add(result.constructor.name);
    });
  }

  // Build out matrices to hold driver points across races.
  // These matrices are formatted for data visualizations using Chart JS.
  const positionMatrix: Record<string, number[]> = {}; // driverID -> array of points per race
  const driverSeenTemplate: Record<string, boolean> = {}; // driverID -> boolean
  const cumulativeMatrix: Record<string, number[]> = {}; // driverID -> array of cumalitive points
  Object.keys(driverNameMap).forEach((driverID) => {
    positionMatrix[driverID] = new Array(racesFiltered.length + 1).fill(""); // one extra for the total
    cumulativeMatrix[driverID] = new Array(racesFiltered.length).fill(0);
    driverSeenTemplate[driverID] = false;
  });

  // Build out matrix for constructors cumulative points.
  // teamSeenTemplate is used to track how to update team points. When we see a
  // result for a team the first time, we grab previous total. On the second
  // team result for a given race, we update the existing value.
  const constructorMatrix: Record<string, number[]> = {};
  const teamSeenTemplate: Record<string, boolean> = {};
  constructorMap.forEach((constructor) => {
    constructorMatrix[constructor] = new Array(racesFiltered.length).fill(0);
    teamSeenTemplate[constructor] = false;
  });

  for (const [idx, race] of racesFiltered.entries()) {
    const teamSeen = { ...teamSeenTemplate };
    const driverSeen = { ...driverSeenTemplate };
    for (const result of race.race_results) {
      const driverID = result.driver.short_name;
      const constructor = result.constructor.name;
      positionMatrix[driverID][idx] = result.finish_position;
      const prevTotal = idx > 0 ? cumulativeMatrix[driverID][idx - 1] : 0;
      cumulativeMatrix[driverID][idx] = prevTotal + result.points;
      driverSeen[driverID] = true;

      // First time we see a team, we grab prev total. Second go, update current
      if (teamSeen[constructor]) {
        constructorMatrix[constructor][idx] += result.points;
      } else {
        const prevTeamTotal =
          idx > 0 ? constructorMatrix[constructor][idx - 1] : 0;
        constructorMatrix[constructor][idx] = prevTeamTotal + result.points;
        teamSeen[constructor] = true;
      }

      // On the last loop, set the total using the last cumalitve value.
      if (idx == racesFiltered.length - 1)
        positionMatrix[driverID][idx + 1] = cumulativeMatrix[driverID][idx];
    }
    // When a driver doesn't have a race result, preserve their previous cumulative points total.
    Object.entries(driverSeen).map(([driverID, seen]) => {
      const prevTotal = idx > 0 ? cumulativeMatrix[driverID][idx - 1] : 0;
      if (!seen) cumulativeMatrix[driverID][idx] = prevTotal;
    });
  }

  // Sort drivers and teams from first to last in standings, descending order.
  const sortedDrivers = Object.keys(driverNameMap).sort((a, b) => {
    const totalA = cumulativeMatrix[a][cumulativeMatrix[a].length - 1];
    const totalB = cumulativeMatrix[b][cumulativeMatrix[b].length - 1];
    return totalB - totalA;
  });
  const sortedConstructors = [...constructorMap].sort((a, b) => {
    const totalA = constructorMatrix[a][constructorMatrix[a].length - 1];
    const totalB = constructorMatrix[b][constructorMatrix[b].length - 1];
    return totalB - totalA;
  });

  return {
    raceLabels,
    raceInfo,
    sortedDrivers,
    drivers: driverNameMap,
    positionPerRace: positionMatrix,
    cumulativePoints: cumulativeMatrix,
    sortedConstructors,
    constructorPoints: constructorMatrix,
  };
}

export default calculateStandings;
