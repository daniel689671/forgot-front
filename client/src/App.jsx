import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ResetPass from "./pages/ResetPass";
import PassWords from "./pages/PassWords";
import PassChange from "./pages/PassChange";
import PassOk from "./pages/PassOk";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="" element={<ResetPass />} />
          <Route path="/passWords" element={<PassWords />} />
          <Route path="/passok" element={<PassOk />} />
          <Route path="/PassChange" element={<PassChange />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
