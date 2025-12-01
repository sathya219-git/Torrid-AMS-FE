import "./filterResult.css";
import FilteredResult from "../FilteredResults/filteredResults";
import CriticalIncidentList from "../CriticalIncidentList/CriticalIncidentList";
import TeamMembersPortfolio from "../TeamMembersPortfolio/teamMembersPortfolio";
import FilterCategory from "../FilterCategory/filterCategory";
import { PriorityList } from "../cards/cards.constants";
import IncidentPriorityDetailsCard from "../cards/incident-priority-details-card/incident-priority-details-card";
import { CountByPriority, filterState } from "../../store/filterStore";
import { useAtomValue } from "jotai";
import ServiceLevelMatrix from "../ServiceLevelMatrix/ServiceLevelMatrix";
// import "../TeamMembersPortfolio/teamMembersPortfolio.css";

export default function FilterResult() {
  const incidentPrioritySummary = useAtomValue(CountByPriority);
  const filterOpened = useAtomValue(filterState);

  return (
    <div className="card-padding">
      <FilterCategory />
      <FilteredResult />
      <div style={{borderRadius:"8px"}} className={`team-member-card ${filterOpened ? "opened" : "closed"}`}>
        <div style={{ backgroundColor: "#fff",padding:"22px" ,borderRadius:"8px"}}>
          <ServiceLevelMatrix></ServiceLevelMatrix>
          <div className="incident-priority-header">
            <h2>Incident Priority</h2>
          </div>
          <div className="priority-container" style={{ borderRadius: "12px" }}>
            <div className="priority-summary">
              {PriorityList.map(({ key, value }) => {
                const priorityData = incidentPrioritySummary?.priority[key];
                const stats = priorityData?.details?.[0];
                return (
                  <IncidentPriorityDetailsCard
                    key={key}
                    label={value}
                    totalResolvedTime={priorityData?.totalResolvedTime ?? "—"}
                    avgResolvedTime={priorityData?.avgResolvedTime ?? "—"}
                    breachedCount={priorityData?.breachedCount ?? "—"}
                    stats={stats}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <CriticalIncidentList />

      <TeamMembersPortfolio />
    </div>
  );
}
