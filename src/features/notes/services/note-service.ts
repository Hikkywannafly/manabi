import { createClient } from "@/lib/supabase/client";

export interface Note {
  id: string;
  user_id: string;
  title: string | null;
  content: string | null;
  cue: string | null;
  summary: string | null;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

export type CreateNoteInput = Partial<
  Pick<Note, "title" | "content" | "cue" | "summary" | "is_pinned">
>;
export type UpdateNoteInput = Partial<
  Omit<Note, "id" | "user_id" | "created_at">
>;

export const noteService = {
  async getNotes() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .order("is_pinned", { ascending: false })
      .order("updated_at", { ascending: false });

    if (error) throw error;
    return (data || []) as Note[];
  },

  async createNote(input: CreateNoteInput) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("notes")
      .insert({
        user_id: user.id,
        title: input.title || "",
        content: input.content || "",
        cue: input.cue || "",
        summary: input.summary || "",
        is_pinned: input.is_pinned ?? false,
      })
      .select()
      .single();

    if (error) throw error;
    return data as Note;
  },

  async updateNote(id: string, updates: UpdateNoteInput) {
    const supabase = createClient();

    // First get the existing note to merge with updates
    const { data: existingNote, error: fetchError } = await supabase
      .from("notes")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;

    // Use upsert with POST method to avoid CORS issues with PATCH
    const { data, error } = await supabase
      .from("notes")
      .upsert(
        {
          ...existingNote,
          ...updates,
          id, // Ensure ID is kept
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" },
      )
      .select()
      .single();

    if (error) throw error;
    return data as Note;
  },

  async deleteNote(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from("notes").delete().eq("id", id);

    if (error) throw error;
  },

  async togglePin(id: string, is_pinned: boolean) {
    return this.updateNote(id, { is_pinned });
  },
};
