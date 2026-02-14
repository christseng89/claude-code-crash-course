interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const isSelected = selectedCategory === category;
        return (
          <button
            key={category}
            type="button"
            onClick={() => onSelectCategory(category)}
            aria-pressed={isSelected ? "true" : "false"}
            aria-label={`Filter by ${category} category${isSelected ? " (selected)" : ""}`}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
              isSelected
                ? "bg-[#d97757] text-[#faf9f5] shadow-lg shadow-[#d97757]/30 dark:shadow-[#d97757]/20"
                : "bg-white/80 text-[#141413] ring-1 ring-[#e8e6dc] backdrop-blur-sm hover:bg-[#e8e6dc] hover:ring-[#b0aea5] dark:bg-[#141413]/80 dark:text-[#faf9f5] dark:ring-[#b0aea5]/50 dark:hover:bg-[#141413] dark:hover:ring-[#b0aea5]"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
