import { LoadingOverlay } from "@mantine/core";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import closedicon from "../../assets/closed_icon.png";
import inprogress from "../../assets/inprogress_icon.png";
import openicon from "../../assets/open_icon.png";
import totalincidenticon from "../../assets/total_incident_icon.png";
import { appliedFilter, filterState } from "../../store/filterStore";
import { buildFilterQuery } from "../../utils/queryBuilder";
import { PriorityList } from "./cards.constants";
import "./cards.css";
import { IncidentPrioritySummary, IncidentSummary } from "./cards.interface";
import IncidentCountCard from "./incident-count-card/incident-count-card";
import IncidentPriorityDetailsCard from "./incident-priority-details-card/incident-priority-details-card";

export default function Cards() {
  const filterOpened = useAtomValue(filterState);
  const appliedFilters = useAtomValue(appliedFilter);

  const [incidentSummary, setIncidentSummary] =
    useState<IncidentSummary | null>(null);
  const [incidentPrioritySummary, setIncidentPrioritySummary] =
    useState<IncidentPrioritySummary | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [loadingPriority, setLoadingPriority] = useState<boolean>(true);

  // Fetch KPI summary
  useEffect(() => {
    setLoading(true);
    const query = buildFilterQuery(appliedFilters);
    const url = query
      ? `http://localhost:5092/api/Incident/kpis?${query}`
      : `http://localhost:5092/api/Incident/kpis`;

    fetch(url)
      .then((res) => {
        res.json().then((data: IncidentSummary) => {
          setIncidentSummary(data);
        });
      })
      .catch((err) => {
        console.error("Error fetching incident summary:", err);
        setIncidentSummary(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [appliedFilters]);

  // Fetch incident priority summary
  useEffect(() => {
    setLoadingPriority(true);
    const query = buildFilterQuery(appliedFilters);
    const url = `http://localhost:5092/api/Incident/countbypriority?${query}`;
    fetch(url)
      .then((res) => {
        res.json().then((data: IncidentPrioritySummary) => {
          setIncidentPrioritySummary(data);
        });
      })
      .catch((err) => {
        console.error("Error fetching incident priority summary:", err);
        setIncidentPrioritySummary(null);
      })
      .finally(() => {
        setLoadingPriority(false);
      });
  }, [appliedFilters]);

  return (
    <div className="dashboard-container opened">
      <div className={`first-div ${filterOpened ? "full" : "compact"}`}>
        <div className="summary-cards">
          <LoadingOverlay
            visible={loading}
            zIndex={1000}
            overlayProps={{ blur: 1 }}
          />

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
        </div>

        <div style={{ backgroundColor: "#fff" }}>
          <div className="incident-priority-header">
            <h2>Incident Priority</h2>
          </div>
          <LoadingOverlay
            visible={loadingPriority}
            zIndex={1000}
            overlayProps={{ blur: 1 }}
          />
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
