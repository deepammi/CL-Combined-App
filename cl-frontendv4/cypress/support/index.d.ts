/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject = any> {
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
  const describe: Function;
  const it: Function;
  const beforeEach: Function;
  const afterEach: Function;
  const before: Function;
  const after: Function;
} 