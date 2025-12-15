"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { FlashcardFilter } from "@/features/flashcards/components/flashcard-filter";
import type { Flashcard } from "@/features/flashcards/components/flashcard-item";
import { FlashcardList } from "@/features/flashcards/components/flashcard-list";
import { useRouter } from "@/i18n/routing";

const MOCK_FLASHCARDS: Flashcard[] = [
  {
    id: "1",
    term: "React",
    definition:
      "A JavaScript library for building user interfaces. It is maintained by Facebook and a community of individual developers and companies.",
    tags: ["Frontend", "JavaScript"],
    createdAt: "2023-10-01",
  },
  {
    id: "2",
    term: "TypeScript",
    definition:
      "A strict syntactical superset of JavaScript and adds optional static typing to the language.",
    tags: ["Language", "Microsoft"],
    createdAt: "2023-10-02",
  },
  {
    id: "3",
    term: "Next.js",
    definition:
      "An open-source web development framework created by Vercel enabling React-based web applications with server-side rendering and generating static websites.",
    tags: ["Framework", "React"],
    createdAt: "2023-10-03",
  },
  {
    id: "4",
    term: "Tailwind CSS",
    definition:
      "A utility-first CSS framework for rapidly building custom user interfaces.",
    tags: ["CSS", "Styling"],
    createdAt: "2023-10-04",
  },
  {
    id: "5",
    term: "Prisma",
    definition:
      "Next-generation Node.js and TypeScript ORM. Prisma unlocks a new level of developer experience when working with databases thanks to its intuitive data model, automated migrations, type-safety & auto-completion.",
    tags: ["Database", "ORM"],
    createdAt: "2023-10-05",
  },
  {
    id: "6",
    term: "GraphQL",
    definition:
      "A query language for APIs and a runtime for fulfilling those queries with your existing data.",
    tags: ["API", "Query Language"],
    createdAt: "2023-10-06",
  },
];

export default function FlashcardsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [_sort, setSort] = useState("newest");

  // In a real app, filtering and sorting would likely happen on the server or with a more robust local logic
  const filteredFlashcards = MOCK_FLASHCARDS.filter(
    (card) =>
      card.term.toLowerCase().includes(search.toLowerCase()) ||
      card.definition.toLowerCase().includes(search.toLowerCase()),
  );

  const handleView = (id: string) => {
    // Navigate to view page
  };

  const handleEdit = (id: string) => {
    // Navigate to edit page
  };

  return (
    <DashboardLayout
      title="Flashcards"
      description="Manage and review your flashcards collection."
      actions={
        <Button onClick={() => router.push("/dashboard/flashcards/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Flashcard
        </Button>
      }
    >
      <div className="flex flex-col gap-6">
        <FlashcardFilter onSearchChange={setSearch} onSortChange={setSort} />

        <FlashcardList
          flashcards={filteredFlashcards}
          onView={handleView}
          onEdit={handleEdit}
        />

        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </DashboardLayout>
  );
}
