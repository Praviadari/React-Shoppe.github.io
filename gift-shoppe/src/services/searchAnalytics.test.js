import {
  clearSearchAnalytics,
  getSearchAnalytics,
  normalizeSearchQuery,
  recordSearchQuery,
} from './searchAnalytics';

describe('searchAnalytics', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('records and ranks search terms', () => {
    recordSearchQuery('Photo Frame');
    recordSearchQuery('watch');
    recordSearchQuery('photo frame');

    const analytics = getSearchAnalytics();
    expect(analytics[0]).toEqual({ term: 'photo frame', count: 2 });
    expect(analytics[1]).toEqual({ term: 'watch', count: 1 });
  });

  it('ignores blank queries', () => {
    recordSearchQuery('   ');
    expect(getSearchAnalytics()).toEqual([]);
  });

  it('normalizes queries', () => {
    expect(normalizeSearchQuery('  Watch  ')).toBe('watch');
  });

  it('clears analytics', () => {
    recordSearchQuery('gift');
    clearSearchAnalytics();
    expect(getSearchAnalytics()).toEqual([]);
  });
});
