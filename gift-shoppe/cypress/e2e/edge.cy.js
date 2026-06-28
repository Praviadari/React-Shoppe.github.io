describe('Edge cases', () => {
  beforeEach(() => {
    cy.clearAppState();
  });

  it('updates cart quantity from the cart page', () => {
    cy.addFirstProductToCart();
    cy.visit('/cart');

    cy.get('.cart-item__qty-input').clear().type('2');
    cy.get('.cart-item__line-total').should('contain', '₹');
    cy.get('.cart-count').should('contain', '2');
  });

  it('limits engraving input length on the build page', () => {
    cy.visit('/build');
    cy.get('#engraving').type('A'.repeat(25));
    cy.get('#engraving').should('have.value', 'A'.repeat(20));
    cy.contains('.char-count', '20/20').should('be.visible');
  });

  it('shows an empty checkout state when the bag is empty', () => {
    cy.visit('/checkout');
    cy.contains('Your bag is empty').should('be.visible');
    cy.get('button[type="submit"]').should('not.exist');
  });
});
