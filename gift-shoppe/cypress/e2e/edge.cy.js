describe('Edge Case Testing', () => {

  it('EDGE-001: Negative Quantity in Cart Handling', () => {
    cy.visit('/');
    cy.get('.product-card .add-to-cart-btn').first().click();
    
    // Open the cart
    cy.get('.cart-icon-container').click();
    
    // Try to decrement past 1
    cy.get('.quantity-btn').contains('-').click(); // to zero, possibly removing it
    
    // Check if the item was removed or if the quantity is enforced at a minimum of 1
    cy.get('body').then($body => {
      // If the cart-item doesn't exist anymore, it handled it by removing
      if ($body.find('.cart-item').length === 0) {
        cy.get('.empty-cart-message').should('be.visible');
      } else {
        // Otherwise, it should say minimum 1
        cy.get('.item-quantity').should('have.text', '1');
      }
    });

    // Check we never have a negative subtotal
    cy.get('.cart-total').invoke('text').then((text) => {
      const num = parseFloat(text.replace(/[^0-9.]/g, ''));
      expect(num).to.be.at.least(0);
    });
  });

  it('EDGE-002: Extremely Long Inputs in Gift Builder', () => {
    cy.visit('/custom-gift');

    // Create a 500 character payload
    const longString = 'A'.repeat(500);

    // Enter it
    cy.get('input[placeholder="Enter recipient name"]').type(longString, { delay: 0 });

    // Ensure it doesn't break the UI (e.g., input width should be constrained)
    cy.get('input[placeholder="Enter recipient name"]').invoke('width').should('be.lessThan', window.innerWidth);

    // Depending on backend validation, it should potentially trim or throw an error on submit
    // Here we just test UI resilience
  });
  
  it('EDGE-003: Network Disconnect handling (Offline mode)', () => {
    // You can mock the window.navigator.onLine property or use Cypress intercepts to mock failed requests
    
    cy.visit('/');
    cy.get('.product-card .add-to-cart-btn').first().click();
    cy.visit('/checkout');

    // Mock a 503 Service Unavailable or network error for the checkout endpoint
    cy.intercept('POST', '**/checkout', {
      forceNetworkError: true
    }).as('checkoutError');

    // Attempt to submit
    cy.get('form').submit();
    cy.wait('@checkoutError');
    
    // Check that the UI handles it gracefully instead of crashing
    // For example, showing a toast error or an alert message
    cy.get('.error-message, .toast').should('contain.text', 'network').or('contain.text', 'failed');
  });

});
