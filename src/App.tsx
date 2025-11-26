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
import { useAtom, useSetAtom } from "jotai";
import {
  categories,
  CountByPriority,
  groups,
  InitiateAPI,
  KPIs,
  LoginSuccess,
  P1BreachedResponse,
  P1IncidentsResponse,
  P2BreachedResponse,
  P2IncidentsResponse,
  P3BreachedResponse,
  P3IncidentsResponse,
  P4BreachedResponse,
  P4IncidentsResponse,
  ReloadUploadedReportsGrid,
  ResetSuccess,
  status,
  tabValue,
  TeamMemberDetails,
  teamMembers,
  UploadedReportsResponse,
} from "./store/filterStore";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AssignmentGroupItem } from "./components/AssignmentGroup/assignment-group.interface";
import { notifications } from "@mantine/notifications";
import { CategoryItem } from "./components/Category/category.interface";
import { StatusItem } from "./components/Status/status.interface";

export default function App() {
  const [activeURLs, setActiveURLs] = useState<Set<string>>(new Set());
  const [initiateAPI, setInitiateAPI] = useAtom(InitiateAPI);

  const showLoader = useMemo(() => {
    return activeURLs.size > 0;
  }, [activeURLs]);

  const setAssignmentGroups = useSetAtom(groups);
  const setCategories = useSetAtom(categories);
  const setStatusList = useSetAtom(status);
  const setTeamMembers = useSetAtom(teamMembers);
  const setIncidentSummary = useSetAtom(KPIs);
  const setIncidentPrioritySummary = useSetAtom(CountByPriority);
  const setMemberDetailsResponse = useSetAtom(TeamMemberDetails);

  const setP1IncidentsResponse = useSetAtom(P1IncidentsResponse);
  const setP2IncidentsResponse = useSetAtom(P2IncidentsResponse);
  const setP3IncidentsResponse = useSetAtom(P3IncidentsResponse);
  const setP4IncidentsResponse = useSetAtom(P4IncidentsResponse);

  const setP1BreachedResponse = useSetAtom(P1BreachedResponse);
  const setP2BreachedResponse = useSetAtom(P2BreachedResponse);
  const setP3BreachedResponse = useSetAtom(P3BreachedResponse);
  const setP4BreachedResponse = useSetAtom(P4BreachedResponse);

  const setUploadedReportsResponse = useSetAtom(UploadedReportsResponse);
  const setReloadUploadedReportsGrid = useSetAtom(ReloadUploadedReportsGrid);
  const setTab = useSetAtom(tabValue);
  const setLoginSuccess = useSetAtom(LoginSuccess);
  const setResetSuccess = useSetAtom(ResetSuccess);

  useEffect(() => {
    if (initiateAPI.size === 0) {
      return;
    }
    initiateAPI.forEach((value, key) => {
      if (!activeURLs.has(key)) {
        setActiveURLs((prev) => {
          const curr = new Set(prev);
          curr.add(key);
          return curr;
        });
        fetch(key, {
          method: value.method,
          body: value.body,
          headers:
            key.includes("auth/login") || key.includes("auth/resetPassword")
              ? {
                  "Content-Type": "application/json",
                }
              : undefined,
        }).then((res) => {
          if (res.ok) {
            handleResponse(key, res);
          } else {
            res.text().then((val) => {
              const errMsg = val.slice(1, val.length - 1);
              if (key.includes("auth/login")) {
                notifications.show({
                  position: "top-right",
                  title: "Login Failed",
                  message: "Invalid username or password",
                  color: "red",
                  radius: "md",
                  classNames: {
                    root: "err-ntfn-root",
                  },
                  styles: {
                    body: {
                      margin: "10px",
                    },
                    title: { fontWeight: 600, color: "#922b21" },
                    description: { color: "#943126" },
                  },
                });
              } else {
                notifications.show({
                  position: "top-right",
                  title: "An error occured",
                  message: errMsg,
                  color: "red",
                  radius: "md",
                  classNames: {
                    root: "err-ntfn-root",
                  },
                  styles: {
                    body: {
                      margin: "10px",
                    },
                    title: { fontWeight: 600, color: "#922b21" },
                    description: { color: "#943126" },
                  },
                });
              }
            });
            handleError(key);
          }
        });
      }
    });
    setInitiateAPI(new Map());
  }, [initiateAPI]);

  const handleResponse = useCallback((url: string, res: Response) => {
    res.json().then((data) => {
      if (url.includes("api/Incident/assignmentgroups")) {
        const groups: AssignmentGroupItem[] = Array.isArray(data) ? data : [];
        setAssignmentGroups(
          groups.map((group) => {
            return group.assignmentGroupName;
          })
        );
      } else if (url.includes("api/Incident/categorycountbygroup")) {
        const categories: CategoryItem[] = Array.isArray(data) ? data : [];
        setCategories(categories);
      } else if (url.includes("api/Incident/statuscountbypriority")) {
        const statusList: StatusItem[] = Array.isArray(data) ? data : [];
        setStatusList(statusList);
      } else if (url.includes("api/Incident/nameandcountbypriority?")) {
        setMemberDetailsResponse(data);
      } else if (url.includes("api/Incident/nameandcountbypriority")) {
        setTeamMembers(data?.memberDetails ?? []);
      } else if (url.includes("api/Incident/countbypriority")) {
        setIncidentPrioritySummary(data);
      } else if (url.includes("api/Incident/kpis")) {
        setIncidentSummary(data);
      } else if (url.includes("api/Incident/breachlistbypriority")) {
        if (url.includes(encodeURIComponent("1 - Critical"))) {
          setP1BreachedResponse(data);
        } else if (url.includes(encodeURIComponent("2 - High"))) {
          setP2BreachedResponse(data);
        } else if (url.includes(encodeURIComponent("3 - Moderate"))) {
          setP3BreachedResponse(data);
        } else if (url.includes(encodeURIComponent("4 - Low"))) {
          setP4BreachedResponse(data);
        }
      } else if (url.includes("api/Incident/detailsbypriority")) {
        if (url.includes(encodeURIComponent("1 - Critical"))) {
          setP1IncidentsResponse(data);
        } else if (url.includes(encodeURIComponent("2 - High"))) {
          setP2IncidentsResponse(data);
        } else if (url.includes(encodeURIComponent("3 - Moderate"))) {
          setP3IncidentsResponse(data);
        } else if (url.includes(encodeURIComponent("4 - Low"))) {
          setP4IncidentsResponse(data);
        }
      } else if (url.includes("api/files/history")) {
        setUploadedReportsResponse(data);
      } else if (url.includes("api/auth/resetPassword")) {
        notifications.show({
          title: "Success",
          message: `Password reset successfully!`,
          color: "green",
          radius: "md",
          styles: {
            root: {
              backgroundColor: "#e6ffed",
              border: "1px solid #27ae60",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            },
            title: { fontWeight: 600, color: "#145a32" },
            description: { color: "#196f3d" },
          },
        });
        setResetSuccess(true);
      } else if (url.includes("api/auth/login")) {
        notifications.show({
          title: "Success",
          message: `Logged in successfully!`,
          color: "green",
          radius: "md",
          styles: {
            root: {
              backgroundColor: "#e6ffed",
              border: "1px solid #27ae60",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            },
            title: { fontWeight: 600, color: "#145a32" },
            description: { color: "#196f3d" },
          },
        });
        sessionStorage.setItem("userLoggedIn", "true");
        setLoginSuccess(true);
      } else if (url.includes("api/files/import?uploadHistoryId")) {
        setAssignmentGroups([]);
        setCategories([]);
        setStatusList([]);
        setMemberDetailsResponse(undefined);
        setTab(true);
      } else if (url.includes("api/files/upload")) {
        notifications.show({
          title: "Upload Successful",
          message: `File uploaded successfully!`,
          color: "green",
          radius: "md",
          styles: {
            root: {
              backgroundColor: "#e6ffed",
              border: "1px solid #27ae60",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            },
            title: { fontWeight: 600, color: "#145a32" },
            description: { color: "#196f3d" },
          },
        });
        setReloadUploadedReportsGrid(new Date().getTime());
      }
      setActiveURLs((prev) => {
        const curr = new Set(prev);
        curr.delete(url);
        return curr;
      });
    });
  }, []);

  const handleError = useCallback((url: string) => {
    if (url.includes("api/Incident/assignmentgroups")) {
      setAssignmentGroups([]);
    } else if (url.includes("api/Incident/categorycountbygroup")) {
      setCategories([]);
    } else if (url.includes("api/Incident/statuscountbypriority")) {
      setStatusList([]);
    } else if (url.includes("api/Incident/nameandcountbypriority?")) {
      setMemberDetailsResponse(undefined);
    } else if (url.includes("api/Incident/nameandcountbypriority")) {
      setTeamMembers([]);
    } else if (url.includes("api/Incident/countbypriority")) {
      setIncidentPrioritySummary(undefined);
    } else if (url.includes("api/Incident/kpis")) {
      setIncidentSummary(undefined);
    } else if (url.includes("api/Incident/breachlistbypriority")) {
      if (url.includes(encodeURIComponent("1 - Critical"))) {
        setP1BreachedResponse(undefined);
      } else if (url.includes(encodeURIComponent("2 - High"))) {
        setP2BreachedResponse(undefined);
      } else if (url.includes(encodeURIComponent("3 - Moderate"))) {
        setP3BreachedResponse(undefined);
      } else if (url.includes(encodeURIComponent("4 - Low"))) {
        setP4BreachedResponse(undefined);
      }
    } else if (url.includes("api/Incident/detailsbypriority")) {
      if (url.includes(encodeURIComponent("1 - Critical"))) {
        setP1IncidentsResponse(undefined);
      } else if (url.includes(encodeURIComponent("2 - High"))) {
        setP2IncidentsResponse(undefined);
      } else if (url.includes(encodeURIComponent("3 - Moderate"))) {
        setP3IncidentsResponse(undefined);
      } else if (url.includes(encodeURIComponent("4 - Low"))) {
        setP4IncidentsResponse(undefined);
      }
    } else if (url.includes("api/files/history")) {
      setUploadedReportsResponse(undefined);
    }
    setActiveURLs((prev) => {
      const curr = new Set(prev);
      curr.delete(url);
      return curr;
    });
  }, []);

  return (
    <MantineProvider theme={theme}>
      {
        <MantineProvider theme={theme}>
          <LoadingOverlay
            visible={showLoader}
            zIndex={1000}
            overlayProps={{ blur: 1, fixed: true }}
            classNames={{
              loader: "center-loader",
            }}
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
                  sessionStorage.getItem("userLoggedIn") === "true" ? (
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
