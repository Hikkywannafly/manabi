"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTaskStore } from "@/stores/use-task-store";
import { TaskList } from "./task-list";

interface TaskBoardProps {
  children: React.ReactNode;
}

export function TaskBoard({ children }: TaskBoardProps) {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const { addTask } = useTaskStore();
  const [open, setOpen] = useState(false);

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      addTask(newTaskTitle.trim());
      setNewTaskTitle("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddTask();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-xl border-none bg-black/80 p-0 text-white backdrop-blur-xl sm:rounded-3xl">
        <div className="flex h-[500px] flex-col overflow-hidden">
          <Tabs defaultValue="tasks" className="flex h-full flex-col">
            <div className="flex items-center justify-between border-white/10 border-b px-6 py-4">
              <TabsList className="bg-transparent p-0">
                <TabsTrigger
                  value="tasks"
                  className="rounded-none border-none bg-transparent px-0 pb-1 font-bold text-lg text-white/50 hover:text-white data-[state=active]:border-white data-[state=active]:bg-transparent data-[state=active]:text-white"
                >
                  Tasks
                </TabsTrigger>
                <TabsTrigger
                  value="events"
                  className="ml-6 rounded-none border-none bg-transparent pb-1 font-bold text-lg text-white/50 hover:text-white data-[state=active]:border-white data-[state=active]:bg-transparent data-[state=active]:text-white"
                >
                  Events
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="tasks" className="mt-0 h-full">
                <div className="flex h-full flex-col">
                  <ScrollArea className="flex-1 px-6 py-4">
                    <TaskList />
                  </ScrollArea>

                  {/* Input Area */}
                  <div className="border-white/10 border-t bg-black/20 p-4">
                    <div className="flex items-center gap-2 rounded-xl bg-white/5 p-2 pr-2 ring-1 ring-white/10 focus-within:ring-white/30">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 rounded-lg bg-white/10 text-white/70 text-xs hover:bg-white/20 hover:text-white"
                      >
                        Edit
                      </Button>
                      <Input
                        placeholder="What are you working on?"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="h-auto border-none bg-transparent p-0 text-white placeholder:text-white/30 focus-visible:ring-0"
                      />
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          className="h-8 text-white/50 hover:text-white"
                          onClick={() => setOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          className="h-8 rounded-lg bg-white/10 text-white/90 hover:bg-white/20"
                          onClick={handleAddTask}
                          disabled={!newTaskTitle.trim()}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2 text-center text-white/30 text-xs">
                      Add up to 3 tasks. Upgrade to Plus to add more.
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="events" className="mt-0 h-full p-6">
                <div className="flex h-full items-center justify-center text-white/30">
                  No events
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
