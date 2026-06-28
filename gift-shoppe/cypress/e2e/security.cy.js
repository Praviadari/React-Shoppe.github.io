describe('Security & Authorization Tests', () => {

  it('SEC-001: XSS (Cross-Site Scripting) via Custom Gift Builder', () => {
    cy.visit('/custom-gift');
    
    // Attempt to inject a script into the name field
    const xssPayload = "<script>document.body.style.backgroundColor='red';</script>";
    cy.get('input[placeholder="Enter recipient name"]').type(xssPayload);
    cy.get('textarea[placeholder="Enter a customized message"]').type(xssPayload);
    
    // Add to cart
    cy.contains('button', 'Next Step').click(); // assuming multi-step
    // Wait for the UI or try to find an add to cart button
    cy.get('button').contains(/add to cart|finish/i).click();

    // Go to cart
    cy.visit('/cart');
    
    // We expect the script to NOT execute, but the text to be correctly escaped
    cy.get('body').should('not.have.css', 'background-color', 'rgb(255, 0, 0)');
    cy.contains(xssPayload).should('be.visible');
  });

  it('SEC-003: Authentication Bypass on Protected Routes', () => {
    // Ensure we are logged out by clearing cookies and storage
    cy.clearCookies();
    cy.clearLocalStorage();
    
    // Try to visit checkout directly
    cy.visit('/checkout');
    
    // Expect app to redirect to login
    cy.url().should('include', '/login');
    cy.get('form').contains(/sign in|log in/i).should('be.visible');
  });

  it('SEC-005: Session Management and Invalidation', () => {
    // Normally login
    // Mock a login here for testing purposes
    window.localStorage.setItem('userToken', 'fake-valid-token');
    
    cy.visit('/');
    // Check we are "logged in" by looking for a Profile or Logout button
    cy.contains(/log out|profile/i).should('exist');
    
    // Clear the token
    cy.clearLocalStorage('userToken');
    cy.reload();
    
    // We should no longer see the logged-in specific buttons
    cy.contains(/log in/i).should('exist');
  });
});
