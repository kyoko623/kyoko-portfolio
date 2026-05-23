import type { CollectionEntry } from 'astro:content';

type FilmLike = Pick<CollectionEntry<'films'>, 'data'> & { data: { order: number; draft: boolean } };

/**
 * Returns a new array of films sorted by `order` ascending (does not mutate input).
 */
export function sortFilms<T extends FilmLike>(films: T[]): T[] {
  return [...films].sort((a, b) => a.data.order - b.data.order);
}

/**
 * Returns only films where draft === false. Filters in production builds.
 * In dev mode, all films (including drafts) are typically shown — callers
 * decide whether to apply this.
 */
export function filterPublished<T extends FilmLike>(films: T[]): T[] {
  return films.filter((f) => !f.data.draft);
}
