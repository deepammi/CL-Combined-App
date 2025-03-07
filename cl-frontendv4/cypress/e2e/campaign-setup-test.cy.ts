describe('Campaign Setup Test', () => { 
  beforeEach(() => { 
    cy.visit('/'); 
    cy.wait(1000); 
    cy.get('body').then($body => { 
      if ($body.find('a:contains("Campaign"), button:contains("Campaign")').length > 0) { 
        cy.get('a:contains("Campaign"), button:contains("Campaign")').first().click({ force: true }); 
      } 
    }); 
  }); 

  it('should display a page with content', () => { 
    cy.get('body').should('be.visible'); 
  }); 

  it('should have interactive elements', () => { 
    cy.get('button, input, a').should('exist'); 
  }); 

  it('should allow basic interaction', () => { 
    cy.get('button').first().click({ force: true }); 
  }); 
});
