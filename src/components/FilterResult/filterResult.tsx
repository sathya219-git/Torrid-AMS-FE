import "./filterResult.css";
import FilteredResult from "../FilteredResults/filteredResults";
import CriticalIncidentList from "../CriticalIncidentList/CriticalIncidentList";
import TeamMembersPortfolio from "../TeamMembersPortfolio/teamMembersPortfolio";
import { useAtomValue } from "jotai";
import { filterState } from "../../store/filterStore";
import { useEffect } from "react";
import FilterCategory from "../FilterCategory/filterCategory";
// import FilterCategory from "../FilterCategory/filterCategory";

export default function FilterResult() {
  const filterOpened = useAtomValue(filterState);

  useEffect(() => {
    console.log(filterOpened);
  }, [filterOpened]);

  return (
    <div className="card-padding">
      <FilterCategory />
      <FilteredResult />

      <CriticalIncidentList />

      <TeamMembersPortfolio />
    </div>
  );
}
