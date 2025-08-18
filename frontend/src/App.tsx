import "./App.css";
import SeasonView from "./components/SeasonView";
import SeasonHeader from "./components/SeasonHeader";

function App() {
  return (
    <div className="max-w-full">
      <SeasonHeader />
      <SeasonView />
    </div>
  );
}

export default App;
