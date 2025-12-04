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

  BreachSLA:string;
  ActualResolvedTime:string;
  Resolved:string;
  Created:string;
  State:string;
  Category:string;
  ShortDescription:string;
  AssignedTo:string;
  Number:string;

}

export type SortOrder = "ASC" | "DESC" | "";
