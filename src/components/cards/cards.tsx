import "./cards.css";
import clock from '../../assets/clock.png';
import check from '../../assets/check.png';
import arrow from '../../assets/arrow.png';
import redarrow from '../../assets/redarrow.png';
import { useMemo } from "react";
import IncidentChart from "./IncidentChart"; // Assuming this is your P1 Chart component
import { Incident, incidentsData } from '../data/incidents';
import DonutChart from "./donutChart";
import PieChartWithExplosion from "./PieChartWithExplosion";
import AreaChartSection from "./areaChart";
import LineChart from "./lineChart";
import totalincidenticon from '../../assets/total_incident_icon.png';
import openicon from '../../assets/open_icon.png';
import inprogress from '../../assets/inprogress_icon.png';
import closedicon from '../../assets/closed_icon.png';
import { useAtomValue } from "jotai";
import { filterState } from "../../store/filterStore";


  


// --- Data Definition (Used in this file) ---


// --- Utility Function to Aggregate Summary Cards Data ---

function getIncidentSummary(data: any[]) {
    const summary = {
        total: data.length,
        open: 0,
        inProgress: 0,
        closed: 0,
        p1: 0,
        p2: 0,
        p3: 0,
        p4: 0,
    };

    data.forEach(incident => {
        const state = incident.state.toLowerCase();
        const priority = incident.priority.toLowerCase();

        // State Counts
        if (state === 'open') summary.open++;
        if (state === 'in progress') summary.inProgress++;
        if (state === 'closed') summary.closed++;

        // Priority Counts
        if (priority === 'p1') summary.p1++;
        if (priority === 'p2') summary.p2++;
        if (priority === 'p3') summary.p3++;
        if (priority === 'p4') summary.p4++;
    });

    return summary;
}

// --- Component Definition ---
export default function Cards() {
const filterOpened = useAtomValue(filterState);
    const summary = useMemo(() => getIncidentSummary(incidentsData), []);

    return (
        <div className={`dashboard-container ${filterOpened ? "opened" : "closed"}`}>
            {/* first div */}
            <div  className={`first-div ${filterOpened ? "full" : "compact"}`}>
                <div className="summary-cards">
                    {/* Total Incidents Card */}
                    <div className="card incident">
                        <div className="card-icon incident">
                            <img className="icon-property" src={totalincidenticon} alt="" />
                        </div>
                        <div className="card-content">
                            <h3>Total Incident</h3>
                            <p>{summary.total}</p> {/* DYNAMIC VALUE */}
                        </div>
                    </div>

                    {/* Open Incidents Card */}
                    <div className="card open">
                        <div className="card-icon open">
                            <img className="icon-property" src={openicon} alt="" />
                        </div>
                        <div className="card-content">
                            <h3>Open</h3>
                            <p>{summary.open} <img src={arrow} className="card-status-dot" alt="Up trend" /></p> {/* DYNAMIC VALUE */}
                        </div>
                    </div>

                    {/* In Progress Incidents Card */}
                    <div className="card progress">
                        <div className="card-icon progress">
                            <img className="icon-property" src={inprogress} alt="" />
                        </div>
                        <div className="card-content">
                            <h3>In progress</h3>
                            <p>{summary.inProgress} <img src={arrow} className="card-status-dot" alt="Up trend" /></p> {/* DYNAMIC VALUE */}
                        </div>
                    </div>

                    <div className="card closed">
                        <div className="card-icon closed">
                            <img className="icon-property" src={closedicon} alt="" />
                        </div>
                        <div className="card-content">
                            <h3>Closed</h3>
                            <p>{summary.closed} <img src={redarrow} className="card-status-dot" alt="Down trend" /></p> {/* DYNAMIC VALUE */}
                        </div>
                    </div>
                </div>

                {/* INCIDENT PRIORITY// */}
                <div>

                    <div className="incident-priority-header">
                        <h2>Incident Priority</h2>
                        <div className="metrics-dropdown">
                            <span style={{ fontWeight: '600' }}> Metrics in:</span>
                            <select style={{ fontWeight: '500' }}>
                                <option>Weeks</option>
                                <option>Days</option>
                                <option>Months</option>
                            </select>
                        </div>
                    </div>
                    <div className={`priority-container ${filterOpened ? "" : "compact-priority"}`} style={{ backgroundColor: '#f5f6fa', borderRadius: '12px' }}>
                        <div className="priority-summary">
                            <div className="priority-item">
                                <h3>P1-Critical</h3>
                                <p>{summary.p1}</p> {/* DYNAMIC VALUE */}
                            </div>
                            <div className="priority-item">
                                <h3>P2-High</h3>
                                <p>{summary.p2}</p> {/* DYNAMIC VALUE */}
                            </div>
                            <div className="priority-item">
                                <h3>P3-Moderate</h3>
                                <p>{summary.p3}</p> {/* DYNAMIC VALUE */}
                            </div>
                            <div className="priority-item">
                                <h3>P4-Low</h3>
                                <p>{summary.p4}</p> {/* DYNAMIC VALUE */}
                            </div>
                            <div className="priority-item avg-resolved">
                                <div>
                                    <h3>Avg Resolved Time</h3>
                                    <p>4132 <small>Weeks</small><img src={arrow} className="card-status-dot" style={{ marginLeft: '10px', marginTop: '5px' }} alt="Up trend" /></p>
                                </div>
                                <span className="card-status-dot green"></span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>



            {/* --- INCIDENT PRIORITY SECTION (DYNAMIC PRIORITY COUNTS) --- */}
            <div className={`incident-priority-section ${filterOpened ? "full" : "expanded"}`}>


                {/* --- CHARTS GRID --- */}
                <div className="charts-grid">
                    {/* P1 Chart (Bar Chart) */}
                    <div className="chart-card">
                        {/* IncidentChart assumes it internally targets P1 based on previous discussion */}
                        <IncidentChart />
                    </div>

                    {/* P2 Chart (Doughnut Chart - remains static for now) */}
                    <div className="chart-card">
                        <h3>P2- High ({summary.p2})</h3> {/* DYNAMIC VALUE */}
                        {/* ... (Static Doughnut Chart JSX) ... */}
                        <div className="chart-doughnut-container doughnut-p2">
                            <PieChartWithExplosion />
                        </div>
                    </div>

                    {/* P3 Chart (Line Chart - remains static for now) */}
                    <div className="chart-card">
                        <h3>P3- Moderate ({summary.p3})</h3> {/* DYNAMIC VALUE */}
                        {/* ... (Static Line Chart JSX) ... */}
                        <div className="chart-line-container">
                            {/* <AreaChartSection/> */}
                            <LineChart />

                        </div>
                    </div>

                    {/* P4 Chart (Doughnut Chart - remains static for now) */}
                    <div className="chart-card">
                        <h3>P4- Low ({summary.p4})</h3>
                        {/* ... (Static Doughnut Chart JSX) ... */}
                        <div className="chart-doughnut-container">
                            <DonutChart></DonutChart>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}