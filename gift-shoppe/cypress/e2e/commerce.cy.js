describe('Core commerce flows', () => {
  beforeEach(() => {
    cy.clearAppState();
  });

  it('adds a catalog product to the bag from the shop', () => {
    cy.addFirstProductToCart();
    cy.get('a[aria-label*="Shopping bag"]').click();
    cy.url().should('include', '/cart');
    cy.get('.cart-item').should('have.length', 1);
  });

  it('completes the custom gift builder flow', () => {
    cy.visit('/build');
    cy.get('#baseItem').select('infinity-frame');
    cy.get('#material').select('crystal');
    cy.get('#engraving').type('Asha');
    cy.contains('button', /Add Custom Build to Cart/i).click();
    cy.contains('Item Successfully Added to Cart!').should('be.visible');

    cy.visit('/cart');
    cy.get('.cart-item').should('contain', 'Custom Infinity Photo Frame');
    cy.get('.cart-item__meta').should('contain', 'Asha');
  });

  it('shows validation errors on checkout when the form is empty', () => {
    cy.addFirstProductToCart();
    cy.visit('/checkout');
    cy.get('button[type="submit"]').click();
    cy.get('.field-error').should('have.length.at.least', 1);
    cy.contains('Full name is required').should('be.visible');
  });

  it('places a guest order and lands on confirmation', () => {
    cy.addFirstProductToCart();
    cy.visit('/checkout');

    cy.contains('label', 'Full name').find('input').type('Test Customer');
    cy.contains('label', 'Email').find('input').type('test@example.com');
    cy.contains('label', 'Phone').find('input').type('9876543210');
    cy.contains('label', 'Address').find('textarea').type('42 Gift Street');
    cy.contains('label', 'City').find('input').type('Bengaluru');
    cy.contains('label', 'PIN code').find('input').type('560001');

    cy.get('button[type="submit"]').click();
    cy.url().should('match', /\/order\/ORD-/);
    cy.contains('Order confirmed').should('be.visible');
  });
});
