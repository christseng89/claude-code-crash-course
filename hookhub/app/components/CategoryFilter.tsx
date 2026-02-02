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
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
            selectedCategory === category
              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 dark:shadow-blue-500/20"
              : "bg-white/80 text-gray-700 ring-1 ring-gray-200/50 backdrop-blur-sm hover:bg-gray-50 hover:ring-gray-300/50 dark:bg-gray-900/80 dark:text-gray-300 dark:ring-gray-800/50 dark:hover:bg-gray-800/80 dark:hover:ring-gray-700/50"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
