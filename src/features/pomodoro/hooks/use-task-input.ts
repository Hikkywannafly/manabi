import { useCallback, useState } from "react";
import { TASK_TAGS } from "../types";

export function useTaskInput() {
  const [task, setTask] = useState("");
  const [selectedTag, setSelectedTag] = useState(TASK_TAGS[0]);
  const [isOpen, setIsOpen] = useState(false);

  const handleTaskChange = useCallback((value: string) => {
    setTask(value);
  }, []);

  const handleTagSelect = useCallback((tag: (typeof TASK_TAGS)[0]) => {
    setSelectedTag(tag);
    setIsOpen(false);
  }, []);

  const clearTask = useCallback(() => {
    setTask("");
  }, []);

  return {
    task,
    selectedTag,
    isOpen,
    setTask: handleTaskChange,
    setSelectedTag: handleTagSelect,
    setIsOpen,
    clearTask,
  };
}
