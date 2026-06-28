describe('Security and access control', () => {
  beforeEach(() => {
    cy.clearAppState();
  });

  it('sanitizes malicious engraving input in the custom builder', () => {
    cy.visit('/build');
    const payload = "<script>alert('xss')</script>Name";
    cy.get('#engraving').type(payload, { parseSpecialCharSequences: false });
    cy.get('#engraving').invoke('val').should('not.include', '<script>');
    cy.get('body').should('not.have.css', 'background-color', 'rgb(255, 0, 0)');
  });

  it('redirects unauthenticated users away from the account page', () => {
    cy.visit('/account');
    cy.url().should('include', '/login');
    cy.contains('h1', 'Sign in').should('be.visible');
  });

  it('allows guest checkout without forcing login', () => {
    cy.addFirstProductToCart();
    cy.visit('/checkout');
    cy.url().should('include', '/checkout');
    cy.contains('h1', 'Checkout').should('be.visible');
    cy.contains('Delivery details').should('be.visible');
  });
});
