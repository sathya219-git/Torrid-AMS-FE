export interface BreachedIncidents {
    incidentNumber: string;
    assignedTo: string;
    shortDescription: string;
    category: string;
    actualResolvedTime: string;
    breachSLA: string;
};

export type SortOrder = "ASC" | "DESC" | "";