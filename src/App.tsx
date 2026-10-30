import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Auth & Public Pages
import Login from "./pages/auth/Login/Login";
import Register from "./pages/auth/Register/Register";
import SuspensionAppeal from "./pages/auth/SuspensionAppeal/SuspensionAppeal";
import TermsAndCondition from "./pages/auth/TermsAndCondition/TermsAndCondition";
import ForgotPassword from "./pages/auth/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword/ResetPassword";

// Student / User Pages
import StudentHome from "./pages/student/StudentHome";
import Parking from "./pages/student/Parking";
import Profile from "./pages/student/Profile";
import Reports from "./pages/student/Reports";
import Vehicles from "./pages/student/Vehicles";

// Guard Page
import GuardDashboard from "./pages/guard/GuardDashboard";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminChangePassword from "./pages/admin/AdminChangePassword";
import AdminForgotPassword from "./pages/admin/AdminForgotPassword";
import VehicleManagement from "./pages/admin/vehicle/VehicleManagement";
import VehicleDetails from "./pages/admin/vehicle/VehicleDetails";
import VehicleRegistration from "./pages/admin/vehicle/VehicleRegistration";
import ParkingManagement from "./pages/admin/parking/ParkingManagement";
import ParkingCapacity from "./pages/admin/parking/ParkingCapacity";
import ParkingHistory from "./pages/admin/parking/ParkingHistory";
import ParkingAnalytics from "./pages/admin/parking/ParkingAnalytics";
import IncidentManagement from "./pages/admin/incident/IncidentManagement";
import IncidentReview from "./pages/admin/incident/IncidentReview";
import AccessRecords from "./pages/admin/access/AccessRecords";
import AccessHistory from "./pages/admin/access/AccessHistory";
import Accounts from "./pages/admin/account/Accounts";
import AdminDetails from "./pages/admin/account/AdminDetails";
import AdminEdit from "./pages/admin/account/AdminEdit";
import AdminSuspend from "./pages/admin/account/AdminSuspend";
import AdminCreate from "./pages/admin/account/AdminCreate";
// Guardrails & Security Wrapper
import { ProtectedRoute } from "./components/ProtectedRoute";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
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

        {/* ADMIN Protected Routes */}
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

        <Route path="/admin/change-password" element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminChangePassword />
          </ProtectedRoute>
        } />

        <Route path="/admin/forgot-password" element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminForgotPassword />
          </ProtectedRoute>
        } />

        <Route path="/admin/accounts" element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <Accounts />
          </ProtectedRoute>
        } />

        <Route path="/admin/accounts/details/:id" element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminDetails />
          </ProtectedRoute>
        } />

        <Route path="/admin/accounts/edit/:id" element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminEdit />
          </ProtectedRoute>
        } />

        <Route path="/admin/accounts/create" element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminCreate />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/accounts/suspend/:id" element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminSuspend />
          </ProtectedRoute>
        } />

        <Route path="/admin/vehicles" element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <VehicleManagement />
          </ProtectedRoute>
        } />

        <Route path="/admin/vehicles/details/:id" element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <VehicleDetails />
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
          path="/admin/incidents/review/:id" 
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
               <IncidentReview />
            </ProtectedRoute>
          } />

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