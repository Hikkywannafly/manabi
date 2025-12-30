# Manabi Processor - Python Backend

AI-powered document processing for Quiz and Flashcard generation.

## Features

- 📄 **Document Parsing**: PDF, DOCX, Excel, TXT
- 🎥 **YouTube**: Extract transcripts from videos
- 🌐 **URL Scraping**: Extract content from web pages
- 🧠 **Smart Chunking**: Semantic text splitting
- ✨ **Quality Generation**: Enhanced prompts with Bloom's Taxonomy

## Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Set environment variables
cp .env.example .env

# Run locally
uvicorn app.main:app --reload
```

## Environment Variables

```env
OPENROUTER_API_KEY=your_openrouter_key
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_role_key
API_SECRET_KEY=your_secret_for_auth
```

## API Endpoints

### Health Check
```
GET /health
```

### Generate Quiz
```
POST /api/v1/generate-quiz
{
  "quiz_id": "uuid",
  "file_url": "https://...",
  "file_type": "pdf",
  "params": {
    "difficulty": "Medium",
    "number_of_questions": 10,
    "question_type": "mixed",
    "language": "english",
    "parsing_mode": "balanced"
  }
}
```

### Generate Flashcards
```
POST /api/v1/generate-flashcards
{
  "deck_id": "uuid",
  "file_url": "https://...",
  "file_type": "pdf",
  "params": {
    "difficulty": "Medium",
    "number_of_cards": 20,
    "language": "english",
    "parsing_mode": "balanced"
  }
}
```

## Deploy to Railway

1. Push to GitHub
2. Connect Railway to your repo
3. Add environment variables
4. Deploy!

## Architecture

```
Frontend → Supabase Edge Function → Python Backend → Supabase DB
```
