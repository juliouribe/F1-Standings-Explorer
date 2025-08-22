import type { GrandPrix } from "@/types";
import { grandPrixAbbreviations } from "../constants";

export function abbreviateGrandPrixName(grand_prix: string): string {
  return grandPrixAbbreviations[grand_prix];
}

export function buildRaceDateString(race: GrandPrix): string {
  return `${abbreviateGrandPrixName(race.name)} ${race.date}`;
}

export function isDateBetween(
  current: string,
  start: string,
  end: string
): boolean {
  const currDate = new Date(current);
  const startDate = new Date(start);
  const endDate = new Date(end);

  return currDate >= startDate && currDate <= endDate;
}
