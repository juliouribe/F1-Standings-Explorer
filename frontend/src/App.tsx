import "./App.css";
import SeasonView from "./components/SeasonView";
import SeasonHeader from "./components/SeasonHeader";
import { Analytics } from "@vercel/analytics/react";

function App() {
  return (
    <div className="max-w-full">
      <Analytics />
      <SeasonHeader />
      <SeasonView />
    </div>
  );
}

export default App;
