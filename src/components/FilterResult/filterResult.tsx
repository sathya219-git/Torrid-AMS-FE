import "./filterResult.css";
import FilteredResult from "../FilteredResults/filteredResults";
import CriticalIncidentList from "../CriticalIncidentList/CriticalIncidentList";
import TeamMembersPortfolio from "../TeamMembersPortfolio/teamMembersPortfolio";
import FilterCategory from "../FilterCategory/filterCategory";

export default function FilterResult() {
  return (
    <div className="card-padding">
      <FilterCategory />
      <FilteredResult />

      <CriticalIncidentList />

      <TeamMembersPortfolio />
    </div>
  );
}
