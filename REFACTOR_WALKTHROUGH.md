# Quiz Generation System Refactor
We have successfully refactored the `generate-content` Edge Function and updated the Frontend to support advanced quiz generation features.

## Changes
### 1. Edge Function Architecture (`supabase/functions/generate-content`)
The function was refactored from a monolithic `index.ts` into a modular service-based architecture:
- **`index.ts`**: Main entry point, orchestrates the services.
- **`services/`**:
  - `ai.service.ts`: Handles AI interaction. efficient single-pass generation of **Title** and **Questions**.
  - `quiz.service.ts`: Manages database operations and **Slug Generation**.
  - `storage.service.ts`: Handles file downloads, text extraction (DOCX), and multi-modal preparation (Images/PDFs).
- **`utils/`**: Shared utilities for Logging and Realtime Progress tracking.
- **`config.ts`**: Centralized configuration, Prompts, and Constants.

### 2. New Features
- **Smart Metadata**: The system now automatically generates a **Title** and a SEO-friendly **Slug** for every quiz.
- **Text Input Support**: Users can now paste text directly instead of uploading a file.
- **Advanced Options**:
  - **Parsing Mode**: Fast (Text only) vs Balanced/Premium (AI Vision).
  - **Mode**: Quiz (Immediate feedback) vs Exam (End feedback).
  - **Task**: Generate Quiz vs Extract Quiz (from existing).
  - **Language**: Explicit language selection.

### 3. Frontend Updates (`create-quiz-form.tsx`)
- Updated UI with new tabs (File / Text).
- Added configuration limits for all new parameters.
- Implemented **Smart Redirection**: The app now redirects to `/dashboard/quiz/[id]/[slug]` upon completion.

### 4. Database Updates
- Ensure your `quizzes` table has the `slug` column (it should be in the migration `20250101000000_init_schema.sql`).
- The system automatically populates it.

## How to Verify
1.  **Deploy Function**:
    ```bash
    supabase functions deploy generate-content --no-verify-jwt
    ```
2.  **Generate a Quiz**:
    - Go to `/dashboard/quiz/create`.
    - Upload a PDF or Paste Text.
    - Select "Language: Vietnamese" (example).
    - Click "Generate".
3.  **Check Result**:
    - Watch the progress bar (Realtime).
    - Upon completion, observe the redirect URL (should include slug).
    - Check the quiz title (should be generated/extracted).

## Files Modified
- `supabase/functions/generate-content/**/*`
- `src/features/quiz/components/create-quiz-form.tsx`
- `src/services/ai-service.ts`
- `src/features/quiz/schema.ts`
