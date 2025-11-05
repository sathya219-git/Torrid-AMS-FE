import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import "@mantine/core/styles.css";
import "@mantine/charts/styles.css";
import Login from "./pages/Login/login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/dashboard";
import "@mantine/dates/styles.css";
import ForgotPassword from "./pages/ForgotPassword/forgotPassword";

export default function App() {
  return (
    <MantineProvider theme={theme}>
      {
        <MantineProvider theme={theme}>
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
