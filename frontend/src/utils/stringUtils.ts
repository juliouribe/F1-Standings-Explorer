import { grandPrixAbbreviations } from "../constants";

export function abbreviateGrandPrixName(grand_prix: string): string {
  return grandPrixAbbreviations[grand_prix];
}
