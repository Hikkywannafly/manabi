import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { KanbanBoard } from "./kanban-board";
import NewTaskDialog from "./new-task-dialog";

export default function KanbanViewPage() {
  return (
    <DashboardLayout
      title="Kanban"
      description="Manage tasks by dnd"
      actions={<NewTaskDialog />}
    >
      <KanbanBoard />
    </DashboardLayout>
  );
}
