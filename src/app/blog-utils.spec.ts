import { describe, expect, it } from 'vitest';
import type { BlogPost } from './blog-posts.generated';
import { filterAndSortPosts, paginationItems, POSTS_PER_PAGE } from './blog-utils';

function post(n: number, year = 2026, month = 10, category = 'Research'): BlogPost {
  return {
    slug: `post-${n}`, title: `Post ${n}`, category,
    date: new Date(Date.UTC(year, month - 1, n)).toISOString(),
    year, month, dateLabel: '', excerpt: '', html: '',
  };
}

describe('blog filtering, sorting, and pagination', () => {
  it('defaults to newest-first sorting', () => {
    const posts = [post(1), post(3), post(2)];
    expect(filterAndSortPosts(posts, { sort: 'newest', years: [], months: [], categories: [] })
      .map((item) => item.slug)).toEqual(['post-3', 'post-2', 'post-1']);
  });

  it('supports oldest-first sorting', () => {
    const posts = [post(3), post(1), post(2)];
    expect(filterAndSortPosts(posts, { sort: 'oldest', years: [], months: [], categories: [] })
      .map((item) => item.slug)).toEqual(['post-1', 'post-2', 'post-3']);
  });

  it('combines month, year, and category filters', () => {
    const posts = [post(1), post(2, 2025), post(3, 2026, 9), post(4, 2026, 10, 'Personal')];
    const matches = filterAndSortPosts(posts, {
      sort: 'newest', years: [2026], months: [10], categories: ['Research'],
    });
    expect(matches.map((item) => item.slug)).toEqual(['post-1']);
  });

  it('limits the page size to 15 posts', () => {
    const posts = Array.from({ length: 31 }, (_, i) => post(i + 1));
    const sorted = filterAndSortPosts(posts, { sort: 'newest', years: [], months: [], categories: [] });
    expect(sorted.slice(0, POSTS_PER_PAGE)).toHaveLength(15);
    expect(sorted.slice(POSTS_PER_PAGE, POSTS_PER_PAGE * 2)).toHaveLength(15);
    expect(sorted.slice(POSTS_PER_PAGE * 2)).toHaveLength(1);
  });

  it('shows Google-style page numbers with ellipses', () => {
    expect(paginationItems(5, 20)).toEqual([1, 'ellipsis', 4, 5, 6, 'ellipsis', 20]);
    expect(paginationItems(1, 20)).toEqual([1, 2, 3, 4, 'ellipsis', 20]);
    expect(paginationItems(20, 20)).toEqual([1, 'ellipsis', 17, 18, 19, 20]);
  });
});
