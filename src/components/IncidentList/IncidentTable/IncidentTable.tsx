import { Table } from "@mantine/core";
import "./IncidentTable.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { BsList } from "react-icons/bs";
import { FaSortAmountDownAlt } from "react-icons/fa";
import { FaSortAmountUp } from "react-icons/fa";
import backward from "../../../assets/backward.png";
import forward from "../../../assets/forward.png";
import ArrowDropDownCircleIcon from "@mui/icons-material/ArrowDropDownCircle";
import { useAtomValue } from "jotai";
import { appliedFilter, FilterState } from "../../../store/filterStore";

type Incident = {
  incidentNo: string;
  assignedTo: string;
  shortDescription: string;
  category: string;
  actualResolvedTime: string;
  state: string;
  resolvedDateTime: string;
  breachSLA: string;
};

export default function IncidentTable({
  priority,
  search,
}: {
  priority: string;
  search: string;
}) {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [totalElements, settotalElements] = useState(0);
  const [totalPage, setTotalPages] = useState(0);
  const appliedFilters = useAtomValue(appliedFilter);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const startRange = (currentPage - 1) * pageSize + 1;
  const endRange = Math.min(currentPage * pageSize, totalElements);

  useEffect(() => {
    setCurrentPage(1);
  }, [priority, search]);

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
  const [sortField, setSortField] = useState<keyof Incident | "">("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const query = buildFilterQuery(appliedFilters);

        const url = `http://localhost:5092/api/Incident/detailsbypriority?Priority=${encodeURIComponent(
          priority
        )}&Search=${encodeURIComponent(
          search
        )}&PageNumber=${currentPage}${query}`;
        const res = await axios.get(url);
        settotalElements(res.data.totalElements);
        setIncidents(res.data.incidents ?? []);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error("Error:", err);
      }
    };
    fetchIncidents();
  }, [priority, search, currentPage, appliedFilters]);

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
    const queryString = params.toString();
    return queryString ? `&${queryString}` : "";
  };

  // sorting function
  const handleSort = (field: keyof Incident) => {
    let order: "asc" | "desc" = "asc";

    if (sortField === field) {
      order = sortOrder === "asc" ? "desc" : "asc";
    }

    setSortField(field);
    setSortOrder(order);

    const sorted = [...incidents].sort((a, b) => {
      const valueA = a[field]?.toString().toLowerCase();
      const valueB = b[field]?.toString().toLowerCase();

      if (valueA < valueB) return order === "asc" ? -1 : 1;
      if (valueA > valueB) return order === "asc" ? 1 : -1;
      return 0;
    });
    setIncidents(sorted);
  };

  const renderSortIcon = (field: keyof Incident) => {
    if (sortField !== field) return <BsList fontSize="small" />;

    return sortOrder === "asc" ? (
      <FaSortAmountUp fontSize="small" />
    ) : (
      <FaSortAmountDownAlt fontSize="small" />
    );
  };
  return (
    <div className="table-container">
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th onClick={() => handleSort("incidentNo")}>
              <div className="table-headers">
                <span> Incident_No </span>
                <span> {renderSortIcon("incidentNo")} </span>
              </div>
            </Table.Th>

            <Table.Th onClick={() => handleSort("assignedTo")}>
              <div className="table-headers">
                <span> Assigned Toooo </span>
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
