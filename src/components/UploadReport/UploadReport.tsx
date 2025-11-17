import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./UploadReport.css";
import { GrDocumentUpload } from "react-icons/gr";
import { Input } from "@mantine/core";
import { GoSortAsc, GoSortDesc } from "react-icons/go";
import backward from "../../assets/backward.png";
import forward from "../../assets/forward.png";
import { useAtomValue, useSetAtom } from "jotai";
import {
  InitiateAPI,
  ReloadUploadedReportsGrid,
  UploadedReportsResponse,
} from "../../store/filterStore";
import { FileDetail } from "./upload-report.interface";

const UploadReport = () => {
  const uploadedReportsResponse = useAtomValue(UploadedReportsResponse);
  const reloadUploadedReportsGrid = useAtomValue(ReloadUploadedReportsGrid);

  const data = useMemo(() => {
    return uploadedReportsResponse?.items ?? [];
  }, [uploadedReportsResponse]);

  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = useMemo(() => 5, []);

  const totalRecords = useMemo(() => {
    return uploadedReportsResponse?.totalCount ?? 0;
  }, [uploadedReportsResponse]);

  const totalPages = useMemo(() => {
    return uploadedReportsResponse?.totalPages ?? 0;
  }, [uploadedReportsResponse]);

  const [sortBy, setSortBy] = useState<string>("uploadedDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchText, setSearchText] = useState<string>("");

  const [tempFiles, setTempFiles] = useState<FileDetail[]>([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const initiateAPI = useSetAtom(InitiateAPI);

  // ✅ Fetch API data whenever sort, page, or search changes
  useEffect(() => {
    const apiUrl = `http://localhost:5092/api/files/history?SearchText=${encodeURIComponent(
      searchText
    )}&SortBy=${sortBy}&SortDir=${sortOrder}&PageNumber=${pageNumber}&PageSize=${pageSize}`;
    initiateAPI((prev) => {
      const curr = new Map(prev);
      curr.set(apiUrl, {
        method: "GET",
        body: null,
      });
      return curr;
    });
  }, [reloadUploadedReportsGrid, sortBy, sortOrder, pageNumber, searchText]);

  // ✅ Handle column sorting
  const handleSort = (column: string) => {
    setSortOrder((prev) =>
      sortBy === column ? (prev === "asc" ? "desc" : "asc") : "asc"
    );
    setSortBy(column);
  };

  // ✅ Pagination controls
  const handlePageChange = useCallback(
    (direction: "next" | "prev") => {
      setPageNumber((prev) =>
        direction === "next"
          ? Math.min(prev + 1, totalPages)
          : Math.max(prev - 1, 1)
      );
    },
    [totalPages]
  );

  // ✅ File handling
  const handleBrowseFiles = () => fileInputRef.current?.click();

  useEffect(() => {
    const existing: FileDetail[] = JSON.parse(
      localStorage.getItem("uploadedFiles") || "[]"
    );
    const updatedFiles = [...tempFiles, ...existing];
    localStorage.setItem("uploadedFiles", JSON.stringify(updatedFiles));
  }, [reloadUploadedReportsGrid]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const tempFileList: FileDetail[] = [];
    const formData = new FormData();
    Array.from(files).forEach((file, index) => {
      formData.append("File", file);
      tempFileList.push({
        id: index,
        fileName: file.name,
        fileSize: `${(file.size / 1024).toFixed(2)} KB`,
        uploadedDate: new Date().toISOString(),
      });
    });
    setTempFiles(tempFileList);

    initiateAPI((prev) => {
      const curr = new Map(prev);
      curr.set("http://localhost:5092/api/files/upload", {
        method: "POST",
        body: formData,
      });
      return curr;
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ✅ Search debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    setPageNumber(1);
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

  const pushToDashboard = (id: any) => {
    const apiUrl = `http://localhost:5092/api/files/import?uploadHistoryId=${id}`;
    initiateAPI((prev) => {
      const curr = new Map(prev);
      curr.set(apiUrl, {
        method: "POST",
        body: undefined,
      });
      return curr;
    });
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
                  radius="md"
                  styles={{
                    input: {
                      border: "1px solid #2c2c2c31",
                      borderRadius: "8px",
                      padding: "22px",
                      outline: "none",
                      boxShadow: "none",

                      "&:focus": {
                        outline: "none",
                        boxShadow: "none",
                        // borderColor: "inherit", // optional subtle border
                      },
                    },
                  }}
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
                          <td>{(pageNumber - 1) * pageSize + idx + 1}</td>
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
              Page {pageNumber} of {totalPages} ( {totalRecords} records)
            </span>
            <div className="pagination">
              <button
                className="page-control"
                disabled={pageNumber === 1}
                onClick={() => setPageNumber(1)}
              >
                <img src={forward} />
                <img src={forward} />
              </button>

              <button
                className="page-control"
                disabled={pageNumber === 1}
                onClick={() => handlePageChange("prev")}
              >
                <img src={forward} />
              </button>

              <button
                className="page-control"
                disabled={pageNumber === totalPages}
                onClick={() => handlePageChange("next")}
              >
                <img src={backward} />
              </button>

              <button
                className="page-control"
                disabled={pageNumber === totalPages}
                onClick={() => setPageNumber(totalPages)}
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
