"use client";

import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/auth-provider";
import type { AchievementRarity } from "@/services/achievement-service";
import { useAchievementStore } from "@/stores/use-achievement-store";
import { AchievementList } from "./achievement-list";
import { AchievementStats } from "./achievement-stats";

export function AchievementsView() {
  const { user } = useAuth();
  const { achievements, isLoading, fetchAchievements } = useAchievementStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRarity, setSelectedRarity] = useState<
    AchievementRarity | "ALL"
  >("ALL");
  const [selectedStatus, setSelectedStatus] = useState<
    "ALL" | "UNLOCKED" | "LOCKED"
  >("ALL");
  const [activeTab, setActiveTab] = useState<string>("ALL");

  useEffect(() => {
    if (user?.id) {
      fetchAchievements(user.id);
    }
  }, [user?.id, fetchAchievements]);

  const filteredAchievements = useMemo(() => {
    return achievements.filter((ach) => {
      // 1. Tab Filter
      if (activeTab !== "ALL" && ach.category.toUpperCase() !== activeTab) {
        // Note: Tab values are uppercase in my logical mapping usually, but let's check values.
        // DB Category: 'Study', 'Social' (Title Case).
        // Tab value: 'STUDY' (if using shadcn tabs usually value is whatever we set).
        // Let's match case insensitive.
        if (ach.category.toUpperCase() !== activeTab) return false;
      }

      // 2. Search Filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !(
            ach.title.toLowerCase().includes(query) ||
            ach.description.toLowerCase().includes(query)
          )
        ) {
          return false;
        }
      }

      // 3. Rarity Filter
      if (selectedRarity !== "ALL" && ach.rarity !== selectedRarity) {
        return false;
      }

      // 4. Status Filter
      if (selectedStatus === "UNLOCKED" && !ach.unlocked) return false;
      if (selectedStatus === "LOCKED" && ach.unlocked) return false;

      return true;
    });
  }, [achievements, activeTab, searchQuery, selectedRarity, selectedStatus]);

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="font-bold text-3xl tracking-tight">Achievements</h1>
        <p className="text-muted-foreground">
          Complete challenges and unlock rewards as you progress in your
          learning journey
        </p>
      </div>

      <AchievementStats achievements={achievements} />

      <div className="flex flex-col gap-4">
        {/* Controls */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground" />
            <Input
              placeholder="Search achievements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select
            value={selectedRarity}
            onValueChange={(val) => setSelectedRarity(val as any)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Rarities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Rarities</SelectItem>
              <SelectItem value="Common">Common</SelectItem>
              <SelectItem value="Rare">Rare</SelectItem>
              <SelectItem value="Epic">Epic</SelectItem>
              <SelectItem value="Legendary">Legendary</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={selectedStatus}
            onValueChange={(val) => setSelectedStatus(val as any)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="UNLOCKED">Unlocked</SelectItem>
              <SelectItem value="LOCKED">Locked</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabs */}
        <Tabs
          defaultValue="ALL"
          className="w-full"
          onValueChange={setActiveTab}
        >
          <TabsList className="h-auto w-full justify-start overflow-x-auto bg-muted/50 p-1">
            <TabsTrigger value="ALL">All</TabsTrigger>
            <TabsTrigger value="STUDY">Study</TabsTrigger>
            <TabsTrigger value="CREATION">Creation</TabsTrigger>
            <TabsTrigger value="PERFORMANCE">Performance</TabsTrigger>
            <TabsTrigger value="STREAK">Streak</TabsTrigger>
            <TabsTrigger value="SOCIAL">Social</TabsTrigger>
            <TabsTrigger value="SPECIAL">Special</TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <AchievementList
              achievements={filteredAchievements}
              isLoading={isLoading}
            />
          </div>
        </Tabs>
      </div>
    </div>
  );
}
