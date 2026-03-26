import { getLessonHref } from '@/lib/lessonLink';

describe('getLessonHref', () => {
  test('returns # for locked lessons', () => {
    expect(getLessonHref({ locked: true, id: 'x', slug: 's' })).toBe('#');
  });

  test('prefers slug when present', () => {
    expect(getLessonHref({ locked: false, id: 'x', slug: 'alphabet' })).toBe('/lecons/alphabet');
  });

  test('falls back to id when no slug', () => {
    expect(getLessonHref({ locked: false, id: 'abc123' })).toBe('/lesson/abc123');
  });
});
