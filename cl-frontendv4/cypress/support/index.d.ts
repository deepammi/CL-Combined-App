/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to select DOM element by data-cy attribute.
     * @example cy.dataCy('greeting')
     */
    dataCy(value: string): Chainable<Element>
  }
}

// Extend the global namespace to include Cypress
declare global {
  const cy: Cypress.Chainable;
  const expect: Chai.ExpectStatic;
} 