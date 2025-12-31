import { z } from "zod";

export const collectionCreationSchema = z.object({
  name: z
    .string()
    .min(1, "Collection name is required")
    .max(100, "Collection name must be less than 100 characters"),
  isPublic: z.boolean().default(false),
});

export type CollectionCreationValues = z.infer<typeof collectionCreationSchema>;

export const collectionUpdateSchema = z.object({
  name: z
    .string()
    .min(1, "Collection name is required")
    .max(100, "Collection name must be less than 100 characters"),
});

export type CollectionUpdateValues = z.infer<typeof collectionUpdateSchema>;
