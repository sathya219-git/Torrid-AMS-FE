import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import "@mantine/core/styles.css";
import "@mantine/charts/styles.css";
import Login from "./pages/Login/login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/dashboard";
import "@mantine/dates/styles.css";

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
            </Routes>
          </BrowserRouter>
        </MantineProvider>
      }
    </MantineProvider>
  );
}
