import Data from "./data_retrieval/Data";
import Home from "./components/Home";
import { Routes, Route } from "react-router-dom";
import NavigationBar from "./components/navigation/NavigationBar";
import { ContextProvider } from "./context/ContextAPI";
import StatsChart from "./components/chart/StatsChart";

function App() {
  return (
    <>
      <ContextProvider>
        <NavigationBar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/bitcoin" element={<Data currency={"bitcoin"} />} />
          <Route path="/ethereum" element={<Data currency={"ethereum"} />} />
          <Route path="/charts" element={<StatsChart />} />
        </Routes>
      </ContextProvider>
    </>
  );
}

export default App;
