export interface PriorityStats {
  totalCount: number;
  open: number;
  inProgress: number;
  closed: number;
  onHold: number;
  reopen: number;
  resolved: number;
}

export interface PriorityDetails {
  details: PriorityStats[];
  avgResolvedTime: string;
  totalResolvedTime: string;
  breachedCount:number;
}

export interface IncidentPrioritySummary {
  priority: Record<string, PriorityDetails>;
}

export interface IncidentSummary {
  totalIncidents: number;
  openIncidents: number;
  inProgressIncidents: number;
  closedIncidents: number;
  breachedCount:number;
}
