import { Component, computed, inject, PLATFORM_ID, signal, ViewEncapsulation } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { BLOG_POSTS } from './blog-posts.generated';
import { filterAndSortPosts, paginationItems, POSTS_PER_PAGE, type BlogSort } from './blog-utils';
import { DomSanitizer } from '@angular/platform-browser';

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

@Component({
  selector: 'app-blog',
  templateUrl: './blog.html',
  styleUrl: './blog.css',
  encapsulation: ViewEncapsulation.None,
})
export class Blog {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly sanitizer = inject(DomSanitizer);

  readonly months = MONTH_NAMES;
  readonly years = [...new Set(BLOG_POSTS.map((post) => post.year))].sort((a, b) => b - a);
  readonly categories = [...new Set(BLOG_POSTS.map((post) => post.category))].sort();

  readonly filterOpen = signal(false);
  readonly sort = signal<BlogSort>('newest');
  readonly selectedYears = signal<number[]>([]);
  readonly selectedMonths = signal<number[]>([]);
  readonly selectedCategories = signal<string[]>([]);
  readonly requestedPage = signal(1);
  readonly expandedSlug = signal<string | null>(null);

  readonly hasFilters = computed(
    () =>
      this.selectedYears().length > 0 ||
      this.selectedMonths().length > 0 ||
      this.selectedCategories().length > 0,
  );
  readonly filteredPosts = computed(() =>
    filterAndSortPosts(BLOG_POSTS, {
      sort: this.sort(),
      years: this.selectedYears(),
      months: this.selectedMonths(),
      categories: this.selectedCategories(),
    }),
  );
  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredPosts().length / POSTS_PER_PAGE)),
  );
  readonly page = computed(() => {
    const expanded = this.expandedSlug();
    if (expanded) {
      const index = this.filteredPosts().findIndex((post) => post.slug === expanded);
      if (index !== -1) return Math.floor(index / POSTS_PER_PAGE) + 1;
    }
    return Math.min(Math.max(this.requestedPage(), 1), this.totalPages());
  });
  readonly visiblePosts = computed(() =>
    this.filteredPosts().slice((this.page() - 1) * POSTS_PER_PAGE, this.page() * POSTS_PER_PAGE),
  );
  readonly pageButtons = computed(() => paginationItems(this.page(), this.totalPages()));
  readonly renderedHtml = new Map(
    BLOG_POSTS.map((post) => [post.slug, this.sanitizer.bypassSecurityTrustHtml(post.html)]),
  );

  constructor() {
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      this.sort.set(params.get('sort') === 'oldest' ? 'oldest' : 'newest');
      this.selectedYears.set(this.readNumbers(params.get('year'), this.years));
      this.selectedMonths.set(
        this.readNumbers(
          params.get('month'),
          MONTH_NAMES.map((_, i) => i + 1),
        ),
      );
      this.selectedCategories.set(this.readStrings(params.get('category'), this.categories));
      const page = Number(params.get('page'));
      this.requestedPage.set(Number.isSafeInteger(page) && page > 0 ? page : 1);
      this.expandedSlug.set(params.get('post'));
    });
  }

  setSort(value: string): void {
    this.navigate({ sort: value === 'oldest' ? 'oldest' : null, page: null, post: null });
  }

  toggleYear(value: number): void {
    this.navigate({
      year: this.toggleValue(this.selectedYears(), value).join(',') || null,
      page: null,
      post: null,
    });
  }

  toggleMonth(value: number): void {
    this.navigate({
      month: this.toggleValue(this.selectedMonths(), value).join(',') || null,
      page: null,
      post: null,
    });
  }

  toggleCategory(value: string): void {
    this.navigate({
      category: this.toggleValue(this.selectedCategories(), value).join(',') || null,
      page: null,
      post: null,
    });
  }

  clearFilters(): void {
    this.navigate({ year: null, month: null, category: null, page: null, post: null });
  }

  togglePost(slug: string): void {
    this.navigate({ post: this.expandedSlug() === slug ? null : slug });
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages() || page === this.page()) return;
    this.navigate({ page: page === 1 ? null : page, post: null });
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  private navigate(changes: Record<string, string | number | null>): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: changes,
      queryParamsHandling: 'merge',
    });
  }

  private readNumbers(raw: string | null, allowed: readonly number[]): number[] {
    return (raw ?? '')
      .split(',')
      .map(Number)
      .filter(
        (value, index, values) =>
          Number.isInteger(value) && allowed.includes(value) && values.indexOf(value) === index,
      );
  }

  private readStrings(raw: string | null, allowed: readonly string[]): string[] {
    return (raw ?? '')
      .split(',')
      .filter((value, index, values) => allowed.includes(value) && values.indexOf(value) === index);
  }

  private toggleValue<T>(current: readonly T[], value: T): T[] {
    return current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
  }
}
