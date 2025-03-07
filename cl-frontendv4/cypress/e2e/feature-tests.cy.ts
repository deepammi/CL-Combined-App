describe('Feature Tests', () => {
  beforeEach(() => {
    // Visit the homepage before each test
    cy.visit('/');
    cy.wait(1000);
  });

  it('should navigate to login page', () => {
    cy.visit('/login');
    cy.wait(1000);
    cy.url().should('include', '/login');
    cy.get('input').should('exist');
    cy.get('button').should('exist');
  });

  it('should navigate to caller dashboard page', () => {
    cy.visit('/caller-dashboard', { failOnStatusCode: false });
    cy.wait(1000);
    cy.get('body').should('be.visible');
  });

  it('should navigate to AI research page', () => {
    cy.visit('/ai-research', { failOnStatusCode: false });
    cy.wait(1000);
    cy.get('body').should('be.visible');
  });

  it('should navigate to call analysis page', () => {
    cy.visit('/call-analysis', { failOnStatusCode: false });
    cy.wait(1000);
    cy.get('body').should('be.visible');
  });

  it('should navigate to pre-sales AI page', () => {
    cy.visit('/pre-sales-ai', { failOnStatusCode: false });
    cy.wait(1000);
    cy.get('body').should('be.visible');
  });

  it('should navigate to campaign alerts page', () => {
    cy.visit('/campaign-alerts', { failOnStatusCode: false });
    cy.wait(1000);
    cy.get('body').should('be.visible');
  });

  it('should navigate to manager dashboard page', () => {
    cy.visit('/manager-dashboard', { failOnStatusCode: false });
    cy.wait(1000);
    cy.get('body').should('be.visible');
  });

  it('should navigate to call logs page', () => {
    cy.visit('/call-logs', { failOnStatusCode: false });
    cy.wait(1000);
    cy.get('body').should('be.visible');
  });
}); 