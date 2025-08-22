import type { GrandPrix } from "@/types";
import { grandPrixAbbreviations } from "../constants";

export function abbreviateGrandPrixName(grand_prix: string): string {
  return grandPrixAbbreviations[grand_prix];
}

export function buildRaceDateString(race: GrandPrix): string {
  return `${abbreviateGrandPrixName(race.name)} ${race.date}`;
}
