interface CategoryFilterProps {
  categories: ReadonlyArray<{ label: string; value: string }>;
  activeCategory: string;
  onCategoryChange: (value: string) => void;
}

export default function CategoryFilter({ categories, activeCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-8" role="tablist" aria-label="Filter minerals by category">
      {categories.map(cat => (
        <button
          key={cat.value}
          role="tab"
          aria-selected={activeCategory === cat.value}
          onClick={() => onCategoryChange(cat.value)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base ${
            activeCategory === cat.value
              ? 'bg-accent-blue text-white border-accent-blue shadow-lg shadow-accent-blue/20'
              : 'bg-bg-surface text-slate-400 border-white/10 hover:bg-white/5 hover:text-white'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
