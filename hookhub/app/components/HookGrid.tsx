"use client";

import { useState, useMemo } from "react";
import { Hook } from "@/types/hook";
import HookCard from "./HookCard";
import CategoryFilter from "./CategoryFilter";
import SearchBar from "./SearchBar";

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
      <div className="text-sm text-gray-600">
        Showing {filteredHooks.length} hook{filteredHooks.length !== 1 ? "s" : ""}
      </div>

      {/* Hook Grid */}
      {filteredHooks.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredHooks.map((hook) => (
            <HookCard key={hook.id} hook={hook} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-lg font-medium text-gray-900">No hooks found</p>
          <p className="mt-2 text-sm text-gray-600">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
}
