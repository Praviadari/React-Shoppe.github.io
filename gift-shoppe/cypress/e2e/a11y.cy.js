import 'cypress-axe';

describe('Accessibility (WCAG 2.x)', () => {
  beforeEach(() => {
    cy.clearAppState();
  });

  const publicPages = [
    { path: '/', name: 'Home' },
    { path: '/shop', name: 'Shop' },
    { path: '/build', name: 'Custom build' },
    { path: '/faq', name: 'FAQ' },
    { path: '/support', name: 'Support' },
    { path: '/search', name: 'Search' },
  ];

  publicPages.forEach(({ path, name }) => {
    it(`has no serious accessibility violations on ${name}`, () => {
      cy.visit(path);
      cy.injectAxe();
      cy.checkA11y(undefined, {
        includedImpacts: ['critical', 'serious'],
      });
    });
  });

  it('has no serious violations on checkout with items in cart', () => {
    cy.addFirstProductToCart();
    cy.visit('/checkout');
    cy.injectAxe();
    cy.checkA11y(undefined, {
      includedImpacts: ['critical', 'serious'],
    });
  });
});
