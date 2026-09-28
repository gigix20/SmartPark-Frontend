import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import SuspensionAppeal from "./pages/SuspensionAppeal/SuspensionAppeal";
import DataPrivacyModal from "./pages/TermsAndCondition/TermsAndCondtion";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/appeal" element={<SuspensionAppeal />} />
        <Route path="/terms-and-conditions" element={<DataPrivacyModal />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;