describe('Basic Test', () => {
  it('should visit the homepage', () => {
    cy.visit('/');
    cy.wait(2000);
    cy.get('body').should('be.visible');
  });

  it('should navigate to login page', () => {
    cy.visit('/login');
    cy.wait(2000);
    cy.get('body').should('be.visible');
    cy.url().should('include', '/login');
  });

  it('should have login form elements', () => {
    cy.visit('/login');
    cy.wait(2000);
    cy.get('input').should('exist');
    cy.get('button').should('exist');
  });

  it('should navigate to different pages', () => {
    // Visit homepage
    cy.visit('/');
    cy.wait(1000);
    
    // Navigate to login page
    cy.visit('/login');
    cy.wait(1000);
    cy.url().should('include', '/login');
    
    // Try to navigate to other pages (they might redirect to login)
    cy.visit('/caller-dashboard', { failOnStatusCode: false });
    cy.wait(1000);
    cy.get('body').should('be.visible');
    
    cy.visit('/ai-research', { failOnStatusCode: false });
    cy.wait(1000);
    cy.get('body').should('be.visible');
    
    cy.visit('/call-analysis', { failOnStatusCode: false });
    cy.wait(1000);
    cy.get('body').should('be.visible');
  });
}); 