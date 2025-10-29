import React, { useEffect, useMemo, useState } from "react";
import { Accordion, Input } from "@mantine/core";
import "./CriticalIncidentsList.css";
import { BsSortDown, BsSortUp } from "react-icons/bs";
import backward from "../../assets/backward.png";
import forward from "../../assets/forward.png";
import { useAtomValue } from "jotai";
import { buildFilterQuery } from "../../utils/queryBuilder";
import { appliedFilter } from "../../store/filterStore";

const incidentsData = [
  {
    id: "INC2233999",
    description: "Network Outage at Data Center 3.",
    category: "Ecom Systems",
    priority: "P1",
    resolution: "Network connectivity restored; root cause analysis ongoing.",
    state: "Closed",
    resolvedDate: "9/2/2025",
    resolvedTime: "11:22:33 AM",
  },
  {
    id: "INC2233988",
    description: "Database Server Overload.",
    category: "Ecom Systems",
    priority: "P1",
    resolution: "Server rebooted; investigating memory leak.",
    state: "Open",
    resolvedDate: "9/2/2025",
    resolvedTime: "10:11:22 AM",
  },
  {
    id: "INC2233987",
    description: "Payment Gateway Failure.",
    category: "Finance",
    priority: "P2",
    resolution: "Service Restored; applied hotfix.",
    state: "In progress",
    resolvedDate: "9/2/2025",
    resolvedTime: "09:00:11 AM",
  },
  {
    id: "INC2233986",
    description: "DDoS Attack on Web Servers.",
    category: "Security",
    priority: "P2",
    resolution: "Implemented rate limiting; traffic normalized.",
    state: "On hold",
    resolvedDate: "9/2/2025",
    resolvedTime: "07:55:00 AM",
  },
  {
    id: "INC2233985",
    description: "Critical System Upgrade Failure.",
    category: "Infrastructure",
    priority: "P3",
    resolution: "Rolled back to previous version; investigating root cause.",
    state: "Reopen",
    resolvedDate: "9/2/2025",
    resolvedTime: "06:44:36 AM",
  },
  {
    id: "INC2233984",
    description: "Data Corruption in Production DB.",
    category: "Ecom Systems",
    priority: "P1",
    resolution: "Restored from backup; running consistency checks.",
    state: "In progress",
    resolvedDate: "9/2/2025",
    resolvedTime: "05:33:44 AM",
  },
  {
    id: "INC2233993",
    description: "Unexpected Server Shutdown.",
    category: "Finance",
    priority: "P3",
    resolution: "Server restarted; checking hardware logs.",
    state: "On hold",
    resolvedDate: "9/2/2025",
    resolvedTime: "04:22:33 AM",
  },
  {
    id: "INC2233992",
    description: "SSL Certificate Expired.",
    category: "Security",
    priority: "P2",
    resolution: "Renewed certificate; services restored.",
    state: "Closed",
    resolvedDate: "9/2/2025",
    resolvedTime: "03:11:22 AM",
  },
  {
    id: "INC2233991",
    description: "Hardware Failure.",
    category: "Infrastructure",
    priority: "P4",
    resolution: "Replaced faulty hardware.",
    state: "Closed",
    resolvedDate: "9/2/2025",
    resolvedTime: "02:00:00 AM",
  },
  {
    id: "INC2233990",
    description: "Minor UI Bug.",
    category: "Ecom Systems",
    priority: "P4",
    resolution: "Fixed in hotfix release.",
    state: "Closed",
    resolvedDate: "9/2/2025",
    resolvedTime: "01:00:00 AM",
  },
];

const ALL_PRIORITIES_KEY = "All Incidents";

const getPriorityDisplayValue = (code: string) => {
  const mapping: Record<string, string> = {
    P1: "Critical",
    P2: "High",
    P3: "Moderate",
    P4: "Low",
  };
  return `${code}- ${mapping[code] || "Priority"}`;
};

interface Incident {
  incidentNo: string;
  description: string;
  category: string;
  resolutionNotes: string;
  state: string;
  resolvedDateTime: string;
}

interface ApiResponse {
  pagination: any;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  incidents: Incident[];
}

const CriticalIncidentsList: React.FC = () => {


  const appliedFilters = useAtomValue(appliedFilter);

  // 🪣 React state
  const [ApiResponse, setApiResponse] = useState<ApiResponse | null>(null);

  // 🧭 Pagination/sorting/metrics state
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<string | null>("Alphabetical");
  const [sortOrder, setSortOrder] = useState<string | null>("ascending");
  const [metricsUnit, setMetricsUnit] = useState("Weeks");

  // 📡 Fetch data from API
  useEffect(() => {
    const fetchMemberSummary = async () => {
      try {
        const query = buildFilterQuery(appliedFilters);
        const url = query
          ? `http://localhost:5092/api/Incident/detailsbypriority?${query}`
          : `http://localhost:5092/api/Incident/detailsbypriority`;
        console.log("Critical incident URL:", url);

        const response = await fetch(url);
        const data: ApiResponse = await response.json();



        setApiResponse(data);
      } catch (error) {
        console.error("Error fetching member summary:", error);
        setApiResponse(null);
      }
    };

    fetchMemberSummary();
  }, [appliedFilters, pageNumber, pageSize, sortBy, sortOrder, metricsUnit]);




  const dynamicPriorityCodes = useMemo(() => {
    const codes = Array.from(new Set(incidentsData.map((d) => d.priority)));
    codes.sort((a, b) => parseInt(a.substring(1)) - parseInt(b.substring(1)));
    return codes;
  }, []);

  const dynamicPriorityLevels = dynamicPriorityCodes.map((code) => ({
    value: getPriorityDisplayValue(code),
    code,
  }));

  const [activePriority, setActivePriority] = useState<string | null>(
    ALL_PRIORITIES_KEY
  );

  const handleAccordionChange = (value: string | null) => {
    setActivePriority(value);
  };

  return (
    <div className="incident-dashboard">
      <h1 className="dashboard-title">Critical Incidents List</h1>

      {/* Tabs */}
      <div className="filter-tabs">
        <button
          className={`tab-button ${activePriority === ALL_PRIORITIES_KEY ? "active" : ""
            }`}
          onClick={() => setActivePriority(ALL_PRIORITIES_KEY)}
        >
          All Incidents ({incidentsData.length})
        </button>

        {dynamicPriorityLevels.map((p) => (
          <button
            key={p.code}
            className={`tab-button ${activePriority === p.value ? "active" : ""
              }`}
            onClick={() => setActivePriority(p.value)}
          >
            {p.value} ({incidentsData.filter((d) => d.priority === p.code).length})
          </button>
        ))}
      </div>

      {/* Accordion */}
      <div className="incident-section">
        <Accordion
          chevronPosition="right"
          value={activePriority}
          onChange={handleAccordionChange}
        >
          {/* All incidents */}
          <Accordion.Item value={ALL_PRIORITIES_KEY}>
            <Accordion.Control>
              {ALL_PRIORITIES_KEY} ({incidentsData.length})
            </Accordion.Control>
            <Accordion.Panel>
              <IncidentTable incidents={incidentsData} />
            </Accordion.Panel>
          </Accordion.Item>

          {/* Dynamic priorities */}
          {dynamicPriorityLevels.map((priority) => {
            const priorityIncidents = incidentsData.filter(
              (i) => i.priority === priority.code
            );
            return (
              <Accordion.Item key={priority.code} value={priority.value}>
                <Accordion.Control>
                  {priority.value} ({priorityIncidents.length})
                </Accordion.Control>
                <Accordion.Panel>
                  <IncidentTable incidents={priorityIncidents} />
                </Accordion.Panel>
              </Accordion.Item>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
};

export default CriticalIncidentsList;

const IncidentTable: React.FC<{ incidents: any[] }> = ({ incidents }) => {
  return (
    <div className="incident-table-container">
      {/* Search box (static, no logic) */}
      <Input
        classNames={{
          wrapper: "my-input-wrapper",
          input: "my-input-element",
        }}
        placeholder="Search incidents..."
      />

      {/* Header */}
      <div className="incident-row header-row">
        <span className="col-incident-no">
          Incident no <BsSortUp size={14} />
        </span>
        <span className="col-description">
          Description <BsSortUp size={14} />
        </span>
        <span className="col-category">
          Category <BsSortUp size={14} />
        </span>
        <span className="col-resolution">
          Resolution notes <BsSortUp size={14} />
        </span>
        <span className="col-state">
          State <BsSortUp size={14} />
        </span>
        <span className="col-resolved-date">
          Resolved Date & Time <BsSortUp size={14} />
        </span>
      </div>

      {/* Body */}
      <div className="incident-body">
        {incidents.map((incident) => (
          <div key={incident.id} className="incident-row data-row">
            <span className="col-incident-no">{incident.id}</span>
            <span className="col-description">{incident.description}</span>
            <span className="col-category">{incident.category}</span>
            <span className="col-resolution">{incident.resolution}</span>
            <span
              className={`col-state state-${incident.state
                .toLowerCase()
                .replace(" ", "-")}`}
            >
              {incident.state}
            </span>
            <span className="col-resolved-date">
              {incident.resolvedDate}
              <br />
              {incident.resolvedTime}
            </span>
          </div>
        ))}
      </div>

      {/* Pagination UI (static, no logic) */}
      <div className="pagination-footer">
        <span>Showing 1-10 of {incidents.length} Total Incidents</span>
        <div className="pagination-controls">
          <button style={{ borderRadius: "6px 0 0 6px" }}>
            <img src={forward} alt="" />
            <img src={forward} alt="" />
          </button>
          <button>
            <img src={forward} alt="" />
          </button>
          <button>
            <img src={backward} alt="" />
          </button>
          <button style={{ borderRadius: "0 6px 6px 0" }}>
            <img src={backward} alt="" />
            <img src={backward} alt="" />
          </button>
        </div>
      </div>
    </div>
  );
};
