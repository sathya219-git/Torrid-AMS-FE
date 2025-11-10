import React, { useEffect, useRef, useState } from "react";
import "./UploadReport.css";
import { GrDocumentUpload } from "react-icons/gr";
import { Input } from "@mantine/core";
import { GoSortAsc, GoSortDesc } from "react-icons/go";
import backward from "../../assets/backward.png";
import forward from "../../assets/forward.png";
interface FileDetail {
    filename: string | null;
    fileSize: number;
    updateddateandtime: string | number;
    otherfield?: string;
}

interface Pagination {
    page: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
    sortBy: string;
}

interface ApiResponse {
    fileDetailes: FileDetail[];
    pagination: Pagination;
}

const UploadReport = () => {
    const [data, setData] = useState<FileDetail[]>([]);
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        pageSize: 5,
        totalRecords: 0,
        totalPages: 0,
        sortBy: "filename",
    });
    const [sortBy, setSortBy] = useState<string>("filename");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [loading, setLoading] = useState<boolean>(false);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // ✅ Fetch API data whenever sort or page changes
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                const apiUrl = `http://localhost:5092/api/Incident/nameandcountbypriority?SortBy=${sortBy}&SortOrder=${sortOrder}&PageNumber=${pagination.page}&PageSize=${pagination.pageSize}`;
                console.log("API URL:", apiUrl);

                const response = await fetch(apiUrl);
                if (!response.ok) throw new Error("Failed to fetch data");

                const json: ApiResponse = await response.json();
                setData(json.fileDetailes || []);
                setPagination(json.pagination);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [sortBy, sortOrder, pagination.page]);

    // ✅ Handle column sorting
    const handleSort = (column: string) => {
        setSortOrder((prev) =>
            sortBy === column ? (prev === "asc" ? "desc" : "asc") : "asc"
        );
        setSortBy(column);
    };

    // ✅ Pagination controls
    const handlePageChange = (direction: "next" | "prev") => {
        setPagination((prev) => ({
            ...prev,
            page:
                direction === "next"
                    ? Math.min(prev.page + 1, prev.totalPages)
                    : Math.max(prev.page - 1, 1),
        }));
    };

    // ✅ File handling
    const handleBrowseFiles = () => fileInputRef.current?.click();
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const files = event.target.files;
  if (!files || files.length === 0) return;

  // Get existing files from localStorage (if any)
  const existing = JSON.parse(localStorage.getItem("uploadedFiles") || "[]");

  // Map new files
  const newFiles = Array.from(files).map((file) => ({
    name: file.name,
    size: `${(file.size / 1024).toFixed(2)} KB`,
    type: file.type,
    uploadedAt: new Date().toISOString(),
  }));

  // Put new files first (latest on top)
  const updatedFiles = [...newFiles, ...existing];

  // Store in localStorage
  localStorage.setItem("uploadedFiles", JSON.stringify(updatedFiles));

  // Trigger custom event to update notification component
  window.dispatchEvent(new Event("uploadedFilesUpdated"));

  console.log("Files uploaded:", updatedFiles);
};
    // ✅ Helper: Always show arrow indicators
    const getSortIcon = (column: string) => {
        if (sortBy === column)
            return sortOrder === "asc" ? (
                <GoSortAsc className="active-icon" />
            ) : (
                <GoSortDesc className="active-icon" />
            );
        return <GoSortAsc className="inactive-icon" />;
    };

    return (
        <div className="upload-report-container">
            <div className="report-header">
                <h2 className="report-title">Upload Report</h2>
            </div>

            <div className="content-wrapper">
                {/* Left Upload Section */}
                <div className="main-upload-area">
                    <div className="upload-area">
                        <div className="upload-icon">
                            <GrDocumentUpload />
                        </div>
                        <p className="upload-text-main">
                            Choose a file or drag and drop here..
                        </p>
                        <p className="upload-text-support">
                            Support <b>Excel</b> format up to <b>50MB</b>
                        </p>
                        <button className="btn-secondary" onClick={handleBrowseFiles}>
                            Browse Files
                        </button>
                        <input
                            type="file"
                            accept=".xls,.xlsx"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                        />
                    </div>
                </div>

                {/* Right History Section */}
                <div className="history-section">
                    <div className="history-content">
                        <div className="table-container-file-upload">
                            <div className="table-header">
                                <h2>Uploaded File History</h2>
                                <Input placeholder="Search here..." />
                            </div>

                            {loading ? (
                                <p className="loading-text">Loading...</p>
                            ) : (
                                <table className="custom-table">
                                    <thead>
                                        <tr>
                                            <th>S.No</th>

                                            <th onClick={() => handleSort("filename")}>
                                                <div className="sortable-header">
                                                    <span>File Name</span>
                                                    {getSortIcon("filename")}
                                                </div>
                                            </th>

                                            <th onClick={() => handleSort("fileSize")}>
                                                <div className="sortable-header">
                                                    <span>File Size</span>
                                                    {getSortIcon("fileSize")}
                                                </div>
                                            </th>

                                            <th onClick={() => handleSort("updateddateandtime")}>
                                                <div className="sortable-header">
                                                    <span>Updated Time & Date</span>
                                                    {getSortIcon("updateddateandtime")}
                                                </div>
                                            </th>

                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.length > 0 ? (
                                            data.map((item, idx) => (
                                                <tr key={idx}>
                                                    <td>
                                                        {(pagination.page - 1) * pagination.pageSize +
                                                            idx +
                                                            1}
                                                    </td>
                                                    <td>{item.filename || "-"}</td>
                                                    <td>{item.fileSize || 0}</td>
                                                    <td>{item.updateddateandtime || "-"}</td>
                                                    <td>Show Dashboard</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="no-records">
                                                    No records found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                    {/* Pagination */}
                    {/* <div className="pagination">
                        <button
                            disabled={pagination.page === 1}
                            onClick={() => handlePageChange("prev")}
                        >
                            ◀ Prev
                        </button>
                        <span>
                            Page {pagination.page} of {pagination.totalPages} | Total Records:{" "}
                            {pagination.totalRecords}
                        </span>
                        <button
                            disabled={pagination.page === pagination.totalPages}
                            onClick={() => handlePageChange("next")}
                        >
                            Next ▶
                        </button>
                    </div> */}

                    <footer className="portfolio-footer">
                        <span>
                            Page 2 of 111 ( 23 records)
                        </span>
                        <div className="pagination">
                            <button
                                style={{
                                    borderRadius: "6px 0 0 6px",
                                    border: " 1px solid #33303111",
                                }}
                                className="page-control"


                            >
                                <img src={forward} />
                                <img src={forward} />
                            </button>

                            <button
                                style={{ border: " 1px solid #33303111" }}
                                className="page-control"

                            >
                                <img src={forward} />
                            </button>


                            <button
                                style={{ border: " 1px solid #33303111" }}
                                className="page-control"

                            >
                                <img src={backward} />
                            </button>

                            <button
                                style={{
                                    borderRadius: "0 6px 6px 0",
                                    border: " 1px solid #33303111",
                                }}
                                className="page-control"

                            >
                                <img src={backward} />
                                <img src={backward} />
                            </button>
                        </div>
                    </footer>

                </div>
            </div>
        </div>
    );
};

export default UploadReport;
