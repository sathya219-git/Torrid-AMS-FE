import { atom } from "jotai";

export const filterState = atom(true);

export interface FilterChip {
  key:
    | "assignmentGroup"
    | "duration.from"
    | "duration.to"
    | "category"
    | "priority"
    | "status"
    | "teamMember";
  value: string;
}

export interface FilterState {
  assignmentGroup: string[];
  duration: {
    from: Date | null;
    to: Date | null;
  };
  category: string[];
  priority: string[];
  status: string[];
  teamMember: string[];
}

export const selectedFilter = atom<FilterState>({
  assignmentGroup: [],
  duration: {
    from: null,
    to: null,
  },
  category: [],
  priority: [],
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
  priority: [],
  status: [],
  teamMember: [],
});

export const resetEnabled = atom((get) => {
  const filter = get(appliedFilter);
  return (
    filter.assignmentGroup.length > 0 ||
    filter.category.length > 0 ||
    filter.priority.length > 0 ||
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
    filter.priority.length > 0 ||
    filter.status.length > 0 ||
    filter.teamMember.length > 0 ||
    filter.duration.from !== null ||
    filter.duration.to !== null
  );
});

export const filterChips = atom((get) => {
  const filters = get(appliedFilter);
  const chips: FilterChip[] = [];
  chips.push(
    ...filters.assignmentGroup.map((value) => {
      return {
        key: "assignmentGroup",
        value: value,
      } as FilterChip;
    })
  );
  if (filters.duration.from !== null) {
    chips.push({
      key: "duration.from",
      value: `From : ${filters.duration.from.toLocaleDateString("en-US")}`,
    });
  }
  if (filters.duration.to !== null) {
    chips.push({
      key: "duration.to",
      value: `To : ${filters.duration.to.toLocaleDateString("en-US")}`,
    });
  }
  chips.push(
    ...filters.category.map((value) => {
      return {
        key: "category",
        value: value,
      } as FilterChip;
    })
  );
  chips.push(
    ...filters.priority.map((value) => {
      return {
        key: "priority",
        value: value,
      } as FilterChip;
    })
  );
  chips.push(
    ...filters.status.map((value) => {
      return {
        key: "status",
        value: value,
      } as FilterChip;
    })
  );
  chips.push(
    ...filters.teamMember.map((value) => {
      return {
        key: "teamMember",
        value: value,
      } as FilterChip;
    })
  );
  return chips;
});
