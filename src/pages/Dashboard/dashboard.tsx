import "./dashboard.css";
import Header from "../../components/Header/header";
import FilterCollapse from "../../components/FilterCollapse/filterCollapse";
import FilterResult from "../../components/FilterResult/filterResult";
import MainHeader from "../../components/MainHeader/mainHeader";
import UploadReport from "../../components/UploadReport/UploadReport";
import { useEffect } from "react";
import { useAtom } from "jotai";
import { tabValue } from "../../store/filterStore";

export default function Dashboard() {
  const [tab, setTab] = useAtom(tabValue); // ✅ Jotai atom (true/false)

  // 🧠 Map atom (boolean) → tab name
  const activeTab = tab ? "dashboard" : "Upload-Report";

  // 🧩 Handle tab change from UI
  const handleTabChange = (value:any) => {
    if (value) {
      setTab(value === "dashboard"); // ✅ update atom based on tab
    }
  };

  return (
    <div className="main">
      <MainHeader activeTab={activeTab} onTabChange={handleTabChange} />
      {tab ? (
        <>
          <div className="page-header">
            <Header />
          </div>
          <div className="filter-content">
            <FilterCollapse />
            <FilterResult />
          </div>
        </>
      ) : (
        <UploadReport />
      )}
    </div>
  );
}
