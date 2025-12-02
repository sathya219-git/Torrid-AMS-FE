import { Table } from "@mantine/core";
import { useAtomValue, useSetAtom } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BsList } from "react-icons/bs";
import backward from "../../../assets/backward.png";
import forward from "../../../assets/forward.png";
import {
  ActiveBreachAccordion,
  ActiveIncidentTab,
  appliedFilter,
  InitiateAPI,
} from "../../../store/filterStore";
import "./BreachedListTable.css";
import {
  BreachedIncidents,
  BreachedIncidentsResponse,
  SortOrder,
} from "./breached-list-table.interface";
import { BreachFilters } from "../../../store/filter-store.interface";
import { GoSortAsc, GoSortDesc } from "react-icons/go";

export default function BreachedListTable({
  priority,
  breachFilters,
  breachedResponse,
}: {
  priority: string;
  breachFilters: BreachFilters;
  breachedResponse: BreachedIncidentsResponse | undefined;
}) {
  const breachedIncidents = useMemo(() => {
    return breachedResponse?.items ?? [];
  }, [breachedResponse]);

  const totalElements = useMemo(() => {
    return breachedResponse?.totalElements ?? 0;
  }, [breachedResponse]);

  const totalPage = useMemo(() => {
    return breachedResponse?.totalPages ?? 0;
  }, [breachedResponse]);

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
  const activeIncidentTab = useAtomValue(ActiveIncidentTab);
  const activeBreachAccordion = useAtomValue(ActiveBreachAccordion);

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

  const initiateAPI = useSetAtom(InitiateAPI);

  const [lastUpdatedOn, setLastUpdatedOn] = useState(0);
  const [prevSearch, setPrevSearch] = useState<string | undefined>(undefined);

  const apiUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (appliedFilters.Category?.length > 0) {
      params.append("Category", appliedFilters.Category.join(","));
    }
    if (appliedFilters.AssignedToName?.length > 0) {
      params.append("AssignedToName", appliedFilters.AssignedToName.join(","));
    }
    if (appliedFilters.AssignmentGroup?.length > 0) {
      params.append("AssignmentGroup", appliedFilters.AssignmentGroup.join(","));
    }
    if (appliedFilters.State?.length > 0) {
      params.append("State", appliedFilters.State.join(","));
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
    // if (
    //   breachFilters.breachSLA !== undefined &&
    //   breachFilters.breachSLA !== ""
    // ) {
    //   params.append("BreachSLA", breachFilters.breachSLA);
    // }
    // if (
    //   breachFilters.actualResolvedTime !== undefined &&
    //   breachFilters.actualResolvedTime !== ""
    // ) {
    //   params.append("ActualResolvedTime", breachFilters.actualResolvedTime);
    // }
    if (breachFilters.Search) {
      params.append("Search", breachFilters.Search);
    }

    if (sortField !== "") {
      params.append("SortBy", sortField);
      params.append("SortOrder", sortOrder);
    }

    if (
      appliedFilters.UpdatedOn > lastUpdatedOn ||
      breachFilters.Search !== prevSearch
    ) {
      setLastUpdatedOn(appliedFilters.UpdatedOn);
      setPrevSearch(breachFilters.Search);
      setCurrentPage(1);
    }

    const queryString = params.toString();
    const query = queryString ? `&${queryString}` : "";
    const url = `http://localhost:5092/api/Incident/breachlistbypriority?Priority=${encodeURIComponent(
      priority
    )}&PageNumber=${currentPage}&PageSize=${8}${query}`;

    return url;
  }, [
    priority,
    breachFilters,
    appliedFilters,
    currentPage,
    sortField,
    sortOrder,
    lastUpdatedOn,
    prevSearch,
  ]);

  useEffect(() => {
    if (activeIncidentTab !== priority || activeBreachAccordion !== priority) {
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
  }, [apiUrl, activeIncidentTab, activeBreachAccordion]);

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
        <GoSortAsc size={16} />
      ) : (
        <GoSortDesc size={16} />
      );
    },
    [sortOrder, sortField]
  );

  return (
    <div className="bl-table-container">
      <Table.ScrollContainer minWidth={600}>
        <Table>
          <Table.Thead>
            <Table.Tr className="bl-header-row">
              <Table.Th
                className="bl-header-cell first-header"
                onClick={() => handleSort("incidentNumber")}
              >
                <div className="bl-table-headers">
                  <span>Incident No</span>
                  <span>{renderSortIcon("incidentNumber")}</span>
                </div>
              </Table.Th>

              <Table.Th
                className="bl-header-cell"
                onClick={() => handleSort("assignedTo")}
              >
                <div className="bl-table-headers">
                  <span>Assigned To</span>
                  <span>{renderSortIcon("assignedTo")}</span>
                </div>
              </Table.Th>

              <Table.Th
                className="bl-header-cell"
                onClick={() => handleSort("shortDescription")}
              >
                <div className="bl-table-headers">
                  <span>Description</span>
                  <span>{renderSortIcon("shortDescription")}</span>
                </div>
              </Table.Th>

              <Table.Th
                className="bl-header-cell"
                onClick={() => handleSort("category")}
              >
                <div className="bl-table-headers">
                  <span>Category</span>
                  <span>{renderSortIcon("category")}</span>
                </div>
              </Table.Th>
              <Table.Th
                className="bl-header-cell"
                onClick={() => handleSort("state")}
              >
                <div className="bl-table-headers">
                  <span>State</span>
                  <span>{renderSortIcon("state")}</span>
                </div>
              </Table.Th>

              <Table.Th
                className="bl-header-cell"
                onClick={() => handleSort("createdDateTime")}
              >
                <div className="bl-table-headers">
                  <span>Created Date</span>
                  <span>{renderSortIcon("createdDateTime")}</span>
                </div>
              </Table.Th>
              {/* <Table.Th
                className="bl-header-cell"
                onClick={() => handleSort("updatedDateTime")}
              >
                <div className="bl-table-headers">
                  <span>Updated Date</span>
                  <span>{renderSortIcon("updatedDateTime")}</span>
                </div>
              </Table.Th> */}
              <Table.Th
                className="bl-header-cell"
                onClick={() => handleSort("resolvedDateTime")}
              >
                <div className="bl-table-headers">
                  <span>Resolved Date</span>
                  <span>{renderSortIcon("resolvedDateTime")}</span>
                </div>
              </Table.Th>

              <Table.Th
                className="bl-header-cell"
                onClick={() => handleSort("actualResolvedTime")}
              >
                <div className="bl-table-headers">
                  <span>Actual Resolved Time</span>
                  <span>{renderSortIcon("actualResolvedTime")}</span>
                </div>
              </Table.Th>

              <Table.Th
                className="bl-header-cell last-header"
                onClick={() => handleSort("breachSLA")}
              >
                <div className="bl-table-headers">
                  <span>Breach SLA</span>
                  <span>{renderSortIcon("breachSLA")}</span>
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
                  <p>No incidents found</p>
                </Table.Td>
              </Table.Tr>
            ) : (
              breachedIncidents.map((item, index) => (
                <Table.Tr
                  key={item.incidentNumber}
                  className={index === 0 ? "first-row-gap" : ""}
                >
                  <Table.Td>{item.incidentNumber}</Table.Td>
                  <Table.Td>{item.assignedTo}</Table.Td>
                  <Table.Td>{item.shortDescription}</Table.Td>
                  <Table.Td>{item.category}</Table.Td>
                  <Table.Td>{item.state}</Table.Td>
                  <Table.Td>{item.createdDateTime}</Table.Td>
                  {/* <Table.Td>{item.updatedDateTime}</Table.Td> */}
                  <Table.Td>{item.resolvedDateTime}</Table.Td>
                  <Table.Td>{item.actualResolvedTime}</Table.Td>
                  <Table.Td>{item.breachSLA}</Table.Td>
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
