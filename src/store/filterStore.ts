import { atom } from "jotai";

export const filterState = atom(true);

export interface FilterState {
  assignmentGroup: string[];
  duration: {
    from: Date | null;
    to: Date | null;
  };
  category: string[];
  incidentPriority: string[];
  status: string[];
  teamMember: string[];
}

export type FilterKeys =
  | "assignmentGroup"
  | "duration"
  | "category"
  | "incidentPriority"
  | "status"
  | "teamMember";

export const selectedFilter = atom<FilterState>({
  assignmentGroup: [],
  duration: {
    from: null,
    to: null,
  },
  category: [],
  incidentPriority: [],
  status: [],
  teamMember: [],
});

export const appliedFilter = atom<FilterState>({
  assignmentGroup: [],
  duration: {
    from: null,
    to: null,
  },
  category: [],
  incidentPriority: [],
  status: [],
  teamMember: [],
});

export const resetEnabled = atom((get) => {
  const filter = get(appliedFilter);
  return (
    filter.assignmentGroup.length > 0 ||
    filter.category.length > 0 ||
    filter.incidentPriority.length > 0 ||
    filter.status.length > 0 ||
    filter.teamMember.length > 0 ||
    filter.duration.from !== null ||
    filter.duration.to !== null
  );
});

export const filterEnabled = atom((get) => {
  const filter = get(selectedFilter);
  return (
    filter.assignmentGroup.length > 0 ||
    filter.category.length > 0 ||
    filter.incidentPriority.length > 0 ||
    filter.status.length > 0 ||
    filter.teamMember.length > 0 ||
    filter.duration.from !== null ||
    filter.duration.to !== null
  );
});
