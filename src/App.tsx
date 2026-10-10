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
import GuardDashboard from "./pages/guard/GuardDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/appeal" element={<SuspensionAppeal />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/terms-and-conditions" element={<TermsAndCondition />} />
        
        {/* USER / STUDENT Protected Routes */}
        <Route
          path="/StudentHome"
          element={
            <ProtectedRoute allowedRoles={["USER", "STUDENT"]}>
              <StudentHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/parking"
          element={
            <ProtectedRoute allowedRoles={["USER", "STUDENT"]}>
              <Parking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["USER", "STUDENT", "GUARD", "ADMIN"]}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute allowedRoles={["USER", "STUDENT"]}>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vehicles"
          element={
            <ProtectedRoute allowedRoles={["USER", "STUDENT"]}>
              <Vehicles />
            </ProtectedRoute>
          }
        />

        {/* GUARD Protected Route */}
        <Route
          path="/guard"
          element={
            <ProtectedRoute allowedRoles={["GUARD"]}>
              <GuardDashboard />
            </ProtectedRoute>
          }
        />

        {/* ADMIN Protected Route */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;