# Optimization Plan: Quiz Generation Cleanup

## Goal
Eliminate "garbage files" in Supabase Storage after quiz generation. Optimize the flow for text inputs to avoid unnecessary storage operations.

## Problem
1.  **Garbage Accumulation**: Uploaded files (PDFs, Images) remain in the `uploads` bucket indefinitely after the quiz is generated, cluttering storage.
2.  **Inefficient Text Flow**: Currently, text input is converted to a "dummy file", uploaded, then downloaded by the backend. This is redundant and slow.

## Proposed Solution

### 1. Direct Text Processing (No Storage for Text)
- **Frontend**: When the user provides "Text Input":
    - Do NOT create a dummy file.
    - Do NOT upload to Supabase Storage.
    - Send the raw text directly in the API Request Payload (`textContent`).
- **Backend**: Check if `textContent` exists. If yes, skip the download step and use it directly.

### 2. Auto-Cleanup for Files (Self-Destruct)
- **Frontend**: Uploads the file as usual (necessary for large PDFs/Images).
- **Backend**:
    - Generates the quiz.
    - **CRITICAL**: In a `finally` block (executed whether success or fail), delete the file from Supabase Storage.
    - This ensures `uploads` is effectively a temporary scratchpad, not a permanent archive.

## Technical Changes

### Backend (`supabase/functions/generate-content`)
-   **`types.ts`**: Add `textContent` (optional) to `RequestPayload`.
-   **`services/storage.service.ts`**: Add `deleteFile(path)` method.
-   **`index.ts`**:
    -   Refactor logic to handle `textContent` vs `filePath`.
    -   Implement the "Delete after processing" logic for files.

### Frontend (`CreateQuizForm.tsx`)
-   Logic update:
    -   If `activeTab === 'text'`, pass `textContent` in the body.
    -   Else review file upload logic (keep as is, but rely on backend to clean up).

## Benefits
-   **Zero Storage Waste**: Buckets stay clean.
-   **Faster Text Quizzes**: Skips 2 network calls (Upload + Download) for text inputs.
-   **Cost Saving**: Reduces storage costs.
