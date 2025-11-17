import { atom } from "jotai";
import { CategoryItem } from "../components/Category/category.interface";
import { StatusItem } from "../components/Status/status.interface";
import { TeamMember } from "../components/TeamMembers/team-members.interface";
import {
  ApiRequest,
  BreachFilters,
  FilterChip,
  FilterState,
} from "./filter-store.interface";
import { MemberDetailsResponse } from "../components/member-portfolio/member-portfolio.interface";
import {
  IncidentPrioritySummary,
  IncidentSummary,
} from "../components/cards/cards.interface";
import { BreachedIncidentsResponse } from "../components/IncidentList/BreachedListTable/breached-list-table.interface";
import { IncidentResponse } from "../components/IncidentList/IncidentTable/incident-table.interface";
import { UploadReportResponse } from "../components/UploadReport/upload-report.interface";

export const InitiateAPI = atom<Map<string, ApiRequest>>(new Map());

export const filterState = atom(false);

export const tabValue = atom(true);

export const KPIs = atom<IncidentSummary | undefined>();

export const CountByPriority = atom<IncidentPrioritySummary | undefined>();

export const TeamMemberDetails = atom<MemberDetailsResponse | undefined>();

export const IncidentsResponse = atom<IncidentResponse | undefined>();

export const BreachedResponse = atom<BreachedIncidentsResponse | undefined>();

export const UploadedReportsResponse = atom<UploadReportResponse | undefined>();

export const ReloadUploadedReportsGrid = atom(new Date().getTime());

export const LoginSuccess = atom(false);

// Left side filters
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

// Top Filter Chips
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

export const P1BreachFilters = atom<BreachFilters>({
  actualResolvedTime: undefined,
  breachSLA: undefined,
  categories: undefined,
  assignedTo: undefined,
});

export const P2BreachFilters = atom<BreachFilters>({
  actualResolvedTime: undefined,
  breachSLA: undefined,
  categories: undefined,
  assignedTo: undefined,
});

export const P3BreachFilters = atom<BreachFilters>({
  actualResolvedTime: undefined,
  breachSLA: undefined,
  categories: undefined,
  assignedTo: undefined,
});

export const P4BreachFilters = atom<BreachFilters>({
  actualResolvedTime: undefined,
  breachSLA: undefined,
  categories: undefined,
  assignedTo: undefined,
});

export const ActiveIncidentTab = atom<string | null>("1 - Critical");
export const ActiveCriticalAccordion = atom<string | null>(null);
export const ActiveBreachAccordion = atom<string | null>(null);
