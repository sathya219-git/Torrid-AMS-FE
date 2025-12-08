describe('Login Page UI Test', () => {
  it('should allow user to type email, password and click Sign In', () => {

    cy.visit('http://localhost:5173');

    // Email input
    cy.get('input')
      .first()
      .type('test@gmail.com')
      .should('have.value', 'test@gmail.com');

    // Password input
    cy.get('input[type="password"]')
      .type('123')
      .should('have.value', '123');

    // Click Sign In button
    cy.contains('button', 'Sign In').click();
    cy.url().should('equal', 'http://localhost:5173/dashboard');

    
  });
});
