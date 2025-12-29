-- Add flashcard-specific achievements
INSERT INTO public.achievements (code, title, description, icon, category, rarity, xp_reward, total_steps, sort_order)
VALUES
  ('FIRST_DECK_CREATOR', 'Deck Pioneer', 'Create your first flashcard deck', '📚', 'Creation', 'Common', 50, 1, 20),
  ('DECK_CREATOR_10', 'Deck Enthusiast', 'Create 10 flashcard decks', '📚', 'Creation', 'Rare', 200, 10, 21),
  ('DECK_CREATOR_50', 'Deck Master', 'Create 50 flashcard decks', '📚', 'Creation', 'Epic', 500, 50, 22),
  ('FLASHCARD_CREATOR_100', 'Card Collector', 'Create 100 flashcards', '🃏', 'Creation', 'Rare', 300, 100, 23),
  ('FLASHCARD_CREATOR_500', 'Card Hoarder', 'Create 500 flashcards', '🃏', 'Creation', 'Epic', 1000, 500, 24)
ON CONFLICT (code) DO NOTHING;
