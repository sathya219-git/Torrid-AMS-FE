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
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
      const formatted = new Date(appliedFilters.FromDate).toLocaleDateString(
        "en-US"
      );
      params.append("FromDate", `${formatted},00:00:00 AM`);
    }
    if (appliedFilters.ToDate) {
      const formatted = new Date(appliedFilters.ToDate).toLocaleDateString("en-US");
      params.append("ToDate", `${formatted},11:59:59 PM`);
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
    const url = `${API_BASE_URL}/api/Incident/breachlistbypriority?Priority=${encodeURIComponent(
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
              <Table.Th style={{minWidth:"140px",maxWidth:"140px"}}
                className="bl-header-cell first-header"
                onClick={() => handleSort("Number")}
              >
                <div className="bl-table-headers">
                  <span>Incident No</span>
                  <span>{renderSortIcon("Number")}</span>
                </div>
              </Table.Th>

              <Table.Th style={{minWidth:"200px",maxWidth:"200px"}}
                className="bl-header-cell"
                onClick={() => handleSort("AssignedTo")}
              >
                <div className="bl-table-headers">
                  <span>Assigned To</span>
                  <span>{renderSortIcon("AssignedTo")}</span>
                </div>
              </Table.Th>

              <Table.Th style={{minWidth:"350px",maxWidth:"350px"}}
                className="bl-header-cell"
                onClick={() => handleSort("ShortDescription")}
              >
                <div className="bl-table-headers">
                  <span>Description</span>
                  <span>{renderSortIcon("ShortDescription")}</span>
                </div>
              </Table.Th>

              <Table.Th style={{minWidth:"150px",maxWidth:"150px"}}
                className="bl-header-cell"
                onClick={() => handleSort("Category")}
              >
                <div className="bl-table-headers">
                  <span>Category</span>
                  <span>{renderSortIcon("Category")}</span>
                </div>
              </Table.Th>
              <Table.Th style={{minWidth:"120px",maxWidth:"120px"}}
                className="bl-header-cell"
                onClick={() => handleSort("State")}
              >
                <div className="bl-table-headers">
                  <span>State</span>
                  <span>{renderSortIcon("State")}</span>
                </div>
              </Table.Th>

              <Table.Th style={{minWidth:"180px",maxWidth:"180px"}}
                className="bl-header-cell"
                onClick={() => handleSort("Created")}
              >
                <div className="bl-table-headers">
                  <span>Created Date</span>
                  <span>{renderSortIcon("Created")}</span>
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
              <Table.Th style={{minWidth:"210px",maxWidth:"210px"}}
                className="bl-header-cell"
                onClick={() => handleSort("Resolved")}
              >
                <div className="bl-table-headers">
                  <span>Resolved Date & Time</span>
                  <span>{renderSortIcon("Resolved")}</span>
                </div>
              </Table.Th>

              <Table.Th style={{minWidth:"210px",maxWidth:"210px"}}
                className="bl-header-cell"
                onClick={() => handleSort("ActualResolvedTime")}
              >
                <div className="bl-table-headers">
                  <span>Actual Resolved Time</span>
                  <span>{renderSortIcon("ActualResolvedTime")}</span>
                </div>
              </Table.Th>

              <Table.Th style={{minWidth:"200px",maxWidth:"200px"}}
                className="bl-header-cell last-header"
                onClick={() => handleSort("BreachSLA")}
              >
                <div className="bl-table-headers">
                  <span>Breach SLA</span>
                  <span>{renderSortIcon("BreachSLA")}</span>
                </div>
              </Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody >
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
                  <Table.Td >{item.shortDescription}</Table.Td>
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
