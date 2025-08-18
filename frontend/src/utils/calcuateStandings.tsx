import type { DriverSummary, GrandPrix } from "@/types";

function calculateStandings(races: GrandPrix[]): [string, DriverSummary][] {
  const driverMap: Record<string, DriverSummary> = {};
  for (const race of races) {
    for (const result of race.race_results) {
      const driver = result.driver.name;
      // Create empty object if first result for driver.
      if (!driverMap[driver])
        driverMap[driver] = {
          total: 0,
        };
      driverMap[driver][race.race_track.name] = result.points;
      driverMap[driver].total += result.points;
    }
  }

  return Object.entries(driverMap).sort(
    ([, raceA], [, raceB]) => raceB.total - raceA.total
  );
}

export default calculateStandings;
