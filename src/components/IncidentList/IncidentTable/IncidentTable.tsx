import { Table } from "@mantine/core";
import "./IncidentTable.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { BsList } from "react-icons/bs";
import { FaSortAmountDownAlt } from "react-icons/fa";
import { FaSortAmountUp } from "react-icons/fa";
import backward from "../../../assets/backward.png";
import forward from "../../../assets/forward.png";
import ArrowDropDownCircleIcon from "@mui/icons-material/ArrowDropDownCircle";
import { useAtomValue } from "jotai";
import {
  ActiveCriticalAccordion,
  ActiveIncidentTab,
  appliedFilter,
} from "../../../store/filterStore";
import { Incident, SortOrder } from "./incident-table.interface";

export default function IncidentTable({ priority }: { priority: string }) {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [totalElements, settotalElements] = useState(0);
  const [totalPage, setTotalPages] = useState(0);
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
  }, []);

  useEffect(() => {
    console.log(priority);
    console.log(activeIncidentTab);
    console.log(activeCriticalAccordion);
    if (
      activeIncidentTab !== priority ||
      activeCriticalAccordion !== priority
    ) {
      return;
    }
    const query = buildFilterQuery();
    const encodedPriority = encodeURIComponent(priority);
    const url = `http://localhost:5092/api/Incident/detailsbypriority?Priority=${encodedPriority}&PageNumber=${currentPage}${query}`;
    axios
      .get(url)
      .then((res) => {
        setIncidents(res.data.incidents ?? []);
        settotalElements(res.data.totalElements);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => {
        console.error("Error:", err);
        setIncidents([]);
        settotalElements(0);
        setTotalPages(0);
      });
  }, [
    priority,
    currentPage,
    appliedFilters,
    sortField,
    sortOrder,
    activeIncidentTab,
    activeCriticalAccordion,
  ]);

  const buildFilterQuery = useCallback(() => {
    const params = new URLSearchParams();

    if (appliedFilters.Category?.length > 0) {
      params.append("Category", appliedFilters.Category.join(","));
    }
    if (appliedFilters.State?.length > 0) {
      params.append("State", appliedFilters.State.join(","));
    }
    if (appliedFilters.AssignedToName?.length > 0) {
      params.append("AssignedToName", appliedFilters.AssignedToName.join(","));
    }
    if (sortField !== "") {
      params.append("SortBy", sortField);
      params.append("SortOrder", sortOrder);
    }
    const queryString = params.toString();
    return queryString ? `&${queryString}` : "";
  }, [appliedFilters, sortField, sortOrder]);

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
        <FaSortAmountUp fontSize="small" />
      ) : (
        <FaSortAmountDownAlt fontSize="small" />
      );
    },
    [sortField, sortOrder]
  );

  return (
    <div className="table-container">
      <Table.ScrollContainer minWidth={600}>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th onClick={() => handleSort("incidentNo")}>
                <div className="table-headers">
                  <span> Incident No </span>
                  <span> {renderSortIcon("incidentNo")} </span>
                </div>
              </Table.Th>

              <Table.Th onClick={() => handleSort("assignedTo")}>
                <div className="table-headers">
                  <span> Assigned To </span>
                  <span> {renderSortIcon("assignedTo")} </span>
                </div>
              </Table.Th>

              <Table.Th onClick={() => handleSort("shortDescription")}>
                <div className="table-headers">
                  <span> Description </span>
                  <span> {renderSortIcon("shortDescription")} </span>
                </div>
              </Table.Th>

              <Table.Th onClick={() => handleSort("category")}>
                <div className="table-headers">
                  <span> Category </span>
                  <span> {renderSortIcon("category")} </span>
                </div>
              </Table.Th>

              <Table.Th onClick={() => handleSort("state")}>
                <div className="table-headers">
                  <span> State </span>
                  <span> {renderSortIcon("state")} </span>
                </div>
              </Table.Th>

              <Table.Th onClick={() => handleSort("actualResolvedTime")}>
                <div className="table-headers">
                  <span> Actual Resolved Time </span>
                  <span> {renderSortIcon("actualResolvedTime")} </span>
                </div>
              </Table.Th>

              <Table.Th onClick={() => handleSort("resolvedDateTime")}>
                <div className="table-headers">
                  <span> Resolved Date & Time </span>
                  <span> {renderSortIcon("resolvedDateTime")} </span>
                </div>
              </Table.Th>

              {/* <Table.Th onClick={() => handleSort("createdDate")}>
                <div className="table-headers">
                  <span> Created Date </span>
                  <span> {renderSortIcon("createdDate")} </span>
                </div>
              </Table.Th> */}

              <Table.Th onClick={() => handleSort("breachSLA")}>
                <div className="table-headers">
                  <span> Breach SLA </span>
                  <span> {renderSortIcon("breachSLA")} </span>
                </div>
              </Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {totalElements === 0 ? (
              <Table.Tr>
                <Table.Td
                  colSpan={8}
                  style={{ textAlign: "center", padding: 20 }}
                >
                  No incidents found
                </Table.Td>
              </Table.Tr>
            ) : (
              incidents.map((incident) => {
                const isBreached = incident.breachSLA !== "No Breach";

                return (
                  <Table.Tr
                    key={incident.incidentNo}
                    className={`breached-row ${isBreached ? "breached" : ""}`}
                  >
                    <Table.Td>{incident.incidentNo}</Table.Td>
                    <Table.Td>{incident.assignedTo}</Table.Td>
                    <Table.Td>{incident.shortDescription}</Table.Td>
                    <Table.Td>{incident.category}</Table.Td>
                    <Table.Td>{incident.state}</Table.Td>
                    <Table.Td>{incident.actualResolvedTime}</Table.Td>
                    <Table.Td>{incident.resolvedDateTime}</Table.Td>
                    {/* <Table.Td>{incident.createdDate}</Table.Td> */}

                    <Table.Td className="highlight-downarrow">
                      <div className="breach-cell">
                        <span>{incident.breachSLA}</span>

                        {isBreached && (
                          <ArrowDropDownCircleIcon className="arrow" />
                        )}
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
}
