import "./filterResult.css";
import FilteredResult from "../FilteredResults/filteredResults";
import CriticalIncidentList from "../CriticalIncidentList/CriticalIncidentList";
import TeamMembersPortfolio from "../TeamMembersPortfolio/teamMembersPortfolio";
import { useAtomValue } from "jotai";
import { filterState } from "../../store/filterStore";
import { useEffect } from "react";

export default function FilterResult() {
  const filterOpened = useAtomValue(filterState);

  useEffect(() => {
    console.log(filterOpened);
  }, [filterOpened]);

  return (
    <div className="card-padding">
      <FilteredResult />

      <CriticalIncidentList />

      <TeamMembersPortfolio />
    </div>
  );
}
