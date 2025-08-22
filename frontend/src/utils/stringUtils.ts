import { grandPrixAbbreviations } from "../constants";

export function abbreviateGrandPrixName(grand_prix: string): string {
  return grandPrixAbbreviations[grand_prix];
}

export function extractYearFromISOString(date: string): string {
  return date.slice(0, 4);
}
