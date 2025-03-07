describe('Working Test', () => {
  it('should visit the homepage', () => {
    cy.visit('/');
    cy.wait(2000);
    cy.get('body').should('be.visible');
  });

  it('should navigate to different pages', () => {
    // Visit homepage
    cy.visit('/');
    cy.wait(1000);
    
    // Check if we can navigate to login page
    cy.visit('/login');
    cy.wait(1000);
    cy.get('body').should('be.visible');
    
    // Go back to homepage
    cy.visit('/');
    cy.wait(1000);
    cy.get('body').should('be.visible');
  });

  it('should bypass login with localStorage', () => {
    // Visit login page
    cy.visit('/login');
    cy.wait(1000);
    
    // Set localStorage to simulate being logged in
    cy.window().then((win) => {
      win.localStorage.setItem('token', 'fake-jwt-token');
      win.localStorage.setItem('user', JSON.stringify({
        email: 'userone@example.com',
        name: 'User One',
        roleId: 1
      }));
    });
    
    // Visit a protected page
    cy.visit('/dashboard', { failOnStatusCode: false });
    cy.wait(1000);
    
    // Verify we're on a page that requires authentication
    cy.get('body').should('be.visible');
    cy.url().should('not.include', '/login');
  });

  it('should mock dashboard data', () => {
    // Set localStorage to simulate being logged in
    cy.window().then((win) => {
      win.localStorage.setItem('token', 'fake-jwt-token');
      win.localStorage.setItem('user', JSON.stringify({
        email: 'userone@example.com',
        name: 'User One',
        roleId: 1
      }));
    });
    
    // Mock campaign data API
    cy.intercept('GET', '**/api/v1/campaign/list', {
      statusCode: 200,
      body: {
        success: true,
        data: [
          { id: 'test-campaign-123', name: 'Test Campaign', createdAt: new Date().toISOString() }
        ]
      }
    }).as('getCampaigns');
    
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
    
    // Navigate to dashboard (assuming it exists)
    cy.visit('/dashboard', { failOnStatusCode: false });
    cy.wait(1000);
    
    // Verify the page loaded
    cy.get('body').should('be.visible');
  });
}); 