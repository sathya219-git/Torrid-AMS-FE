import "./cards.css";
import { useMemo, useState, useEffect } from "react";
import IncidentChart from "./IncidentChart";
import DonutChart from "./donutChart";
import PieChartWithExplosion from "./PieChartWithExplosion";
import LineChart from "./lineChart";
import totalincidenticon from "../../assets/total_incident_icon.png";
import openicon from "../../assets/open_icon.png";
import inprogress from "../../assets/inprogress_icon.png";
import closedicon from "../../assets/closed_icon.png";
import { useAtomValue } from "jotai";
import { filterState, appliedFilter } from "../../store/filterStore";
import { buildFilterQuery } from "../../utils/queryBuilder";
import { incidentsData } from "../data/incidents";

export default function Cards() {
    interface PriorityStats {
        totalCount: number;
        open: number;
        inProgress: number;
        closed: number;
        onHold: number;
        reopen: number;
        resolved: number;
    }

    interface IncidentPrioritySummary {
        priority: Record<string, PriorityStats[]>;
        totalAverageResolvedTime: string;
    }

    interface IncidentSummary {
        totalIncidents: number;
        openIncidents: number;
        inProgressIncidents: number;
        closedIncidents: number;
    }

    const filterOpened = useAtomValue(filterState);
    const appliedFilters = useAtomValue(appliedFilter);

    const [incidentSummary, setIncidentSummary] = useState<IncidentSummary | null>(null);
    const [incidentPrioritySummary, setIncidentPrioritySummary] = useState<IncidentPrioritySummary | null>(null);

    // ✅ new state for metric selection
    const [metrics, setMetrics] = useState<string>("Weeks");

    // Fetch KPIs summary
    useEffect(() => {
        const fetchIncidentSummary = async () => {
            try {
                const query = buildFilterQuery(appliedFilters);
                const url = query
                    ? `http://localhost:5092/api/Incident/kpis?${query}`
                    : `http://localhost:5092/api/Incident/kpis`;

                const response = await fetch(url);
                const data: IncidentSummary = await response.json();
                console.log("kpis URL:", url);
                setIncidentSummary(data);
            } catch (error) {
                console.error("Error fetching incident summary:", error);
                setIncidentSummary(null);
            }
        };
        fetchIncidentSummary();
    }, [appliedFilters]);

    // ✅ Fetch incident count by priority (depends on filters + metrics)
    useEffect(() => {
        const fetchIncidentPrioritySummary = async () => {
            try {
                const query = buildFilterQuery(appliedFilters);
                const queryWithMetric = query ? `${query}&metrics=${metrics}` : `metrics=${metrics}`;

                const url = `http://localhost:5092/api/Incident/countbypriority?${queryWithMetric}`;
                console.log("Incident priority URL:", url);

                const response = await fetch(url);
                const data: IncidentPrioritySummary = await response.json();

                setIncidentPrioritySummary(data);
            } catch (error) {
                console.error("Error fetching incident priority summary:", error);
                setIncidentPrioritySummary(null);
            }
        };

        fetchIncidentPrioritySummary();
    }, [appliedFilters, metrics]); // ✅ triggers again when metrics change

    const summary = useMemo(() => {
        const result = {
            total: incidentsData.length,
            open: 0,
            inProgress: 0,
            closed: 0,
            p1: 0,
            p2: 0,
            p3: 0,
            p4: 0,
        };
        incidentsData.forEach((incident) => {
            const state = incident.state.toLowerCase();
            const priority = incident.priority.toLowerCase();
            if (state === "open") result.open++;
            if (state === "in progress") result.inProgress++;
            if (state === "closed") result.closed++;
            if (priority === "p1") result.p1++;
            if (priority === "p2") result.p2++;
            if (priority === "p3") result.p3++;
            if (priority === "p4") result.p4++;
        });
        return result;
    }, []);

    return (
        <div className={`dashboard-container ${filterOpened ? "opened" : "closed"}`}>
            {/* ---- TOP CARDS ---- */}
            <div className={`first-div ${filterOpened ? "full" : "compact"}`}>
                <div className="summary-cards">
                    <div className="card incident">
                        <div className="card-icon incident">
                            <img className="icon-property" src={totalincidenticon} alt="" />
                        </div>
                        <div className="card-content">
                            <h3>Total Incident</h3>
                            <p>{incidentSummary?.totalIncidents}</p>
                        </div>
                    </div>

                    <div className="card open">
                        <div className="card-icon open">
                            <img className="icon-property" src={openicon} alt="" />
                        </div>
                        <div className="card-content">
                            <h3>Open</h3>
                            <p>{incidentSummary?.openIncidents}</p>
                        </div>
                    </div>

                    <div className="card progress">
                        <div className="card-icon progress">
                            <img className="icon-property" src={inprogress} alt="" />
                        </div>
                        <div className="card-content">
                            <h3>In progress</h3>
                            <p>{incidentSummary?.inProgressIncidents}</p>
                        </div>
                    </div>

                    <div className="card closed">
                        <div className="card-icon closed">
                            <img className="icon-property" src={closedicon} alt="" />
                        </div>
                        <div className="card-content">
                            <h3>Closed</h3>
                            <p>{incidentSummary?.closedIncidents}</p>
                        </div>
                    </div>
                </div>

                {/* ---- INCIDENT PRIORITY HEADER ---- */}
                <div>
                    <div className="incident-priority-header">
                        <h2>Incident Priority</h2>
                        <div className="metrics-dropdown">
                            <span style={{ fontWeight: "600" }}> Metrics in:</span>
                            <select
                                value={metrics}
                                onChange={(e) => setMetrics(e.target.value)} // ✅ trigger re-fetch
                                style={{ fontWeight: "500" }}
                            >
                                <option value="Weeks">Weeks</option>
                                <option value="Days">Days</option>
                                <option value="Months">Months</option>
                            </select>
                        </div>
                    </div>

                    {/* ---- PRIORITY SUMMARY ---- */}
                    <div
                        className={`priority-container ${filterOpened ? "" : "compact-priority"}`}
                        style={{ backgroundColor: "#f5f6fa", borderRadius: "12px" }}
                    >
                        <div className="priority-summary">
                            <div className="priority-item">
                                <h3>P1-Critical</h3>
                                <p>{incidentPrioritySummary?.priority["1 - Critical"]?.[0]?.totalCount ?? 0}</p>
                            </div>
                            <div className="priority-item">
                                <h3>P2-High</h3>
                                <p>{incidentPrioritySummary?.priority["2 - High"]?.[0]?.totalCount ?? 0}</p>
                            </div>
                            <div className="priority-item">
                                <h3>P3-Moderate</h3>
                                <p>{incidentPrioritySummary?.priority["3 - Moderate"]?.[0]?.totalCount ?? 0}</p>
                            </div>
                            <div className="priority-item">
                                <h3>P4-Low</h3>
                                <p>{incidentPrioritySummary?.priority["4 - Low"]?.[0]?.totalCount ?? 0}</p>
                            </div>

                            {/* ✅ Dynamic Avg Resolved Time */}
                            <div className="priority-item avg-resolved">
                                <div>
                                    <h3>Avg Resolved Time</h3>
                                    <p>
                                        {(() => {
                                            const timeText = incidentPrioritySummary?.totalAverageResolvedTime ?? "0 weeks";
                                            const [value, unit] = timeText.split(" ");
                                            return (
                                                <>
                                                    {value} <small>{unit}</small>
                                                </>
                                            );
                                        })()}
                                    </p>
                                </div>
                                <span className="card-status-dot green"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ---- CHARTS SECTION ---- */}
            <div className={`incident-priority-section ${filterOpened ? "full" : "expanded"}`}>
                <div className="charts-grid">
                    <div className="chart-card">
                        <h3>P1- Critical ({incidentPrioritySummary?.priority["1 - Critical"]?.[0]?.totalCount ?? 0})</h3>
                        <IncidentChart />
                    </div>

                    <div className="chart-card">
                        <h3>P2- High ({incidentPrioritySummary?.priority["2 - High"]?.[0]?.totalCount ?? 0})</h3>
                        <div className="chart-doughnut-container doughnut-p2">
                            <PieChartWithExplosion />
                        </div>
                    </div>

                    <div className="chart-card">
                        <h3>P3- Moderate ({incidentPrioritySummary?.priority["3 - Moderate"]?.[0]?.totalCount ?? 0})</h3>
                        <div className="chart-line-container">
                            <LineChart />
                        </div>
                    </div>

                    <div className="chart-card">
                        <h3>P4- Low ({incidentPrioritySummary?.priority["4 - Low"]?.[0]?.totalCount ?? 0})</h3>
                        <div className="chart-doughnut-container">
                            <DonutChart />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
