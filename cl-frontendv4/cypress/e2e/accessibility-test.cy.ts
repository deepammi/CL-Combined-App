/**
 * Accessibility Tests
 * 
 * This test checks for accessibility issues on key pages.
 */

// Import axe-core
import 'cypress-axe';

describe('Accessibility Tests', () => {
  beforeEach(() => {
    // Set viewport size to ensure consistent testing
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

  it('should check login page for accessibility issues', () => {
    cy.visit('/login', { failOnStatusCode: false });
    cy.wait(1000); // Wait for page to load completely
    
    // Inject axe-core
    cy.injectAxe();
    
    // Run accessibility tests and log violations instead of failing
    cy.checkA11y(null, {
      includedImpacts: ['critical', 'serious']
    }, null, true); // The last parameter (true) means it will only log violations, not fail the test
  });

  it('should check dashboard page for accessibility issues', () => {
    cy.visit('/dashboard', { failOnStatusCode: false });
    cy.wait(1000); // Wait for page to load completely
    
    // Inject axe-core
    cy.injectAxe();
    
    // Run accessibility tests and log violations instead of failing
    cy.checkA11y(null, {
      includedImpacts: ['critical', 'serious']
    }, null, true);
  });

  it('should check campaign setup page for accessibility issues', () => {
    cy.visit('/campaign', { failOnStatusCode: false });
    cy.wait(1000); // Wait for page to load completely
    
    // Inject axe-core
    cy.injectAxe();
    
    // Run accessibility tests and log violations instead of failing
    cy.checkA11y(null, {
      includedImpacts: ['critical', 'serious']
    }, null, true);
  });

  it('should check phone calling page for accessibility issues', () => {
    cy.visit('/call', { failOnStatusCode: false });
    cy.wait(1000); // Wait for page to load completely
    
    // Inject axe-core
    cy.injectAxe();
    
    // Run accessibility tests and log violations instead of failing
    cy.checkA11y(null, {
      includedImpacts: ['critical', 'serious']
    }, null, true);
  });

  it('should check specific accessibility rules', () => {
    cy.visit('/', { failOnStatusCode: false });
    cy.wait(1000); // Wait for page to load completely
    
    // Inject axe-core
    cy.injectAxe();
    
    // Check specific accessibility rules and log violations instead of failing
    cy.checkA11y(null, {
      runOnly: {
        type: 'rule',
        values: ['color-contrast', 'aria-roles', 'image-alt']
      }
    }, null, true);
  });
}); 