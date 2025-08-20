function getLineGraphColor(idx: number, alpha = 1) {
  const colors = [
    `rgba(255, 99, 132, ${alpha})`, // Red
    `rgba(54, 162, 235, ${alpha})`, // Blue
    `rgba(255, 205, 86, ${alpha})`, // Yellow
    `rgba(75, 192, 192, ${alpha})`, // Teal
    `rgba(153, 102, 255, ${alpha})`, // Purple
    `rgba(255, 159, 64, ${alpha})`, // Orange
    `rgba(199, 199, 199, ${alpha})`, // Grey
    `rgba(83, 102, 255, ${alpha})`, // Indigo
    `rgba(255, 99, 255, ${alpha})`, // Pink
    `rgba(99, 255, 132, ${alpha})`, // Green
  ];
  return colors[idx % colors.length];
}

export function generateDriverLineChartData(
  processedData: Record<string, any>
): Record<string, any> {
  const drivers: string[] = processedData.sortedDrivers;
  const datasets = drivers.map((driverId, idx) => ({
    label: driverId,
    data: processedData.cumulativePoints[driverId],
    fullName: processedData.drivers[driverId],
    borderColor: getLineGraphColor(idx),
    backgroundColor: getLineGraphColor(idx, 0.1),
    fill: true,
    tension: 0.1,
  }));

  return {
    labels: processedData.raceLabels,
    datasets,
  };
}
