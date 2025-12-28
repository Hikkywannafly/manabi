import type { Metadata } from "next";
import { DashboardPage } from "@/components/layouts";
import { NoteList } from "@/features/notes/components/note-list";

export const metadata: Metadata = {
  title: "Notes | Manabi",
  description: "Capture and organize your study notes",
};

export default function NotesPage() {
  return (
    <DashboardPage>
      <NoteList />
    </DashboardPage>
  );
}
