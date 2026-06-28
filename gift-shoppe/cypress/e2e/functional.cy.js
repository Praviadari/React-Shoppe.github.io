describe('Functional Testing', () => {

  beforeEach(() => {
    cy.visit('/');
  });

  it('FUNC-001: Verify "Add to Cart" functionality from Shop/Home', () => {
    cy.get('.product-card').first().within(() => {
      // Find the add to cart button within the first product card
      cy.get('.add-to-cart-btn').click();
    });

    // Check header cart icon counter
    cy.get('.cart-count').should('contain', '1');
    
    // Open the cart
    cy.get('.cart-icon-container').click();
    cy.get('.cart-modal').should('be.visible');
    
    // Verify 1 item is listed
    cy.get('.cart-item').should('have.length', 1);
  });

  it('FUNC-002: Verify Custom Gift Builder full flow', () => {
    cy.visit('/custom-gift');

    // Step 1: Select Box
    cy.contains('.gift-option', 'Luxury Wooden Box').click();
    
    // Type name
    cy.get('input[placeholder="Enter recipient name"]').type('John Doe');
    
    // Select items
    cy.contains('.gift-option', 'Gourmet Chocolate').click();
    
    // Select Add to Cart or Finish
    cy.get('.add-gift-to-cart-btn').click();

    // Verify in cart
    cy.get('.cart-icon-container').click();
    cy.get('.cart-item').should('contain', 'Custom Gift Box');
    cy.get('.cart-item').should('contain', 'John Doe');
  });

  it('FUNC-004: Form Validation in Checkout', () => {
    // Need an item in cart first to access checkout properly
    cy.visit('/');
    cy.get('.product-card .add-to-cart-btn').first().click();
    cy.visit('/checkout');

    // Click submit without filling form
    cy.get('button[type="submit"]').click();

    // Expect HTML5 required validation or custom React error state
    cy.get('form').find(':invalid').should('have.length.at.least', 1);
    // OR if using custom errors
    // cy.get('.error-message').should('be.visible');
  });

});
