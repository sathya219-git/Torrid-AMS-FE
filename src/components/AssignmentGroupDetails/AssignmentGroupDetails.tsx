import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useMemo } from "react";
import {
  appliedFilter,
  AssignmentGroups,
  filterState,
  InitiateAPI,
} from "../../store/filterStore";
import "./AssignmentGroupDetails.css";
export default function AssignmentGroupDetails() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const initiateAPI = useSetAtom(InitiateAPI);
  const appliedFilters = useAtomValue(appliedFilter);
  const torridGroupDetails = useAtomValue(AssignmentGroups);

  const filterOpened = useAtomValue(filterState);
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
      const formatted = new Date(appliedFilters.FromDate).toLocaleDateString(
        "en-US"
      );
      params.append("FromDate", `${formatted},00:00:00 AM`);
    }
    if (appliedFilters.ToDate) {
      const formatted = new Date(appliedFilters.ToDate).toLocaleDateString("en-US");
      params.append("ToDate", `${formatted},11:59:59 PM`);
    }

    const query = params.size > 0 ? `&${params.toString()}` : "";

    return `${API_BASE_URL}/api/Incident/assignmentgroups?${query}`;
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
    <div style={{ marginTop: "35px" }}>
      <div className="assignement-group-details-heading">
        <h2>Assignment Torrid Group</h2>
      </div>

      <div className="groups-container">
        {
          // Check if torridGroupDetails is defined AND is an array AND has elements
          torridGroupDetails &&
          Array.isArray(torridGroupDetails) &&
          torridGroupDetails.length > 0 ? (
            // **TRUE:** If data exists, map and render the group details
            torridGroupDetails.map((value) => (
              <div className="group-details" key={value.assignmentGroupName}>
                <h3>{value.assignmentGroupName}</h3>
                <p>{value.incidentCount}</p>
              </div>
            ))
          ) : (
            // **FALSE:** If data is missing or empty, show the message
            <div className={`fil-result ${filterOpened ? "opened" : "closed"}`}>
              <p> No torrid groups to display.</p>
            </div>
          )
        }
      </div>
    </div>
  );
}
