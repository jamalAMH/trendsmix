import type { StoryCategory } from "@/types/story";
import { formatCategory, getCategoryAccent } from "@/lib/utils";

interface CategoryBadgeProps {
  category: StoryCategory;
  className?: string;
}

export default function CategoryBadge({
  category,
  className = "",
}: CategoryBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide ring-1 ring-inset ${getCategoryAccent(category)} ${className}`}
    >
      {formatCategory(category)}
    </span>
  );
}
