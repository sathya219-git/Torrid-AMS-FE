import "@mantine/charts/styles.css";
import { LoadingOverlay, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard/dashboard";
import ForgotPassword from "./pages/ForgotPassword/forgotPassword";
import Login from "./pages/Login/login";
import { theme } from "./theme";
import { useAtomValue } from "jotai";
import { ShowLoader } from "./store/filterStore";
import { useEffect } from "react";

export default function App() {
  const showLoader = useAtomValue(ShowLoader);

  useEffect(() => {
    if (showLoader) {
      document.body.classList.add('loader');
    } else {
      document.body.classList.remove('loader');
    }
  }, [showLoader])

  return (
    <MantineProvider theme={theme}>
      {
        <MantineProvider theme={theme}>
          <LoadingOverlay
            visible={showLoader}
            zIndex={1000}
            overlayProps={{ blur: 1 }}
          />
          <Notifications position="top-right" limit={5} autoClose={4000} />
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={<Navigate to="/login" replace={true} />}
              />
              <Route path="/login" element={<Login />} />
              <Route
                path="/dashboard"
                element={
                  !sessionStorage.getItem("userId") ? (
                    <Dashboard />
                  ) : (
                    <Navigate to="/login" replace={true} />
                  )
                }
              />
              <Route path="/forgotPassword" element={<ForgotPassword />} />
              <Route
                path="*"
                element={<Navigate to="/login" replace={true} />}
              />
            </Routes>
          </BrowserRouter>
        </MantineProvider>
      }
    </MantineProvider>
  );
}
