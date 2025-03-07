// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Import axe-core and cypress-axe
import 'cypress-axe';

// -- This is a parent command --
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/');
  cy.get('input[type="email"], input[type="text"]').first().type(email);
  cy.get('input[type="password"]').type(password);
  cy.get('button[type="submit"]').click();
});

// Navigate to a specific page after login
Cypress.Commands.add('navigateTo', (page) => {
  const pageMap = {
    'campaign': /campaign|setup/i,
    'ai-research': /ai|research/i,
    'phone-calling': /phone|call/i,
    'pre-sales-ai': /pre-sales|ai/i,
    'database': /database|db/i
  };
  
  const pattern = pageMap[page] || new RegExp(page, 'i');
  cy.get('a, button').contains(pattern).click({ force: true });
  cy.wait(1000); // Wait for navigation to complete
});

// Mock successful login and navigate to a page
Cypress.Commands.add('loginAndNavigate', (page) => {
  // Visit the homepage
  cy.visit('/');
  cy.wait(1000);
  
  // Mock successful login
  cy.intercept('POST', '**/api/v1/auth/login', {
    statusCode: 200,
    body: {
      token: 'fake-jwt-token',
      user: {
        email: 'userone@example.com',
        name: 'User One',
        roleId: 1
      }
    }
  }).as('loginRequest');

  // Login
  cy.get('input[type="email"], input[type="text"]').first().type('userone');
  cy.get('input[type="password"]').type('UserOne1*');
  cy.get('button[type="submit"]').click();
  cy.wait('@loginRequest');
  
  if (page) {
    // Navigate to the specified page
    const pageMap = {
      'campaign': /campaign|setup/i,
      'ai-research': /ai|research/i,
      'phone-calling': /phone|call/i,
      'pre-sales-ai': /pre-sales|ai/i,
      'database': /database|db/i
    };
    
    const pattern = pageMap[page] || new RegExp(page, 'i');
    cy.get('a, button').contains(pattern).click({ force: true });
    cy.wait(1000); // Wait for navigation to complete
  }
});

// Select a campaign from the dropdown
Cypress.Commands.add('selectCampaign', (campaignName) => {
  cy.intercept('GET', '**/api/v1/campaign/list', {
    statusCode: 200,
    body: {
      success: true,
      data: [
        { id: 'test-campaign-123', name: 'Test Campaign', createdAt: new Date().toISOString() }
      ]
    }
  }).as('getCampaigns');
  
  cy.wait('@getCampaigns');
  cy.get('select, div[role="combobox"]').click({ force: true });
  cy.get('li, option').contains(campaignName || 'Test Campaign').click({ force: true });
});

// Mock active campaign data
Cypress.Commands.add('mockActiveCampaign', () => {
  cy.intercept('GET', '**/api/v1/campaign/active', {
    statusCode: 200,
    body: {
      success: true,
      data: {
        id: 'test-campaign-123',
        name: 'Test Campaign',
        buyers: [
          { 
            id: 'buyer-1', 
            name: 'Test Buyer 1', 
            company: 'Test Company 1',
            phone: '+1234567890',
            email: 'buyer1@example.com',
            position: 'CEO'
          },
          { 
            id: 'buyer-2', 
            name: 'Test Buyer 2', 
            company: 'Test Company 2',
            phone: '+0987654321',
            email: 'buyer2@example.com',
            position: 'CTO'
          }
        ]
      }
    }
  }).as('getActiveCampaign');
});

// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })

// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })

// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Add custom commands here
Cypress.Commands.add('dataCy', (value: string) => {
  return cy.get(`[data-cy=${value}]`);
});

// Add a custom command for accessibility testing
Cypress.Commands.add('checkA11y', (context?: any, options?: any) => {
  cy.injectAxe();
  cy.checkA11y(context, options);
});

// Add a custom command for checking accessibility with custom rules
Cypress.Commands.add('checkA11yWithRules', (context: any, rules: string[], options?: any) => {
  cy.injectAxe();
  cy.checkA11y(context, {
    runOnly: {
      type: 'rule',
      values: rules,
    },
    ...options,
  });
});

// Add a custom command for checking accessibility with custom tags
Cypress.Commands.add('checkA11yWithTags', (context: any, tags: string[], options?: any) => {
  cy.injectAxe();
  cy.checkA11y(context, {
    runOnly: {
      type: 'tag',
      values: tags,
    },
    ...options,
  });
});

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      dataCy(value: string): Chainable<JQuery<HTMLElement>>
      
      /**
       * Custom command for accessibility testing
       * @example cy.checkA11y()
       */
      checkA11y(context?: any, options?: any): Chainable<void>
      
      /**
       * Custom command for checking accessibility with custom rules
       * @example cy.checkA11yWithRules('main', ['color-contrast'])
       */
      checkA11yWithRules(context: any, rules: string[], options?: any): Chainable<void>
      
      /**
       * Custom command for checking accessibility with custom tags
       * @example cy.checkA11yWithTags('main', ['wcag2a'])
       */
      checkA11yWithTags(context: any, tags: string[], options?: any): Chainable<void>
      
      /**
       * Custom command to select DOM element by data-test attribute.
       * @example cy.dataTest('greeting')
       */
      dataTest(value: string): Chainable<JQuery<HTMLElement>>
      
      /**
       * Custom command to select campaign.
       * @example cy.selectCampaign('Test Campaign')
       */
      selectCampaign(campaignName?: string): Chainable<void>
      
      /**
       * Custom command to mock active campaign.
       * @example cy.mockActiveCampaign()
       */
      mockActiveCampaign(): Chainable<void>
    }
  }
} 