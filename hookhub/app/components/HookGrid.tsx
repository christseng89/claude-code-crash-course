"use client";

import { useState, useMemo } from "react";
import { Hook } from "@/types/hook";
import HookCard from "./HookCard";
import CategoryFilter from "./CategoryFilter";
import SearchBar from "./SearchBar";
import { Search } from "lucide-react";

interface HookGridProps {
  hooks: Hook[];
}

export default function HookGrid({ hooks }: HookGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Extract unique categories from hooks data
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(hooks.map((hook) => hook.category))
    ).sort();
    return ["All", ...uniqueCategories];
  }, [hooks]);

  // Filter hooks based on selected category and search query
  const filteredHooks = useMemo(() => {
    let filtered = hooks;

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((hook) => hook.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (hook) =>
          hook.name.toLowerCase().includes(query) ||
          hook.description.toLowerCase().includes(query) ||
          hook.repoName.toLowerCase().includes(query) ||
          hook.repoOwner.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [hooks, selectedCategory, searchQuery]);

  return (
    <div className="flex flex-col gap-8">
      {/* Search Bar */}
      <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* Category Filter */}
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Results Count */}
      <div className="flex items-center gap-2">
        <div className="h-1 w-1 rounded-full bg-[#d97757]"></div>
        <p className="text-sm font-medium text-[#141413] dark:text-[#faf9f5]">
          {filteredHooks.length} hook{filteredHooks.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Hook Grid */}
      {filteredHooks.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredHooks.map((hook) => (
            <HookCard key={hook.id} hook={hook} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#e8e6dc] bg-[#faf9f5]/50 py-16 text-center backdrop-blur-sm dark:border-[#b0aea5]/50 dark:bg-[#141413]/50">
          <div className="mb-4 rounded-full bg-[#e8e6dc] p-4 dark:bg-[#141413]">
            <Search className="h-8 w-8 text-[#b0aea5]" />
          </div>
          <p className="text-lg font-semibold text-[#141413] dark:text-[#faf9f5]">No hooks found</p>
          <p className="mt-2 text-sm text-[#b0aea5]">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
}
