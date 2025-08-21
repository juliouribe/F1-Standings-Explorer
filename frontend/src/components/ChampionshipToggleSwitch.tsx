import type { Dispatch, SetStateAction } from "react";

interface ToggleSwitchProps {
  isTeam: boolean;
  setIsTeam: Dispatch<SetStateAction<boolean>>;
}

function ChampionshipToggleSwitch({ isTeam, setIsTeam }: ToggleSwitchProps) {
  return (
    <div className="p-2">
      <div className="flex items-center space-x-4">
        {/* Driver Text */}
        <span
          className={`text-xl font-medium ${
            !isTeam ? "text-black" : "text-gray-400"
          }`}
        >
          Drivers
        </span>
        {/* Toggle Switch */}
        <div
          className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors duration-200 ${
            isTeam ? "bg-red-600" : "bg-gray-400"
          }`}
          onClick={() => setIsTeam(!isTeam)}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
              isTeam ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </div>
        {/* Constructor Text */}
        <span
          className={`text-xl font-medium ${
            isTeam ? "text-black" : "text-gray-400"
          }`}
        >
          Constructors
        </span>
      </div>
    </div>
  );
}

export default ChampionshipToggleSwitch;
