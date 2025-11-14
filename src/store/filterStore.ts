import { atom } from "jotai";
import { CategoryItem } from "../components/Category/category.interface";
import { StatusItem } from "../components/Status/status.interface";
import { TeamMember } from "../components/TeamMembers/team-members.interface";
import {
  BreachFilters,
  FilterChip,
  FilterState,
  PaginatedRequest,
  PaginatedResponse,
} from "./filter-store.interface";

export const filterState = atom(false);

export const tabValue = atom(true);

export const groups = atom<string[]>([]);
export const selectedGroups = atom<string[]>([]);

export const selectedFromDate = atom<Date | null>(null);
export const selectedToDate = atom<Date | null>(null);

export const categories = atom<CategoryItem[]>([]);
export const selectedCategories = atom<string[]>([]);

export const status = atom<StatusItem[]>([]);
export const selectedStatus = atom<string[]>([]);

export const teamMembers = atom<TeamMember[]>([]);
export const selectedTeamMembers = atom<string[]>([]);

export const appliedFilter = atom<FilterState>({
  AssignmentGroup: [],
  FromDate: null,
  ToDate: null,
  Category: [],
  State: [],
  AssignedToName: [],
});

export const resetEnabled = atom((get) => {
  const filter = get(appliedFilter);
  return (
    filter.AssignmentGroup.length > 0 ||
    filter.Category.length > 0 ||
    filter.State.length > 0 ||
    filter.AssignedToName.length > 0 ||
    filter.FromDate !== null ||
    filter.ToDate !== null
  );
});

export const filterEnabled = atom((get) => {
  const Groups = get(selectedGroups);
  const FromDate = get(selectedFromDate);
  const ToDate = get(selectedToDate);
  const Categories = get(selectedCategories);
  const Status = get(selectedStatus);
  const TeamMembers = get(selectedTeamMembers);
  return (
    Groups.length > 0 ||
    Categories.length > 0 ||
    Status.length > 0 ||
    TeamMembers.length > 0 ||
    FromDate !== null ||
    ToDate !== null
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

export const incidentAPIResponses = atom<Record<string, PaginatedResponse>>({});

export const breachFiltersAtom = atom<BreachFilters>({
  actualResolvedTime: [],
  breachSLA: [],
  incidentId: [],
});
