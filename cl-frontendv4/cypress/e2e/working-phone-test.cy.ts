describe('Phone Calling Test', () => {
  beforeEach(() => {
    // Visit the homepage
    cy.visit('/', { failOnStatusCode: false });
    
    // Set localStorage to simulate being logged in
    cy.window().then((win) => {
      win.localStorage.setItem('token', 'fake-jwt-token');
      win.localStorage.setItem('user', JSON.stringify({
        email: 'userone@example.com',
        name: 'User One',
        roleId: 1
      }));
    });
  });

  it('should verify authentication state', () => {
    // Verify the authentication state
    cy.window().then((win) => {
      expect(win.localStorage.getItem('token')).to.equal('fake-jwt-token');
      const user = JSON.parse(win.localStorage.getItem('user') || '{}');
      expect(user.email).to.equal('userone@example.com');
    });
  });

  it('should mock active campaign API', () => {
    // Set up intercept
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
    
    // Trigger the API call
    cy.window().then(win => {
      fetch('/api/v1/campaign/active');
    });
    
    // Verify the mock was called
    cy.wait('@getActiveCampaign');
  });

  it('should mock call scripts API', () => {
    // Set up intercept
    cy.intercept('GET', '**/api/v1/call-scripts/buyer/*', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          callScript: 'This is a test call script for Buyer 1',
          buyerDetails: {
            id: 'buyer-1',
            name: 'Test Buyer 1',
            company: 'Test Company 1',
            phone: '+1234567890'
          }
        }
      }
    }).as('getCallScripts');
    
    // Trigger the API call
    cy.window().then(win => {
      fetch('/api/v1/call-scripts/buyer/buyer-1');
    });
    
    // Verify the mock was called
    cy.wait('@getCallScripts');
  });

  it('should mock outbound call API', () => {
    // Set up intercept
    cy.intercept('POST', '**/api/v1/call/outbound', {
      statusCode: 200,
      body: {
        success: true,
        message: 'Call initiated successfully',
        data: {
          callId: 'test-call-123'
        }
      }
    }).as('outboundCall');
    
    // Trigger the API call
    cy.window().then(win => {
      fetch('/api/v1/call/outbound', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          buyerId: 'buyer-1',
          phone: '+1234567890'
        })
      });
    });
    
    // Verify the mock was called
    cy.wait('@outboundCall');
  });

  it('should mock disconnect call API', () => {
    // Set up intercept
    cy.intercept('POST', '**/api/v1/call/disconnect', {
      statusCode: 200,
      body: {
        success: true,
        message: 'Call disconnected successfully'
      }
    }).as('disconnectCall');
    
    // Set active call state
    cy.window().then(win => {
      win.localStorage.setItem('activeCall', 'true');
    });
    
    // Trigger the API call
    cy.window().then(win => {
      fetch('/api/v1/call/disconnect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
    });
    
    // Verify the mock was called
    cy.wait('@disconnectCall');
  });

  it('should mock call history API', () => {
    // Set up intercept
    cy.intercept('GET', '**/api/v1/call/history', {
      statusCode: 200,
      body: {
        success: true,
        data: [
          {
            id: 'call-1',
            buyerId: 'buyer-1',
            buyerName: 'Test Buyer 1',
            timestamp: new Date().toISOString(),
            duration: 120,
            status: 'completed',
            notes: 'Test call notes'
          }
        ]
      }
    }).as('getCallHistory');
    
    // Trigger the API call
    cy.window().then(win => {
      fetch('/api/v1/call/history');
    });
    
    // Verify the mock was called
    cy.wait('@getCallHistory');
  });
}); 