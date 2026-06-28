module.exports = {
  ci: {
    collect: {
      numberOfRuns: 1,
      startServerCommand: 'npx serve -s build -l 9000',
      startServerReadyPattern: 'Accepting connections',
      url: [
        'http://localhost:9000/',
        'http://localhost:9000/shop',
        'http://localhost:9000/build',
      ],
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.7 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.85 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 3500 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.15 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
