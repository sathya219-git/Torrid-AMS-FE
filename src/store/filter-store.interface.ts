export interface FilterChip {
  key:
    | "AssignmentGroup"
    | "FromDate"
    | "ToDate"
    | "Category"
    | "State"
    | "AssignedToName";
  value: string;
}

export interface FilterState {
  AssignmentGroup: string[];
  FromDate: Date | null;
  ToDate: Date | null;
  Category: string[];
  State: string[];
  AssignedToName: string[];
  UpdatedOn: number;
}

export interface Incident {
  incidentNo: string;
  description: string;
  category: string;
  resolutionNotes: string;
  state: string;
  resolvedDateTime: string;
}

export interface BreachFilters {
  actualResolvedTime?: string;
  breachSLA?: string;
  categories?: string;
  assignedTo?: string;
  Search?: string;
}
export interface BreachSearchFilters {
  Search?: string;
}
export interface ApiRequest {
  method: string;
  body: any;
}
