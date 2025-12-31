"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUpdateCollection } from "../hooks/use-update-collection";
import { type CollectionUpdateValues, collectionUpdateSchema } from "../schema";
import type { Collection } from "../types";

interface RenameCollectionDialogProps {
  collection: Collection;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RenameCollectionDialog({
  collection,
  open,
  onOpenChange,
}: RenameCollectionDialogProps) {
  const updateCollection = useUpdateCollection();

  const form = useForm<CollectionUpdateValues>({
    resolver: zodResolver(collectionUpdateSchema),
    defaultValues: {
      name: collection.name,
    },
  });

  // Reset form when collection changes
  useEffect(() => {
    form.reset({ name: collection.name });
  }, [collection.name, form]);

  const onSubmit = async (values: CollectionUpdateValues) => {
    await updateCollection.mutateAsync({
      collectionId: collection.id,
      name: values.name,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Collection</DialogTitle>
          <DialogDescription>
            Change the name of your collection.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Collection Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Collection name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateCollection.isPending}>
                {updateCollection.isPending ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
