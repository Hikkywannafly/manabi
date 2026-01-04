# Extractor Service Refactoring

## 📊 Tổng Quan

Đã refactor `extractor.ts` từ **421 dòng** thành **cấu trúc module hóa** với các file chuyên biệt, giảm xuống còn ~70 dòng cho file chính.

## 🏗️ Cấu Trúc Mới

```
services/
├── extractor.ts                 # Main orchestrator (~70 lines)
└── extractors/
    ├── index.ts                 # Centralized exports
    ├── youtube.ts               # YouTube transcript extraction (~150 lines)
    ├── webpage.ts               # Webpage scraping (~80 lines)
    └── file.ts                  # File & Vision extraction (~220 lines)
```

## 📁 Chi Tiết Từng Module

### 1. **extractor.ts** (Main Orchestrator)
**Trách nhiệm:** Điều phối và routing requests đến extractors phù hợp

```typescript
// Đơn giản, dễ đọc
switch (sourceType) {
  case "youtube":
    return await this.youtubeExtractor.extract(content);
  case "webpage":
    return await this.webpageExtractor.extract(content, parsingMode);
  // ...
}
```

**Lợi ích:**
- ✅ Dễ hiểu flow chính
- ✅ Single Responsibility Principle
- ✅ Dễ test và maintain

---

### 2. **extractors/youtube.ts** (YouTube Extractor)
**Trách nhiệm:** Xử lý YouTube transcript extraction

**Chức năng:**
- ✅ Validate và extract video ID từ nhiều format URL
- ✅ Fetch transcript từ YouTube
- ✅ Error handling chi tiết (age-restricted, private, no captions, etc.)
- ✅ Logging đầy đủ

**Methods:**
- `extract(url)` - Main extraction method
- `extractVideoId(url)` - URL parsing & validation
- `handleError(error)` - Specific error messages

---

### 3. **extractors/webpage.ts** (Webpage Extractor)
**Trách nhiệm:** Scrape và extract content từ webpages

**Parsing Modes:**
- **Fast:** Loại bỏ nav, footer, header → chỉ lấy body text
- **Balanced:** Lấy main/article content
- **Premium:** Lấy tất cả + alt text của images

**Methods:**
- `extract(url, parsingMode)` - Main extraction
- `extractFast($)` - Fast mode logic
- `extractBalanced($)` - Balanced mode logic
- `extractPremium($)` - Premium mode logic

---

### 4. **extractors/file.ts** (File & Vision Extractor)
**Trách nhiệm:** Xử lý files (PDF, DOCX, TXT, Images)

**Bao gồm 2 classes:**

#### **FileExtractor**
Routing file types đến extractors phù hợp:
- **DOCX/DOC** → `extractDocx()` (mammoth)
- **TXT** → `extractTxt()` (TextDecoder)
- **PDF** → `extractPdf()` (unpdf)
- **Images** → `extractImage()` → VisionExtractor

#### **VisionExtractor**
OCR và vision-based extraction:
- `extractFromUrl()` - Fetch image từ URL
- `extractFromBuffer()` - Process ArrayBuffer
- `convertToBase64()` - Chunked conversion (avoid stack overflow)
- `getPrompt()` - Dynamic prompts based on parsing mode

---

## 🎯 Lợi Ích Của Refactoring

### 1. **Readability (Dễ Đọc)**
- ❌ **Trước:** 421 dòng trong 1 file
- ✅ **Sau:** 4 files, mỗi file ~70-220 dòng, tập trung vào 1 nhiệm vụ

### 2. **Maintainability (Dễ Maintain)**
- Sửa YouTube logic? → Chỉ cần mở `youtube.ts`
- Thêm parsing mode mới? → Chỉ cần sửa `webpage.ts`
- Không ảnh hưởng đến các modules khác

### 3. **Testability (Dễ Test)**
```typescript
// Test riêng từng extractor
const youtubeExtractor = new YoutubeExtractor();
await youtubeExtractor.extract("https://youtube.com/...");

const webpageExtractor = new WebpageExtractor();
await webpageExtractor.extract("https://example.com", "balanced");
```

### 4. **Reusability (Tái Sử Dụng)**
```typescript
// Có thể dùng VisionExtractor độc lập
const visionExtractor = new VisionExtractor(token, url, model);
await visionExtractor.extractFromBuffer(buffer, "image/png", "premium");
```

### 5. **Single Responsibility Principle**
Mỗi class chỉ làm 1 việc:
- `YoutubeExtractor` → YouTube transcripts
- `WebpageExtractor` → Webpage scraping
- `FileExtractor` → File routing
- `VisionExtractor` → Vision API calls

---

## 🔄 Migration Guide

### Import Cũ:
```typescript
import { ExtractorService } from "./services/extractor.ts";
```

### Import Mới (Vẫn Giữ Nguyên):
```typescript
import { ExtractorService } from "./services/extractor.ts";
// API không đổi, chỉ internal structure thay đổi
```

### Nếu Muốn Dùng Extractors Riêng:
```typescript
import {
  YoutubeExtractor,
  WebpageExtractor,
  VisionExtractor
} from "./services/extractors/index.ts";
```

---

## 📊 So Sánh Trước/Sau

| Metric | Trước | Sau |
|--------|-------|-----|
| **Total Lines** | 421 | ~520 (split across 4 files) |
| **Main File** | 421 lines | 70 lines |
| **Largest Module** | N/A | 220 lines (file.ts) |
| **Readability** | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Maintainability** | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Testability** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

---

## 🚀 Next Steps

1. ✅ **Đã hoàn thành:** Refactor structure
2. 🔄 **Tiếp theo:** Test các extractors
3. 📝 **Sau đó:** Update tests nếu cần
4. 🎯 **Cuối cùng:** Deploy và monitor

---

## 💡 Tips

- Mỗi extractor có thể được test độc lập
- Dễ dàng thêm extractors mới (e.g., `AudioExtractor`, `VideoExtractor`)
- Có thể swap implementation mà không ảnh hưởng main service
- Logging được maintain nhất quán across all extractors
