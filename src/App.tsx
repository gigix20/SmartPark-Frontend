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
import Reports from "./pages/student/Reports";
import Vehicles from "./pages/student/Vehicles";

// Guard Pages
import GuardDashboard from "./pages/guard/GuardDashboard";
import ScanQR from "./pages/guard/ScanQR"; 
import GateRegistered from "./pages/guard/GateRegistered";
import GateRegistrationForm from "./pages/guard/GateRegistrationForm";
import GateMonitoring from "./pages/guard/GateMonitoring";
import Notifications from "./pages/guard/Notifications";
import GuardProfile from "./pages/guard/Profile"; 
import GuardChangePassword from "./pages/guard/GuardChangePassword";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminNotifications from "./pages/admin/AdminNotifications";
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
import GuardCreate from "./pages/admin/account/GuardCreate"; // <--- Naidagdag na ang GuardCreate import dito

// Guardrails & Security Wrapper
import { ProtectedRoute } from "./components/ProtectedRoute";
import { IdleTimer } from "./components/IdleTimer";
import { ProfileDispatcher } from "./components/ProfileDispatcher";


function App() {
  return (
    <BrowserRouter>
      <IdleTimer />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/AdminDashboard" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/AdminDashboard.tsx" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard.tsx" element={<Navigate to="/admin/dashboard" replace />} />
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
        <Route path="/studenthome" element={<Navigate to="/StudentHome" replace />} />
        <Route path="/StudentHome.tsx" element={<Navigate to="/StudentHome" replace />} />
        <Route path="/student" element={<Navigate to="/StudentHome" replace />} />
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
            <ProtectedRoute allowedRoles={["USER", "STUDENT", "GUARD", "ADMIN", "SUPER_ADMIN"]}>
              <ProfileDispatcher />
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

        {/* GUARD Protected Routes */}
        <Route
          path="/guard"
          element={
            <ProtectedRoute allowedRoles={["GUARD"]}>
              <GuardDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/guard/dashboard" element={<Navigate to="/guard" replace />} />
        
        <Route
          path="/guard/scan-qr"
          element={
            <ProtectedRoute allowedRoles={["GUARD"]}>
              <ScanQR />
            </ProtectedRoute>
          }
        />

        <Route
          path="/guard/registration"
          element={
            <ProtectedRoute allowedRoles={["GUARD"]}>
              <GateRegistered />
            </ProtectedRoute>
          }
        />
        <Route
          path="/guard/registration/new"
          element={
            <ProtectedRoute allowedRoles={["GUARD"]}>
              <GateRegistrationForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/guard/monitoring"
          element={
            <ProtectedRoute allowedRoles={["GUARD"]}>
              <GateMonitoring />
            </ProtectedRoute>
          }
        />

        <Route
          path="/guard/notifications"
          element={
            <ProtectedRoute allowedRoles={["GUARD"]}>
              <Notifications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/guard/profile"
          element={
            <ProtectedRoute allowedRoles={["GUARD"]}>
              <GuardProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/guard/change-password"
          element={
            <ProtectedRoute allowedRoles={["GUARD"]}>
              <GuardChangePassword />
            </ProtectedRoute>
          }
        />

        {/* ADMIN Protected Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        <Route path="/admin/notifications" element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminNotifications />
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

        {/* Naidagdag na ang GuardCreate Route dito */}
        <Route path="/admin/guards/create" element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <GuardCreate />
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

        {/* Catch-all for any unknown, mistyped, or unauthorized direct URL access */}
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <Navigate to="/login" replace />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;