import "@mantine/charts/styles.css";
import { LoadingOverlay, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import { BrowserRouter, data, Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard/dashboard";
import ForgotPassword from "./pages/ForgotPassword/forgotPassword";
import Login from "./pages/Login/login";
import { theme } from "./theme";
import { useAtomValue, useSetAtom } from "jotai";
import { groups, InitiateAPI } from "./store/filterStore";
import { useEffect, useState } from "react";
import { AssignmentGroupItem } from "./components/AssignmentGroup/assignment-group.interface";
import { notifications } from "@mantine/notifications";

export default function App() {
  const [showLoader, setShowLoader] = useState(false);
  const initiateAPI = useAtomValue(InitiateAPI);

  const setAssignmentGroups = useSetAtom(groups);

  useEffect(() => {
    if (showLoader) {
      document.body.classList.add("loader");
    } else {
      document.body.classList.remove("loader");
    }
  }, [showLoader]);

  useEffect(() => {
    if (initiateAPI.url !=="") {
      setShowLoader(true);
      fetch(initiateAPI.url, {
        method: initiateAPI.method,
        body: initiateAPI.body,
      })
        .then((res) => {
          res
            .json()
            .then((value) => {
              if (initiateAPI.url.includes("api/Incident/assignmentgroups")) {
                const data: AssignmentGroupItem[] = value;
                setAssignmentGroups(
                  data.map((item) => {
                    return item.assignmentGroupName;
                  })
                );
              }
            })
            .catch((err) => {
              notifications.show({
                position: "top-right",
                title: "An error occured",
                message: err.message,
                color: "red",
                radius: "md",
                styles: {
                  root: {
                    backgroundColor: "#ffe6e6",
                    border: "1px solid #e74c3c",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  },
                  title: { fontWeight: 600, color: "#922b21" },
                  description: { color: "#943126" },
                },
              });
              setAssignmentGroups([]);
            });
        })
        .finally(() => {
          setShowLoader(false);
        });
    }
  }, [initiateAPI]);

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
