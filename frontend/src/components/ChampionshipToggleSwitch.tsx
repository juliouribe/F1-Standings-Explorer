import type { Dispatch, SetStateAction } from "react";

interface ToggleSwitchProps {
  isTeam: boolean;
  setIsTeam: Dispatch<SetStateAction<boolean>>;
}

function ChampionshipToggleSwitch({ isTeam, setIsTeam }: ToggleSwitchProps) {
  return (
    <div className="flex justify-center items-center space-x-2 pr-2">
      {/* Driver Text */}
      <span
        className={`text-md font-medium ${
          !isTeam ? "text-black" : "text-gray-400"
        }`}
      >
        Drivers
      </span>
      {/* Toggle Switch */}
      <div
        className={`relative inline-flex h-4.5 w-8 items-center rounded-full cursor-pointer transition-colors duration-300 ${
          isTeam ? "bg-blue-500" : "bg-gray-300"
        }`}
        onClick={() => setIsTeam(!isTeam)}
      >
        <span
          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-300 ${
            isTeam ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </div>
      {/* Constructor Text */}
      <span
        className={`text-md font-medium ${
          isTeam ? "text-black" : "text-gray-400"
        }`}
      >
        Constructors
      </span>
    </div>
  );
}

export default ChampionshipToggleSwitch;
