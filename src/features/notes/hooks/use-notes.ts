"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useAuth } from "@/contexts/auth-provider";
import {
  type CreateNoteInput,
  type Note,
  noteService,
  type UpdateNoteInput,
} from "../services/note-service";

/**
 * Custom hook for notes data fetching following "Manabi Way"
 * Flow: Component → Hook (React Query) → Service → Supabase Client
 */
export function useNotes() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch all notes
  const {
    data: notes = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["notes", user?.id],
    queryFn: () => noteService.getNotes(),
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Create note mutation
  const createNoteMutation = useMutation({
    mutationFn: (input: CreateNoteInput) => noteService.createNote(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", user?.id] });
    },
  });

  // Update note mutation
  const updateNoteMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateNoteInput }) =>
      noteService.updateNote(id, updates),
    onMutate: async ({ id, updates }) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ["notes", user?.id] });
      const previousNotes = queryClient.getQueryData<Note[]>([
        "notes",
        user?.id,
      ]);

      queryClient.setQueryData<Note[]>(["notes", user?.id], (old = []) =>
        old.map((note) => (note.id === id ? { ...note, ...updates } : note)),
      );

      return { previousNotes };
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousNotes) {
        queryClient.setQueryData(["notes", user?.id], context.previousNotes);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", user?.id] });
    },
  });

  // Delete note mutation
  const deleteNoteMutation = useMutation({
    mutationFn: (id: string) => noteService.deleteNote(id),
    onMutate: async (id) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ["notes", user?.id] });
      const previousNotes = queryClient.getQueryData<Note[]>([
        "notes",
        user?.id,
      ]);

      queryClient.setQueryData<Note[]>(["notes", user?.id], (old = []) =>
        old.filter((note) => note.id !== id),
      );

      return { previousNotes };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousNotes) {
        queryClient.setQueryData(["notes", user?.id], context.previousNotes);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", user?.id] });
    },
  });

  // Toggle pin mutation
  const togglePinMutation = useMutation({
    mutationFn: ({ id, isPinned }: { id: string; isPinned: boolean }) =>
      noteService.togglePin(id, isPinned),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", user?.id] });
    },
  });

  const updateNote = useCallback(
    async (id: string, updates: UpdateNoteInput) => {
      await updateNoteMutation.mutateAsync({ id, updates });
    },
    [updateNoteMutation],
  );

  return {
    notes,
    isLoading,
    error,
    createNote: createNoteMutation.mutateAsync,
    updateNote,
    deleteNote: deleteNoteMutation.mutateAsync,
    togglePin: (id: string, isPinned: boolean) =>
      togglePinMutation.mutateAsync({ id, isPinned }),
  };
}
