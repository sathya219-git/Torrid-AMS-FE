import { FilterState } from "../store/filterStore";

// utils/queryBuilder.ts
export const buildFilterQuery = (filters: any): string => {
  const params = new URLSearchParams();

  // Handle duration separately
  if (filters.FromDate) {
    params.append("FromDate", new Date(filters.FromDate).toLocaleString());
  }
  if (filters.ToDate) {
    params.append("ToDate", new Date(filters.ToDate).toLocaleString());
  }

  // Handle arrays (like category, assignmentGroup, etc.)
  const mapping: Record<string, string> = {
    AssignmentGroup: "AssignmentGroup",
    Category: "Category",
    Priority: "Priority",
    State: "State",
    AssignedToName: "AssignedToName",
  };

  Object.keys(mapping).forEach((key) => {
    const values = filters[key];
    const paramName = mapping[key];
    if (Array.isArray(values) && values.length > 0) {
      values.forEach((val) => params.append(paramName, val));
    }
  });

  // Return query string
  return params.toString(); // e.g. FromDate=08%2F31%2F2025%20AM&Category=Ecom%20systems
};
