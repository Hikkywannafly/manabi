"""
Supabase Client Service
"""

from supabase import create_client, Client
from app.config import settings


class SupabaseService:
    """Service for Supabase operations"""

    def __init__(self):
        self.client: Client = create_client(
            settings.supabase_url,
            settings.supabase_service_key
        )

    async def update_progress(
        self,
        channel_name: str,
        item_id: str,
        progress: int,
        message: str,
        data: dict | None = None
    ):
        """
        Broadcast progress update via Supabase Realtime
        """
        payload = {
            "progress": progress,
            "message": message,
        }
        if data:
            payload["data"] = data

        # Use Supabase Realtime broadcast
        self.client.realtime.channel(f"{channel_name}:{item_id}").send_broadcast(
            event="progress",
            payload=payload
        )

    async def update_quiz_status(self, quiz_id: str, status: str):
        """Update quiz status in database"""
        self.client.table("quizzes").update({
            "status": status
        }).eq("id", quiz_id).execute()

    async def update_quiz_metadata(self, quiz_id: str, title: str, slug: str, status: str = "ready"):
        """Update quiz metadata"""
        self.client.table("quizzes").update({
            "title": title,
            "slug": slug,
            "status": status
        }).eq("id", quiz_id).execute()

    async def save_quiz_questions(self, quiz_id: str, questions: list[dict]):
        """Save quiz questions to database"""
        questions_to_insert = [
            {
                "quiz_id": quiz_id,
                "question_text": q["question_text"],
                "question_type": q.get("question_type", "multiple_choice"),
                "options": q.get("options"),
                "correct_answer": str(q["correct_answer"]),
                "explanation": q.get("explanation", ""),
                "order_index": idx,
            }
            for idx, q in enumerate(questions)
        ]

        self.client.table("quiz_questions").insert(questions_to_insert).execute()

    async def update_deck_status(self, deck_id: str, status: str):
        """Update deck status in database"""
        self.client.table("decks").update({
            "status": status
        }).eq("id", deck_id).execute()

    async def update_deck_metadata(self, deck_id: str, title: str, status: str = "ready"):
        """Update deck metadata"""
        self.client.table("decks").update({
            "title": title,
            "status": status
        }).eq("id", deck_id).execute()

    async def save_flashcards(self, deck_id: str, flashcards: list[dict]):
        """Save flashcards to database"""
        # Get owner_id from deck
        deck = self.client.table("decks").select("owner_id").eq("id", deck_id).single().execute()
        owner_id = deck.data["owner_id"]

        cards_to_insert = [
            {
                "deck_id": deck_id,
                "owner_id": owner_id,
                "front": card["front"],
                "back": card["back"],
                "order_index": idx,
            }
            for idx, card in enumerate(flashcards)
        ]

        self.client.table("flashcards").insert(cards_to_insert).execute()


def get_supabase() -> SupabaseService:
    """Get Supabase service instance"""
    return SupabaseService()
