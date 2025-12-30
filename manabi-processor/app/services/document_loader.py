"""
Document Loader Service
Handles loading content from various sources: PDF, DOCX, Excel, YouTube, URLs
"""

import tempfile
import re
from typing import Optional
import httpx

# LangChain document loaders
from langchain_community.document_loaders import (
    PyMuPDFLoader,
    Docx2txtLoader,
    UnstructuredExcelLoader,
    WebBaseLoader,
)
from langchain.schema import Document

# YouTube transcript
from youtube_transcript_api import YouTubeTranscriptApi


class DocumentLoaderService:
    """Service for loading documents from various sources"""

    @staticmethod
    async def load(
        file_url: Optional[str] = None,
        file_type: Optional[str] = None,
        text_content: Optional[str] = None,
        youtube_url: Optional[str] = None,
        webpage_url: Optional[str] = None,
    ) -> list[Document]:
        """
        Load documents from the appropriate source.
        Returns a list of LangChain Document objects.
        """
        if file_url and file_type:
            return await DocumentLoaderService.load_from_file(file_url, file_type)
        elif youtube_url:
            return await DocumentLoaderService.load_from_youtube(youtube_url)
        elif webpage_url:
            return await DocumentLoaderService.load_from_webpage(webpage_url)
        elif text_content:
            return DocumentLoaderService.load_from_text(text_content)
        else:
            raise ValueError("No valid content source provided")

    @staticmethod
    async def load_from_file(file_url: str, file_type: str) -> list[Document]:
        """Download file and load with appropriate loader"""

        # Download file from URL (Supabase signed URL)
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.get(file_url)
            response.raise_for_status()
            content = response.content

        # Determine file extension
        ext = file_type.lower().strip(".")

        # Save to temp file
        with tempfile.NamedTemporaryFile(delete=False, suffix=f".{ext}") as f:
            f.write(content)
            temp_path = f.name

        # Load based on type
        try:
            if ext == "pdf":
                loader = PyMuPDFLoader(temp_path)
            elif ext in ("docx", "doc"):
                loader = Docx2txtLoader(temp_path)
            elif ext in ("xlsx", "xls"):
                loader = UnstructuredExcelLoader(temp_path)
            elif ext == "txt":
                with open(temp_path, "r", encoding="utf-8") as f:
                    text = f.read()
                return [Document(page_content=text, metadata={"source": file_url, "type": "txt"})]
            else:
                raise ValueError(f"Unsupported file type: {ext}")

            documents = loader.load()

            # Add metadata
            for doc in documents:
                doc.metadata["source_type"] = "file"
                doc.metadata["file_type"] = ext

            return documents

        finally:
            # Cleanup temp file
            import os
            try:
                os.unlink(temp_path)
            except:
                pass

    @staticmethod
    async def load_from_youtube(video_url: str) -> list[Document]:
        """Extract transcript from YouTube video"""

        # Extract video ID
        video_id = DocumentLoaderService._extract_youtube_id(video_url)
        if not video_id:
            raise ValueError(f"Could not extract video ID from URL: {video_url}")

        try:
            # Try to get transcript in multiple languages
            transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)

            # Try Vietnamese first, then English, then any available
            transcript = None
            for lang in ["vi", "en"]:
                try:
                    transcript = transcript_list.find_transcript([lang])
                    break
                except:
                    continue

            if not transcript:
                # Get any available transcript
                transcript = transcript_list.find_generated_transcript(["en", "vi"])

            # Fetch the transcript
            transcript_data = transcript.fetch()

            # Combine into text
            full_text = " ".join([entry["text"] for entry in transcript_data])

            return [Document(
                page_content=full_text,
                metadata={
                    "source": video_url,
                    "source_type": "youtube",
                    "video_id": video_id,
                }
            )]

        except Exception as e:
            raise ValueError(f"Could not extract transcript from YouTube: {str(e)}")

    @staticmethod
    async def load_from_webpage(url: str) -> list[Document]:
        """Scrape content from webpage"""

        loader = WebBaseLoader(url)
        documents = loader.load()

        # Clean up the content
        for doc in documents:
            # Remove excessive whitespace
            doc.page_content = re.sub(r'\s+', ' ', doc.page_content).strip()
            doc.metadata["source_type"] = "webpage"

        return documents

    @staticmethod
    def load_from_text(text: str) -> list[Document]:
        """Create document from plain text"""
        return [Document(
            page_content=text,
            metadata={
                "source": "direct_input",
                "source_type": "text",
            }
        )]

    @staticmethod
    def _extract_youtube_id(url: str) -> Optional[str]:
        """Extract video ID from YouTube URL"""
        patterns = [
            r'(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})',
            r'youtube\.com\/embed\/([a-zA-Z0-9_-]{11})',
            r'youtube\.com\/v\/([a-zA-Z0-9_-]{11})',
        ]

        for pattern in patterns:
            match = re.search(pattern, url)
            if match:
                return match.group(1)

        return None
