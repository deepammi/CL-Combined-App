// Import axe-core and cypress-axe
import 'cypress-axe';

// Add a custom command for accessibility testing
Cypress.Commands.add('injectAxe', () => {
  cy.window({ log: false }).then(window => {
    // Only inject axe if it doesn't already exist
    if (!window.axe) {
      // Inject axe-core library
      cy.log('Injecting axe-core');
      cy.task('log', 'Injecting axe-core');
    }
  });
});

// Add a custom command for checking accessibility
Cypress.Commands.add('checkPageA11y', (options = {}) => {
  cy.log('Checking accessibility');
  cy.window({ log: false }).then(window => {
    // Only run axe if it exists
    if (window.axe) {
      cy.log('Running axe-core checks');
      // Run axe on the document
      window.axe.run(options).then((results: any) => {
        // Log the results
        cy.log(`Accessibility violations: ${results.violations.length}`);
        if (results.violations.length > 0) {
          cy.log(JSON.stringify(results.violations, null, 2));
        }
        // Assert no violations
        expect(results.violations.length).to.equal(0);
      });
    } else {
      cy.log('axe-core not found, skipping accessibility checks');
    }
  });
});

// Declare the commands in the global namespace
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to inject axe-core
       * @example cy.injectAxe()
       */
      injectAxe(): Chainable<void>
      
      /**
       * Custom command to check accessibility
       * @example cy.checkPageA11y()
       */
      checkPageA11y(options?: any): Chainable<void>
    }
  }
} 