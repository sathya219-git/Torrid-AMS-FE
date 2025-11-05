import React, { useRef, useState } from 'react';
import './UploadReport.css'; // Import the stylesheet
import { GrDocumentUpload } from "react-icons/gr";

// --- Mock Data ---
const initialUploadHistory = [
    { id: 1, fileName: 'Excel - 2024 - 2025', fileSize: '23.34 MB', state: 'Uploaded', uploadedAt: '9/2/2025 11:22:33 AM' },
    { id: 2, fileName: 'Excel - 2024 - 2025', fileSize: '12.09 MB', state: 'Failed', uploadedAt: '9/2/2025 10:11:22 AM' },
    { id: 3, fileName: 'Excel - 2024 - 2025', fileSize: '12.09 MB', state: 'Uploaded', uploadedAt: '9/2/2025 10:11:22 AM' },
    { id: 4, fileName: 'Excel - 2024 - 2025', fileSize: '12.09 MB', state: 'Failed', uploadedAt: '9/2/2025 10:11:22 AM' },
    { id: 4, fileName: 'Excel - 2024 - 2025', fileSize: '12.09 MB', state: 'Failed', uploadedAt: '9/2/2025 10:11:22 AM' },
    { id: 4, fileName: 'Excel - 2024 - 2025', fileSize: '12.09 MB', state: 'Failed', uploadedAt: '9/2/2025 10:11:22 AM' },
    { id: 4, fileName: 'lithin - 2024 - 2025', fileSize: '12.09 MB', state: 'Failed', uploadedAt: '9/2/2025 10:11:22 AM' },

];

/**
 * Renders the complete Upload Report UI, including the file upload area and the history table.
 */
const UploadReport = () => {
    const [uploadHistory, setUploadHistory] = useState(initialUploadHistory);
    const [searchTerm, setSearchTerm] = useState('');
    const [historyOpen, setHistoryOpen] = useState(true); // State for collapsing the history panel

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
    const filteredHistory = uploadHistory.filter(item =>
        item.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.state.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Helper function to determine the status badge class
    const getStatusClass = (state: string) => {
        if (state === 'Uploaded') return 'status-uploaded';
        if (state === 'Failed') return 'status-failed';
        return '';
    };

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



                <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "8px" }}>
                    {/* Right Panel: Uploaded History */}
                    <div className="history-panel">
                        <div className="history-header">
                            <h3 className="history-title">Uploaded History</h3>
                            <span
                                className="history-collapse-icon"
                                onClick={() => setHistoryOpen(!historyOpen)}
                            >
                                {historyOpen ? '∧' : '∨'}
                            </span>
                        </div>

                        {/* Search Bar */}
                        <div className="search-container">
                            <input
                                type="text"
                                placeholder="Search here..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                            <span className="search-icon">🔍</span>
                        </div>

                        {/* History Table (Conditional based on historyOpen state) */}
                        {historyOpen && (
                            <>
                                <div style={{ overflowX: 'auto' }}>
                                    <table className="history-table">
                                        <thead>
                                            <tr>
                                                {['S.No', 'File Name', 'File Size', 'State', 'Uploaded Date & Time', 'Uploaded File'].map(header => (
                                                    <th key={header}>{header} ↑↓</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredHistory.map((item, index) => (
                                                <tr key={item.id}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.fileName}</td>
                                                    <td>{item.fileSize}</td>
                                                    <td>
                                                        <span className={`status-badge ${getStatusClass(item.state)}`}>
                                                            {item.state}
                                                        </span>
                                                    </td>
                                                    <td>{item.uploadedAt}</td>
                                                    <td>
                                                        <a href="#" className="download-link">Download File</a>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination/Showing records */}
                                <div className="pagination-footer">
                                    <span>Showing 1-4 of {uploadHistory.length}</span>
                                    <div className="pagination-controls">
                                        <button disabled>&lt;</button>
                                        <button>&gt;</button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>


            </div>
        </div>
    );
};

export default UploadReport;