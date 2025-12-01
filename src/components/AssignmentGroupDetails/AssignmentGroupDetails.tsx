import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useMemo } from "react";
import { appliedFilter, AssignmentGroups, filterState, InitiateAPI } from "../../store/filterStore";
import "./AssignmentGroupDetails.css";
export default function AssignmentGroupDetails() {
  const initiateAPI = useSetAtom(InitiateAPI);
  const appliedFilters = useAtomValue(appliedFilter);
  const torridGroupDetails= useAtomValue(AssignmentGroups);

    const expand=useAtomValue(filterState)
  const apiUrl = useMemo(() => {
    const params = new URLSearchParams();

    if (appliedFilters.Category?.length > 0) {
      params.append("Category", appliedFilters.Category.join(","));
    }
    if (appliedFilters.AssignmentGroup?.length > 0) {
      params.append(
        "AssignmentGroup",
        appliedFilters.AssignmentGroup.join(",")
      );
    }
    if (appliedFilters.State?.length > 0) {
      params.append("State", appliedFilters.State.join(","));
    }
    if (appliedFilters.AssignedToName?.length > 0) {
      params.append("AssignedToName", appliedFilters.AssignedToName.join(","));
    }
    if (appliedFilters.FromDate) {
      const formatted = new Date(appliedFilters.FromDate).toLocaleString(
        "en-US"
      );
      params.append("FromDate", formatted);
    }
    if (appliedFilters.ToDate) {
      const formatted = new Date(appliedFilters.ToDate).toLocaleString("en-US");
      params.append("ToDate", formatted);
    }

    const query = params.size > 0 ? `&${params.toString()}` : "";

    return `http://localhost:5092/api/Incident/assignmentgroups?${query}`;
  }, [appliedFilters]);

  useEffect(() => {
    initiateAPI((prev) => {
      const curr = new Map(prev);
      curr.set(apiUrl, {
        method: "GET",
        body: null,
      });      
      return curr;
    });
  }, [apiUrl]);
  return (
    <div>
      <div className="assignement-group-details-heading">
        <h2>Assignment Torrid Group</h2>
      </div>

      <div className="groups-container">
        {torridGroupDetails.map((value) => (
          <div className="group-details" key={value.assignmentGroupName}>
            <h3>{value.assignmentGroupName}</h3>
            <p>{value.incidentCount}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
