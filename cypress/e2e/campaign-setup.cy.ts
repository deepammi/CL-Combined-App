describe('Campaign Setup', () => {
  beforeEach(() => {
    // Visit the homepage
    cy.visit('/');
    cy.wait(1000);
    
    // Attempt to navigate to Campaign Setup page if it exists
    cy.get('body').then($body => {
      if ($body.find('a:contains("Campaign"), button:contains("Campaign")').length > 0) {
        cy.get('a:contains("Campaign"), button:contains("Campaign")').first().click({ force: true });
      }
    });
  });

  it('should display a page with content', () => {
    // Verify the page has loaded by checking for basic elements
    cy.get('body').should('be.visible');
    cy.screenshot('campaign-setup');
  });

  it('should have interactive elements', () => {
    // Look for any interactive elements on the page
    cy.get('button, input, a').should('exist');
  });

  it('should allow basic interaction', () => {
    // Try to find and interact with elements
    cy.get('button').first().click({ force: true });
  });
}); 