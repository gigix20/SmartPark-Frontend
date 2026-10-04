import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login/Login";
import Register from "./pages/auth/Register/Register";
import SuspensionAppeal from "./pages/auth/SuspensionAppeal/SuspensionAppeal";
import TermsAndCondition from "./pages/auth/TermsAndCondition/TermsAndCondition";
import ForgotPassword from "./pages/auth/ForgotPassword/ForgotPassword";
import StudentHome from "./pages/student/StudentHome";
import Parking from "./pages/student/Parking";
import Profile from "./pages/student/Profile";
import Reports from "./pages/student/Reports";
import Vehicles from "./pages/student/Vehicles";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/appeal" element={<SuspensionAppeal />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/terms-and-conditions" element={<TermsAndCondition />} />
        <Route path="/StudentHome" element={<StudentHome />} />
        
        {/* Idinagdag ang route para sa Parking */}
        <Route path="/parking" element={<Parking />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/vehicles" element={<Vehicles />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;