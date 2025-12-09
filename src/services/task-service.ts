import { createClient } from "@/lib/supabase/client";

export type TaskStatus = "todo" | "in_progress" | "done";

export interface Task {
  id: string;
  user_id: string;
  title: string;
  status: TaskStatus;
  estimated_pomodoros: number;
  actual_pomodoros: number;
  created_at: string;
}

export const taskService = {
  async getTasks() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data || []) as Task[];
  },

  async createTask(title: string, estimated_pomodoros = 1) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("tasks")
      .insert({
        user_id: user.id,
        title,
        status: "todo",
        estimated_pomodoros,
        actual_pomodoros: 0,
      })
      .select()
      .single();

    if (error) throw error;
    return data as Task;
  },

  async updateTask(id: string, updates: Partial<Task>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("tasks")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Task;
  },

  async deleteTask(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) throw error;
  },
};
