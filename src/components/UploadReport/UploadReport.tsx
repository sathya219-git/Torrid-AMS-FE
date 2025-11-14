import React, { useEffect, useRef, useState } from "react";
import "./UploadReport.css";
import { GrDocumentUpload } from "react-icons/gr";
import { Input } from "@mantine/core";
import { GoSortAsc, GoSortDesc } from "react-icons/go";
import backward from "../../assets/backward.png";
import forward from "../../assets/forward.png";
import { notifications } from "@mantine/notifications";
import { useAtom } from "jotai";
import { tabValue } from "../../store/filterStore";

interface FileDetail {
  id: number;
  fileName: string | null;
  fileSize: string;
  uploadedDate: string;
}

interface Pagination {
  page: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  sortBy: string;
}

interface ApiResponse {
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  items: FileDetail[];
}

const UploadReport = () => {
  const [data, setData] = useState<FileDetail[]>([]);
  const [, setTab] = useAtom(tabValue);

  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 6,
    totalRecords: 0,
    totalPages: 0,
    sortBy: "uploadedDate",
  });
  const [sortBy, setSortBy] = useState<string>("uploadedDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchText, setSearchText] = useState<string>("");
  const [refreshPage, setRefreshPage] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ✅ Fetch API data whenever sort, page, or search changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = `http://localhost:5092/api/files/history?SearchText=${encodeURIComponent(
          searchText
        )}&SortBy=${sortBy}&SortDir=${sortOrder}&PageNumber=${
          pagination.page
        }&PageSize=${pagination.pageSize}`;

        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Failed to fetch data");

        const json: ApiResponse = await response.json();

        setData(json.items || []);
        setPagination((prev) => ({
          ...prev,
          totalRecords: json.totalCount,
          totalPages: json.totalPages,
          page: json.pageNumber,
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [refreshPage, sortBy, sortOrder, pagination.page, searchText]);

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

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("File", file));

    // ✅ Show a loading notification first
    const loadingId = notifications.show({
      title: "Uploading...",
      message: "Please wait while the file(s) are being uploaded.",
      color: "blue",
      autoClose: false, // stays until manually closed
      loading: true,
    });

    try {
      const response = await fetch("http://localhost:5092/api/files/upload", {
        method: "POST",
        body: formData,
      });

      // remove loading notification
      notifications.hide(loadingId);

      if (response.ok) {
        if (refreshPage) {
          setRefreshPage(false);
        } else {
          setRefreshPage(true);
        }

        // ✅ Save uploaded files locally (your existing logic)
        const existing = JSON.parse(
          localStorage.getItem("uploadedFiles") || "[]"
        );
        const newFiles = Array.from(files).map((file) => ({
          name: file.name,
          size: `${(file.size / 1024).toFixed(2)} KB`,
          type: file.type,
          uploadedAt: new Date().toISOString(),
        }));
        const updatedFiles = [...newFiles, ...existing];
        localStorage.setItem("uploadedFiles", JSON.stringify(updatedFiles));
        window.dispatchEvent(new Event("uploadedFilesUpdated"));

        // ✅ Success notification
        notifications.show({
          title: "✅ Upload Successful",
          message: `${newFiles.length} file(s) uploaded successfully!`,
          color: "green",
          radius: "md",
          styles: {
            root: {
              backgroundColor: "#e6ffed",
              border: "1px solid #27ae60",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            },
            title: { fontWeight: 600, color: "#145a32" },
            description: { color: "#196f3d" },
          },
        });
      } else {
        // ❌ Failure notification
        notifications.show({
          position: "top-right",
          title: "Upload Failed",
          message: "Something went wrong while uploading the file.",
          color: "red",
          radius: "md",
          styles: {
            root: {
              backgroundColor: "#ffe6e6",
              border: "1px solid #e74c3c",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            },
            title: { fontWeight: 600, color: "#922b21" },
            description: { color: "#943126" },
          },
        });
      }
    } catch (error) {
      notifications.hide(loadingId);

      // ⚠️ Network or exception notification
      notifications.show({
        title: "Network Error",
        message: "Unable to upload. Please check your connection.",
        color: "yellow",
        radius: "md",
        styles: {
          root: {
            backgroundColor: "#fff8e1",
            border: "1px solid #f1c40f",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          },
          title: { fontWeight: 600, color: "#7d6608" },
          description: { color: "#9a7d0a" },
        },
      });
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // ✅ Search debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    setPagination((prev) => ({ ...prev, page: 1 })); // reset to first page
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
  const pushToDashboard = async (id: any) => {
    try {
      const apiUrl = `http://localhost:5092/api/files/import?uploadHistoryId=${id}`;
      const response = await fetch(apiUrl, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await response.json();

      // ✅ If response is fine, set atom to true
      setTab(true);
    } catch (error) {
      console.error("Error calling API:", error);
    }
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
              onInput={handleFileChange}
            />
          </div>
        </div>

        {/* Right History Section */}
        <div className="history-section">
          <div className="history-content">
            <div className="table-container-file-upload">
              <div className="table-header">
                <h2>Uploaded File History</h2>
                <Input
                  placeholder="Search here..."
                  value={searchText}
                  onChange={handleSearchChange}
                />
              </div>

              {
                //   loading ? (
                //     <p className="loading-text">Loading...</p>
                //   ) :
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th onClick={() => handleSort("fileName")}>
                        <div className="sortable-header">
                          <span>File Name</span>
                          {getSortIcon("fileName")}
                        </div>
                      </th>
                      <th onClick={() => handleSort("fileSize")}>
                        <div className="sortable-header">
                          <span>File Size</span>
                          {getSortIcon("fileSize")}
                        </div>
                      </th>
                      <th onClick={() => handleSort("uploadedDate")}>
                        <div className="sortable-header">
                          <span>Updated Time & Date</span>
                          {getSortIcon("uploadedDate")}
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
                          <td>{item.fileName || "-"}</td>
                          <td>{item.fileSize || 0}</td>
                          <td>
                            {new Date(item.uploadedDate).toLocaleString() ||
                              "-"}
                          </td>
                          <td>
                            <span
                              onClick={() => pushToDashboard(item.id)}
                              style={{
                                padding: "8px 16px",
                                borderRadius: "9px",
                                backgroundColor: "#abcbeeff",
                                color: "black",
                                fontWeight: "500",
                                cursor: "pointer",
                                boxShadow: "0 2px 2px rgba(0, 0, 0, 0.2)", // ✨ soft shado2
                                transition: "all 0.3s ease",
                              }}
                            >
                              Show Dashboard
                            </span>
                          </td>
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
              }
            </div>
          </div>

          {/* Pagination Footer */}
          <footer className="portfolio-footer">
            <span>
              Page {pagination.page} of {pagination.totalPages} ({" "}
              {pagination.totalRecords} records)
            </span>
            <div className="pagination">
              <button
                className="page-control"
                disabled={pagination.page === 1}
                onClick={() => setPagination((p) => ({ ...p, page: 1 }))}
              >
                <img src={forward} />
                <img src={forward} />
              </button>

              <button
                className="page-control"
                disabled={pagination.page === 1}
                onClick={() => handlePageChange("prev")}
              >
                <img src={forward} />
              </button>

              <button
                className="page-control"
                disabled={pagination.page === pagination.totalPages}
                onClick={() => handlePageChange("next")}
              >
                <img src={backward} />
              </button>

              <button
                className="page-control"
                disabled={pagination.page === pagination.totalPages}
                onClick={() =>
                  setPagination((p) => ({ ...p, page: p.totalPages }))
                }
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
