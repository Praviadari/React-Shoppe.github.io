const STORAGE_KEY = 'giftshoppe-search-analytics';
const MAX_ENTRIES = 50;

function loadCounts() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

function saveCounts(counts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(counts));
}

export function normalizeSearchQuery(query) {
  return query.trim().toLowerCase();
}

export function recordSearchQuery(query) {
  const normalized = normalizeSearchQuery(query);
  if (!normalized) return;

  const counts = loadCounts();
  counts[normalized] = (counts[normalized] || 0) + 1;
  saveCounts(counts);
}

export function getSearchAnalytics(limit = MAX_ENTRIES) {
  return Object.entries(loadCounts())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([term, count]) => ({ term, count }));
}

export function clearSearchAnalytics() {
  localStorage.removeItem(STORAGE_KEY);
}
