import Link from "next/link";
import type { StoryCategory } from "@/types/story";
import { formatCategory, getCategoryAccent } from "@/lib/utils";

interface CategoryBadgeProps {
  category: StoryCategory;
  className?: string;
  linked?: boolean;
}

export default function CategoryBadge({
  category,
  className = "",
  linked = true,
}: CategoryBadgeProps) {
  const classes = `inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide ring-1 ring-inset ${getCategoryAccent(category)} ${className}`;

  if (!linked) {
    return <span className={classes}>{formatCategory(category)}</span>;
  }

  return (
    <Link
      href={`/category/${category}`}
      className={`${classes} transition-opacity hover:opacity-90`}
    >
      {formatCategory(category)}
    </Link>
  );
}
