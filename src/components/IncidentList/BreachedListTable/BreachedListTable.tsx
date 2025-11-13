import { Table } from "@mantine/core";
import axios from "axios";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { BsList } from "react-icons/bs";
import { FaSortAmountDownAlt, FaSortAmountUp } from "react-icons/fa";
import backward from "../../../assets/backward.png";
import forward from "../../../assets/forward.png";
import {
  appliedFilter,
  breachFiltersAtom,
  FilterState,
} from "../../../store/filterStore";
import "./BreachedListTable.css";

type BreachedIncidents = {
  incidentNumber: string;
  assignedTo: string;
  shortDescription: string;
  category: string;
  actualResolvedTime: string;
  breachSLA: string;
};

export default function BreachedListTable({ priority }: { priority: string }) {
  const [breachedIncidents, setBreachedIncidents] = useState<
    BreachedIncidents[]
  >([]);
  const [totalElements, settotalElements] = useState(0);
  const [totalPage, setTotalPages] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const startRange = (currentPage - 1) * pageSize + 1;
  const endRange = Math.min(currentPage * pageSize, totalElements);
  const appliedFilters = useAtomValue(appliedFilter);
  const breachFilters = useAtomValue(breachFiltersAtom);

  const nextPage = () => {
    if (currentPage < totalPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const resetPageNumber = () => {
    setCurrentPage(1);
  };

  const lastPage = () => {
    setCurrentPage(totalPage);
  };

  // sorting states
  const [sortField, setSortField] = useState<keyof BreachedIncidents | "">("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const fetchBreachedList = async () => {
      try {
        const pageSize = 8;
        const query = buildFilterQuery(appliedFilters);

        const url = `http://localhost:5092/api/Incident/breachlistbypriority?Priority=${encodeURIComponent(
          priority
        )}&PageNumber=${currentPage}&PageSize=${pageSize}${query}`;

        const res = await axios.get(url);
        let items = res.data.items ?? [];

        console.log("Filtered Breached response:", items);
        settotalElements(items.length);
        setBreachedIncidents(items);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error("Axios Error:", err);
      }
    };

    fetchBreachedList();
  }, [priority, currentPage, appliedFilters, breachFilters]);

  // Build API filters
  const buildFilterQuery = (appliedFilters: FilterState) => {
    const params = new URLSearchParams();

    if (appliedFilters.Category?.length > 0) {
      params.append("Category", appliedFilters.Category.join(","));
    }

    if (appliedFilters.Priority?.length > 0) {
      params.append("Priority", appliedFilters.Priority.join(","));
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

    if (breachFilters.breachSLA.length > 0) {
      params.append("BreachSLA", breachFilters.breachSLA.join(","));
    }
    if (breachFilters.actualResolvedTime.length > 0) {
      params.append(
        "ActualResolvedTime",
        breachFilters.actualResolvedTime.join(",")
      );
    }
    if (breachFilters.incidentId.length > 0) {
      params.append("IncidentNumber", breachFilters.incidentId.join(","));
    }

    const queryString = params.toString();
    return queryString ? `&${queryString}` : "";
  };

  // sorting function
  const handleSort = (field: keyof BreachedIncidents) => {
    let order: "asc" | "desc" = "asc";

    if (sortField === field) {
      order = sortOrder === "asc" ? "desc" : "asc";
    }

    setSortField(field);
    setSortOrder(order);

    const sorted = [...breachedIncidents].sort((a, b) => {
      const valueA = a[field]?.toString().toLowerCase();
      const valueB = b[field]?.toString().toLowerCase();

      if (valueA < valueB) return order === "asc" ? -1 : 1;
      if (valueA > valueB) return order === "asc" ? 1 : -1;
      return 0;
    });
    setBreachedIncidents(sorted);
  };

  const renderSortIcon = (field: keyof BreachedIncidents) => {
    if (sortField !== field) return <BsList fontSize="small" />;

    return sortOrder === "asc" ? (
      <FaSortAmountUp fontSize="small" />
    ) : (
      <FaSortAmountDownAlt fontSize="small" />
    );
  };

  return (
    <div className="bl-table-container">
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th onClick={() => handleSort("incidentNumber")}>
              <div className="bl-table-headers">
                <span> Incident_No </span>
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
