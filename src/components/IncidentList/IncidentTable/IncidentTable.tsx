import { Table } from "@mantine/core";
import "./IncidentTable.css";
import "../BreachedListTable/BreachedListTable.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BsList } from "react-icons/bs";
import { FaArrowCircleDown } from "react-icons/fa";
import backward from "../../../assets/backward.png";
import forward from "../../../assets/forward.png";
import { useAtomValue, useSetAtom } from "jotai";
import {
  ActiveCriticalAccordion,
  ActiveIncidentTab,
  appliedFilter,
  InitiateAPI,
} from "../../../store/filterStore";
import {
  Incident,
  IncidentResponse,
  SortOrder,
} from "./incident-table.interface";
import { GoSortAsc, GoSortDesc } from "react-icons/go";

export default function IncidentTable({
  priority,
  Search,
  incidentsResponse,
}: {
  priority: string;
  Search: string;
  incidentsResponse: IncidentResponse | undefined;
}) {
  const incidents = useMemo(() => {
    return incidentsResponse?.incidents ?? [];
  }, [incidentsResponse]);

  const totalElements = useMemo(() => {
    return incidentsResponse?.totalElements ?? 0;
  }, [incidentsResponse]);

  const totalPage = useMemo(() => {
    return incidentsResponse?.totalPages ?? 0;
  }, [incidentsResponse]);

  const [currentPage, setCurrentPage] = useState(1);

  const [sortField, setSortField] = useState<keyof Incident | "">("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("");

  const appliedFilters = useAtomValue(appliedFilter);
  const activeIncidentTab = useAtomValue(ActiveIncidentTab);
  const activeCriticalAccordion = useAtomValue(ActiveCriticalAccordion);

  const startRange = useMemo(() => {
    return (currentPage - 1) * 8 + 1;
  }, [currentPage]);

  const endRange = useMemo(() => {
    return Math.min(currentPage * 8, totalElements);
  }, [currentPage, totalElements]);

  const nextPage = () => {
    if (currentPage < totalPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [currentPage]);

  const resetPageNumber = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const lastPage = useCallback(() => {
    setCurrentPage(totalPage);
  }, [totalPage]);

  const initiateAPI = useSetAtom(InitiateAPI);

  const [lastUpdatedOn, setLastUpdatedOn] = useState(0);
  const [prevSearch, setPrevSearch] = useState("");

  const apiUrl = useMemo(() => {
    const params = new URLSearchParams();

    if (appliedFilters.Category?.length > 0) {
      params.append("Category", appliedFilters.Category.join(","));
    }
    if (appliedFilters.AssignmentGroup?.length > 0) {
      params.append("AssignmentGroup", appliedFilters.AssignmentGroup.join(","));
    }
    if (Search) {
      params.append("Search", Search);
    }

    if (appliedFilters.State?.length > 0) {
      params.append("State", appliedFilters.State.join(","));
    }
    if (appliedFilters.AssignedToName?.length > 0) {
      params.append("AssignedToName", appliedFilters.AssignedToName.join(","));
    }
    if (appliedFilters.FromDate) {
      const formatted = new Date(appliedFilters.FromDate).toLocaleString(
        "en-US"
      );
      params.append("FromDate", formatted);
    }
    if (appliedFilters.ToDate) {
      const formatted = new Date(appliedFilters.ToDate).toLocaleString("en-US");
      params.append("ToDate", formatted);
    }
    if (sortField !== "") {
      params.append("SortBy", sortField);
      params.append("SortOrder", sortOrder);
    }
    const query = params.size > 0 ? `&${params.toString()}` : "";
    const encodedPriority = encodeURIComponent(priority);

    if (appliedFilters.UpdatedOn > lastUpdatedOn || Search !== prevSearch) {
      setLastUpdatedOn(appliedFilters.UpdatedOn);
      setPrevSearch(Search);
      setCurrentPage(1);
    }

    return `http://localhost:5092/api/Incident/detailsbypriority?Priority=${encodedPriority}&PageNumber=${currentPage}&PageSize=${8}${query}`;
  }, [
    priority,
    appliedFilters,
    sortField,
    sortOrder,
    currentPage,
    lastUpdatedOn,
    Search,
    prevSearch,
  ]);

  useEffect(() => {
    if (
      activeIncidentTab !== priority ||
      activeCriticalAccordion !== priority
    ) {
      return;
    }
    initiateAPI((prev) => {
      const curr = new Map(prev);
      curr.set(apiUrl, {
        method: "GET",
        body: null,
      });
      return curr;
    });
  }, [apiUrl, activeIncidentTab, activeCriticalAccordion]);

  const handleSort = useCallback(
    (field: keyof Incident) => {
      let order: SortOrder = "ASC";
      let sortBy: keyof Incident | "" = field;

      if (sortField === field) {
        if (sortOrder === "DESC") {
          order = "ASC";
          sortBy = "";
        } else {
          order = sortOrder === "ASC" ? "DESC" : "ASC";
        }
      }

      setSortField(sortBy);
      setSortOrder(order);
    },
    [sortField, sortOrder]
  );

  const renderSortIcon = useCallback(
    (field: keyof Incident) => {
      if (sortField !== field) return <BsList fontSize="small" />;

      return sortOrder === "ASC" ? (
        <GoSortAsc size={16} />
      ) : (
        <GoSortDesc size={16} />
      );
    },
    [sortField, sortOrder]
  );

  return (
    <div className="bl-table-container">
      <Table.ScrollContainer minWidth={600}>
        <Table>
          <Table.Thead>
            <Table.Tr className="bl-header-row">
              <Table.Th style={{minWidth:"140px",maxWidth:"140px"}}
                className="bl-header-cell first-header"
                onClick={() => handleSort("incidentNo")}
              >
                <div className="bl-table-headers">
                  <span> Incident No </span>
                  <span> {renderSortIcon("incidentNo")} </span>
                </div>
              </Table.Th>

              <Table.Th style={{minWidth:"200px",maxWidth:"200px"}}
                className="bl-header-cell"
                onClick={() => handleSort("assignedTo")}
              >
                <div className="bl-table-headers">
                  <span> Assigned To </span>
                  <span> {renderSortIcon("assignedTo")} </span>
                </div>
              </Table.Th>

              <Table.Th style={{minWidth:"350px",maxWidth:"350px"}}
                className="bl-header-cell"
                onClick={() => handleSort("shortDescription")}
              >
                <div className="bl-table-headers">
                  <span> Description </span>
                  <span> {renderSortIcon("shortDescription")} </span>
                </div>
              </Table.Th>

              <Table.Th style={{minWidth:"150px",maxWidth:"150px"}}
                className="bl-header-cell"
                onClick={() => handleSort("category")}
              >
                <div className="bl-table-headers">
                  <span> Category </span>
                  <span> {renderSortIcon("category")} </span>
                </div>
              </Table.Th>

              <Table.Th style={{minWidth:"120px",maxWidth:"120px"}}
                className="bl-header-cell"
                onClick={() => handleSort("state")}
              >
                <div className="bl-table-headers">
                  <span> State </span>
                  <span> {renderSortIcon("state")} </span>
                </div>
              </Table.Th>
              <Table.Th style={{minWidth:"180px",maxWidth:"180px"}}
                className="bl-header-cell"
                onClick={() => handleSort("createdDateTime")}
              >
                <div className="bl-table-headers">
                  <span> Created Date</span>
                  <span> {renderSortIcon("createdDateTime")} </span>
                </div>
              </Table.Th>
              {/* <Table.Th
                className="bl-header-cell"
                onClick={() => handleSort("updatedDateTime")}
              >
                <div className="bl-table-headers">
                  <span> Updated Date</span>
                  <span> {renderSortIcon("updatedDateTime")} </span>
                </div>
              </Table.Th> */}
              <Table.Th style={{minWidth:"210px",maxWidth:"210px"}}
                className="bl-header-cell"
                onClick={() => handleSort("resolvedDateTime")}
              >
                <div className="bl-table-headers">
                  <span> Resolved Date & Time </span>
                  <span> {renderSortIcon("resolvedDateTime")} </span>
                </div>
              </Table.Th>
              <Table.Th style={{minWidth:"210px",maxWidth:"210px"}}
                className="bl-header-cell"
                onClick={() => handleSort("actualResolvedTime")}
              >
                <div className="bl-table-headers">
                  <span> Actual Resolved Time </span>
                  <span> {renderSortIcon("actualResolvedTime")} </span>
                </div>
              </Table.Th>

              <Table.Th style={{minWidth:"200px",maxWidth:"200px"}}
                className="bl-header-cell last-header"
                onClick={() => handleSort("breachSLA")}
              >
                <div className="bl-table-headers">
                  <span> Breach SLA </span>
                  <span> {renderSortIcon("breachSLA")} </span>
                </div>
              </Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            <Table.Tr className="table-row-compact">
              <Table.Td colSpan={9}></Table.Td>
            </Table.Tr>
            {totalElements === 0 ? (
              <Table.Tr>
                <Table.Td
                  colSpan={8}
                  style={{ textAlign: "center", padding: 20 }}
                >
                  <p>No incidents found</p>
                </Table.Td>
              </Table.Tr>
            ) : (
              incidents.map((incident, index) => {
                const isBreached = incident.breachSLA !== "No Breach";

                return (
                  <Table.Tr
                    key={incident.incidentNo}
                    className={`breached-row ${isBreached ? "breached" : ""}`}
                    style={{
                      outline: index === 0 ? "paddingTop:20px" : undefined,
                    }}
                  >
                    <Table.Td>{incident.incidentNo}</Table.Td>
                    <Table.Td>{incident.assignedTo}</Table.Td>
                    <Table.Td>{incident.shortDescription}</Table.Td>
                    <Table.Td>{incident.category}</Table.Td>
                    <Table.Td>{incident.state}</Table.Td>
                    <Table.Td>{incident.createdDateTime}</Table.Td>
                    {/* <Table.Td>{incident.updatedDateTime}</Table.Td> */}
                    <Table.Td>{incident.resolvedDateTime}</Table.Td>

                    <Table.Td>{incident.actualResolvedTime}</Table.Td>

                    <Table.Td className="highlight-downarrow">
                      <div className="breach-cell">
                        <span>{incident.breachSLA}</span>
                        <span style={{ minWidth: "17px" }}>
                          {isBreached && (
                            <FaArrowCircleDown className="arrow" />
                          )}
                        </span>
                      </div>
                    </Table.Td>
                  </Table.Tr>
                );
              })
            )}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      {/* pagination */}
      <div className="pagination-footer">
        <span>
          Showing {startRange}-{endRange} of {totalElements} Total Incidents
        </span>
        <div className="pagination-controls">
          <button
            onClick={resetPageNumber}
            style={{
              borderRadius: "6px 0px 0px 6px",
              border: "1px solid rgba(51, 48, 49, 0.067)",
              padding: "12px",
            }}
          >
            <img src={forward} alt="" />
            <img src={forward} alt="" />
          </button>
          <button
            onClick={prevPage}
            style={{
              border: "1px solid rgba(51, 48, 49, 0.067)",
              padding: "12px",
            }}
          >
            <img src={forward} alt="" />
          </button>
          <button
            onClick={nextPage}
            style={{
              border: "1px solid rgba(51, 48, 49, 0.067)",
              padding: "12px",
            }}
          >
            <img src={backward} alt="" />
          </button>
          <button
            onClick={lastPage}
            style={{
              borderRadius: "0px 6px 6px 0px",
              border: "1px solid rgba(51, 48, 49, 0.067)",
              padding: "11px",
            }}
          >
            <img src={backward} alt="" />
            <img src={backward} alt="" />
          </button>
        </div>
      </div>
    </div>
  );
}
