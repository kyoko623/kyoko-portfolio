import { describe, expect, it } from 'vitest';
import { sortFilms, filterPublished } from './films';

type Film = {
  data: { order: number; draft: boolean; title: string };
};

describe('sortFilms', () => {
  it('sorts films by order ascending (lower = earlier)', () => {
    const films: Film[] = [
      { data: { order: 3, draft: false, title: 'C' } },
      { data: { order: 1, draft: false, title: 'A' } },
      { data: { order: 2, draft: false, title: 'B' } },
    ];
    const result = sortFilms(films);
    expect(result.map((f) => f.data.title)).toEqual(['A', 'B', 'C']);
  });

  it('does not mutate the input array', () => {
    const films: Film[] = [
      { data: { order: 2, draft: false, title: 'B' } },
      { data: { order: 1, draft: false, title: 'A' } },
    ];
    const snapshot = films.map((f) => f.data.title);
    sortFilms(films);
    expect(films.map((f) => f.data.title)).toEqual(snapshot);
  });
});

describe('filterPublished', () => {
  it('removes films with draft=true', () => {
    const films: Film[] = [
      { data: { order: 1, draft: false, title: 'Published' } },
      { data: { order: 2, draft: true, title: 'Draft' } },
    ];
    const result = filterPublished(films);
    expect(result).toHaveLength(1);
    expect(result[0].data.title).toBe('Published');
  });
});
