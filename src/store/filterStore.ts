import { atom } from "jotai";

export const filterState = atom(true);

export interface PaginatedRequest {
  PageNumber: number;
  PageSize: number;
  SortOrder: string;
  SortBy: string;
  Search: string;
}

export interface FilterChip {
  key:
    | "AssignmentGroup"
    | "FromDate"
    | "ToDate"
    | "Category"
    | "Priority"
    | "State"
    | "AssignedToName";
  value: string;
}

export interface FilterState {
  AssignmentGroup: string[];
  FromDate: Date | null;
  ToDate: Date | null;
  Category: string[];
  Priority: string[];
  State: string[];
  AssignedToName: string[];
}

export const selectedFilter = atom<FilterState>({
  AssignmentGroup: [],
  FromDate: null,
  ToDate: null,
  Category: [],
  Priority: [],
  State: [],
  AssignedToName: [],
});

export const appliedFilter = atom<FilterState>({
  AssignmentGroup: [],
  FromDate: null,
  ToDate: null,
  Category: [],
  Priority: [],
  State: [],
  AssignedToName: [],
});

export const resetEnabled = atom((get) => {
  const filter = get(appliedFilter);
  return (
    filter.AssignmentGroup.length > 0 ||
    filter.Category.length > 0 ||
    filter.Priority.length > 0 ||
    filter.State.length > 0 ||
    filter.AssignedToName.length > 0 ||
    filter.FromDate !== null ||
    filter.ToDate !== null
  );
});

export const filterEnabled = atom((get) => {
  const filter = get(selectedFilter);
  return (
    filter.AssignmentGroup.length > 0 ||
    filter.Category.length > 0 ||
    filter.Priority.length > 0 ||
    filter.State.length > 0 ||
    filter.AssignedToName.length > 0 ||
    filter.FromDate !== null ||
    filter.ToDate !== null
  );
});

export const filterChips = atom((get) => {
  const filters = get(appliedFilter);
  const chips: FilterChip[] = [];
  chips.push(
    ...filters.AssignmentGroup.map((value) => {
      return {
        key: "AssignmentGroup",
        value: value,
      } as FilterChip;
    })
  );
  if (filters.FromDate !== null) {
    chips.push({
      key: "FromDate",
      value: `From : ${filters.FromDate.toLocaleDateString("en-US")}`,
    });
  }
  if (filters.ToDate !== null) {
    chips.push({
      key: "ToDate",
      value: `To : ${filters.ToDate.toLocaleDateString("en-US")}`,
    });
  }
  chips.push(
    ...filters.Category.map((value) => {
      return {
        key: "Category",
        value: value,
      } as FilterChip;
    })
  );
  chips.push(
    ...filters.Priority.map((value) => {
      return {
        key: "Priority",
        value: value,
      } as FilterChip;
    })
  );
  chips.push(
    ...filters.State.map((value) => {
      return {
        key: "State",
        value: value,
      } as FilterChip;
    })
  );
  chips.push(
    ...filters.AssignedToName.map((value) => {
      return {
        key: "AssignedToName",
        value: value,
      } as FilterChip;
    })
  );
  return chips;
});

export const incidentAPIRequests = atom<Record<string, PaginatedRequest>>({
  "All Incidents": {
    PageNumber: 1,
    PageSize: 8,
    SortOrder: "",
    SortBy: "",
    Search: "",
  },
});

export interface Incident {
  incidentNo: string;
  description: string;
  category: string;
  resolutionNotes: string;
  state: string;
  resolvedDateTime: string;
}

export interface PaginatedResponse {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  incidents: Incident[];
}

export const incidentAPIResponses = atom<Record<string, PaginatedResponse>>({});

export interface BreachFilters {
  actualResolvedTime: string[];
  breachSLA: string[];
  incidentId: string[];
}

export const breachFiltersAtom = atom<BreachFilters>({
  actualResolvedTime: [],
  breachSLA: [],
  incidentId: [],
});
