export interface IncidentResponse {
  incidents: Incident[];
  totalElements: number;
  totalPages: number;
}

export interface Incident {
  incidentNo: string;
  assignedTo: string;
  shortDescription: string;
  category: string;
  actualResolvedTime: string;
  state: string;
  resolvedDateTime: string;
  breachSLA: string;
  createdDateTime:string;
  updatedDateTime:string;
}

export type SortOrder = "ASC" | "DESC" | "";
