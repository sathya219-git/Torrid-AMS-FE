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
        <div className="summary-cards">
          <IncidentCountCard
            cssClass="incident"
            iconSrc={totalincidenticon}
            label="Total Incidents"
            incidentCount={incidentSummary?.totalIncidents ?? 0}
          />
          <IncidentCountCard
            cssClass="open"
            iconSrc={folder}
            label="Open"
            incidentCount={incidentSummary?.openIncidents ?? 0}
          />
          <IncidentCountCard
            cssClass="progress"
            iconSrc={inprogress}
            label="In Progress"
            incidentCount={incidentSummary?.inProgressIncidents ?? 0}
          />
          <IncidentCountCard
            cssClass="closed"
            iconSrc={closedicon}
            label="Closed"
            incidentCount={incidentSummary?.closedIncidents ?? 0}
          />
          <IncidentCountCard
            cssClass="breach"
            iconSrc={dangerous}
            label="Breach List"
            incidentCount={incidentSummary?.breachedCount ?? 0}
          />  
        </div>
        <div>
          <AssignmentGroupDetails></AssignmentGroupDetails>
        </div>

        
      </div>
    </div>
  );
}
