// utils/queryBuilder.ts
export const buildFilterQuery = (filters: any): string => {
  const params = new URLSearchParams();

  // Handle duration separately
  if (filters.FromDate) {
    params.append(
      "FromDate",
      new Date(filters.FromDate).toLocaleString("en-US")
    );
  }
  if (filters.ToDate) {
    params.append("ToDate", new Date(filters.ToDate).toLocaleString("en-US"));
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

export const buildIncidentsQuery = (filters: any, req: any): string => {
  const params = new URLSearchParams();

  if (filters.FromDate) {
    params.append(
      "FromDate",
      new Date(filters.FromDate).toLocaleString("en-US")
    );
  }
  if (filters.ToDate) {
    params.append("ToDate", new Date(filters.ToDate).toLocaleString("en-US"));
  }

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

  Object.keys(req).forEach((key) => {
    if (req[key]) {
      params.append(key, req[key]);
    }
  });

  return params.toString();
};
