import { DashboardPage } from "@/components/layouts";
import { KanbanBoard } from "@/features/kanban/components/kanban-board";
import NewTaskDialog from "@/features/kanban/components/new-task-dialog";

export const metadata = {
  title: "Dashboard : Kanban view",
};

export default function Page() {
  return (
    <DashboardPage
      title="Kanban"
      description="Manage tasks by drag and drop"
      headerAction={<NewTaskDialog />}
    >
      <KanbanBoard />
    </DashboardPage>
  );
}
