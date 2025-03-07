describe('Pre-Sales AI Test', () => {
  beforeEach(() => {
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
    
    // Navigate to Pre-Sales AI page
    cy.get('a, button').contains(/pre-sales|ai/i).click({ force: true });
  });

  it('should display the pre-sales AI page with buyer information', () => {
    // Mock active campaign data
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
            }
          ]
        }
      }
    }).as('getActiveCampaign');
    cy.wait('@getActiveCampaign');

    // Check for pre-sales AI elements
    cy.get('h1, h2, h3').contains(/pre-sales|ai/i).should('be.visible');
    cy.get('body').should('contain.text', 'Test Buyer 1');
    cy.get('body').should('contain.text', 'Test Company 1');
    cy.get('body').should('contain.text', 'CEO');
  });

  it('should navigate between buyers using Next and Back buttons', () => {
    // Mock active campaign data with multiple buyers
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
    cy.wait('@getActiveCampaign');

    // Check initial buyer
    cy.get('body').should('contain.text', 'Test Buyer 1');
    
    // Click Next button
    cy.get('button').contains(/next|forward|right/i).click({ force: true });
    
    // Check if second buyer is displayed
    cy.get('body').should('contain.text', 'Test Buyer 2');
    cy.get('body').should('contain.text', 'Test Company 2');
    cy.get('body').should('contain.text', 'CTO');
    
    // Click Back button
    cy.get('button').contains(/back|previous|left/i).click({ force: true });
    
    // Check if first buyer is displayed again
    cy.get('body').should('contain.text', 'Test Buyer 1');
    cy.get('body').should('contain.text', 'Test Company 1');
    cy.get('body').should('contain.text', 'CEO');
  });

  it('should display buyer details in the table', () => {
    // Mock active campaign data
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
              position: 'CEO',
              linkedin: 'https://linkedin.com/in/testbuyer1'
            }
          ]
        }
      }
    }).as('getActiveCampaign');
    cy.wait('@getActiveCampaign');

    // Check if buyer details are displayed in the table
    cy.get('table, div[role="table"]').should('exist');
    cy.get('body').should('contain.text', 'Test Buyer 1');
    cy.get('body').should('contain.text', 'Test Company 1');
    cy.get('body').should('contain.text', 'CEO');
    cy.get('body').should('contain.text', 'buyer1@example.com');
    cy.get('body').should('contain.text', '+1234567890');
  });

  it('should search and filter buyers', () => {
    // Mock active campaign data with multiple buyers
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
    cy.wait('@getActiveCampaign');

    // Type in search box
    cy.get('input[type="text"], input[type="search"]').type('Buyer 2');
    
    // Check if only matching buyer is displayed
    cy.get('body').should('contain.text', 'Test Buyer 2');
    cy.get('body').should('not.contain.text', 'Test Buyer 1');
    
    // Clear search
    cy.get('input[type="text"], input[type="search"]').clear();
    
    // Check if all buyers are displayed again
    cy.get('body').should('contain.text', 'Test Buyer 1');
    cy.get('body').should('contain.text', 'Test Buyer 2');
  });
}); 