export const FILE_UPLOAD_LIMITS = {
  maxFiles: 5,
  maxSize: 20 * 1024 * 1024, // 20MB in bytes
} as const;

/**
 * Get accepted file types for dropzone
 */
export function getAcceptedFileTypes(): Record<string, string[]> {
  return {
    // Images
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
    "image/gif": [".gif"],
    "image/webp": [".webp"],
    "image/bmp": [".bmp"],
    "image/tiff": [".tiff"],
    // Documents
    "application/pdf": [".pdf"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
      ".docx",
    ],
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
      ".xlsx",
    ],
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      [".pptx"],
    "application/msword": [".doc"],
    "application/vnd.ms-excel": [".xls"],
    "application/vnd.ms-powerpoint": [".ppt"],
    "application/rtf": [".rtf"],
    // Text
    "text/plain": [".txt"],
    "text/markdown": [".md"],
    "text/csv": [".csv"],
    "application/json": [".json"],
    "application/xml": [".xml"],
    "text/xml": [".xml"],
  };
}

/**
 * Get list of supported file extensions
 */
export function getSupportedExtensions(): string[] {
  return [
    // Images
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
    ".bmp",
    ".tiff",
    // Documents
    ".pdf",
    ".docx",
    ".xlsx",
    ".pptx",
    ".doc",
    ".xls",
    ".ppt",
    ".rtf",
    // Text
    ".txt",
    ".md",
    ".csv",
    ".json",
    ".xml",
  ];
}

/**
 * Check if file extension is supported
 */
export function isSupportedExtension(fileName: string): boolean {
  const ext = fileName.toLowerCase().substring(fileName.lastIndexOf("."));
  return getSupportedExtensions().includes(ext);
}

/**
 * Format file size to human readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${Math.round((bytes / k ** i) * 100) / 100} ${sizes[i]}`;
}
