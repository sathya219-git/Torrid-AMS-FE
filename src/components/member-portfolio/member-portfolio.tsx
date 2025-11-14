import { LoadingOverlay, Select } from "@mantine/core";
import { useAtomValue } from "jotai";
import { useCallback, useEffect, useState } from "react";
import { GoSortAsc, GoSortDesc } from "react-icons/go";
import backward from "../../assets/backward.png";
import forward from "../../assets/forward.png";
import { appliedFilter } from "../../store/filterStore";
import { buildFilterQuery } from "../../utils/queryBuilder";
import { TeamMembersColumnConfig } from "./member-portfolio.constants";
import "./member-portfolio.css";
import {
  MemberDetails,
  MemberDetailsResponse,
} from "./member-portfolio.interface";
import TeamMemberCard from "./team-member-card/team-member-card";

export default function MemberPortfolio() {
  const appliedFilters = useAtomValue(appliedFilter);

  const [members, setMembers] = useState<MemberDetails[]>([]);

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState("5");

  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("ascending");

  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const query = buildFilterQuery(appliedFilters);
    let url = `http://localhost:5092/api/Incident/nameandcountbypriority`;

    const params = new URLSearchParams();
    if (query) url += `?${query}`;

    params.append("PageNumber", (pageNumber || 1).toString());
    if (pageSize) params.append("PageSize", pageSize.toString());
    if (sortBy) params.append("SortBy", sortBy);
    if (sortOrder) params.append("SortOrder", sortOrder);

    url += query ? `&${params.toString()}` : `?${params.toString()}`;

    fetch(url)
      .then((res) => {
        res.json().then((data: MemberDetailsResponse) => {
          setMembers(data.memberDetails);
          setTotalRecords(data.pagination.totalRecords);
          setTotalPages(data.pagination.totalPages);
          setPageNumber(data.pagination.page);
          setPageSize(data.pagination.pageSize.toString());
        });
      })
      .catch((err) => {
        console.error("Error fetching member summary:", err);
        setMembers([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [appliedFilters, pageNumber, pageSize, sortBy, sortOrder]);

  const goToFirstPage = useCallback(() => {
    setPageNumber(1);
  }, []);

  const goToLastPage = useCallback(() => {
    setPageNumber(totalPages);
  }, []);

  const goToPreviousPage = useCallback(() => {
    if (pageNumber > 1) setPageNumber(pageNumber - 1);
  }, [pageNumber]);

  const goToNextPage = useCallback(() => {
    if (pageNumber < totalPages) setPageNumber(pageNumber + 1);
  }, [totalPages, pageNumber]);

  const onSort = useCallback(
    (column: string) => {
      if (sortBy === column) {
        setSortOrder(sortOrder === "ascending" ? "descending" : "ascending");
      } else {
        setSortBy(column);
        setSortOrder("ascending");
      }
    },
    [sortOrder, sortBy]
  );

  return (
    <div className="team-portfolio-container">
      {/* Header */}
      <header className="portfolio-header">
        <h1 style={{ color: "#333B69" }}>Team Member Portfolio</h1>
      </header>

      {/* Main List */}
      <main className="member-list">
        <LoadingOverlay
          visible={loading}
          zIndex={1000}
          overlayProps={{ blur: 2 }}
        />
        {/* Table Header */}
        <div className="member-card header-row">
          <div className="metrics-grid">
            {TeamMembersColumnConfig.map((col) => (
              <div
                key={col.key}
                className="metric-item sortable"
                onClick={() => onSort(col.key)}
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  // justifyContent: "center",
                  gap: "4px",
                  fontWeight: "600",
                  color: "#333B69",
                  flexDirection: "row",
                }}
              >
                {col.label}
                {sortBy === col.key ? (
                  sortOrder === "ascending" ? (
                    <GoSortAsc size={16} />
                  ) : (
                    <GoSortDesc size={16} />
                  )
                ) : (
                  <GoSortAsc size={16} style={{ opacity: 0.3 }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Data Rows */}
        {members.length > 0 ? (
          members.map((member, index) => (
            <TeamMemberCard key={index} member={member} />
          ))
        ) : (
          <p>No data available.</p>
        )}
      </main>

      {/* Footer Pagination */}
      <footer className="portfolio-footer">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: "9px",
          }}
        >
          <span>
            Page {pageNumber} of {totalPages} ({totalRecords} records)
          </span>
          <span> | Page size:</span>
          <Select
            style={{ width: "70px" }}
            placeholder="Page size"
            data={["5", "10", "15", "20"]}
            value={pageSize}
            onChange={(val) => {
              if (val) {
                setPageSize(val);
                setPageNumber(1);
              }
            }}
            comboboxProps={{
              position: "bottom",
              middlewares: { flip: false, shift: false },
              offset: 0,
            }}
            styles={{
              input: {
                border: "1px solid #ccc",
                "&:focus": {
                  borderColor: "black",
                },
              },
            }}
          />
        </div>

        <div className="member-portpolio-pagination">
          {/* First Page */}
          <button
            style={{
              borderRadius: "6px 0 0 6px",
              border: " 1px solid #33303111",
            }}
            className="page-control"
            onClick={goToFirstPage}
            disabled={pageNumber === 1}
          >
            <img src={forward} />
            <img src={forward} />
          </button>

          {/* Previous */}
          <button
            style={{ border: " 1px solid #33303111" }}
            className="page-control"
            onClick={goToPreviousPage}
            disabled={pageNumber === 1}
          >
            <img src={forward} />
          </button>

          {/* Next */}
          <button
            style={{ border: " 1px solid #33303111" }}
            className="page-control"
            onClick={goToNextPage}
            disabled={pageNumber === totalPages}
          >
            <img src={backward} />
          </button>

          {/* Last */}
          <button
            style={{
              borderRadius: "0 6px 6px 0",
              border: " 1px solid #33303111",
            }}
            className="page-control"
            onClick={goToLastPage}
            disabled={pageNumber === totalPages}
          >
            <img src={backward} />
            <img src={backward} />
          </button>
        </div>
      </footer>
    </div>
  );
}
