import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: deck } = await supabase
    .from("decks")
    .select("slug")
    .eq("id", id)
    .single();

  redirect(`/dashboard/flashcards/${id}/${deck?.slug || "view"}`);
}
