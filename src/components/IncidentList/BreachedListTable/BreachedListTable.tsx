import { Table } from "@mantine/core";
import axios from "axios";
import { useAtomValue } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BsList } from "react-icons/bs";
import { FaSortAmountDownAlt, FaSortAmountUp } from "react-icons/fa";
import backward from "../../../assets/backward.png";
import forward from "../../../assets/forward.png";
import { appliedFilter } from "../../../store/filterStore";
import "./BreachedListTable.css";
import { BreachedIncidents, SortOrder } from "./breached-list-table.interface";
import { BreachFilters } from "../../../store/filter-store.interface";

export default function BreachedListTable({
  priority,
  breachFilters,
}: {
  priority: string;
  breachFilters: BreachFilters;
}) {
  const [breachedIncidents, setBreachedIncidents] = useState<
    BreachedIncidents[]
  >([]);
  const [totalElements, settotalElements] = useState(0);
  const [totalPage, setTotalPages] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);

  const [sortField, setSortField] = useState<keyof BreachedIncidents | "">("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("");

  const startRange = useMemo(() => {
    return (currentPage - 1) * 8 + 1;
  }, [currentPage]);

  const endRange = useMemo(() => {
    return Math.min(currentPage * 8, totalElements);
  }, [currentPage, totalElements]);

  const appliedFilters = useAtomValue(appliedFilter);

  const nextPage = useCallback(() => {
    if (currentPage < totalPage) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [currentPage, totalPage]);

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

  useEffect(() => {
    const query = buildFilterQuery();
    const url = `http://localhost:5092/api/Incident/breachlistbypriority?Priority=${encodeURIComponent(
      priority
    )}&PageNumber=${currentPage}&PageSize=${8}${query}`;
    axios
      .get(url)
      .then((res) => {
        setBreachedIncidents(res.data.items ?? []);
        settotalElements(res.data.totalElements);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => {
        console.error("Axios Error:", err);
        setBreachedIncidents([]);
        settotalElements(0);
        setTotalPages(0);
      });
  }, [currentPage, appliedFilters, breachFilters, sortField, sortOrder]);

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
    if (breachFilters.breachSLA !== undefined) {
      params.append("BreachSLA", breachFilters.breachSLA);
    }
    if (breachFilters.actualResolvedTime !== undefined) {
      params.append("ActualResolvedTime", breachFilters.actualResolvedTime);
    }
    if (sortField !== "") {
      params.append("SortBy", sortField);
      params.append("SortOrder", sortOrder);
    }
    const queryString = params.toString();
    return queryString ? `&${queryString}` : "";
  }, [appliedFilters, breachFilters, sortField, sortOrder]);

  const handleSort = useCallback(
    (field: keyof BreachedIncidents) => {
      let order: SortOrder = "ASC";
      let sortBy: keyof BreachedIncidents | "" = field;
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
    (field: keyof BreachedIncidents) => {
      if (sortField !== field) return <BsList fontSize="small" />;

      return sortOrder === "ASC" ? (
        <FaSortAmountUp fontSize="small" />
      ) : (
        <FaSortAmountDownAlt fontSize="small" />
      );
    },
    [sortOrder]
  );

  return (
    <div className="bl-table-container">
      <Table.ScrollContainer minWidth={600}>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th onClick={() => handleSort("incidentNumber")}>
                <div className="bl-table-headers">
                  <span> Incident No </span>
                  <span> {renderSortIcon("incidentNumber")} </span>
                </div>
              </Table.Th>

              <Table.Th>
                <div
                  className="bl-table-headers"
                  onClick={() => handleSort("assignedTo")}
                >
                  <span> Assigned To </span>
                  <span> {renderSortIcon("assignedTo")} </span>
                </div>
              </Table.Th>

              <Table.Th>
                <div
                  className="bl-table-headers"
                  onClick={() => handleSort("shortDescription")}
                >
                  <span> Description </span>
                  <span> {renderSortIcon("shortDescription")} </span>
                </div>
              </Table.Th>

              <Table.Th onClick={() => handleSort("category")}>
                <div className="bl-table-headers">
                  <span> Category </span>
                  <span> {renderSortIcon("category")} </span>
                </div>
              </Table.Th>

              <Table.Th>
                <div
                  className="bl-table-headers"
                  onClick={() => handleSort("actualResolvedTime")}
                >
                  <span> Actual Resolved Time </span>
                  <span> {renderSortIcon("actualResolvedTime")} </span>
                </div>
              </Table.Th>

              <Table.Th>
                <div
                  className="bl-table-headers"
                  onClick={() => handleSort("breachSLA")}
                >
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
                  colSpan={6}
                  style={{ textAlign: "center", padding: 20 }}
                >
                  No incidents found
                </Table.Td>
              </Table.Tr>
            ) : (
              breachedIncidents.map((breachedIncident) => (
                <Table.Tr key={breachedIncident.incidentNumber}>
                  <Table.Td>{breachedIncident.incidentNumber}</Table.Td>
                  <Table.Td>{breachedIncident.assignedTo}</Table.Td>
                  <Table.Td>{breachedIncident.shortDescription}</Table.Td>
                  <Table.Td>{breachedIncident.category}</Table.Td>
                  <Table.Td>{breachedIncident.actualResolvedTime}</Table.Td>
                  <Table.Td>{breachedIncident.breachSLA}</Table.Td>
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      {/* pagination */}
      <div className="bl-pagination-footer">
        <span>
          Showing {startRange}-{endRange} of {totalElements} Total Incidents
        </span>
        <div className="bl-pagination-controls">
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
