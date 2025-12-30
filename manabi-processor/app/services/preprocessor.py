"""
Preprocessor Service
Handles text cleaning, chunking, and quality scoring based on parsing mode
"""

import re
from typing import Literal
from langchain.schema import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter


class PreprocessorService:
    """Service for preprocessing documents before AI generation"""

    # Configuration for each parsing mode
    PARSING_CONFIGS = {
        "fast": {
            "chunk_size": 4000,
            "chunk_overlap": 200,
            "max_chunks": 3,
            "description": "Quick processing, basic text extraction",
        },
        "balanced": {
            "chunk_size": 2000,
            "chunk_overlap": 400,
            "max_chunks": 6,
            "description": "Good balance of speed and quality",
        },
        "premium": {
            "chunk_size": 1500,
            "chunk_overlap": 500,
            "max_chunks": 10,
            "description": "Deep analysis, best quality",
        },
    }

    @staticmethod
    def process(
        documents: list[Document],
        parsing_mode: Literal["fast", "balanced", "premium"] = "balanced"
    ) -> str:
        """
        Process documents based on parsing mode.

        Returns cleaned and chunked text ready for AI generation.
        """
        config = PreprocessorService.PARSING_CONFIGS[parsing_mode]

        # Step 1: Combine all documents
        full_text = "\n\n".join([doc.page_content for doc in documents])

        # Step 2: Clean text
        cleaned = PreprocessorService._clean_text(full_text)

        # Step 3: If text is short enough, return directly
        if len(cleaned) < config["chunk_size"] * config["max_chunks"]:
            return cleaned

        # Step 4: Chunk with LangChain splitter
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=config["chunk_size"],
            chunk_overlap=config["chunk_overlap"],
            separators=["\n\n", "\n", ". ", ", ", " ", ""],
            length_function=len,
        )
        chunks = splitter.split_text(cleaned)

        # Step 5: Score chunks by educational value
        scored_chunks = [
            (chunk, PreprocessorService._score_educational_value(chunk))
            for chunk in chunks
        ]

        # Step 6: Sort by score and take top N
        scored_chunks.sort(key=lambda x: x[1], reverse=True)
        selected = scored_chunks[:config["max_chunks"]]

        # Step 7: Re-order by original position for coherence
        # (We want high-quality chunks but in reading order)
        chunk_positions = {chunk: chunks.index(chunk) for chunk, _ in selected}
        selected.sort(key=lambda x: chunk_positions.get(x[0], 0))

        # Step 8: Join with separators
        result = "\n\n---\n\n".join([chunk for chunk, _ in selected])

        return result

    @staticmethod
    def _clean_text(text: str) -> str:
        """Clean and normalize text"""

        # Normalize whitespace
        text = re.sub(r'\r\n', '\n', text)
        text = re.sub(r'\r', '\n', text)

        # Remove excessive newlines
        text = re.sub(r'\n{4,}', '\n\n\n', text)

        # Remove excessive spaces
        text = re.sub(r'[ \t]+', ' ', text)

        # Remove page numbers
        text = re.sub(r'\bpage\s+\d+\s*(of\s+\d+)?\b', '', text, flags=re.IGNORECASE)
        text = re.sub(r'^\s*\d+\s*$', '', text, flags=re.MULTILINE)

        # Remove URLs (but keep for reference if needed)
        # text = re.sub(r'https?://\S+', '[URL]', text)

        # Remove email addresses
        text = re.sub(r'\b[\w.-]+@[\w.-]+\.\w+\b', '[EMAIL]', text)

        # Remove copyright notices
        text = re.sub(r'©.*?(?=\n|$)', '', text, flags=re.IGNORECASE)
        text = re.sub(r'copyright.*?(?=\n|$)', '', text, flags=re.IGNORECASE)

        # Trim lines
        lines = [line.strip() for line in text.split('\n')]
        text = '\n'.join(lines)

        # Final trim
        return text.strip()

    @staticmethod
    def _score_educational_value(text: str) -> float:
        """
        Score a chunk by its educational value.
        Higher scores = more likely to contain useful quiz/flashcard content.
        """
        text_lower = text.lower()
        score = 0.0

        # High-value educational keywords
        high_value_keywords = {
            "definition": 4,
            "define": 3,
            "means": 2,
            "refers to": 3,
            "is known as": 3,
            "concept": 3,
            "principle": 4,
            "theory": 3,
            "law": 3,
            "rule": 3,
            "formula": 4,
            "equation": 4,
            "method": 3,
            "process": 3,
            "step": 2,
            "procedure": 3,
        }

        # Medium-value keywords
        medium_value_keywords = {
            "example": 3,
            "for instance": 3,
            "such as": 2,
            "important": 3,
            "key": 2,
            "main": 2,
            "primary": 2,
            "essential": 3,
            "fundamental": 3,
            "critical": 2,
            "significant": 2,
        }

        # Learning-related keywords
        learning_keywords = {
            "remember": 2,
            "note": 2,
            "summary": 4,
            "conclusion": 3,
            "result": 2,
            "therefore": 2,
            "because": 1,
            "thus": 2,
            "hence": 2,
            "consequence": 2,
        }

        # Calculate score from keywords
        for keyword, weight in high_value_keywords.items():
            if keyword in text_lower:
                score += weight

        for keyword, weight in medium_value_keywords.items():
            if keyword in text_lower:
                score += weight

        for keyword, weight in learning_keywords.items():
            if keyword in text_lower:
                score += weight

        # Bonus for structured content (lists, numbered items)
        if re.search(r'^\s*[\d•\-\*]\s', text, re.MULTILINE):
            score += 3

        # Bonus for headers (short lines that might be titles)
        lines = text.split('\n')
        for line in lines:
            if len(line.strip()) > 0 and len(line.strip()) < 80:
                if not line.strip().endswith(('.', ',', ';', ':')):
                    score += 1

        # Penalty for very short chunks
        if len(text) < 200:
            score *= 0.5

        # Penalty for chunks that are mostly numbers/tables
        non_alpha = len(re.findall(r'[^a-zA-Z\s]', text))
        if non_alpha > len(text) * 0.4:
            score *= 0.7

        return score
