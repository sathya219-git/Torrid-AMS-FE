export interface BreachedIncidentsResponse {
  items: BreachedIncidents[];
  totalElements: number;
  totalPages: number;
}

export interface BreachedIncidents {
  incidentNumber: string;
  assignedTo: string;
  shortDescription: string;
  category: string;
  actualResolvedTime: string;
  breachSLA: string;
}

export type SortOrder = "ASC" | "DESC" | "";
