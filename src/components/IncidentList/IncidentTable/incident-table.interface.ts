export interface Incident {
  incidentNo: string;
  assignedTo: string;
  shortDescription: string;
  category: string;
  actualResolvedTime: string;
  state: string;
  resolvedDateTime: string;
  breachSLA: string;
};

export type SortOrder = "ASC" | "DESC" | "";