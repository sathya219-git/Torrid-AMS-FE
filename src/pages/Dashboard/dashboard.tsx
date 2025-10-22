import "./dashboard.css";
import Header from "../../components/Header/header";

import FilterCollapse from "../../components/FilterCollapse/filterCollapse";
import FilterResult from "../../components/FilterResult/filterResult";
import MainHeader from "../../components/MainHeader/mainHeader";

export default function Dashboard() {
  return (
    <div className="main">
      <MainHeader />
      <div className="page-header">
        <Header />
      </div>
      <div className="filter-content">
        <FilterCollapse />
        <FilterResult />
      </div>
    </div>
  );
}
