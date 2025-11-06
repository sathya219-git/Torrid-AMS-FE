import React, { useEffect, useRef, useState } from 'react';
import './UploadReport.css'; // Import the stylesheet
import { GrDocumentUpload } from "react-icons/gr";
interface DataItem {
    name: string;
    filename: string;
    filesize: string;
    state: string;
    updatedtime: string;
}

interface Pagination {
    page: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
    sortBy: string;
}

interface ApiResponse {
    memberDetails: DataItem[];
    pagination: Pagination;
}



/**
 * Renders the complete Upload Report UI, including the file upload area and the history table.
 */
const UploadReport = () => {
    const [data, setData] = useState<DataItem[]>([]);
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        pageSize: 4,
        totalRecords: 0,
        totalPages: 0,
        sortBy: "name",
    });
    const [sortBy, setSortBy] = useState<keyof DataItem>("name");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    // Mock API data (you can remove when real API is ready)
    const mockResponse: ApiResponse = {
        memberDetails: [
            {
                name: "Aparna Prakash",
                filename: "zrfdsdfd",
                filesize: "10",
                state: "uploaded",
                updatedtime: "25-12-23 04:09",
            },
            {
                name: "Aravind Gandla",
                filename: "report.xlsx",
                filesize: "5",
                state: "pending",
                updatedtime: "12-10-23 09:20",
            },
            {
                name: "Vishal Kumar",
                filename: "invoice.pdf",
                filesize: "12",
                state: "uploaded",
                updatedtime: "02-11-23 14:15",
            },
            {
                name: "Aparna Prakash",
                filename: "zrfdsdfd",
                filesize: "10",
                state: "uploaded",
                updatedtime: "25-12-23 04:09",
            },
            {
                name: "Aravind Gandla",
                filename: "report.xlsx",
                filesize: "5",
                state: "pending",
                updatedtime: "12-10-23 09:20",
            },
            {
                name: "Vishal Kumar",
                filename: "invoice.pdf",
                filesize: "12",
                state: "uploaded",
                updatedtime: "02-11-23 14:15",
            }, {
                name: "Aparna Prakash",
                filename: "zrfdsdfd",
                filesize: "10",
                state: "uploaded",
                updatedtime: "25-12-23 04:09",
            },
            {
                name: "Aravind Gandla",
                filename: "report.xlsx",
                filesize: "5",
                state: "pending",
                updatedtime: "12-10-23 09:20",
            },
            {
                name: "Vishal Kumar",
                filename: "invoice.pdf",
                filesize: "12",
                state: "uploaded",
                updatedtime: "02-11-23 14:15",
            },
        ],
        pagination: {
            page: 1,
            pageSize: 3,
            totalRecords: 95,
            totalPages: 10,
            sortBy: "date",
        },
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 🧠 Uncomment this when API is ready
                /*
                const response = await fetch(
                  `http://localhost:5092/api/Incident/nameandcountbypriority?SortBy=${sortBy}&SortOrder=${sortOrder}&PageNumber=${pagination.page}&PageSize=${pagination.pageSize}`
                );
                if (!response.ok) {
                  throw new Error("Failed to fetch data");
                }
        
                const json: ApiResponse = await response.json();
                setData(json.memberDetails);
                setPagination(json.pagination);
                */

                // 🧩 For now: simulate API using mock data
                let sortedData = [...mockResponse.memberDetails];
                sortedData.sort((a, b) => {
                    const valA = a[sortBy].toString().toLowerCase();
                    const valB = b[sortBy].toString().toLowerCase();
                    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
                    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
                    return 0;
                });

                setData(sortedData);
                setPagination(mockResponse.pagination);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [sortBy, sortOrder, pagination.page]);

    const handleSort = (column: keyof DataItem) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(column);
            setSortOrder("asc");
        }
    };

    const handlePageChange = (direction: "next" | "prev") => {
        setPagination((prev) => ({
            ...prev,
            page:
                direction === "next"
                    ? Math.min(prev.page + 1, prev.totalPages)
                    : Math.max(prev.page - 1, 1),
        }));
    };

    // Mock function for file browsing/upload
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleBrowseFiles = () => {
        // Trigger the hidden file input click
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            console.log("Selected file:", file.name);
            //   alert(`File selected: ${file.name}`);
            // You can add your upload logic here
        }
    };

    // Function to filter history based on search term



    return (
        <div className="upload-report-container">
            <div className="report-header">
                <h2 className="report-title">Upload Report</h2>
                <button className="btn-primary">Push to dashboard</button>
            </div>

            <div className="content-wrapper">
                {/* Left Panel: Upload Area */}

                <div className='main-upload-area'>
                    <div className="upload-area">
                        <div className="upload-icon"><GrDocumentUpload />
                        </div> {/* Placeholder for upload icon */}
                        <p className="upload-text-main">
                            Choose a file or drag and drop here..
                        </p>
                        <p className="upload-text-support">
                            Support **Excel** format upto **50MB**
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



                <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "8px", width: "100%" }}>
                    {/* Right Panel: Uploaded History */}
                    <div className="table-container-file-upload ">
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>S.No</th>
                
                                    <th onClick={() => handleSort("filename")}>
                                        File Name {sortBy === "filename" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                                    </th>
                                    <th onClick={() => handleSort("filesize")}>
                                        File Size {sortBy === "filesize" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                                    </th>
                                    
                                    <th onClick={() => handleSort("updatedtime")}>
                                        Updated Time & Date {sortBy === "updatedtime" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                                    </th>
                                    <th onClick={() => handleSort("state")}>
                                        Action {sortBy === "state" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {data.map((item, idx) => (
                                    <tr key={idx}>
                                        <td>{(pagination.page - 1) * pagination.pageSize + idx + 1}</td>
                                        {/* <td>{item.name}</td> */}
                                        <td>{item.filename}</td>
                                        <td>{item.filesize}</td>
                                        <td>{item.updatedtime}</td>
                                                                                <td>{item.state}</td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>


                        <div className="pagination">
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
                        </div>
                    </div>

                </div>


            </div>
        </div>
    );
};

export default UploadReport;