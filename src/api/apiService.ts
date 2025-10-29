// // src/api/apiService.ts
// import { apiClient } from "./apiClient";
// import { IncidentSummary, PagedResult, SearchParams } from "../types";

// /**
//  * Replace BASE_URL with your .NET backend base URL, e.g. process.env.REACT_APP_API_BASE
//  */
// const BASE_URL = (process.env.REACT_APP_API_BASE ?? "http://localhost:5000") + "/api/items";

// export const apiService = {
//   // 1) GET list with pagination/search => GET /api/items?q=...&page=1&pageSize=20
//   getItems: (params?: SearchParams) => {
//     const qs = new URLSearchParams();
//     if (params?.q) qs.append("q", params.q);
//     if (params?.page) qs.append("page", String(params.page));
//     if (params?.pageSize) qs.append("pageSize", String(params.pageSize));
//     if (params?.sortBy) qs.append("sortBy", params.sortBy);
//     const url = `${BASE_URL}?${qs.toString()}`;
//     return apiClient.get<PagedResult<Item>>(url);
//   },

//   // 2) GET by id => GET /api/items/{id}
//   getItem: (id: string) => apiClient.get<Item>(`${BASE_URL}/${encodeURIComponent(id)}`),

//   // 3) POST create => POST /api/items
//   createItem: (payload: Omit<Item, "id" | "createdAt">) => apiClient.post<Item>(BASE_URL, payload),

//   // 4) PUT update => PUT /api/items/{id}
//   updateItem: (id: string, payload: Partial<Item>) => apiClient.put<Item>(`${BASE_URL}/${encodeURIComponent(id)}`, payload),

//   // 5) DELETE => DELETE /api/items/{id}
//   deleteItem: (id: string) => apiClient.del<void>(`${BASE_URL}/${encodeURIComponent(id)}`),

//   // 6) POST bulk create => POST /api/items/bulk
//   bulkCreate: (items: Array<Omit<Item, "id">>) => apiClient.post<Item[]>(`${BASE_URL}/bulk`, items),

//   // 7) POST search advanced => POST /api/items/search (send complex body)
//   advancedSearch: (body: { filter: any; page?: number; pageSize?: number }) =>
//     apiClient.post<PagedResult<Item>>(`${BASE_URL}/search`, body),

//   // 8) POST upload file => POST /api/items/{id}/upload
//   uploadFile: (id: string, file: File) => {
//     const form = new FormData();
//     form.append("file", file);
//     return apiClient.post<{ url: string }>(`${BASE_URL}/${encodeURIComponent(id)}/upload`, form, { rawBody: true });
//   },

//   // 9) GET download report => GET /api/items/{id}/report
//   downloadReport: async (id: string) => {
//     // For binary content, use fetch directly or modify apiClient to optionally return blob.
//     const res = await fetch(`${BASE_URL}/${encodeURIComponent(id)}/report`, {
//       method: "GET",
//       // include headers for auth later
//     });
//     if (!res.ok) throw new Error("Failed to download report");
//     const blob = await res.blob();
//     return blob; // consumer can createObjectURL or use FileSaver
//   },
// };
