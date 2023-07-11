import Data from "./data_retrieval/Data";
import Home from "./components/Home";
import { Routes, Route } from "react-router-dom";
import NavigationBar from "./components/navigation/NavigationBar";
import { ContextProvider } from "./context/ContextAPI";
import About from "./components/About";

function App() {
  return (
    <>
      <ContextProvider>
        <NavigationBar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/bitcoin" element={<Data currency={"bitcoin"} />} />
          <Route path="/ethereum" element={<Data currency={"ethereum"} />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </ContextProvider>
    </>
  );
}

export default App;
