import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login/Login";
import Register from "./pages/auth/Register/Register";
import SuspensionAppeal from "./pages/auth/SuspensionAppeal/SuspensionAppeal";
import TermsAndCondition from "./pages/auth/TermsAndCondition/TermsAndCondition";
import ForgotPassword from "./pages/auth/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword/ResetPassword";
import StudentHome from "./pages/student/StudentHome";
import Parking from "./pages/student/Parking";
import Profile from "./pages/student/Profile";
import Reports from "./pages/student/Reports";
import Vehicles from "./pages/student/Vehicles";
import GuardDashboard from "./pages/guard/GuardDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProfile from "./pages/admin/AdminProfile";
import VehicleManagement from "./pages/admin/VehicleManagement";
import VehicleRegistration from "./pages/admin/VehicleRegistration";
import ParkingManagement from "./pages/admin/ParkingManagement";
import ParkingCapacity from "./pages/admin/ParkingCapacity";
import ParkingHistory from "./pages/admin/ParkingHistory";
import ParkingAnalytics from "./pages/admin/ParkingAnalytics";
import IncidentManagement from "./pages/admin/IncidentManagement";
import AccessRecords from "./pages/admin/AccessRecords";
import AccessHistory from "./pages/admin/AccessHistory";
import Accounts from "./pages/admin/Accounts";
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
        <Route path="/reset-password" element={<ResetPassword />} />
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
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        <Route path="/admin/profile" element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminProfile />
          </ProtectedRoute>
        } />

        <Route path="/admin/accounts" element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <Accounts />
          </ProtectedRoute>
        } />

        <Route path="/admin/vehicles" element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <VehicleManagement />
          </ProtectedRoute>
        } />

        <Route path="/admin/vehicles/registration" element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <VehicleRegistration />
          </ProtectedRoute>
        } />

        <Route path="/admin/parking" element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <ParkingManagement />
          </ProtectedRoute>
        } />

        <Route 
          path="/admin/parking/capacity" 
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <ParkingCapacity />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/admin/parking/history" 
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <ParkingHistory />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/admin/parking/analytics" 
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <ParkingAnalytics />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/admin/incidents" 
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <IncidentManagement />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/admin/access-records" 
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AccessRecords />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/admin/access-records/history" 
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AccessHistory />
            </ProtectedRoute>
          } 
        />

        </Routes>
    </BrowserRouter>
  );
}

export default App;