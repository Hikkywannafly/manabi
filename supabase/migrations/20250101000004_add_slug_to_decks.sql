-- Add slug column to decks table
alter table public.decks
add column if not exists slug text;

-- Create index for faster lookups
create index if not exists idx_decks_slug on public.decks(slug);
