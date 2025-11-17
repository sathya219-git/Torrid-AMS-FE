import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import closedicon from "../../assets/closed_icon.png";
import inprogress from "../../assets/inprogress_icon.png";
import warning from "../../assets/warning.png";
import openicon from "../../assets/open_icon.png";
import totalincidenticon from "../../assets/total_incident_icon.png";
import {
  appliedFilter,
  CountByPriority,
  filterState,
  InitiateAPI,
  KPIs,
} from "../../store/filterStore";
import { buildFilterQuery } from "../../utils/queryBuilder";
import { PriorityList } from "./cards.constants";
import "./cards.css";
import IncidentCountCard from "./incident-count-card/incident-count-card";
import IncidentPriorityDetailsCard from "./incident-priority-details-card/incident-priority-details-card";

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
            iconSrc={openicon}
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
            iconSrc={warning}
            label="Breach List"
            incidentCount={incidentSummary?.inProgressIncidents ?? 0}
          />
        </div>

        <div style={{ backgroundColor: "#fff" }}>
          <div className="incident-priority-header">
            <h2>Incident Priority</h2>
          </div>
          <div className="priority-container" style={{ borderRadius: "12px" }}>
            <div className="priority-summary">
              {PriorityList.map(({ key, value }) => {
                const priorityData = incidentPrioritySummary?.priority[key];
                const stats = priorityData?.details?.[0];
                return (
                  <IncidentPriorityDetailsCard
                    key={key}
                    label={value}
                    totalResolvedTime={priorityData?.totalResolvedTime ?? "—"}
                    avgResolvedTime={priorityData?.avgResolvedTime ?? "—"}
                    stats={stats}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
