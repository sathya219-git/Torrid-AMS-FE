import "./dashboard.css";
import Header from "../../components/Header/header";

import FilterCollapse from "../../components/FilterCollapse/filterCollapse";
import FilterResult from "../../components/FilterResult/filterResult";
import MainHeader from "../../components/MainHeader/mainHeader";
import { useState } from "react";
import UploadReport from "../../components/UploadReport/UploadReport";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // This wrapper handles Mantine's null case safely
  const handleTabChange = (value: string | null) => {
    if (value) setActiveTab(value);
  };

  return (
    <div className="main">
      <MainHeader activeTab={activeTab} onTabChange={handleTabChange} />

      {activeTab === "dashboard" && (
        <>
          <div className="page-header">
            <Header />
          </div>
          <div className="filter-content">
            <FilterCollapse />
            <FilterResult />
          </div>
        </>
      )}

      {activeTab === "Upload-Report" && <UploadReport />}
    </div>
  );
}