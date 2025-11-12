import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import "@mantine/charts/styles.css";
import Login from "./pages/Login/login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/dashboard";
import "@mantine/dates/styles.css";
import '@mantine/notifications/styles.css';
import ForgotPassword from "./pages/ForgotPassword/forgotPassword";
import { Notifications } from "@mantine/notifications";

export default function App() {
  return (
    <MantineProvider theme={theme}>
      {
        <MantineProvider theme={theme}>
                      <Notifications position="top-right" limit={5} autoClose={4000} />

          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/forgotPassword" element={<ForgotPassword />} />
            </Routes>
          </BrowserRouter>
        </MantineProvider>
      }
    </MantineProvider>
  );
}
