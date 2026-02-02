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
        <div className="h-1 w-1 rounded-full bg-blue-500"></div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
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
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white/50 py-16 text-center backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/50">
          <div className="mb-4 rounded-full bg-gray-100 p-4 dark:bg-gray-800">
            <Search className="h-8 w-8 text-gray-400 dark:text-gray-500" />
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">No hooks found</p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
}
