/**
 * Visual Regression Tests
 * 
 * This test captures screenshots of key pages for visual regression testing.
 * Compare these screenshots manually or with a visual diffing tool.
 */

describe('Visual Regression Tests', () => {
  beforeEach(() => {
    // Set viewport size to ensure consistent screenshots
    cy.viewport(1280, 800);
    
    // Set up authenticated state for protected pages
    cy.window().then(win => {
      win.localStorage.setItem('token', 'fake-jwt-token');
      win.localStorage.setItem('user', JSON.stringify({
        email: 'userone@example.com',
        name: 'User One',
        roleId: 1
      }));
    });
  });

  it('should capture login page', () => {
    cy.visit('/login', { failOnStatusCode: false });
    cy.wait(1000); // Wait for animations to complete
    cy.screenshot('login-page-visual');
  });

  it('should capture dashboard page', () => {
    cy.visit('/dashboard', { failOnStatusCode: false });
    cy.wait(1000); // Wait for animations to complete
    cy.screenshot('dashboard-page-visual');
  });

  it('should capture campaign setup page', () => {
    cy.visit('/campaign', { failOnStatusCode: false });
    cy.wait(1000); // Wait for animations to complete
    cy.screenshot('campaign-setup-page-visual');
  });

  it('should capture phone calling page', () => {
    cy.visit('/call', { failOnStatusCode: false });
    cy.wait(1000); // Wait for animations to complete
    cy.screenshot('phone-calling-page-visual');
  });

  it('should capture AI research page', () => {
    cy.visit('/ai-research', { failOnStatusCode: false });
    cy.wait(1000); // Wait for animations to complete
    cy.screenshot('ai-research-page-visual');
  });

  it('should capture database operations page', () => {
    cy.visit('/database', { failOnStatusCode: false });
    cy.wait(1000); // Wait for animations to complete
    cy.screenshot('database-operations-page-visual');
  });

  it('should capture error page', () => {
    cy.visit('/non-existent-page', { failOnStatusCode: false });
    cy.wait(1000); // Wait for animations to complete
    cy.screenshot('error-page-visual');
  });
}); 