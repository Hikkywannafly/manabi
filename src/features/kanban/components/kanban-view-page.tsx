import { DashboardPage } from "@/components/layouts";
import { KanbanBoard } from "./kanban-board";
import NewTaskDialog from "./new-task-dialog";

export default function KanbanViewPage() {
  return (
    <DashboardPage
      title="Kanban"
      description="Manage tasks by dnd"
      headerAction={<NewTaskDialog />}
    >
      <KanbanBoard />
    </DashboardPage>
  );
}
