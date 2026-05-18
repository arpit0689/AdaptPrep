import { Navigate, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import AppLayout from './layouts/AppLayout';
import AuthPage from './pages/AuthPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './dashboard/DashboardPage';
import AnalyticsPage from './analytics/AnalyticsPage';
import RoadmapPage from './roadmap/RoadmapPage';
import SchedulePage from './roadmap/SchedulePage';
import SubjectsPage from './roadmap/SubjectsPage';
import AttendancePage from './attendance/AttendancePage';
import SettingsPage from './settings/SettingsPage';
import { useAuthStore } from './store/authStore';

const Protected = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  if (!user) return <Navigate to="/auth" replace />;
  if (!user.onboardingCompleted) return <Navigate to="/onboarding" replace />;
  return children;
};

export default function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/" element={<Protected><AppLayout /></Protected>}>
          <Route index element={<DashboardPage />} />
          <Route path="roadmap" element={<RoadmapPage />} />
          <Route path="subjects" element={<SubjectsPage />} />
          <Route path="schedule" element={<SchedulePage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}
