import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import TeachersPage from "./pages/TeachersPage";
import AttendancePage from "./pages/AttendancePage";
import AiInsightsPage from "./pages/AiInsightsPage";
import SettingsPage from "./pages/SettingsPage";
import ReportsPage from "./pages/ReportsPage";
import { AppProvider, useAppContext } from "./context/AppContext";
import Layout from "./components/layout/Layout";
import React, { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";

const queryClient = new QueryClient();

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { isLoggedIn } = useAppContext();
  return isLoggedIn ? <Layout>{children}</Layout> : <Navigate to="/login" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AppProvider>
          <React.Fragment> {/* Use React.Fragment to wrap multiple children for AppProvider */}
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <DashboardPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/teachers"
                element={
                  <PrivateRoute>
                    <TeachersPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/attendance"
                element={
                  <PrivateRoute>
                    <AttendancePage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/ai-insights"
                element={
                  <PrivateRoute>
                    <AiInsightsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <PrivateRoute>
                    <SettingsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <PrivateRoute>
                    <ReportsPage />
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster richColors position="bottom-right" />
          </React.Fragment>
        </AppProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;