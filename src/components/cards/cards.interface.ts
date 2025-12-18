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
  stateDetails: Record<string, number>;
  totalCountForPriority: number;
  avgResolvedTime: string;
  totalResolvedTime:string;
  breachedCount: number;
  openMoreThan15Days: number;
  openLessThan15Days: number;
}

export interface IncidentPrioritySummary {
  priority: Record<string, PriorityDetails>;
}

export interface IncidentSummary {
  totalIncidents: number;
  openCount: number;
  breachedCount: number;
  openMore15Days: number;
  openLess15Days: number;
  states: Record<string, number>;
}

