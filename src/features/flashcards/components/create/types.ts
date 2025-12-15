export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: "uploading" | "processing" | "success" | "error";
  progress: number;
  error?: string;
  url?: string;
}
