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
  state:string;
  createdDateTime:string;
  updatedDateTime:string;
  resolvedDateTime:string;
  actualResolvedTime: string;
  breachSLA: string;
  

}

export type SortOrder = "ASC" | "DESC" | "";
