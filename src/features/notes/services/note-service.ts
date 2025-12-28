import { createClient } from "@/lib/supabase/client";

export interface Note {
  id: string;
  user_id: string;
  title: string | null;
  content: string | null;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

export type CreateNoteInput = Partial<Pick<Note, "title" | "content">>;
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
        is_pinned: false,
      })
      .select()
      .single();

    if (error) throw error;
    return data as Note;
  },

  async updateNote(id: string, updates: UpdateNoteInput) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("notes")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
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
