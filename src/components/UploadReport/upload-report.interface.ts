export interface FileDetail {
  id: number;
  fileName: string | null;
  fileSize: string;
  uploadedDate: string;
}

export interface UploadReportResponse {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  items: FileDetail[];
}
