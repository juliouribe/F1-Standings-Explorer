import type { GrandPrix } from "@/types";
import type { Dispatch, SetStateAction } from "react";

interface ClearDatesButtonProps {
  races: GrandPrix[];
  setStartDate: Dispatch<SetStateAction<string>>;
  setEndDate: Dispatch<SetStateAction<string>>;
}

const ClearDatesButton = ({
  races,
  setStartDate,
  setEndDate,
}: ClearDatesButtonProps) => {
  return (
    <button
      className="border border-gray-400 px-2 py-1 rounded-md text-sm hover:bg-gray-300 cursor-pointer"
      onClick={() => {
        setStartDate(races[0].date);
        setEndDate(races[races.length - 1].date);
      }}
    >
      Clear Dates
    </button>
  );
};

export default ClearDatesButton;
