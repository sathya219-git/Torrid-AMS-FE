import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import closedicon from "../../assets/closed_icon.png";
import dangerous from "../../assets/dangerous.png";
import folder from "../../assets/folder.png";
import inprogress from "../../assets/inprogress_icon.png";
import totalincidenticon from "../../assets/total_incident_icon.png";
import {
  appliedFilter,
  CountByPriority,
  filterState,
  InitiateAPI,
  KPIs,
} from "../../store/filterStore";
import { buildFilterQuery } from "../../utils/queryBuilder";
import AssignmentGroupDetails from "../AssignmentGroupDetails/AssignmentGroupDetails";
import "./cards.css";
import IncidentCountCard from "./incident-count-card/incident-count-card";

export default function Cards() {
  const filterOpened = useAtomValue(filterState);
  const appliedFilters = useAtomValue(appliedFilter);

  const incidentSummary = useAtomValue(KPIs);

  const incidentPrioritySummary = useAtomValue(CountByPriority);

  const initiateAPI = useSetAtom(InitiateAPI);
  const colors = [
    "#4379ee6c",
    "#2BCB4329",
    "#f15f6149",
    "#08D0F429",
    "#F9F0CC",
    "#EBD7FD",
    "#DAE0F7",
    "#D7EBFD",
    "#EDEFF6",
    "#FFE6D6",
    "#e2f9ccff",
    "#2862b929",
  ];

  // Fetch KPI summary
  useEffect(() => {
    const query = buildFilterQuery(appliedFilters);
    const url = query
      ? `http://localhost:5092/api/Incident/kpis?${query}`
      : `http://localhost:5092/api/Incident/kpis`;

    initiateAPI((prev) => {
      const curr = new Map(prev);
      curr.set(url, {
        method: "GET",
        body: null,
      });
      return curr;
    });
  }, [appliedFilters]);

  // Fetch incident priority summary
  useEffect(() => {
    const query = buildFilterQuery(appliedFilters);
    const url = `http://localhost:5092/api/Incident/countbypriority?${query}`;
    initiateAPI((prev) => {
      const curr = new Map(prev);
      curr.set(url, {
        method: "GET",
        body: null,
      });
      return curr;
    });
  }, [appliedFilters]);

  return (
    <div className="dashboard-container opened">
      <div className={`first-div ${filterOpened ? "full" : "compact"}`}>
        <div className={`summary-cards ${filterOpened ? "full" : "compact"}`}>
          {incidentSummary &&
            Object.entries(incidentSummary).map(([key, value], idx) => {
              let label = key.replace(/([A-Z])/g, " $1");

              // custom overrides
              if (key === "openLess15Days") label = "<= 15 Days";
              if (key === "openMore15Days") label = "> 15 Days";
              if (key === "totalIncidents") label = "Total Incidents";
              if (key === "breachedCount") label = "Breached Incident";
              if (key === "openCount") label = "Open";

              return (
                <IncidentCountCard
                  key={key}
                  bgColor={colors[idx % colors.length]}
                  label={label}
                  incidentCount={value as number}
                />
              );
            })}
        </div>
        <div>
          <AssignmentGroupDetails></AssignmentGroupDetails>
        </div>
      </div>
    </div>
  );
}
{
  /* <IncidentCountCard
  cssClass="open"
  iconSrc={folder}
  label="Open"
  incidentCount={incidentSummary?.openIncidents ?? 0}
/>; */
}
