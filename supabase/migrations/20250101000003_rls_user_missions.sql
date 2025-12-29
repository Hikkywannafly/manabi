-- RLS Policies for user_missions

-- Enable RLS (already enabled in init_schema but good to ensure)
alter table public.user_missions enable row level security;

-- Policy: Users can view their own missions
create policy "Users can view their own missions"
  on public.user_missions
  for select
  using (auth.uid() = user_id);

-- Policy: Users can insert their own missions (needed for initial creation in service)
create policy "Users can insert their own missions"
  on public.user_missions
  for insert
  with check (auth.uid() = user_id);

-- Policy: Users can update their own missions (progress updates)
create policy "Users can update their own missions"
  on public.user_missions
  for update
  using (auth.uid() = user_id);
