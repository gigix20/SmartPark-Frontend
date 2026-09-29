import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login/Login";
import Register from "./pages/auth/Register/Register";
import SuspensionAppeal from "./pages/auth/SuspensionAppeal/SuspensionAppeal";
import DataPrivacyModal from "./pages/auth/TermsAndCondition/TermsAndCondtion";
import ForgotPassword from "./pages/auth/ForgotPassword/ForgotPassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/appeal" element={<SuspensionAppeal />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/terms-and-conditions" element={<DataPrivacyModal />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;