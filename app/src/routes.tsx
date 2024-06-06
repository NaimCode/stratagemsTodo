import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/auth/loginPage";
import RegisterPage from "./pages/auth/registerPage";
import SettingsAppearancePage from "./pages/settings/appearancePage";
import SettingsNotificationsPage from "./pages/settings/notificationPages";
import ProfilePage from "./pages/settings/profilePage";
import TodosPage from "./pages/todosPage";
import AuthSection from "./sections/authSection";
import DashboardSection from "./sections/dashboard";
import SettingsSection from "./sections/settings";
import useAuthStore from "./state/auth";

const RoutesWrapper = () => {
  const { token } = useAuthStore();
  return (
    <Routes>
      <Route
        path="/auth"
        element={token ? <Navigate to="/" /> : <AuthSection />}
      >
        <Route index element={<Navigate to="login" />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="login" element={<LoginPage />} />
      </Route>
      <Route
        path="/"
        element={token ? <DashboardSection /> : <Navigate to="/auth" />}
      >
        <Route index element={<Navigate to="todos" />} />
        <Route path="todos" element={<TodosPage />} />
        <Route path="settings" element={<SettingsSection />}>
          <Route index element={<Navigate to="profile" />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="notifications" element={<SettingsNotificationsPage />} />
          <Route path="appearance" element={<SettingsAppearancePage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default RoutesWrapper;
