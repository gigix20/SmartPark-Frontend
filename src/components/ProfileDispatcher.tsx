import { Navigate } from "react-router-dom";
import Profile from "@/pages/student/Profile";

export function ProfileDispatcher() {
  const userStr = typeof window !== "undefined" ? localStorage.getItem("user") : null;
  let role = "";

  if (userStr) {
    try {
      const parsed = JSON.parse(userStr);
      role = (parsed?.role || "").toUpperCase();
    } catch {
      role = "";
    }
  }

  if (role === "ADMIN" || role === "SUPER_ADMIN") {
    return <Navigate to="/admin/profile" replace />;
  }

  if (role === "GUARD") {
    return <Navigate to="/guard/profile" replace />;
  }

  // Regular users / students will view the student profile
  return <Profile />;
}
