import { createClient } from "@/lib/supabase/client";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  estimated_pomodoros: number;
  actual_pomodoros: number;
  position_order: number;
  priority: TaskPriority;
  due_date?: string | null;
  created_at: string;
  updated_at: string;
}

export const taskService = {
  async getTasks() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("position_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data || []) as Task[];
  },

  async createTask(
    title: string,
    description?: string,
    status: TaskStatus = "TODO",
    estimated_pomodoros = 1,
    position_order = 0,
  ) {
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
        description,
        status,
        estimated_pomodoros,
        actual_pomodoros: 0,
        position_order,
        priority: "medium",
      })
      .select()
      .single();

    if (error) throw error;
    return data as Task;
  },

  async updateTask(id: string, updates: Partial<Task>) {
    const supabase = createClient();

    // Convert status to uppercase if it's being updated from lowercase accidentally
    if (updates.status) {
      updates.status = updates.status.toUpperCase() as TaskStatus;
    }

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

  async reorderTasks(
    tasks: { id: string; position_order: number; status: TaskStatus }[],
  ) {
    const supabase = createClient();

    // Using multiple updates in a transaction-like way or parallel
    // For simplicity in client-side, we can do them one by one or use an RPC if performance is an issue
    // But since this is small board, we'll use Promise.all for some efficiency
    const promises = tasks.map((task) =>
      supabase
        .from("tasks")
        .update({ position_order: task.position_order, status: task.status })
        .eq("id", task.id),
    );

    const results = await Promise.all(promises);
    const errors = results.filter((r) => r.error);

    if (errors.length > 0) {
      throw errors[0].error;
    }
  },
};
