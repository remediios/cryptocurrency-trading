import "./App.css";
import Data from "./data_retrieval/Data";
import Home from "./components/Home";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/bitcoin" element={<Data />} />
      </Routes>
    </>
  );
}

export default App;
