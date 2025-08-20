export function generateLineChartData(
  processedData: Record<string, any>
): Record<string, any> {
  const drivers: string[] = processedData.sortedDrivers;
  const datasets = drivers.map((driverId) => ({
    label: processedData.drivers[driverId],
    data: processedData.cumulativePoints[driverId],
  }));

  return {
    labels: processedData.raceLabels,
    datasets,
  };
}
