import "./App.css";
import RaceResults from "./components/RaceResults";
import SeasonHeader from "./components/SeasonHeader";

function App() {
  return (
    <div className="max-w-full">
      <SeasonHeader />
      <RaceResults />
    </div>
  );
}

export default App;
