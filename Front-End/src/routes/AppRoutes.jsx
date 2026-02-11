import { Routes, Route } from "react-router-dom";

/* Public Pages */
import Landing from "../pages/public/Landing";
import About from "../pages/public/About";
import NotFound from "../pages/public/NotFound";

/* Auth Pages */
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

/* App Pages */
import Dashboard from "../pages/app/Dashboard";
import Upload from "../pages/app/Upload";
import Threats from "../pages/app/Threats";
import Reports from "../pages/app/Reports";
import Alerts from "../pages/app/Alerts";
import Settings from "../pages/app/Settings";

/* Layouts */
import PublicLayout from "../layouts/PublicLayout";
import AuthLayout from "../layouts/AuthLayout";
import AppLayout from "../layouts/AppLayout";

/* Protected Route */
import ProtectedRoute from "../components/layout/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
      </Route>

      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected App Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/threats" element={<Threats />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
