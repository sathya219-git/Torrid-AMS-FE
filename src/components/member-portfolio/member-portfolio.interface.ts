export interface MemberDetails {
  name: string | null;
  p1: number;
  p2: number;
  p3: number;
  p4: number;
  totalCount: number;
  lastUpdated: string;
  actualResolvedTime: string;
}

interface Pagination {
  page: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  sortBy: string;
}

export interface MemberDetailsResponse {
  memberDetails: MemberDetails[];
  pagination: Pagination;
}
