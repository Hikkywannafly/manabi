# Extractor Service Architecture

## 🏗️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    ExtractorService                         │
│                   (Main Orchestrator)                       │
│                      ~70 lines                              │
└──────────────┬──────────────────────────────────────────────┘
               │
               │ Delegates to specialized extractors
               │
       ┌───────┴────────┬──────────┬──────────┐
       │                │          │          │
       ▼                ▼          ▼          ▼
┌─────────────┐  ┌──────────┐  ┌──────┐  ┌─────────┐
│  Youtube    │  │ Webpage  │  │ File │  │ Vision  │
│ Extractor   │  │Extractor │  │Extrac│  │Extractor│
│ ~150 lines  │  │ ~80 lines│  │ tor  │  │~120 lines│
└─────────────┘  └──────────┘  └──┬───┘  └─────────┘
                                   │         ▲
                                   │         │
                                   └─────────┘
                                   Uses Vision for
                                   image files
```

## 📊 Responsibility Breakdown

### ExtractorService (Orchestrator)
```typescript
extract(sourceType, content, fileType?, parsingMode?)
  ├─ "text"     → return content directly
  ├─ "youtube"  → YoutubeExtractor.extract()
  ├─ "webpage"  → WebpageExtractor.extract()
  ├─ "image"    → VisionExtractor.extractFromUrl()
  └─ "file"     → FileExtractor.extract()
```

### YoutubeExtractor
```typescript
extract(url)
  ├─ extractVideoId(url)
  │   ├─ youtube.com/watch?v=ID
  │   ├─ youtu.be/ID
  │   └─ youtube.com/embed/ID
  ├─ YoutubeTranscript.fetchTranscript()
  ├─ Validate transcript
  └─ handleError() with specific messages
```

### WebpageExtractor
```typescript
extract(url, parsingMode)
  ├─ fetch(url)
  ├─ cheerio.load(html)
  └─ parsingMode?
      ├─ "fast"     → extractFast()
      ├─ "balanced" → extractBalanced()
      └─ "premium"  → extractPremium()
```

### FileExtractor
```typescript
extract(url, fileType, parsingMode)
  ├─ fetch file
  └─ fileType?
      ├─ "docx/doc" → extractDocx() [mammoth]
      ├─ "txt"      → extractTxt() [TextDecoder]
      ├─ "pdf"      → extractPdf() [unpdf]
      └─ images     → extractImage() → VisionExtractor
```

### VisionExtractor
```typescript
extractFromBuffer(arrayBuffer, mimeType, parsingMode)
  ├─ convertToBase64() [chunked]
  ├─ getPrompt(parsingMode)
  └─ GitHub Models Vision API call
```

## 🔄 Data Flow Example

### Example 1: YouTube Video
```
User Request
    ↓
ExtractorService.extract("youtube", "https://youtube.com/watch?v=abc123")
    ↓
YoutubeExtractor.extract()
    ↓
extractVideoId() → "abc123"
    ↓
YoutubeTranscript.fetchTranscript()
    ↓
Validate & Join text
    ↓
Return transcript text
```

### Example 2: PDF File
```
User Request
    ↓
ExtractorService.extract("file", "https://...", "pdf", "balanced")
    ↓
FileExtractor.extract()
    ↓
fetch() → ArrayBuffer
    ↓
extractPdf()
    ↓
unpdf.extractText()
    ↓
Validate (>50 chars)
    ↓
Return PDF text
```

### Example 3: Image File
```
User Request
    ↓
ExtractorService.extract("file", "https://...", "png", "premium")
    ↓
FileExtractor.extract()
    ↓
fetch() → ArrayBuffer
    ↓
extractImage()
    ↓
VisionExtractor.extractFromBuffer()
    ↓
convertToBase64() [chunked]
    ↓
GitHub Models Vision API
    ↓
Return OCR text
```

## 🎯 Design Patterns Used

### 1. **Strategy Pattern**
Different extraction strategies based on source type:
- YouTube → Transcript API
- Webpage → Cheerio scraping
- PDF → unpdf library
- Images → Vision API

### 2. **Delegation Pattern**
Main service delegates to specialized extractors:
```typescript
// Instead of one giant class
class ExtractorService {
  extract() {
    return this.youtubeExtractor.extract(); // Delegate
  }
}
```

### 3. **Single Responsibility Principle**
Each class has one job:
- `YoutubeExtractor` → Only YouTube
- `WebpageExtractor` → Only webpages
- `FileExtractor` → Only file routing
- `VisionExtractor` → Only vision API

### 4. **Dependency Injection**
```typescript
constructor(githubToken: string) {
  this.visionExtractor = new VisionExtractor(
    githubToken,
    AI_CONFIG.chatUrl,
    AI_CONFIG.generationModel
  );
  this.fileExtractor = new FileExtractor(this.visionExtractor);
}
```

## 📈 Benefits Visualization

```
Before Refactoring:
┌─────────────────────────────────────┐
│                                     │
│         ExtractorService            │
│                                     │
│  421 lines of mixed responsibilities│
│  - YouTube logic                    │
│  - Webpage logic                    │
│  - PDF logic                        │
│  - Image logic                      │
│  - Vision API logic                 │
│  - Error handling                   │
│  - URL parsing                      │
│  - Base64 conversion                │
│  ...                                │
│                                     │
└─────────────────────────────────────┘
        ❌ Hard to read
        ❌ Hard to maintain
        ❌ Hard to test


After Refactoring:
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Youtube     │  │  Webpage     │  │  File        │
│  Extractor   │  │  Extractor   │  │  Extractor   │
│  150 lines   │  │  80 lines    │  │  100 lines   │
└──────────────┘  └──────────────┘  └──────────────┘
        ✅ Easy to read
        ✅ Easy to maintain
        ✅ Easy to test
        ✅ Reusable
```

## 🧪 Testing Strategy

### Unit Tests (Per Extractor)
```typescript
// test/extractors/youtube.test.ts
describe("YoutubeExtractor", () => {
  it("should extract video ID from standard URL", () => {
    const extractor = new YoutubeExtractor();
    const id = extractor.extractVideoId("https://youtube.com/watch?v=abc123");
    expect(id).toBe("abc123");
  });
});

// test/extractors/webpage.test.ts
describe("WebpageExtractor", () => {
  it("should extract text in fast mode", async () => {
    const extractor = new WebpageExtractor();
    const text = await extractor.extract("https://example.com", "fast");
    expect(text).toBeDefined();
  });
});
```

### Integration Tests (Main Service)
```typescript
// test/extractor.test.ts
describe("ExtractorService", () => {
  it("should route to correct extractor", async () => {
    const service = new ExtractorService(token);
    const text = await service.extract("youtube", "https://...");
    expect(text).toBeDefined();
  });
});
```
