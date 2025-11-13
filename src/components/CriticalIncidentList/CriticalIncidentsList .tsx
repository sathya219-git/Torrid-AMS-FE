import React, { useEffect, useState } from "react";
import { Accordion, Input, Table } from "@mantine/core";
import "./CriticalIncidentsList.css";
import { BsSortUp, BsSortDown } from "react-icons/bs";
import backward from "../../assets/backward.png";
import forward from "../../assets/forward.png";
import { useAtom, useAtomValue } from "jotai";
import {
  buildFilterQuery,
  buildIncidentsQuery,
} from "../../utils/queryBuilder";
import {
  appliedFilter,
  incidentAPIRequests,
  incidentAPIResponses,
} from "../../store/filterStore";
import { Incident } from "../../store/filter-store.interface";

const CriticalIncidentsList: React.FC = () => {
  const appliedFilters = useAtomValue(appliedFilter);
  const incidentAPIReqs = useAtomValue(incidentAPIRequests);
  const [incidentAPIResList, setIncidentAPIResList] =
    useAtom(incidentAPIResponses);

  const [tabs, setTabs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("All Incidents");
  const [tabCounts, setTabCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const entry = Object.entries(incidentAPIReqs).find(
      (entry) => entry[0] === activeTab
    );
    if (entry) {
      const params = buildIncidentsQuery(
        appliedFilters,
        entry[1]
      );
      fetch(
        `http://localhost:5092/api/Incident/detailsbypriority?${params}`
      ).then((res) => {
        res.json().then((data) => {
          setIncidentAPIResList((prev) => {
            const curr = { ...prev };
            curr[activeTab] = data;
            return curr;
          });
        });
      });
    }
  }, [incidentAPIReqs, appliedFilters, activeTab]);

  useEffect(() => {
    Object.keys(incidentAPIReqs).forEach((key) => {
      
      const filters = buildFilterQuery(appliedFilters);
      const priority = encodeURIComponent(key);
      const url =
        key === "All Incidents"
          ? `http://localhost:5092/api/Incident/detailsbypriority?PageSize=1&${filters}&Search=${incidentAPIReqs[key].Search}`
          : `http://localhost:5092/api/Incident/detailsbypriority?Priority=${priority}&Search=${incidentAPIReqs[key].Search}&PageSize=1&${filters}`;
      fetch(url).then((res) => {
        res.json().then((data) => {
          setTabCounts((prev) => {
            const curr = { ...prev };
            curr[key] = data.totalElements ?? 0;
            return curr;
          });
        });
      });
    });
  }, [incidentAPIReqs, appliedFilters]);

  useEffect(() => {
    setTabs(Object.keys(incidentAPIReqs));
  }, [incidentAPIReqs]);

  const handleAccordionChange = (value: string | null) => {
    setActiveTab(value ?? "");
  };

  return (
    <div className="incident-dashboard">
      <h1 className="dashboard-title">Incidents List</h1>

      <div className="filter-tabs">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {index === 0 ? tab : `P${tab}`} ({tabCounts[tab] ?? 0})
          </button>
        ))}
      </div>

      <div className="incident-section">
        <Accordion
          chevronPosition="right"
          value={activeTab}
          onChange={handleAccordionChange}
        >
          {tabs.map((tab, index) => (
            <Accordion.Item key={tab} value={tab}>
              <Accordion.Control>
                {index === 0 ? tab : `P${tab}`} ({tabCounts[tab] ?? 0})
              </Accordion.Control>
              <Accordion.Panel>
                <IncidentTable
                  tab={tab}
                  incidents={incidentAPIResList[tab]?.incidents ?? []}
                  totalElements={incidentAPIResList[tab]?.totalElements ?? 0}
                  totalPages={incidentAPIResList[tab]?.totalPages ?? 0}
                />
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default CriticalIncidentsList;

const IncidentTable: React.FC<{
  tab: string;
  incidents: Incident[];
  totalElements: number;
  totalPages: number;
}> = ({ tab, incidents, totalElements, totalPages }) => {
  const [incidentAPIReqs, setIncidentAPIReqs] = useAtom(incidentAPIRequests);
  const [startRange, setStartRange] = useState(1);
  const [endRange, setEndRange] = useState(8);
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  useEffect(() => {
    const offset =
      (incidentAPIReqs[tab]?.PageNumber - 1) * incidentAPIReqs[tab]?.PageSize;
    setStartRange(offset + 1);
    const end = offset + incidentAPIReqs[tab]?.PageSize;
    setEndRange(end > totalElements ? totalElements : end);
  }, [incidentAPIReqs, totalElements, totalPages]);

  const resetPageNumber = () => {
    setIncidentAPIReqs((prev) => {
      const curr = { ...prev };
      curr[tab] = {
        ...curr[tab],
        PageNumber: 1,
      };
      return curr;
    });
  };
  const nextPage = () => {
    setIncidentAPIReqs((prev) => {
      const curr = { ...prev };
      curr[tab] = {
        ...curr[tab],
        PageNumber: curr[tab].PageNumber + 1,
      };
      return curr;
    });
  };

  const prevPage = () => {
    setIncidentAPIReqs((prev) => {
      const curr = { ...prev };
      curr[tab] = {
        ...curr[tab],
        PageNumber:
          curr[tab].PageNumber > 1
            ? curr[tab].PageNumber - 1
            : curr[tab].PageNumber,
      };
      return curr;
    });
  };

  const lastPage = () => {
    setIncidentAPIReqs((prev) => {
      const curr = { ...prev };
      curr[tab] = {
        ...curr[tab],
        PageNumber: totalPages,
      };
      return curr;
    });
  };

  const search = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIncidentAPIReqs((prev) => {
        const curr = { ...prev };
        curr[tab] = {
          ...curr[tab],
          Search: e.currentTarget.value,
        };
        return curr;
      });
    } else if (e.currentTarget.value === "") {
      setIncidentAPIReqs((prev) => {
        const curr = { ...prev };
        curr[tab] = {
          ...curr[tab],
          Search: "",
        };
        return curr;
      });
    }
  };

  const sort = (field: string) => {
    let order =
      sortOrder === "desc" ? "" : sortOrder === "asc" ? "desc" : "asc";
    if (field !== sortField) {
      order = "asc";
    }
    setIncidentAPIReqs((prev) => {
      const curr = { ...prev };
      curr[tab] = {
        ...curr[tab],
        SortOrder: order,
        SortBy: order ? field : "",
      };
      return curr;
    });
    setSortField(order ? field : "");
    setSortOrder(order);
  };

  return (
    <div className="incident-table-container">
      <Input
        classNames={{
          wrapper: "my-input-wrapper",
          input: "my-input-element",
        }}
        placeholder="Search incidents..."
        onKeyUp={(e) => search(e)}
      />

      <Table.ScrollContainer minWidth={600}>
        <Table layout="auto">
          <Table.Thead>
            <Table.Tr className="header-row">
              <Table.Th
                className="col-incident-no"
                onClick={() => sort("incidentNo")}
              >
                Incident No{" "}
                {sortField === "incidentNo" ? (
                  sortOrder === "asc" ? (
                    <BsSortUp size={14} />
                  ) : (
                    <BsSortDown size={14} />
                  )
                ) : (
                  <></>
                )}
              </Table.Th>
              <Table.Th
                className="col-description"
                onClick={() => sort("description")}
              >
                Description{" "}
                {sortField === "description" ? (
                  sortOrder === "asc" ? (
                    <BsSortUp size={14} />
                  ) : (
                    <BsSortDown size={14} />
                  )
                ) : (
                  <></>
                )}
              </Table.Th>
              <Table.Th
                className="col-category"
                onClick={() => sort("category")}
              >
                Category{" "}
                {sortField === "category" ? (
                  sortOrder === "asc" ? (
                    <BsSortUp size={14} />
                  ) : (
                    <BsSortDown size={14} />
                  )
                ) : (
                  <></>
                )}
              </Table.Th>
              <Table.Th
                className="col-resolution"
                onClick={() => sort("resolutionNotes")}
              >
                Resolution Notes{" "}
                {sortField === "resolutionNotes" ? (
                  sortOrder === "asc" ? (
                    <BsSortUp size={14} />
                  ) : (
                    <BsSortDown size={14} />
                  )
                ) : (
                  <></>
                )}
              </Table.Th>
              <Table.Th className="col-state" onClick={() => sort("state")}>
                State{" "}
                {sortField === "state" ? (
                  sortOrder === "asc" ? (
                    <BsSortUp size={14} />
                  ) : (
                    <BsSortDown size={14} />
                  )
                ) : (
                  <></>
                )}
              </Table.Th>
              <Table.Th
                className="col-resolved-date"
                onClick={() => sort("resolvedDateTime")}
              >
                Resolved Date & Time{" "}
                {sortField === "resolvedDateTime" ? (
                  sortOrder === "asc" ? (
                    <BsSortUp size={14} />
                  ) : (
                    <BsSortDown size={14} />
                  )
                ) : (
                  <></>
                )}
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody className="incident-body">
            {incidents.map((incident) => (
              <Table.Tr
                key={incident.incidentNo}
                className="incident-row data-row"
              >
                <Table.Td className="col-incident-no">
                  {incident.incidentNo}
                </Table.Td>
                <Table.Td className="col-description">
                  {incident.description}
                </Table.Td>
                <Table.Td className="col-category">
                  {incident.category}
                </Table.Td>
                <Table.Td className="col-resolution">
                  {incident.resolutionNotes || "-"}
                </Table.Td>
                <Table.Td className="col-state">{incident.state}</Table.Td>
                <Table.Td className="col-resolved-date">
                  {incident.resolvedDateTime}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
      {/* Pagination UI (static, no logic) */}
      <div className="pagination-footer">
        <span>
          Showing {startRange}-{endRange} of {totalElements} Total Incidents
        </span>
        <div className="pagination-controls">
          <button
            onClick={resetPageNumber}
            style={{ borderRadius: "6px 0 0 6px" }}
          >
            <img src={forward} alt="" />
            <img src={forward} alt="" />
          </button>
          <button onClick={prevPage}>
            <img src={forward} alt="" />
          </button>
          <button onClick={nextPage}>
            <img src={backward} alt="" />
          </button>
          <button onClick={lastPage} style={{ borderRadius: "0 6px 6px 0" }}>
            <img src={backward} alt="" />
            <img src={backward} alt="" />
          </button>
        </div>
      </div>
    </div>
  );
};
