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
  BreachedResponse,
  categories,
  CountByPriority,
  groups,
  IncidentsResponse,
  InitiateAPI,
  KPIs,
  status,
  TeamMemberDetails,
  teamMembers,
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
  const setIncidentsResponse = useSetAtom(IncidentsResponse);
  const setBreachedResponse = useSetAtom(BreachedResponse);

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
        }).then((res) => {
          if (res.ok) {
            handleResponse(key, res);
          } else {
            notifications.show({
              position: "top-right",
              title: "An error occured",
              message: res.statusText,
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
        setBreachedResponse(data);
      } else if (url.includes("api/Incident/detailsbypriority")) {
        setIncidentsResponse(data);
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
      setBreachedResponse(undefined);
    } else if (url.includes("api/Incident/detailsbypriority")) {
      setIncidentsResponse(undefined);
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
