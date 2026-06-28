Cypress.Commands.add('clearAppState', () => {
  cy.clearLocalStorage();
  cy.clearCookies();
});

Cypress.Commands.add('waitForCatalog', () => {
  cy.get('.product-card', { timeout: 20000 }).should('have.length.at.least', 1);
});

Cypress.Commands.add('addFirstProductToCart', () => {
  cy.visit('/shop');
  cy.waitForCatalog();
  cy.get('.product-card').first().find('.add-to-cart-btn').click({ force: true });
  cy.get('.cart-count').should('contain', '1');
});
