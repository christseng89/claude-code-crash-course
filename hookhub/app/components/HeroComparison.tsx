"use client";

import HeroWithCTA from "./heros/HeroWithCTA";
import HeroWithNav from "./heros/HeroWithNav";
import HeroWithSearch from "./heros/HeroWithSearch";

export default function HeroComparison() {
  const handleSearch = (query: string) => {
    console.log("Search query:", query);
  };

  return (
    <div className="space-y-8 mb-12">
      {/* Hero 1: With CTA */}
      <div>
        <div className="bg-yellow-100 dark:bg-yellow-900/20 px-4 py-2 border-b-2 border-yellow-400 dark:border-yellow-600">
          <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-300">
            Option 1: Hero with CTA Button
          </p>
        </div>
        <HeroWithCTA ctaLabel="Browse Hooks" ctaHref="#hooks" />
      </div>

      {/* Hero 2: With Navigation */}
      <div>
        <div className="bg-blue-100 dark:bg-blue-900/20 px-4 py-2 border-b-2 border-blue-400 dark:border-blue-600">
          <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">
            Option 2: Hero with Navigation Menu
          </p>
        </div>
        <HeroWithNav />
      </div>

      {/* Hero 3: With Search */}
      <div>
        <div className="bg-green-100 dark:bg-green-900/20 px-4 py-2 border-b-2 border-green-400 dark:border-green-600">
          <p className="text-sm font-semibold text-green-800 dark:text-green-300">
            Option 3: Hero with Search Bar
          </p>
        </div>
        <HeroWithSearch onSearch={handleSearch} />
      </div>
    </div>
  );
}
