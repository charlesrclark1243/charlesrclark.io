import type { BlogPost } from './blog-posts.generated';

export const POSTS_PER_PAGE = 15;
export type BlogSort = 'newest' | 'oldest';
export type PaginationItem = number | 'ellipsis';

export interface BlogFilters {
  sort: BlogSort;
  years: readonly number[];
  months: readonly number[];
  categories: readonly string[];
}

export function filterAndSortPosts(posts: readonly BlogPost[], filters: BlogFilters): BlogPost[] {
  return posts
    .filter((post) =>
      (!filters.years.length || filters.years.includes(post.year)) &&
      (!filters.months.length || filters.months.includes(post.month)) &&
      (!filters.categories.length || filters.categories.includes(post.category)),
    )
    .sort((a, b) =>
      (filters.sort === 'newest' ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)) ||
      a.slug.localeCompare(b.slug),
    );
}

export function paginationItems(page: number, totalPages: number): PaginationItem[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const visible = new Set([1, totalPages, page - 1, page, page + 1]);
  if (page <= 3) [2, 3, 4].forEach((n) => visible.add(n));
  if (page >= totalPages - 2) {
    [totalPages - 3, totalPages - 2, totalPages - 1].forEach((n) => visible.add(n));
  }
  const numbers = [...visible].filter((n) => n >= 1 && n <= totalPages).sort((a, b) => a - b);
  const items: PaginationItem[] = [];
  for (const n of numbers) {
    const previous = items.at(-1);
    if (typeof previous === 'number' && n - previous > 1) {
      if (n - previous === 2) items.push(previous + 1);
      else items.push('ellipsis');
    }
    items.push(n);
  }
  return items;
}
